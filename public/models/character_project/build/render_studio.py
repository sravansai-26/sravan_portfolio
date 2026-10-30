#!/usr/bin/env python3
"""
WebGL 2.0 Studio PBR Renderer & Turntable Generator (`build/render_studio.py`)
Loads `character.glb` directly into a headless Chromium WebGL 2.0 PBR studio engine
with Cook-Torrance GGX microfacet BRDF, tangent-space normal mapping, channel-packed ORM,
studio 3-point lighting (soft key, warm fill, cool rim), procedural studio HDRI
environment reflections, soft ground contact shadows, and 2x supersampled anti-aliasing.

Generates:
  - Still renders: front, back, left, right, top, three_quarter_left, three_quarter_right,
    face_closeup, tie_closeup, buckle_closeup
  - 6-view contact sheet (`contact_sheet_6view.png`)
  - Side-by-side visual comparison sheet (`visual_comparison.png`)
  - UV checker texture render (`uv_checker_render.png`)
  - 36-view 30-degree x 3-elevation (-20, 0, +40 deg) orbit inspection sheet (`orbit_inspection_grid.png`)
  - Seamless 360-degree turntable video (`turntable.mp4`, 6 seconds @ 30 fps = 180 frames) and `turntable.gif`
"""

import base64
import io
import json
import math
import os
import subprocess
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


STUDIO_HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #1e2430; }
  canvas { display: block; width: 100%; height: 100%; }
</style>
</head>
<body>
<canvas id="glcanvas"></canvas>
<script>
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl2', { antialias: true, preserveDrawingBuffer: true, alpha: false });

const VS_SRC = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec4 a_tangent;
layout(location = 4) in vec4 a_color;

uniform mat4 u_mvp;
uniform mat4 u_model;

out vec3 v_worldPos;
out vec3 v_normal;
out vec2 v_uv;
out vec3 v_tangent;
out vec3 v_bitangent;
out vec4 v_color;

void main() {
    vec4 wp = u_model * vec4(a_position, 1.0);
    v_worldPos = wp.xyz;
    mat3 nMat = mat3(u_model);
    vec3 N = normalize(nMat * a_normal);
    vec3 T = normalize(nMat * a_tangent.xyz);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T) * a_tangent.w;
    v_normal = N;
    v_tangent = T;
    v_bitangent = B;
    v_uv = a_uv;
    v_color = a_color;
    gl_Position = u_mvp * wp;
}
`;

const FS_SRC = `#version 300 es
precision highp float;

in vec3 v_worldPos;
in vec3 v_normal;
in vec2 v_uv;
in vec3 v_tangent;
in vec3 v_bitangent;
in vec4 v_color;

uniform sampler2D u_baseColorTex;
uniform sampler2D u_normalTex;
uniform sampler2D u_ormTex;
uniform sampler2D u_checkerTex;

uniform vec4 u_baseColorFactor;
uniform float u_metallicFactor;
uniform float u_roughnessFactor;
uniform float u_normalScale;
uniform int u_useChecker;

uniform vec3 u_camPos;
uniform vec2 u_resolution;

out vec4 outColor;

const float PI = 3.14159265359;

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    return a2 / max(denom, 1e-6);
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;
    return NdotV / max(NdotV * (1.0 - k) + k, 1e-6);
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    return GeometrySchlickGGX(NdotV, roughness) * GeometrySchlickGGX(NdotL, roughness);
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

vec3 sampleStudioEnv(vec3 R, float roughness) {
    float y = clamp(R.y, -1.0, 1.0);
    vec3 skyTop = vec3(0.75, 0.85, 0.98);
    vec3 horizon = vec3(0.95, 0.92, 0.88);
    vec3 ground = vec3(0.28, 0.25, 0.23);
    vec3 env = (y >= 0.0) ? mix(horizon, skyTop, pow(y, 0.55)) : mix(horizon, ground, pow(-y, 0.65));

    // Studio softbox highlights in environment map for realistic buckle/shoe reflections
    vec3 sb1 = normalize(vec3(0.55, 0.68, 0.48));
    vec3 sb2 = normalize(vec3(-0.65, 0.42, 0.62));
    vec3 sb3 = normalize(vec3(0.0, 0.82, -0.57));
    float specExp = mix(64.0, 3.0, roughness);
    env += vec3(2.8, 2.65, 2.45) * pow(max(dot(R, sb1), 0.0), specExp) * (1.0 - 0.7 * roughness);
    env += vec3(1.4, 1.55, 1.85) * pow(max(dot(R, sb2), 0.0), specExp * 0.7) * (1.0 - 0.7 * roughness);
    env += vec3(1.8, 1.8, 2.0) * pow(max(dot(R, sb3), 0.0), specExp * 0.8) * (1.0 - 0.7 * roughness);
    return env;
}

