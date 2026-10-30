#!/usr/bin/env python3
"""
Procedural PBR Texture Atlas Generator (`build/generate_textures.py`) — Exact 1:1 Pixar Character
Synthesizes 2048x2048 BaseColor, Normal, ORM, and UV Checker textures directly matched to the
color palette, soft gradients, facial features, and material finishes of `image_17e097.jpg`.
"""

import json
import math
import os
import numpy as np
from PIL import Image, ImageDraw


def hex_to_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)], dtype=np.float32)


def smoothstep_np(edge0, edge1, x):
    t = np.clip((x - edge0) / max(edge1 - edge0, 1e-8), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def generate_pbr_textures(allocations, out_dir, size=2048):
    os.makedirs(out_dir, exist_ok=True)

    basecolor = np.full((size, size, 3), 128.0, dtype=np.float32)
    height_field = np.zeros((size, size), dtype=np.float32)
    ao_map = np.full((size, size), 246.0, dtype=np.float32)
    rough_map = np.full((size, size), 165.0, dtype=np.float32)
    metal_map = np.zeros((size, size), dtype=np.float32)

    PALETTE = {
        "hat_crown":   ("#78482A", 0.58, 0.0),
        "hat_brim":    ("#6A3D22", 0.60, 0.0),
        "hat_band":    ("#3D2415", 0.48, 0.0),
        "head":        ("#EDA67A", 0.48, 0.0),
        "nose":        ("#DC624C", 0.42, 0.0),
        "ear":         ("#E2946C", 0.50, 0.0),
        "eyelid":      ("#E69C74", 0.48, 0.0),
        "hand":        ("#EA9E74", 0.50, 0.0),
        "brow":        ("#4E4D50", 0.62, 0.0),
        "hair":        ("#8E9094", 0.64, 0.0),
        "shirt":       ("#649BD2", 0.68, 0.0),
        "button":      ("#5286BC", 0.34, 0.0),
        "neckerchief": ("#BF1719", 0.54, 0.0),
        "belt":        ("#623112", 0.44, 0.0),
        "buckle":      ("#D0D6DC", 0.20, 1.0),
        "denim":       ("#15385A", 0.74, 0.0),
        "shoe_upper":  ("#6B3816", 0.26, 0.0),
        "shoe_sole":   ("#241309", 0.62, 0.0),
    }

    pad_px = max(4, int(0.0025 * size))

    for part_name, box in allocations.items():
        u0, v0, u1, v1 = box
        x0 = max(0, int(math.floor(u0 * size)) - pad_px)
        x1 = min(size, int(math.ceil(u1 * size)) + pad_px)
        y0 = max(0, int(math.floor(v0 * size)) - pad_px)
        y1 = min(size, int(math.ceil(v1 * size)) + pad_px)

        h_px = y1 - y0
        w_px = x1 - x0
        if h_px <= 0 or w_px <= 0:
            continue

        us = (np.arange(x0, x1, dtype=np.float32) / size - u0) / max(u1 - u0, 1e-6)
        vs = (np.arange(y0, y1, dtype=np.float32) / size - v0) / max(v1 - v0, 1e-6)
        U, V = np.meshgrid(np.clip(us, 0.0, 1.0), np.clip(vs, 0.0, 1.0))

        if part_name == "hat_crown":
            cat = "hat_crown"
        elif part_name == "hat_brim":
            cat = "hat_brim"
        elif part_name == "hat_band":
            cat = "hat_band"
        elif part_name == "head":
            cat = "head"
        elif part_name == "nose":
            cat = "nose"
        elif part_name.startswith("ear_"):
            cat = "ear"
        elif part_name.startswith("eyelid_"):
            cat = "eyelid"
        elif part_name.startswith(("palm_", "finger_", "thumb_")):
            cat = "hand"
        elif part_name.startswith("brow_"):
            cat = "brow"
        elif part_name.startswith("hair_"):
            cat = "hair"
        elif part_name.startswith(("shirt_", "collar_", "arm_", "cuff_")):
            cat = "shirt"
        elif part_name.startswith("button_"):
            cat = "button"
        elif part_name.startswith("neckerchief_"):
            cat = "neckerchief"
        elif part_name == "belt_strap":
            cat = "belt"
        elif part_name.startswith("buckle_"):
            cat = "buckle"
        elif part_name.startswith(("trousers_", "leg_", "belt_loop_")):
            cat = "denim"
        elif part_name.startswith("shoe_upper_"):
            cat = "shoe_upper"
        elif part_name.startswith("shoe_sole_"):
            cat = "shoe_sole"
        else:
            cat = "shirt"

        if part_name.startswith("eye_"):
            col = np.zeros((h_px, w_px, 3), dtype=np.float32)
            col[:, :] = hex_to_rgb("#FAF9F5")
            r_cornea = 1.0 - V
            # Big expressive blue iris & pupil matching image_17e097.jpg
            iris_mask = np.clip((0.265 - r_cornea) / 0.016, 0.0, 1.0)
            pupil_mask = np.clip((0.092 - r_cornea) / 0.012, 0.0, 1.0)
            limbus_ring = np.exp(-0.5 * ((r_cornea - 0.250) / 0.016) ** 2)

            angle_f = U * 28.0 * math.pi
            fibers = 0.5 + 0.5 * np.sin(angle_f) * np.cos(angle_f * 0.5 + r_cornea * 36.0)
            iris_inner = hex_to_rgb("#52AEFA")
            iris_outer = hex_to_rgb("#165AA2")
            t_iris = np.clip((r_cornea - 0.11) / 0.14, 0.0, 1.0)[..., None]
            iris_col = iris_inner * (1.0 - t_iris) + iris_outer * t_iris
            iris_col += (fibers[..., None] - 0.5) * 24.0
            iris_col = iris_col * (1.0 - 0.60 * limbus_ring[..., None]) + hex_to_rgb("#0B2342") * (0.60 * limbus_ring[..., None])

            col = col * (1.0 - iris_mask[..., None]) + iris_col * iris_mask[..., None]
            col = col * (1.0 - pupil_mask[..., None]) + hex_to_rgb("#080B11") * pupil_mask[..., None]

            # Bright white specular catchlight dot at top-left of iris (matching image_17e097.jpg!)
            glint1 = np.exp(-0.5 * (((U - 0.19) / 0.038) ** 2 + ((V - 0.87) / 0.032) ** 2))
            glint2 = np.exp(-0.5 * (((U - 0.68) / 0.032) ** 2 + ((V - 0.86) / 0.026) ** 2))
            glint = np.clip(glint1 + glint2, 0.0, 1.0)
            col = np.clip(col + glint[..., None] * 245.0, 0.0, 255.0)

            basecolor[y0:y1, x0:x1] = col
            rough_map[y0:y1, x0:x1] = 16.0
            metal_map[y0:y1, x0:x1] = 0.0
            ao_map[y0:y1, x0:x1] = 252.0
            continue

        hex_c, rough_val, metal_val = PALETTE[cat]
        rgb = hex_to_rgb(hex_c)
        col = np.broadcast_to(rgb, (h_px, w_px, 3)).copy()
        hf = np.zeros((h_px, w_px), dtype=np.float32)
        ao = np.full((h_px, w_px), 245.0, dtype=np.float32)
        rgh = np.full((h_px, w_px), rough_val * 255.0, dtype=np.float32)
        met = np.full((h_px, w_px), metal_val * 255.0, dtype=np.float32)

        if cat == "head":
            # Half 0 (U in [0, 0.5], centered at U=0.25) is the front face (+Z)
            # 1) Warm golden-peach shading on lower jaw/neck (V < 0.25)
            lower_warm = smoothstep_np(0.0, 0.30, 0.30 - V)
            col = col * (1.0 - 0.18 * lower_warm[..., None]) + hex_to_rgb("#E29870") * (0.18 * lower_warm[..., None])

            # 2) Rosy coral-pink cheek blush (U ~ 0.135 and 0.365, V ~ 0.50) & warm chin blush (U ~ 0.25, V ~ 0.25)
            cheek_r = np.exp(-0.5 * (((U - 0.135) / 0.052) ** 2 + ((V - 0.50) / 0.075) ** 2))
            cheek_l = np.exp(-0.5 * (((U - 0.365) / 0.052) ** 2 + ((V - 0.50) / 0.075) ** 2))
            chin_blush = np.exp(-0.5 * (((U - 0.25) / 0.055) ** 2 + ((V - 0.25) / 0.048) ** 2))
            blush = np.clip(cheek_r + cheek_l + 0.55 * chin_blush, 0.0, 1.0)
            col = col * (1.0 - 0.48 * blush[..., None]) + hex_to_rgb("#EE7562") * (0.48 * blush[..., None])

            # 3) Warm upturned CLOSED-LIP SMILE crease & corner dimples (U in [0.16..0.34], V ~ 0.43 + curve)
            dx_smile = (U - 0.25) / 0.085
            v_smile_curve = 0.395 + 0.036 * (dx_smile ** 2)
            smile_line = (
                np.exp(-0.5 * ((V - v_smile_curve) / 0.009) ** 2)
                * np.exp(-0.5 * (dx_smile ** 2))
            )
            dimple_r = np.exp(-0.5 * (((U - 0.165) / 0.014) ** 2 + ((V - 0.432) / 0.020) ** 2))
            dimple_l = np.exp(-0.5 * (((U - 0.335) / 0.014) ** 2 + ((V - 0.432) / 0.020) ** 2))
            smile_dark = np.clip(smile_line + 0.75 * (dimple_r + dimple_l), 0.0, 1.0)
            col = col * (1.0 - 0.78 * smile_dark[..., None]) + hex_to_rgb("#6E281C") * (0.78 * smile_dark[..., None])
            ao *= (1.0 - 0.35 * smile_dark)
            hf -= 0.45 * smile_dark

            # 4) Subtle double-chin crease line above and below the chin pad (V ~ 0.315 and V ~ 0.185)
            chin_crease = (
                np.exp(-0.5 * ((V - 0.315) / 0.012) ** 2) * np.exp(-0.5 * (((U - 0.25) / 0.045) ** 2))
                + 0.8 * np.exp(-0.5 * ((V - 0.185) / 0.014) ** 2) * np.exp(-0.5 * (((U - 0.25) / 0.060) ** 2))
            )
            col = col * (1.0 - 0.35 * chin_crease[..., None]) + hex_to_rgb("#C87A5A") * (0.35 * chin_crease[..., None])
            ao *= (1.0 - 0.22 * chin_crease)

            # 5) Outer eye crow's-feet laugh lines (U ~ 0.13 and 0.37, V ~ 0.68)
            crow_r = np.exp(-0.5 * (((U - 0.135) / 0.018) ** 2 + ((V - 0.68) / 0.022) ** 2))
            crow_l = np.exp(-0.5 * (((U - 0.365) / 0.018) ** 2 + ((V - 0.68) / 0.022) ** 2))
            crows = np.clip(crow_r + crow_l, 0.0, 1.0)
            col = col * (1.0 - 0.25 * crows[..., None]) + hex_to_rgb("#CC8264") * (0.25 * crows[..., None])

            # 6) Soft hat brim ambient shadow at top of forehead (V > 0.82)
            hat_ao = smoothstep_np(0.80, 0.98, V)
            ao *= (1.0 - 0.22 * hat_ao)

        elif cat == "nose":
            # Cute rounded rosy button nose: warm peach at root (V=0) grading to rosy coral-pink at tip (V=1)
            rosy = smoothstep_np(0.10, 0.85, V)
            col = hex_to_rgb("#ECA478") * (1.0 - rosy[..., None]) + hex_to_rgb("#DC5E48") * rosy[..., None]
            # Soft highlight on upper bridge/tip
            tip_spec = np.exp(-0.5 * ((V - 0.82) / 0.14) ** 2)
            rgh = 108.0 - 24.0 * tip_spec

        elif cat in ("ear", "eyelid", "hand"):
            warm_var = smoothstep_np(0.0, 0.7, 1.0 - V)
            col = col * (1.0 - 0.18 * warm_var[..., None]) + hex_to_rgb("#E5856E") * (0.18 * warm_var[..., None])

        elif cat in ("hair", "brow"):
            # Combed silver-grey hair strands
            strands = np.sin(U * 180.0 + np.sin(V * 30.0) * 1.5)
            col += strands[..., None] * 14.0
            hf += 0.30 * strands
            ao -= 16.0 * (0.5 - 0.5 * strands)

        elif cat == "hat_brim":
            # Darker warm brown on the underside of the brim (ph in [pi..2pi] -> U in [0.5..1.0]),
            # warm saddle brown on top (U in [0.0..0.5]) matching image_17e097.jpg!
            underside = smoothstep_np(0.45, 0.58, U) * (1.0 - smoothstep_np(0.92, 1.0, U))
            col_top = hex_to_rgb("#7A4A2B")
            col_bot = hex_to_rgb("#422411")
            col = col_top * (1.0 - underside[..., None]) + col_bot * underside[..., None]
            ao *= (1.0 - 0.18 * underside)

        elif cat == "hat_crown":
            # Subtle crown crease shading & warm highlight on the two top peaks
            peak_hl = np.exp(-0.5 * ((V - 0.82) / 0.15) ** 2)
            col += peak_hl[..., None] * 14.0

        elif cat == "neckerchief":
            # Vibrant crimson-red neckerchief with soft fold shading
            folds = np.sin(U * 28.0 + V * 12.0) * 0.5 + np.cos(V * 24.0) * 0.5
            col_mid = hex_to_rgb("#C81B1D")
            col_hi = hex_to_rgb("#E22B2B")
            col_sh = hex_to_rgb("#880E10")
            t_f = np.clip(0.5 + 0.35 * folds, 0.0, 1.0)[..., None]
            col = col_sh * (1.0 - t_f) + col_hi * t_f
            col = 0.65 * col + 0.35 * col_mid
            ao -= 18.0 * np.maximum(0.0, -folds)
            hf += 0.22 * folds

        elif cat == "shirt":
            # Soft powder-blue cotton with warm lower belly shading & subtle center placket line
            grad_v = smoothstep_np(0.0, 0.85, V)
            col_low = hex_to_rgb("#4D82B8")
            col_high = hex_to_rgb("#75AAE0")
            col = col_low * (1.0 - grad_v[..., None]) + col_high * grad_v[..., None]

            if part_name == "shirt_torso":
                # Subtle center placket double seam line at front center (U ~ 0.245)
                plk_line = (
                    np.exp(-0.5 * ((U - 0.236) / 0.003) ** 2)
                    + 0.6 * np.exp(-0.5 * ((U - 0.256) / 0.003) ** 2)
                )
                col = col * (1.0 - 0.28 * plk_line[..., None]) + hex_to_rgb("#3D6B99") * (0.28 * plk_line[..., None])
                hf -= 0.25 * plk_line
                # Soft belt contact AO at bottom of belly (V < 0.08)
                belt_ao = smoothstep_np(0.0, 0.09, 0.09 - V)
                ao *= (1.0 - 0.25 * belt_ao)

        elif cat == "button":
            # Beveled powder-blue button with raised rim, recessed dish, and 2 central thread holes
            r_b = 1.0 - V
            rim = np.exp(-0.5 * ((r_b - 0.24) / 0.045) ** 2)
            dish = np.clip((0.18 - r_b) / 0.05, 0.0, 1.0)
            holes = np.exp(-0.5 * ((r_b - 0.07) / 0.025) ** 2) * (np.cos(U * 4.0 * math.pi) > 0.25).astype(np.float32)
            col = col + rim[..., None] * 28.0 - dish[..., None] * 22.0 - holes[..., None] * 65.0
            hf += 0.35 * rim - 0.50 * holes

        elif cat == "belt":
            # Rich cognac brown leather belt with top/bottom dark bevels
            edge_dark = np.exp(-0.5 * ((V - 0.05) / 0.06) ** 2) + np.exp(-0.5 * ((V - 0.95) / 0.06) ** 2)
            col = col * (1.0 - 0.35 * edge_dark[..., None]) + hex_to_rgb("#3B1C09") * (0.35 * edge_dark[..., None])

        elif cat == "buckle":
            if part_name == "buckle_plate":
                col = np.broadcast_to(hex_to_rgb("#989EA6"), (h_px, w_px, 3)).copy()
                rgh[:, :] = 68.0
                ao[:, :] = 205.0
            else:
                col = np.broadcast_to(hex_to_rgb("#E2E7EC"), (h_px, w_px, 3)).copy()
                rgh[:, :] = 38.0
                ao[:, :] = 250.0
            met[:, :] = 255.0

        elif cat == "denim":
            # Deep indigo denim with subtle vertical gradient & pocket seam shading
            grad_v = smoothstep_np(0.0, 0.9, V)
            col = hex_to_rgb("#143454") * (1.0 - grad_v[..., None]) + hex_to_rgb("#214D78") * grad_v[..., None]
            seam_u = np.exp(-0.5 * ((U - 0.03) / 0.008) ** 2) + np.exp(-0.5 * ((U - 0.47) / 0.008) ** 2)
            col = col * (1.0 - 0.35 * seam_u[..., None]) + hex_to_rgb("#0E243B") * (0.35 * seam_u[..., None])

        elif cat == "shoe_upper":
            # Glossy brown leather boots with warm burnished toe highlight & dark instep lace grooves
            toe_hl = np.exp(-0.5 * ((V - 0.80) / 0.14) ** 2)
            lace_band = (
                np.exp(-0.5 * ((V - 0.48) / 0.012) ** 2)
                + np.exp(-0.5 * ((V - 0.54) / 0.012) ** 2)
                + np.exp(-0.5 * ((V - 0.60) / 0.012) ** 2)
            ) * np.exp(-0.5 * (((U - 0.25) / 0.12) ** 2))
            col = col + toe_hl[..., None] * 24.0
            col = col * (1.0 - 0.55 * lace_band[..., None]) + hex_to_rgb("#2E1608") * (0.55 * lace_band[..., None])
            rgh -= 18.0 * toe_hl

        basecolor[y0:y1, x0:x1] = np.clip(col, 0.0, 255.0)
        height_field[y0:y1, x0:x1] = hf
        ao_map[y0:y1, x0:x1] = np.clip(ao, 0.0, 255.0)
        rough_map[y0:y1, x0:x1] = np.clip(rgh, 10.0, 255.0)
        metal_map[y0:y1, x0:x1] = np.clip(met, 0.0, 255.0)

    dy, dx = np.gradient(height_field)
    strength = 0.40
    nx = -dx * strength
    ny = -dy * strength
    nz = np.ones_like(nx)
    norm_len = np.sqrt(nx * nx + ny * ny + nz * nz)
    nx /= norm_len
    ny /= norm_len
    nz /= norm_len

    normal_rgb = (
        np.stack(
            [
                np.clip((nx * 0.5 + 0.5) * 255.0, 0, 255),
                np.clip((ny * 0.5 + 0.5) * 255.0, 0, 255),
                np.clip((nz * 0.5 + 0.5) * 255.0, 0, 255),
            ],
            axis=-1,
        ).astype(np.uint8)
        // 4
    ) * 4

    orm_rgb = np.stack(
        [
            ao_map.astype(np.uint8),
            rough_map.astype(np.uint8),
            metal_map.astype(np.uint8),
        ],
        axis=-1,
    )

    basecolor_u8 = basecolor.astype(np.uint8)

    basecolor_path = os.path.join(out_dir, "basecolor.png")
    normal_path = os.path.join(out_dir, "normal.png")
    orm_path = os.path.join(out_dir, "orm.png")
    checker_path = os.path.join(out_dir, "uv_checker.png")

    Image.fromarray(basecolor_u8, mode="RGB").save(basecolor_path, optimize=True)
    Image.fromarray(normal_rgb, mode="RGB").save(normal_path, optimize=True)
    Image.fromarray(orm_rgb, mode="RGB").save(orm_path, optimize=True)

    checker = Image.new("RGB", (size, size), (240, 240, 240))
    draw = ImageDraw.Draw(checker)
    n_cells = 32
    cell_px = size // n_cells
    palette_chk = [
        (52, 110, 168), (68, 152, 118), (196, 134, 62), (168, 72, 92),
        (106, 90, 168), (74, 146, 168), (162, 154, 64), (138, 86, 68),
    ]
    for r in range(n_cells):
        for c in range(n_cells):
            base_c = palette_chk[((r // 4) * 2 + (c // 4)) % len(palette_chk)]
            if (r + c) % 2 == 0:
                fill = tuple(min(255, int(v * 1.25)) for v in base_c)
            else:
                fill = tuple(max(0, int(v * 0.72)) for v in base_c)
            draw.rectangle(
                [c * cell_px, r * cell_px, (c + 1) * cell_px, (r + 1) * cell_px],
                fill=fill,
                outline=(220, 220, 220),
            )
    checker.save(checker_path, optimize=True)

    return {
        "basecolor": basecolor_path,
        "normal": normal_path,
        "orm": orm_path,
        "checker": checker_path,
    }


if __name__ == "__main__":
    with open("artifacts/file_generation/ttl=63d/intermediate/project/build/uv_layout.json") as f:
        allocs = json.load(f)
    paths = generate_pbr_textures(
        allocs, "artifacts/file_generation/ttl=63d/intermediate/project/build/textures", size=2048
    )
    for k, p in paths.items():
        print(f"{k}: {p} ({os.path.getsize(p)/1024:.1f} KB)")
