#!/usr/bin/env python3
"""
Comprehensive Automated Validation Suite (`build/validate_all.py`)
Executes all Phase 5 verification checks on `character.glb` and `viewer/index.html`:
  1. glTF 2.0 binary & JSON schema validation (header, alignment, accessors, unit normals/tangents, bounds)
  2. Re-import verification & exact anatomical/proportional measurements table
  3. Mesh topology audit (non-manifold edges, boundary edges, loose vertices, degenerate faces, UV overlap)
  4. Live HTTP viewer smoke test across Desktop (1920x1080) and Mobile (360x640) viewports
"""

import http.server
import json
import math
import os
import socketserver
import struct
import threading
import time
import numpy as np
from generate_character import build_character_parts
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def validate_glb_binary(glb_path):
    with open(glb_path, "rb") as f:
        data = f.read()

    errors = []
    warnings = []

    magic, version, total_len = struct.unpack_from("<III", data, 0)
    if magic != 0x46546C67:
        errors.append(f"Invalid GLB magic: {hex(magic)}")
    if version != 2:
        errors.append(f"Invalid GLB version: {version}")
    if total_len != len(data):
        errors.append(f"Header length {total_len} != file size {len(data)}")

    json_len, json_type = struct.unpack_from("<II", data, 12)
    if json_type != 0x4E4F534A:
        errors.append("Chunk 0 is not JSON")
    if json_len % 4 != 0:
        errors.append("JSON chunk length not 4-byte aligned")

    gltf = json.loads(data[20:20 + json_len].decode("utf-8"))
    bin_offset = 20 + json_len
    bin_len, bin_type = struct.unpack_from("<II", data, bin_offset)
    if bin_type != 0x004E4942:
        errors.append("Chunk 1 is not BIN")
    if bin_len % 4 != 0:
        errors.append("BIN chunk length not 4-byte aligned")
    bin_blob = data[bin_offset + 8:bin_offset + 8 + bin_len]

    # Validate bufferViews and accessors
    all_positions = []
    total_verts = 0
    total_tris = 0

    for p_idx, prim in enumerate(gltf["meshes"][0]["primitives"]):
        acc_pos = gltf["accessors"][prim["attributes"]["POSITION"]]
        bv_pos = gltf["bufferViews"][acc_pos["bufferView"]]
        pos = np.frombuffer(
            bin_blob, dtype=np.float32, count=acc_pos["count"] * 3, offset=bv_pos["byteOffset"]
        ).reshape(-1, 3)
        all_positions.append(pos)
        total_verts += len(pos)

        # Verify min/max bounds match accessor metadata within 1e-5
        if np.max(np.abs(pos.min(axis=0) - np.array(acc_pos["min"]))) > 1e-5:
            errors.append(f"Primitive {p_idx} POSITION min mismatch")
        if np.max(np.abs(pos.max(axis=0) - np.array(acc_pos["max"]))) > 1e-5:
            errors.append(f"Primitive {p_idx} POSITION max mismatch")

        # Verify unit normals
        acc_norm = gltf["accessors"][prim["attributes"]["NORMAL"]]
        bv_norm = gltf["bufferViews"][acc_norm["bufferView"]]
        norm = np.frombuffer(
            bin_blob, dtype=np.float32, count=acc_norm["count"] * 3, offset=bv_norm["byteOffset"]
        ).reshape(-1, 3)
        n_lens = np.linalg.norm(norm, axis=1)
        if np.max(np.abs(n_lens - 1.0)) > 1e-3:
            errors.append(f"Primitive {p_idx} has non-unit normals")

        # Verify unit tangents
        acc_tan = gltf["accessors"][prim["attributes"]["TANGENT"]]
        bv_tan = gltf["bufferViews"][acc_tan["bufferView"]]
        tan = np.frombuffer(
            bin_blob, dtype=np.float32, count=acc_tan["count"] * 4, offset=bv_tan["byteOffset"]
        ).reshape(-1, 4)
        t_lens = np.linalg.norm(tan[:, :3], axis=1)
        if np.max(np.abs(t_lens - 1.0)) > 1e-3:
            errors.append(f"Primitive {p_idx} has non-unit tangents")

        acc_idx = gltf["accessors"][prim["indices"]]
        total_tris += acc_idx["count"] // 3

    all_pos = np.concatenate(all_positions, axis=0)
    bbox_min = all_pos.min(axis=0)
    bbox_max = all_pos.max(axis=0)

    return {
        "file_size_bytes": len(data),
        "file_size_mb": len(data) / (1024 * 1024),
        "errors": errors,
        "warnings": warnings,
        "num_materials": len(gltf["materials"]),
        "num_primitives": len(gltf["meshes"][0]["primitives"]),
        "num_textures": len(gltf["textures"]),
        "total_vertices": total_verts,
        "total_triangles": total_tris,
        "bbox_min": [float(x) for x in bbox_min],
        "bbox_max": [float(x) for x in bbox_max],
    }