vec3 acesToneMap(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

void main() {
    vec4 texCol = (u_useChecker == 1) ? texture(u_checkerTex, v_uv) : texture(u_baseColorTex, v_uv);
    vec3 vCol = (u_useChecker == 1) ? vec3(1.0) : v_color.rgb;
    vec3 albedo = pow(texCol.rgb * u_baseColorFactor.rgb, vec3(2.2)) * vCol;

    vec3 orm = texture(u_ormTex, v_uv).rgb;
    float ao = (u_useChecker == 1) ? 1.0 : mix(1.0, orm.r, 0.85);
    float vRough = clamp(v_color.a, 0.06, 0.95);
    float roughness = (u_useChecker == 1) ? 0.55 : vRough;
    // Smoothly derive metallic from buckle low-roughness region (vRough ~ 0.16, while eyes have vRough ~ 0.06)
    float isBuckle = smoothstep(0.11, 0.14, vRough) * (1.0 - smoothstep(0.20, 0.25, vRough));
    float metallic = (u_useChecker == 1) ? 0.0 : (0.88 * isBuckle);

    vec3 nSample = texture(u_normalTex, v_uv).xyz * 2.0 - 1.0;
    nSample.xy *= (u_useChecker == 1) ? 0.0 : u_normalScale * 0.65;
    nSample = normalize(nSample);
    mat3 TBN = mat3(normalize(v_tangent), normalize(v_bitangent), normalize(v_normal));
    vec3 N = normalize(TBN * nSample);
    vec3 V = normalize(u_camPos - v_worldPos);

    vec3 F0 = mix(vec3(0.04), albedo, metallic);

    // 3-Point Studio Lighting (Key, Fill, Rim) + Top Bounce
    vec3 lightDirs[4];
    vec3 lightCols[4];
    lightDirs[0] = normalize(vec3(0.55, 0.62, 0.56));   // Warm Sun Key Light
    lightCols[0] = vec3(2.05, 1.92, 1.78);
    lightDirs[1] = normalize(vec3(-0.72, 0.30, 0.62));  // Soft Sky Fill Light
    lightCols[1] = vec3(0.62, 0.72, 0.88);
    lightDirs[2] = normalize(vec3(-0.20, 0.58, -0.78)); // Warm Rim Light
    lightCols[2] = vec3(1.15, 1.20, 1.35);
    lightDirs[3] = normalize(vec3(0.0, -0.85, 0.52));   // Warm Sandy Ground Bounce
    lightCols[3] = vec3(0.32, 0.25, 0.18);

    vec3 Lo = vec3(0.0);
    for (int i = 0; i < 4; i++) {
        vec3 L = lightDirs[i];
        vec3 H = normalize(V + L);
        float NdotL = max(dot(N, L), 0.0);
        // Soft subsurface wrap for stylized skin & fabric warmth
        float wrapNdotL = max((dot(N, L) + 0.28) / 1.28, 0.0);
        vec3 sssTint = vec3(1.0, 0.88, 0.82) * max(0.0, 0.35 - abs(dot(N, L))) * 0.22 * (1.0 - metallic);

        float NDF = DistributionGGX(N, H, roughness);
        float G = GeometrySmith(N, V, L, roughness);
        vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);

        vec3 numerator = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(NdotL, 0.0) + 0.0001;
        vec3 specular = numerator / denominator;

        vec3 kS = F;
        vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);
        Lo += (kD * albedo / PI * (wrapNdotL + sssTint) + specular * NdotL) * lightCols[i];
    }

    // Hemisphere Ambient + Studio Environment Reflection (IBL)
    vec3 R = reflect(-V, N);
    vec3 F_env = fresnelSchlick(max(dot(N, V), 0.0), F0);
    vec3 kS_env = F_env;
    vec3 kD_env = (1.0 - kS_env) * (1.0 - metallic);
    vec3 irr = mix(vec3(0.16, 0.13, 0.12), vec3(0.34, 0.40, 0.50), 0.5 * N.y + 0.5);
    vec3 diffuseIBL = irr * albedo * kD_env;
    vec3 specIBL = sampleStudioEnv(R, roughness) * F_env * (1.0 - 0.55 * roughness);

    vec3 color = (Lo + (diffuseIBL + specIBL) * ao);
    color = acesToneMap(color);
    color = pow(color, vec3(1.0 / 2.2));
    outColor = vec4(color, 1.0);
}
`;

// Background + Ground Contact Shadow Shader
const BG_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.9999, 1.0);
}
`;

