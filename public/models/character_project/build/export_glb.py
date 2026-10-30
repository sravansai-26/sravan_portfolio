#!/usr/bin/env python3
"""
glTF 2.0 Binary (.glb) Exporter & Validator (`build/export_glb.py`)
Packages the 13 PBR materials, 3 embedded 2048x2048 textures (BaseColor, Normal, ORM),
and 13 merged material mesh primitives into a single binary glTF 2.0 `character.glb` file
conforming strictly to the Khronos glTF 2.0 specification.
"""

import json
import os
import struct
import numpy as np
from generate_character import build_character_parts
from generate_textures import generate_pbr_textures


MATERIAL_SPECS = [
    ("mat_skin",           [1.0, 1.0, 1.0, 1.0], 0.0, 0.52),
    ("mat_eye",            [1.0, 1.0, 1.0, 1.0], 0.0, 0.12),
    ("mat_hair",           [1.0, 1.0, 1.0, 1.0], 0.0, 0.68),
    ("mat_hat_leather",    [1.0, 1.0, 1.0, 1.0], 0.0, 0.62),
    ("mat_hat_band",       [1.0, 1.0, 1.0, 1.0], 0.0, 0.50),
    ("mat_shirt_fabric",   [1.0, 1.0, 1.0, 1.0], 0.0, 0.72),
    ("mat_buttons",        [1.0, 1.0, 1.0, 1.0], 0.0, 0.35),
    ("mat_tie_fabric",     [1.0, 1.0, 1.0, 1.0], 0.0, 0.56),
    ("mat_belt_leather",   [1.0, 1.0, 1.0, 1.0], 0.0, 0.45),
    ("mat_buckle_metal",   [1.0, 1.0, 1.0, 1.0], 1.0, 0.18),
    ("mat_trousers_denim", [1.0, 1.0, 1.0, 1.0], 0.0, 0.76),
    ("mat_shoe_leather",   [1.0, 1.0, 1.0, 1.0], 0.0, 0.25),
    ("mat_shoe_sole",      [1.0, 1.0, 1.0, 1.0], 0.0, 0.65),
]


def pad4(byte_arr, pad_char=b"\x00"):
    rem = len(byte_arr) % 4
    if rem != 0:
        byte_arr += pad_char * (4 - rem)
    return byte_arr