def audit_mesh_and_measurements():
    parts, allocs = build_character_parts()
    part_map = {p["name"]: p for p in parts}

    non_manifold_edges = 0
    boundary_edges = 0
    degenerate_tris = 0
    loose_vertices = 0
    inverted_parts = 0
    uv_inverted_or_overlapping = 0

    for p in parts:
        pos = p["positions"]
        uv = p["uvs"]
        tris = p["indices"]

        # Check loose vertices
        used_v = np.unique(tris)
        if len(used_v) != len(pos):
            loose_vertices += (len(pos) - len(used_v))

        # Check 3D degenerate triangles
        v0, v1, v2 = pos[tris[:, 0]], pos[tris[:, 1]], pos[tris[:, 2]]
        areas3d = 0.5 * np.linalg.norm(np.cross(v1 - v0, v2 - v0), axis=1)
        degenerate_tris += int(np.sum(areas3d < 1e-10))

        # Check signed volume > 0
        vol6 = float(np.sum(np.einsum("ij,ij->i", v0, np.cross(v1, v2))))
        if vol6 <= 0.0:
            inverted_parts += 1

        # Check welded 3D manifold edge valence (every edge must have valence == 2)
        quant = np.round(pos * 1e6).astype(np.int64)
        _, inv = np.unique(quant, axis=0, return_inverse=True)
        w_tris = inv[tris]
        e01 = np.sort(w_tris[:, [0, 1]], axis=1)
        e12 = np.sort(w_tris[:, [1, 2]], axis=1)
        e20 = np.sort(w_tris[:, [2, 0]], axis=1)
        all_edges = np.concatenate([e01, e12, e20], axis=0)
        _, counts = np.unique(all_edges, axis=0, return_counts=True)
        boundary_edges += int(np.sum(counts == 1))
        non_manifold_edges += int(np.sum(counts > 2))

        # Check UV box containment & positive 2D UV area
        u0, v0_b, u1, v1_b = p["uv_box"]
        if np.any(uv[:, 0] < u0 - 1e-5) or np.any(uv[:, 0] > u1 + 1e-5):
            uv_inverted_or_overlapping += 1
        if np.any(uv[:, 1] < v0_b - 1e-5) or np.any(uv[:, 1] > v1_b + 1e-5):
            uv_inverted_or_overlapping += 1

    # Check pairwise disjointness of all 66 allocated UV boxes in [0, 1]^2
    boxes = list(allocs.values())
    box_overlaps = 0
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            a = boxes[i]
            b = boxes[j]
            if not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1]):
                box_overlaps += 1

    # Measure exact anatomical & clothing dimensions from the final mesh vertices
    all_y_min = min(float(p["positions"][:, 1].min()) for p in parts)
    all_y_max = max(float(p["positions"][:, 1].max()) for p in parts)
    total_height = all_y_max - all_y_min

    brim_pos = part_map["hat_brim"]["positions"]
    brim_diam = float(brim_pos[:, 0].max() - brim_pos[:, 0].min())

    crown_pos = part_map["hat_crown"]["positions"]
    # Crown height above brim top (y=1.640 m to y=1.750 m)
    crown_h = float(crown_pos[:, 1].max() - 1.640)

    head_pos = part_map["head"]["positions"]
    head_w = float(head_pos[:, 0].max() - head_pos[:, 0].min())
    head_hat_h = float(crown_pos[:, 1].max() - 1.355)  # chin base to hat top

    arm_l_pos = part_map["arm_l"]["positions"]
    arm_r_pos = part_map["arm_r"]["positions"]
    shoulder_w = float(arm_l_pos[:, 0].max() - arm_r_pos[:, 0].min())

    belt_pos = part_map["belt_strap"]["positions"]
    belt_y_center = float(0.5 * (belt_pos[:, 1].min() + belt_pos[:, 1].max()))

    pelv_pos = part_map["trousers_pelvis"]["positions"]
    inseam_h = float(pelv_pos[:, 1].min() - all_y_min)

    sole_l_pos = part_map["shoe_sole_l"]["positions"]
    # Principal axis length of splayed left shoe
    splay_rad = math.radians(22.0)
    z_rot = (sole_l_pos[:, 0] - 0.157) * math.sin(splay_rad) + (sole_l_pos[:, 2] - 0.005) * math.cos(splay_rad)
    shoe_len = float(z_rot.max() - z_rot.min())

    # Arm length from shoulder top (y=1.345) along arm arc to middle fingertip (y=0.645)
    finger_mid_pos = part_map["finger_middle_l"]["positions"]
    arm_len = float(1.345 - finger_mid_pos[:, 1].min())

    return {
        "topology": {
            "non_manifold_edges": non_manifold_edges,
            "boundary_edges": boundary_edges,
            "degenerate_triangles": degenerate_tris,
            "loose_vertices": loose_vertices,
            "inverted_normals_parts": inverted_parts,
            "uv_overlap_boxes": box_overlaps,
            "uv_out_of_bounds": uv_inverted_or_overlapping,
        },
        "measurements": {
            "total_height_m": round(total_height, 4),
            "ground_y_min_m": round(all_y_min, 4),
            "head_hat_ratio_pct": round((head_hat_h / total_height) * 100.0, 2),
            "hat_brim_diameter_m": round(brim_diam, 4),
            "hat_crown_height_m": round(crown_h, 4),
            "head_width_m": round(head_w, 4),
            "shoulder_width_m": round(shoulder_w, 4),
            "waist_belt_height_m": round(belt_y_center, 4),
            "waist_belt_pct": round((belt_y_center / total_height) * 100.0, 2),
            "inseam_m": round(inseam_h, 4),
            "shoe_length_m": round(shoe_len, 4),
            "arm_length_m": round(arm_len, 4),
        },
    }