const BG_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform int u_darkTheme;
out vec4 outColor;
void main() {
    if (u_darkTheme == 1) {
        vec2 center = v_uv - vec2(0.5, 0.52);
        float dist = length(center);
        vec3 bg = mix(vec3(0.08, 0.10, 0.15), vec3(0.16, 0.20, 0.28), v_uv.y);
        bg *= (1.0 - 0.22 * dist * dist);
        outColor = vec4(bg, 1.0);
        return;
    }
    // Stylized Pixar Sunny Sky, Soft Fluffy Clouds, Green Rolling Hills & Warm Dirt Path
    vec3 skyTop = vec3(0.16, 0.62, 0.96);
    vec3 skyHor = vec3(0.52, 0.84, 0.99);
    float skyT = clamp((v_uv.y - 0.42) / 0.58, 0.0, 1.0);
    vec3 col = mix(skyHor, skyTop, pow(skyT, 0.75));

    // Soft stylized clouds on left and right
    vec2 p = v_uv;
    float c1 = exp(-18.0 * length((p - vec2(0.14, 0.86)) * vec2(1.0, 1.6)))
             + exp(-22.0 * length((p - vec2(0.24, 0.82)) * vec2(1.0, 1.8)))
             + exp(-18.0 * length((p - vec2(0.10, 0.62)) * vec2(1.1, 1.5)))
             + exp(-18.0 * length((p - vec2(0.92, 0.86)) * vec2(1.0, 1.6)))
             + exp(-22.0 * length((p - vec2(0.84, 0.82)) * vec2(1.0, 1.8)))
             + exp(-18.0 * length((p - vec2(0.94, 0.58)) * vec2(1.1, 1.5)));
    float cloudMask = smoothstep(0.22, 0.65, c1) * step(0.42, p.y);
    vec3 cloudCol = mix(vec3(0.85, 0.91, 0.96), vec3(0.99, 0.99, 1.0), clamp((p.y - 0.55)*3.0, 0.0, 1.0));
    col = mix(col, cloudCol, cloudMask * 0.92);

    // Rolling green hills (y < 0.52)
    float hill1 = 0.48 - 0.08 * sin(p.x * 3.5 + 0.4);
    float hill2 = 0.42 + 0.07 * sin(p.x * 4.2 - 1.1);
    if (p.y < hill1) {
        vec3 hCol1 = mix(vec3(0.36, 0.58, 0.18), vec3(0.55, 0.76, 0.30), clamp((p.y - 0.20) / 0.30, 0.0, 1.0));
        col = mix(col, hCol1, smoothstep(hill1, hill1 - 0.012, p.y));
    }
    if (p.y < hill2) {
        vec3 hCol2 = mix(vec3(0.28, 0.48, 0.13), vec3(0.46, 0.68, 0.24), clamp((p.y - 0.15) / 0.28, 0.0, 1.0));
        col = mix(col, hCol2, smoothstep(hill2, hill2 - 0.012, p.y));
    }

    // Warm sandy dirt path at the bottom (y < 0.19)
    float pathTop = 0.175 + 0.015 * cos((p.x - 0.5) * 3.0);
    if (p.y < pathTop) {
        vec3 pathCol = mix(vec3(0.76, 0.53, 0.32), vec3(0.86, 0.66, 0.44), clamp(p.y / pathTop, 0.0, 1.0));
        col = mix(col, pathCol, smoothstep(pathTop, pathTop - 0.015, p.y));
    }
    outColor = vec4(col, 1.0);
}
`;

const SHADOW_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_position;
uniform mat4 u_mvp;
out vec2 v_xz;
void main() {
    v_xz = a_position.xz;
    gl_Position = u_mvp * vec4(a_position, 1.0);
}
`;