def export_character_glb(glb_path, tex_dir, tex_size=2048):
    parts, allocs = build_character_parts()
    tex_paths = generate_pbr_textures(allocs, tex_dir, size=tex_size)

    mat_index_map = {name: idx for idx, (name, _, _, _) in enumerate(MATERIAL_SPECS)}

    # Group parts by material into 13 clean primitives
    grouped = {name: [] for name, _, _, _ in MATERIAL_SPECS}
    for p in parts:
        grouped[p["material"]].append(p)

    bin_blob = bytearray()
    buffer_views = []
    accessors = []
    primitives = []

    def add_buffer_view(raw_bytes, target=None):
        offset = len(bin_blob)
        length = len(raw_bytes)
        bin_blob.extend(raw_bytes)
        while len(bin_blob) % 4 != 0:
            bin_blob.append(0)
        bv = {
            "buffer": 0,
            "byteOffset": offset,
            "byteLength": length,
        }
        if target is not None:
            bv["target"] = target
        idx = len(buffer_views)
        buffer_views.append(bv)
        return idx

    def add_accessor(bv_idx, comp_type, count, acc_type, min_val=None, max_val=None):
        acc = {
            "bufferView": bv_idx,
            "byteOffset": 0,
            "componentType": comp_type,
            "count": count,
            "type": acc_type,
        }
        if min_val is not None:
            acc["min"] = [float(x) for x in min_val]
        if max_val is not None:
            acc["max"] = [float(x) for x in max_val]
        idx = len(accessors)
        accessors.append(acc)
        return idx

    for mat_name, _, _, _ in MATERIAL_SPECS:
        subparts = grouped[mat_name]
        if not subparts:
            continue

        pos_list, norm_list, uv_list, tan_list, idx_list = [], [], [], [], []
        v_offset = 0
        for sp in subparts:
            pos_list.append(sp["positions"])
            norm_list.append(sp["normals"])
            uv_list.append(sp["uvs"])
            tan_list.append(sp["tangents"])
            idx_list.append(sp["indices"] + v_offset)
            v_offset += len(sp["positions"])

        pos_arr = np.concatenate(pos_list, axis=0).astype(np.float32)
        norm_arr = np.concatenate(norm_list, axis=0).astype(np.float32)
        uv_arr = np.concatenate(uv_list, axis=0).astype(np.float32)
        tan_arr = np.concatenate(tan_list, axis=0).astype(np.float32)
        idx_arr = np.concatenate(idx_list, axis=0).reshape(-1)

        # Ensure unit normals and tangents within strict glTF-Validator tolerance
        n_len = np.linalg.norm(norm_arr, axis=1, keepdims=True)
        zero_mask = (n_len[:, 0] < 1e-6)
        if np.any(zero_mask):
            norm_arr[zero_mask] = np.array([0.0, 0.0, 1.0], dtype=np.float32)
            n_len = np.linalg.norm(norm_arr, axis=1, keepdims=True)
        norm_arr /= n_len
        t_len = np.linalg.norm(tan_arr[:, :3], axis=1, keepdims=True)
        tan_arr[:, :3] /= np.maximum(t_len, 1e-8)
        tan_arr[:, 3] = np.where(tan_arr[:, 3] >= 0.0, 1.0, -1.0)

        v_count = len(pos_arr)
        i_count = len(idx_arr)

        # Indices bufferView (ELEMENT_ARRAY_BUFFER = 34963)
        if v_count < 65535:
            idx_bin = idx_arr.astype(np.uint16).tobytes()
            idx_comp_type = 5123  # UNSIGNED_SHORT
        else:
            idx_bin = idx_arr.astype(np.uint32).tobytes()
            idx_comp_type = 5125  # UNSIGNED_INT

        bv_idx = add_buffer_view(idx_bin, target=34963)
        acc_idx = add_accessor(
            bv_idx,
            idx_comp_type,
            i_count,
            "SCALAR",
            min_val=[int(idx_arr.min())],
            max_val=[int(idx_arr.max())],
        )

        # POSITION (ARRAY_BUFFER = 34962, FLOAT = 5126)
        bv_pos = add_buffer_view(pos_arr.tobytes(), target=34962)
        acc_pos = add_accessor(
            bv_pos,
            5126,
            v_count,
            "VEC3",
            min_val=pos_arr.min(axis=0),
            max_val=pos_arr.max(axis=0),
        )

        # NORMAL
        bv_norm = add_buffer_view(norm_arr.tobytes(), target=34962)
        acc_norm = add_accessor(bv_norm, 5126, v_count, "VEC3")

        # TEXCOORD_0
        bv_uv = add_buffer_view(uv_arr.tobytes(), target=34962)
        acc_uv = add_accessor(bv_uv, 5126, v_count, "VEC2")

        # TANGENT
        bv_tan = add_buffer_view(tan_arr.tobytes(), target=34962)
        acc_tan = add_accessor(bv_tan, 5126, v_count, "VEC4")

        primitives.append(
            {
                "attributes": {
                    "POSITION": acc_pos,
                    "NORMAL": acc_norm,
                    "TEXCOORD_0": acc_uv,
                    "TANGENT": acc_tan,
                },
                "indices": acc_idx,
                "material": mat_index_map[mat_name],
                "mode": 4,  # TRIANGLES
            }
        )

    # Embed the 3 PNG textures into bufferViews (no target for images per glTF 2.0 spec)
    images = []
    textures = []
    for tex_key, tex_name in [
        ("basecolor", "character_basecolor"),
        ("normal", "character_normal"),
        ("orm", "character_orm"),
    ]:
        with open(tex_paths[tex_key], "rb") as f:
            img_bytes = f.read()
        bv_img = add_buffer_view(img_bytes, target=None)
        img_idx = len(images)
        images.append(
            {
                "name": tex_name,
                "bufferView": bv_img,
                "mimeType": "image/png",
            }
        )
        textures.append(
            {
                "name": tex_name,
                "sampler": 0,
                "source": img_idx,
            }
        )

    materials = []
    for mat_name, base_factor, metal_factor, rough_factor in MATERIAL_SPECS:
        materials.append(
            {
                "name": mat_name,
                "pbrMetallicRoughness": {
                    "baseColorFactor": base_factor,
                    "baseColorTexture": {"index": 0, "texCoord": 0},
                    "metallicFactor": metal_factor,
                    "roughnessFactor": rough_factor,
                    "metallicRoughnessTexture": {"index": 2, "texCoord": 0},
                },
                "normalTexture": {"index": 1, "texCoord": 0, "scale": 1.0},
                "occlusionTexture": {"index": 2, "texCoord": 0, "strength": 1.0},
                "doubleSided": False,
            }
        )

    gltf_json = {
        "asset": {
            "version": "2.0",
            "generator": "Custom Stylized Character Pipeline v1.0",
            "copyright": "2026 Stylized Character Character",
        },
        "scene": 0,
        "scenes": [{"name": "CharacterCharacterScene", "nodes": [0]}],
        "nodes": [{"name": "CharacterCharacter", "mesh": 0}],
        "meshes": [
            {
                "name": "CharacterCharacterMesh",
                "primitives": primitives,
            }
        ],
        "materials": materials,
        "textures": textures,
        "images": images,
        "samplers": [
            {
                "magFilter": 9729,  # LINEAR
                "minFilter": 9987,  # LINEAR_MIPMAP_LINEAR
                "wrapS": 10497,     # REPEAT
                "wrapT": 10497,     # REPEAT
            }
        ],
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(bin_blob)}],
    }

    json_bytes = pad4(json.dumps(gltf_json, separators=(",", ":")).encode("utf-8"), b" ")
    bin_bytes = pad4(bytes(bin_blob), b"\x00")

    total_length = 12 + 8 + len(json_bytes) + 8 + len(bin_bytes)
    os.makedirs(os.path.dirname(os.path.abspath(glb_path)), exist_ok=True)
    with open(glb_path, "wb") as f:
        # GLB Header: magic 'glTF' (0x46546C67), version 2, total length
        f.write(struct.pack("<III", 0x46546C67, 2, total_length))
        # Chunk 0: JSON (0x4E4F534A)
        f.write(struct.pack("<II", len(json_bytes), 0x4E4F534A))
        f.write(json_bytes)
        # Chunk 1: BIN (0x004E4942)
        f.write(struct.pack("<II", len(bin_bytes), 0x004E4942))
        f.write(bin_bytes)

    print(f"Exported {glb_path}: {total_length / (1024*1024):.2f} MB ({total_length:,} bytes)")
    return glb_path, parts, allocs, tex_paths


if __name__ == "__main__":
    export_character_glb(
        "artifacts/file_generation/ttl=63d/intermediate/project/character.glb",
        "artifacts/file_generation/ttl=63d/intermediate/project/build/textures",
        tex_size=2048,
    )