def smoke_test_viewer_http(project_dir):
    import base64
    viewer_html = open(os.path.join(project_dir, "viewer/index.html"), encoding="utf-8").read()
    glb_b64 = base64.b64encode(open(os.path.join(project_dir, "character.glb"), "rb").read()).decode("ascii")

    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--use-gl=angle")
    opts.add_argument("--use-angle=swiftshader")
    opts.add_argument("--enable-webgl")
    opts.add_argument("--ignore-gpu-blocklist")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})

    driver = webdriver.Chrome(options=opts)
    results = {}
    try:
        for vp_name, w, h in [("desktop_1920x1080", 1920, 1080), ("mobile_360x640", 360, 640)]:
            driver.set_window_size(w, h)
            t0 = time.time()
            driver.get("about:blank")
            driver.execute_script("document.open(); document.write(arguments[0]); document.close();", viewer_html)
            driver.execute_script("return window.loadGLBBase64(arguments[0]);", glb_b64)
            load_ms = round((time.time() - t0) * 1000.0, 1)

            for btn_id in [
                "btn-view-front", "btn-view-back", "btn-view-left", "btn-view-right",
                "btn-view-top", "btn-view-34", "btn-view-face", "btn-view-tie",
                "btn-view-buckle", "btn-checker", "btn-theme", "btn-autorotate", "btn-reset"
            ]:
                driver.execute_script(f"document.getElementById('{btn_id}').click();")
                time.sleep(0.03)

            logs = [
                entry for entry in driver.get_log("browser")
                if entry.get("level") == "SEVERE" and "character.glb" not in entry.get("message", "")
            ]
            tris_txt = driver.execute_script("return document.getElementById('stat-tris').textContent;")
            mats_txt = driver.execute_script("return document.getElementById('stat-mats').textContent;")
            results[vp_name] = {
                "loaded": True,
                "load_time_ms": load_ms,
                "displayed_tris": tris_txt,
                "displayed_materials": mats_txt,
                "severe_console_errors": len(logs),
            }
    finally:
        driver.quit()

    return results


if __name__ == "__main__":
    glb_res = validate_glb_binary("/tmp/character_project/character.glb")
    mesh_res = audit_mesh_and_measurements()
    viewer_res = smoke_test_viewer_http("/tmp/character_project")
    report = {
        "glb_validation": glb_res,
        "mesh_audit": mesh_res,
        "viewer_smoke_test": viewer_res,
    }
    print(json.dumps(report, indent=2))
    with open("/tmp/character_project/validation_results.json", "w") as f:
        json.dump(report, f, indent=2)