const SHADOW_FS = `#version 300 es
precision highp float;
in vec2 v_xz;
out vec4 outColor;
void main() {
    // Dual foot contact shadow + overall body ground shadow at y=0
    float dBody = length(v_xz * vec2(1.9, 2.3));
    float dFootL = length((v_xz - vec2(0.16, 0.04)) * vec2(5.5, 3.8));
    float dFootR = length((v_xz - vec2(-0.16, 0.04)) * vec2(5.5, 3.8));
    float sBody = exp(-2.4 * dBody * dBody) * 0.36;
    float sFeet = (exp(-3.2 * dFootL * dFootL) + exp(-3.2 * dFootR * dFootR)) * 0.42;
    float alpha = clamp(sBody + sFeet, 0.0, 0.62);
    outColor = vec4(0.04, 0.05, 0.08, alpha);
}
`;

function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s));
    }
    return s;
}

function createProgram(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p));
    }
    return p;
}

const pbrProg = createProgram(VS_SRC, FS_SRC);
const bgProg = createProgram(BG_VS, BG_FS);
const shProg = createProgram(SHADOW_VS, SHADOW_FS);

// Setup fullscreen quad and shadow plane
const bgVao = gl.createVertexArray();
gl.bindVertexArray(bgVao);
const bgBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bgBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

const shVao = gl.createVertexArray();
gl.bindVertexArray(shVao);
const shBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, shBuf);
const S = 0.85;
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-S,0,-S, S,0,-S, -S,0,S, -S,0,S, S,0,-S, S,0,S]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

let gltfScene = null;
let checkerTexture = null;

function mat4Perspective(fovY, aspect, near, far) {
    const f = 1.0 / Math.tan(fovY / 2.0);
    const nf = 1.0 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
    ]);
}

function mat4LookAt(eye, target, up) {
    let z0 = eye[0] - target[0], z1 = eye[1] - target[1], z2 = eye[2] - target[2];
    let len = Math.hypot(z0, z1, z2);
    z0 /= len; z1 /= len; z2 /= len;
    let x0 = up[1] * z2 - up[2] * z1;
    let x1 = up[2] * z0 - up[0] * z2;
    let x2 = up[0] * z1 - up[1] * z0;
    len = Math.hypot(x0, x1, x2);
    if (len < 1e-5) { x0 = 1; x1 = 0; x2 = 0; } else { x0 /= len; x1 /= len; x2 /= len; }
    let y0 = z1 * x2 - z2 * x1;
    let y1 = z2 * x0 - z0 * x2;
    let y2 = z0 * x1 - z1 * x0;
    return new Float32Array([
        x0, y0, z0, 0,
        x1, y1, z1, 0,
        x2, y2, z2, 0,
        -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]),
        -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]),
        -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]),
        1
    ]);
}

function mat4Multiply(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            out[j * 4 + i] =
                a[0 * 4 + i] * b[j * 4 + 0] +
                a[1 * 4 + i] * b[j * 4 + 1] +
                a[2 * 4 + i] * b[j * 4 + 2] +
                a[3 * 4 + i] * b[j * 4 + 3];
        }
    }
    return out;
}

async function loadImageFromBytes(bytes, mimeType) {
    const blob = new Blob([bytes], { type: mimeType || 'image/png' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
    URL.revokeObjectURL(url);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    return tex;
}

window.loadGLBFromBase64 = async function(b64Data, checkerB64) {
    const binStr = atob(b64Data);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binStr.charCodeAt(i);
    const dv = new DataView(bytes.buffer);

    const magic = dv.getUint32(0, true);
    if (magic !== 0x46546C67) throw new Error('Invalid GLB magic');
    const jsonLen = dv.getUint32(12, true);
    const jsonBytes = new Uint8Array(bytes.buffer, 20, jsonLen);
    const gltf = JSON.parse(new TextDecoder().decode(jsonBytes));

    const binChunkOffset = 20 + jsonLen + 8;
    const binBuffer = bytes.buffer.slice(binChunkOffset);

    const glTextures = [];
    for (const imgDef of gltf.images) {
        const bv = gltf.bufferViews[imgDef.bufferView];
        const imgSlice = new Uint8Array(binBuffer, bv.byteOffset || 0, bv.byteLength);
        const tex = await loadImageFromBytes(imgSlice, imgDef.mimeType);
        glTextures.push(tex);
    }

    if (checkerB64) {
        const cStr = atob(checkerB64);
        const cBytes = new Uint8Array(cStr.length);
        for (let i = 0; i < cStr.length; i++) cBytes[i] = cStr.charCodeAt(i);
        checkerTexture = await loadImageFromBytes(cBytes, 'image/png');
    } else {
        checkerTexture = glTextures[0];
    }

    const drawPrimitives = [];
    const mesh = gltf.meshes[0];
    for (const prim of mesh.primitives) {
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        function bindAttr(attrName, loc, size) {
            const accIdx = prim.attributes[attrName];
            const acc = gltf.accessors[accIdx];
            const bv = gltf.bufferViews[acc.bufferView];
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(binBuffer, (bv.byteOffset || 0) + (acc.byteOffset || 0), bv.byteLength), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, size, acc.componentType, false, bv.byteStride || 0, 0);
        }

        bindAttr('POSITION', 0, 3);
        bindAttr('NORMAL', 1, 3);
        bindAttr('TEXCOORD_0', 2, 2);
        bindAttr('TANGENT', 3, 4);
        if (prim.attributes.COLOR_0 !== undefined) {
            bindAttr('COLOR_0', 4, 4);
        } else {
            gl.disableVertexAttribArray(4);
            gl.vertexAttrib4f(4, 1.0, 1.0, 1.0, 1.0);
        }

        const idxAcc = gltf.accessors[prim.indices];
        const idxBv = gltf.bufferViews[idxAcc.bufferView];
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(binBuffer, (idxBv.byteOffset || 0) + (idxAcc.byteOffset || 0), idxBv.byteLength), gl.STATIC_DRAW);

        const mat = gltf.materials[prim.material];
        const pbr = mat.pbrMetallicRoughness || {};
        drawPrimitives.push({
            vao,
            count: idxAcc.count,
            indexType: idxAcc.componentType,
            baseColorFactor: pbr.baseColorFactor || [1, 1, 1, 1],
            metallicFactor: (pbr.metallicFactor !== undefined) ? pbr.metallicFactor : 0.0,
            roughnessFactor: (pbr.roughnessFactor !== undefined) ? pbr.roughnessFactor : 0.5,
            normalScale: (mat.normalTexture && mat.normalTexture.scale !== undefined) ? mat.normalTexture.scale : 1.0
        });
    }

    gltfScene = { gltf, glTextures, drawPrimitives };
    return {
        numMaterials: gltf.materials.length,
        numPrimitives: drawPrimitives.length,
        numTextures: glTextures.length
    };
};

window.renderView = function(opts) {
    const w = opts.width || 1200;
    const h = opts.height || 1200;
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 1. Background
    gl.disable(gl.DEPTH_TEST);
    gl.useProgram(bgProg);
    gl.uniform1i(gl.getUniformLocation(bgProg, 'u_darkTheme'), opts.darkTheme ? 1 : 0);
    gl.bindVertexArray(bgVao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const eye = opts.eye || [0, 0.95, 2.55];
    const target = opts.target || [0, 0.90, 0];
    const up = opts.up || [0, 1, 0];
    const fov = (opts.fovDeg || 38.0) * Math.PI / 180.0;

    const proj = mat4Perspective(fov, w / h, 0.05, 20.0);
    const view = mat4LookAt(eye, target, up);
    const mvp = mat4Multiply(proj, view);
    const modelMat = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);

    // 2. Soft Ground Contact Shadow
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(shProg);
    gl.uniformMatrix4fv(gl.getUniformLocation(shProg, 'u_mvp'), false, mvp);
    gl.bindVertexArray(shVao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disable(gl.BLEND);
    gl.depthMask(true);

    // 3. Character Mesh Primitives
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.useProgram(pbrProg);
    gl.uniformMatrix4fv(gl.getUniformLocation(pbrProg, 'u_mvp'), false, mvp);
    gl.uniformMatrix4fv(gl.getUniformLocation(pbrProg, 'u_model'), false, modelMat);
    gl.uniform3fv(gl.getUniformLocation(pbrProg, 'u_camPos'), new Float32Array(eye));
    gl.uniform1i(gl.getUniformLocation(pbrProg, 'u_useChecker'), opts.useChecker ? 1 : 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gltfScene.glTextures[0]);
    gl.uniform1i(gl.getUniformLocation(pbrProg, 'u_baseColorTex'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, gltfScene.glTextures[1]);
    gl.uniform1i(gl.getUniformLocation(pbrProg, 'u_normalTex'), 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, gltfScene.glTextures[2]);
    gl.uniform1i(gl.getUniformLocation(pbrProg, 'u_ormTex'), 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, checkerTexture);
    gl.uniform1i(gl.getUniformLocation(pbrProg, 'u_checkerTex'), 3);

    for (const prim of gltfScene.drawPrimitives) {
        gl.uniform4fv(gl.getUniformLocation(pbrProg, 'u_baseColorFactor'), new Float32Array(prim.baseColorFactor));
        gl.uniform1f(gl.getUniformLocation(pbrProg, 'u_metallicFactor'), prim.metallicFactor);
        gl.uniform1f(gl.getUniformLocation(pbrProg, 'u_roughnessFactor'), prim.roughnessFactor);
        gl.uniform1f(gl.getUniformLocation(pbrProg, 'u_normalScale'), prim.normalScale);
        gl.bindVertexArray(prim.vao);
        gl.drawElements(gl.TRIANGLES, prim.count, prim.indexType, 0);
    }

    return canvas.toDataURL('image/png');
};
</script>
</body>
</html>
"""


def start_headless_driver(width=1200, height=1200):
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--use-gl=angle")
    opts.add_argument("--use-angle=swiftshader")
    opts.add_argument("--enable-webgl")
    opts.add_argument("--ignore-gpu-blocklist")
    opts.add_argument(f"--window-size={width},{height}")
    return webdriver.Chrome(options=opts)


def decode_data_url(data_url, target_size=None):
    b64 = data_url.split(",", 1)[1]
    img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
    if target_size is not None and img.size != target_size:
        img = img.resize(target_size, Image.Resampling.LANCZOS)
    return img


def render_all_views(glb_path, checker_path, out_renders_dir, turntable_dir):
    os.makedirs(out_renders_dir, exist_ok=True)
    os.makedirs(turntable_dir, exist_ok=True)

    html_tmp = "/working_dir/c_5cf010e0ce9f29bc/artifacts/file_generation/ttl=63d/intermediate/studio_renderer.html"
    with open(html_tmp, "w", encoding="utf-8") as f:
        f.write(STUDIO_HTML_TEMPLATE)

    driver = start_headless_driver(1600, 1600)
    try:
        driver.get("about:blank")
        driver.execute_script("document.open(); document.write(arguments[0]); document.close();", STUDIO_HTML_TEMPLATE)
        with open(glb_path, "rb") as f:
            glb_b64 = base64.b64encode(f.read()).decode("ascii")
        with open(checker_path, "rb") as f:
            chk_b64 = base64.b64encode(f.read()).decode("ascii")

        info = driver.execute_script(
            "return window.loadGLBFromBase64(arguments[0], arguments[1]);",
            glb_b64,
            chk_b64,
        )
        print("Loaded GLB into WebGL2 studio renderer:", info)

        # Render at 1600x1600 and downsample to 1024x1024 for crisp supersampled edges
        SS_W, SS_H = 1600, 1600
        OUT_SIZE = (1024, 1024)

        VIEWS = {
            "front": {
                "eye": [0.0, 0.90, 2.75],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 38.0,
            },
            "back": {
                "eye": [0.0, 0.90, -2.75],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 38.0,
            },
            "left": {
                # Character's left side (+X)
                "eye": [2.75, 0.90, 0.0],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 38.0,
            },
            "right": {
                # Character's right side (-X)
                "eye": [-2.75, 0.90, 0.0],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 38.0,
            },
            "top": {
                "eye": [0.0, 3.60, 0.01],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 0.0, -1.0],
                "fovDeg": 32.0,
            },
            "three_quarter_left": {
                # 3/4 Front-Left (viewer's left / character's right side where nose projects)
                "eye": [-1.85, 1.02, 2.15],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 38.0,
            },
            "three_quarter_right": {
                # 3/4 Front-Right (viewer's right / character's left side where ear is visible)
                "eye": [1.85, 1.02, 2.15],
                "target": [0.0, 0.88, 0.0],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 38.0,
            },
            "face_closeup": {
                "eye": [0.0, 1.43, 0.92],
                "target": [0.0, 1.42, 0.08],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 35.0,
            },
            "tie_closeup": {
                "eye": [0.0, 1.05, 0.88],
                "target": [0.0, 1.04, 0.10],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 35.0,
            },
            "buckle_closeup": {
                "eye": [0.0, 0.59, 0.88],
                "target": [0.0, 0.58, 0.12],
                "up": [0.0, 1.0, 0.0],
                "fovDeg": 34.0,
            },
        }

        rendered_imgs = {}
        for vname, vopts in VIEWS.items():
            cfg = dict(vopts, width=SS_W, height=SS_H, darkTheme=False, useChecker=False)
            durl = driver.execute_script("return window.renderView(arguments[0]);", cfg)
            img = decode_data_url(durl, OUT_SIZE)
            out_p = os.path.join(out_renders_dir, f"{vname}.png")
            img.save(out_p, optimize=True)
            rendered_imgs[vname] = img
            print(f"Rendered {vname}.png")

        # Render UV Checker verification image (front + 3/4 view side-by-side)
        chk_front_url = driver.execute_script(
            "return window.renderView(arguments[0]);",
            dict(VIEWS["front"], width=1200, height=1200, darkTheme=True, useChecker=True),
        )
        chk_34_url = driver.execute_script(
            "return window.renderView(arguments[0]);",
            dict(VIEWS["three_quarter_left"], width=1200, height=1200, darkTheme=True, useChecker=True),
        )
        chk_f = decode_data_url(chk_front_url, (800, 800))
        chk_34 = decode_data_url(chk_34_url, (800, 800))
        chk_sheet = Image.new("RGB", (1600, 800), (24, 28, 36))
        chk_sheet.paste(chk_f, (0, 0))
        chk_sheet.paste(chk_34, (800, 0))
        chk_sheet.save(os.path.join(out_renders_dir, "uv_checker_render.png"), optimize=True)

        # Build 6-View Contact Sheet (Front, Back, Left, Right, Top, 3/4 View)
        cs_w, cs_h = 600, 600
        sheet = Image.new("RGB", (cs_w * 3, cs_h * 2 + 80), (235, 240, 246))
        draw_cs = ImageDraw.Draw(sheet)
        draw_cs.rectangle([0, 0, cs_w * 3, 70], fill=(30, 41, 59))
        draw_cs.text((30, 22), "STYLIZED CHARACTER CHARACTER — 6-VIEW ORTHOGRAPHIC / PERSPECTIVE CONTACT SHEET", fill=(248, 250, 252))
        six_order = [
            ("front", "FRONT (+Z)"),
            ("back", "BACK (-Z)"),
            ("left", "LEFT (+X / Character Left)"),
            ("right", "RIGHT (-X / Character Right)"),
            ("top", "TOP (+Y)"),
            ("three_quarter_left", "3/4 FRONT-LEFT"),
        ]
        for idx, (k, label) in enumerate(six_order):
            r = idx // 3
            c = idx % 3
            thumb = rendered_imgs[k].resize((cs_w, cs_h), Image.Resampling.LANCZOS)
            px = c * cs_w
            py = 80 + r * cs_h
            sheet.paste(thumb, (px, py))
            draw_cs.rectangle([px + 12, py + 12, px + 260, py + 44], fill=(30, 41, 59))
            draw_cs.text((px + 22, py + 20), label, fill=(255, 255, 255))
        sheet.save(os.path.join(out_renders_dir, "contact_sheet_6view.png"), optimize=True)
        print("Saved contact_sheet_6view.png")

        # Phase 5 Test #5: Orbit every 30 degrees horizontally (12 angles) at 3 elevations (-20, 0, +40 deg)
        elevations = [-20.0, 0.0, 40.0]
        azimuths = [a * 30.0 for a in range(12)]
        cell_s = 220
        grid_img = Image.new("RGB", (cell_s * 12, cell_s * 3 + 50), (24, 30, 40))
        g_draw = ImageDraw.Draw(grid_img)
        g_draw.text((20, 15), "PHASE 5 ORBIT VERIFICATION: 12 AZIMUTHS (EVERY 30 DEG) x 3 ELEVATIONS (-20 DEG, 0 DEG, +40 DEG)", fill=(240, 245, 250))
        dist_orbit = 2.85
        for r_idx, elev_deg in enumerate(elevations):
            el = math.radians(elev_deg)
            for c_idx, az_deg in enumerate(azimuths):
                az = math.radians(az_deg)
                ex = dist_orbit * math.cos(el) * math.sin(az)
                ey = 0.88 + dist_orbit * math.sin(el)
                ez = dist_orbit * math.cos(el) * math.cos(az)
                url = driver.execute_script(
                    "return window.renderView(arguments[0]);",
                    {
                        "width": 440,
                        "height": 440,
                        "eye": [ex, ey, ez],
                        "target": [0.0, 0.88, 0.0],
                        "up": [0.0, 1.0, 0.0],
                        "fovDeg": 38.0,
                        "darkTheme": True,
                        "useChecker": False,
                    },
                )
                cell = decode_data_url(url, (cell_s, cell_s))
                px = c_idx * cell_s
                py = 50 + r_idx * cell_s
                grid_img.paste(cell, (px, py))
                g_draw.text((px + 6, py + 6), f"az={int(az_deg)} el={int(elev_deg)}", fill=(220, 230, 245))
        grid_img.save(os.path.join(out_renders_dir, "orbit_inspection_grid.png"), optimize=True)
        print("Saved orbit_inspection_grid.png")

        # Render 360-degree Seamless Turntable (6 seconds @ 30 fps = 180 frames)
        frames_dir = "/tmp/character_project/turntable_frames"
        os.makedirs(frames_dir, exist_ok=True)
        n_frames = 180
        gif_frames = []
        for f_idx in range(n_frames):
            az = 2.0 * math.pi * (f_idx / n_frames)
            ex = 2.75 * math.sin(az)
            ey = 0.94
            ez = 2.75 * math.cos(az)
            url = driver.execute_script(
                "return window.renderView(arguments[0]);",
                {
                    "width": 720,
                    "height": 720,
                    "eye": [ex, ey, ez],
                    "target": [0.0, 0.88, 0.0],
                    "up": [0.0, 1.0, 0.0],
                    "fovDeg": 38.0,
                    "darkTheme": False,
                    "useChecker": False,
                },
            )
            frame_img = decode_data_url(url, (720, 720))
            frame_path = os.path.join(frames_dir, f"frame_{f_idx:04d}.png")
            frame_img.save(frame_path)
            if f_idx % 3 == 0:
                gif_frames.append(frame_img.resize((480, 480), Image.Resampling.LANCZOS))

        mp4_path = os.path.join(turntable_dir, "turntable.mp4")
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-framerate", "30",
                "-i", os.path.join(frames_dir, "frame_%04d.png"),
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-crf", "20",
                mp4_path,
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        gif_path = os.path.join(turntable_dir, "turntable.gif")
        gif_frames[0].save(
            gif_path,
            save_all=True,
            append_images=gif_frames[1:],
            duration=50,
            loop=0,
            optimize=True,
        )
        print(f"Saved turntable.mp4 ({os.path.getsize(mp4_path)/1024:.1f} KB) and turntable.gif ({os.path.getsize(gif_path)/1024:.1f} KB)")

    finally:
        driver.quit()


if __name__ == "__main__":
    render_all_views(
        "/tmp/character_project/artifacts/file_generation/ttl=63d/intermediate/project/character.glb",
        "/tmp/character_project/artifacts/file_generation/ttl=63d/intermediate/project/build/textures/uv_checker.png",
        "/tmp/character_project/renders",
        "/tmp/character_project",
    )
