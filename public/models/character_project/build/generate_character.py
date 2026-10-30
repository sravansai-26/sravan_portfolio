#!/usr/bin/env python3
"""
Procedural 3D Character Mesh Generator (`build/generate_character.py`) — Exact 1:1 Pixar Character
Reconstructs the exact chubby, friendly, middle-aged character character from the reference 2D render
(`image_17e097.jpg`) in full 360-degree 3D geometry with zero fat reduction and no caricature sketch overrides:
  - Sculpted Western character hat with cattleman two-peak crown crease, front pinch, wide curved brim, and dark band.
  - Large pear-shaped head with wide fleshy jowls, prominent rounded double-chin pad, warm closed-lip smile
    with dimples, cute rounded rosy button nose, big expressive blue eyes with catchlights, thick arched
    grey eyebrows, rounded ears, and combed silver-grey sideburns/back hair.
  - Plump crimson-red neckerchief wrapped around the neck with a puffed central knot, sculpted fabric folds,
    and two curved pointed tails resting over the powder-blue pointed shirt collar wings.
  - Full, round, cuddly barrel belly/torso in powder-blue cotton with center placket, 3 beveled buttons,
    huge rounded shoulders, thick curved sleeves with inner elbow creases, rolled cuffs, and chubby hands.
  - Low-slung brown leather belt at y = 0.55 m with denim belt loops and a thick rounded silver oval buckle
    with two vertical capsule indentations.
  - Short, thick, stocky deep-denim trousers (crotch arch at y = 0.28 m) with front pocket seams and
    splayed glossy brown leather boots with stitched welt, raised heel block, and instep laces.
"""

import json
import math
import os
import numpy as np
from mesh_primitives import UVTileAllocator, build_closed_tube, build_closed_torus


def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / max(edge1 - edge0, 1e-8), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def gaussian(x, mu, sigma):
    return np.exp(-0.5 * ((x - mu) / max(sigma, 1e-8)) ** 2)


def rot_y(pts, angle_rad):
    c, s = math.cos(angle_rad), math.sin(angle_rad)
    R = np.array([[c, 0.0, s], [0.0, 1.0, 0.0], [-s, 0.0, c]], dtype=np.float64)
    return pts @ R.T


def rot_z(pts, angle_rad):
    c, s = math.cos(angle_rad), math.sin(angle_rad)
    R = np.array([[c, -s, 0.0], [s, c, 0.0], [0.0, 0.0, 1.0]], dtype=np.float64)
    return pts @ R.T


def make_SweepTube(spine_pts, radii_x, radii_z, Nv, uv_box, mat_name, part_name, up_hint=(0.0, 0.0, 1.0)):
    """Sweeps an elliptical cross-section along a 3D spine curve using parallel transport frames."""
    spine = np.asarray(spine_pts, dtype=np.float64)
    Nu = len(spine)
    rx = np.asarray(radii_x, dtype=np.float64)
    rz = np.asarray(radii_z, dtype=np.float64)

    tangents = np.zeros_like(spine)
    tangents[0] = spine[1] - spine[0]
    tangents[-1] = spine[-1] - spine[-2]
    for i in range(1, Nu - 1):
        tangents[i] = spine[i + 1] - spine[i - 1]
    t_norms = np.linalg.norm(tangents, axis=1, keepdims=True)
    tangents /= np.maximum(t_norms, 1e-8)

    normals = np.zeros_like(spine)
    binormals = np.zeros_like(spine)
    up_ref = np.array(up_hint, dtype=np.float64)
    if abs(np.dot(tangents[0], up_ref)) > 0.92:
        up_ref = np.array([1.0, 0.0, 0.0], dtype=np.float64)
    binormals[0] = np.cross(tangents[0], up_ref)
    binormals[0] /= np.linalg.norm(binormals[0])
    normals[0] = np.cross(binormals[0], tangents[0])

    for i in range(1, Nu):
        v = np.cross(tangents[i - 1], tangents[i])
        s = np.linalg.norm(v)
        c = np.dot(tangents[i - 1], tangents[i])
        if s < 1e-7:
            normals[i] = normals[i - 1]
            binormals[i] = binormals[i - 1]
        else:
            axis = v / s
            n_prev = normals[i - 1]
            normals[i] = (
                n_prev * c
                + np.cross(axis, n_prev) * s
                + axis * np.dot(axis, n_prev) * (1.0 - c)
            )
            normals[i] /= np.linalg.norm(normals[i])
            binormals[i] = np.cross(tangents[i], normals[i])

    rings = np.zeros((Nu, Nv, 3), dtype=np.float64)
    thetas = np.linspace(0.0, 2.0 * math.pi, Nv, endpoint=False)
    for i in range(Nu):
        u_axis = normals[i]
        v_axis = binormals[i]
        for j, th in enumerate(thetas):
            rings[i, j] = (
                spine[i]
                + rx[i] * math.sin(th) * u_axis
                + rz[i] * math.cos(th) * v_axis
            )

    bot_pole = spine[0] - tangents[0] * (0.22 * min(rx[0], rz[0]))
    top_pole = spine[-1] + tangents[-1] * (0.22 * min(rx[-1], rz[-1]))
    return build_closed_tube(rings, bot_pole, top_pole, uv_box, mat_name, part_name)


def build_character_parts():
    """Builds all sculpted manifold parts of the Pixar-style character character from `image_17e097.jpg`."""
    allocator = UVTileAllocator(grid_cols=14, grid_rows=14, margin=0.0025)
    parts = []

    def front_back_thetas(Nv):
        return np.linspace(0.0, 2.0 * math.pi, Nv, endpoint=False)

    # =========================================================================
    # 1. WESTERN CHARACTER HAT: Sculpted Cattleman Crown (two top peaks + center
    #    valley crease + front pinch dimples), wide upturned U-brim, dark band.
    #    y = 1.48 m to 1.75 m, brim width = 0.56 m.
    # =========================================================================
    Nu_crown, Nv_crown = 36, 64
    th_crown = front_back_thetas(Nv_crown)
    rings_crown = np.zeros((Nu_crown, Nv_crown, 3), dtype=np.float64)
    y_crown_vals = np.linspace(1.528, 1.742, Nu_crown)
    for i, y in enumerate(y_crown_vals):
        t = (y - 1.528) / (1.742 - 1.528)  # 0 at band base, 1 at top peaks
        # Western crown taper: wider at base (rx=0.142, rz=0.162), tapering inward as it rises
        taper_x = 1.0 - 0.22 * (t ** 1.15)
        taper_z = 1.0 - 0.16 * (t ** 1.15)
        top_dome = 0.16 + 0.84 * (1.0 - 0.65 * (smoothstep(0.84, 1.0, t) ** 2))
        rx_c = 0.144 * taper_x * top_dome
        rz_c = 0.160 * taper_z * top_dome

        for j, th in enumerate(th_crown):
            cx = -math.cos(th)
            cz = math.sin(th)
            # Front side pinch dimples (classic character hat pinch at cz > 0.2, |cx| ~ 0.65, t in [0.35..0.85])
            pinch = (
                -0.016
                * gaussian(t, 0.62, 0.22)
                * gaussian(abs(cx), 0.68, 0.22)
                * smoothstep(0.0, 0.7, cz)
            )
            x = cx * (rx_c + pinch)
            z = cz * rz_c - 0.010

            # Cattleman two-peak top crease: two rounded peaks at |cx| ~ 0.55 and a central valley dip at cx ~ 0
            yy = y
            if t > 0.60:
                w_top = smoothstep(0.60, 1.0, t)
                cattleman_peaks = 0.022 * w_top * math.sin(abs(cx) * math.pi * 0.95)
                center_valley = -0.018 * w_top * gaussian(cx, 0.0, 0.28) * (1.0 - 0.3 * abs(cz))
                yy = y + cattleman_peaks + center_valley
            rings_crown[i, j] = [x, yy, z]

    uv_crown = allocator.allocate("hat_crown", 2, 2)
    parts.append(
        build_closed_tube(
            rings_crown,
            [0.0, 1.524, -0.010],
            [0.0, 1.730, -0.010],
            uv_crown,
            "mat_hat_leather",
            "hat_crown",
        )
    )

    # Western Character Hat Brim: Wide (0.56 m), sweeping up on left and right wings and dipping in front
    # so the warm dark-brown underside frames the forehead and hair just like image_17e097.jpg!
    Nu_brim, Nv_brim = 64, 24
    th_brim = front_back_thetas(Nu_brim)
    phi_brim = np.linspace(0.0, 2.0 * math.pi, Nv_brim, endpoint=False)
    pts_brim = np.zeros((Nu_brim, Nv_brim, 3), dtype=np.float64)
    for i, th in enumerate(th_brim):
        cx = -math.cos(th)
        cz = math.sin(th)
        r_in_x, r_out_x = 0.085, 0.274
        r_in_z, r_out_z = 0.095, 0.258
        for j, ph in enumerate(phi_brim):
            s_rad = 0.5 * (1.0 + math.cos(ph))  # 0 at crown root, 1 at outer brim edge
            thick_half = 0.010 * (0.75 + 0.35 * s_rad)
            rx = r_in_x + s_rad * (r_out_x - r_in_x) + 0.008 * math.cos(ph)
            rz = r_in_z + s_rad * (r_out_z - r_in_z) + 0.008 * math.cos(ph)
            x = cx * rx
            z = cz * rz - 0.010
            # Dramatic Western upward curl on sides (cx^2) + slight jaunty asymmetry as in image_17e097.jpg
            side_curl = 0.072 * (s_rad ** 1.35) * (cx ** 2)
            jaunty_tilt = -0.014 * cx * s_rad
            front_dip = -0.012 * (s_rad ** 1.2) * max(cz, 0.0)
            y_mid = 1.515 + side_curl + jaunty_tilt + front_dip
            y = y_mid + thick_half * math.sin(ph)
            pts_brim[i, j] = [x, y, z]

    uv_brim = allocator.allocate("hat_brim", 2, 2)
    parts.append(
        build_closed_torus(pts_brim, uv_brim, "mat_hat_leather", "hat_brim")
    )

    # Dark Chocolate-Brown Leather Hat Band (y = 1.530..1.572 m)
    Nu_band, Nv_band = 56, 16
    th_band = front_back_thetas(Nu_band)
    phi_band = np.linspace(0.0, 2.0 * math.pi, Nv_band, endpoint=False)
    pts_band = np.zeros((Nu_band, Nv_band, 3), dtype=np.float64)
    for i, th in enumerate(th_band):
        cx = -math.cos(th)
        cz = math.sin(th)
        rx_b = 0.143
        rz_b = 0.159
        y_base = 1.542 + 0.012 * (cx ** 2) - 0.004 * cx
        for j, ph in enumerate(phi_band):
            dr = 0.0055 * math.cos(ph)
            dy = 0.020 * math.sin(ph)
            pts_band[i, j] = [
                cx * (rx_b + dr),
                y_base + dy,
                cz * (rz_b + dr) - 0.010,
            ]

    uv_band = allocator.allocate("hat_band", 2, 1)
    parts.append(
        build_closed_torus(pts_band, uv_band, "mat_hat_band", "hat_band")
    )

    # =========================================================================
    # 2. BIG PEAR-SHAPED HEAD & FACE (`mat_skin`):
    #    Spans y = 1.11 m (nestled inside neckerchief) to y = 1.56 m (under hat).
    #    Wide fleshy jowls (width = 0.39 m at y = 1.25 m), tapering to forehead
    #    (width = 0.28 m at y = 1.48 m), prominent rounded double-chin pad,
    #    warm upturned closed-lip smile with cheek dimples, eye sockets!
    # =========================================================================
    Nu_head, Nv_head = 64, 80
    th_head = front_back_thetas(Nv_head)
    y_head_vals = np.linspace(1.110, 1.610, Nu_head)
    rings_head = np.zeros((Nu_head, Nv_head, 3), dtype=np.float64)

    for i, y in enumerate(y_head_vals):
        t = (y - 1.110) / (1.610 - 1.110)  # 0 at neck base inside bandana, 1 at top cranium
        # Pear-shaped profile: wide heavy jowls/cheeks at t in [0.18..0.48], tapering smoothly to temples (t~0.75)
        bot_round = 0.22 + 0.78 * (smoothstep(0.0, 0.16, t) ** 0.55)
        hat_tuck = 1.0 - 0.32 * smoothstep(0.74, 0.94, t)
        top_cap = (0.22 + 0.78 * (1.0 - 0.65 * (smoothstep(0.88, 1.0, t) ** 2))) * hat_tuck
        pear_jowl = 1.0 + 0.24 * gaussian(t, 0.32, 0.16) - 0.12 * smoothstep(0.52, 0.85, t)

        base_rx = 0.158 * bot_round * top_cap * pear_jowl
        base_rz = 0.152 * bot_round * top_cap * (1.0 + 0.18 * gaussian(t, 0.30, 0.16))

        for j, th in enumerate(th_head):
            cx = -math.cos(th)
            cz = math.sin(th)
            # Soft, fleshy rounded-pear cross-section
            denom = (abs(cx) ** 2.3 + abs(cz) ** 2.3) ** (1.0 / 2.3)
            r_mult = 0.84 + 0.16 * min(1.0 / max(denom, 1e-4), 1.10)

            rx = base_rx * r_mult
            rz = base_rz * r_mult

            if cz > 0.0:
                # 1) Full, plump rosy cheek apples & wide lower jowls (t ~ 0.36..0.54)
                cheek_apple = 0.020 * gaussian(t, 0.48, 0.11) * gaussian(abs(cx), 0.52, 0.24) * (cz ** 1.3)
                jowl_swell = 0.018 * gaussian(t, 0.28, 0.12) * gaussian(abs(cx), 0.58, 0.28) * cz
                rx += cheek_apple + jowl_swell
                rz += 0.85 * cheek_apple + 0.65 * jowl_swell

                # 2) Prominent rounded Chin Pad / Double-Chin cushion (y ~ 1.22 m -> t ~ 0.24, cx ~ 0)
                chin_pad = 0.028 * gaussian(t, 0.220, 0.058) * gaussian(cx, 0.0, 0.26) * (cz ** 2)
                # Crease groove directly above and below the chin pad (matching image_17e097.jpg!)
                chin_groove_top = -0.010 * gaussian(t, 0.285, 0.020) * gaussian(cx, 0.0, 0.24) * (cz ** 2)
                chin_groove_bot = -0.010 * gaussian(t, 0.155, 0.022) * gaussian(cx, 0.0, 0.30) * (cz ** 2)
                rz += chin_pad + chin_groove_top + chin_groove_bot

                # 3) Warm, friendly CLOSED-LIP SMILE (y ~ 1.31 m -> t ~ 0.44, curving upward at corners!)
                smile_curve_t = 0.385 + 0.16 * (cx ** 2)
                smile_seam = -0.014 * gaussian(t, smile_curve_t, 0.016) * gaussian(cx, 0.0, 0.34) * (cz ** 3)
                # Plump upper lip & soft lower lip cushion framing the closed smile
                upper_lip = 0.014 * gaussian(t, smile_curve_t + 0.032, 0.028) * gaussian(cx, 0.0, 0.32) * (cz ** 2)
                lower_lip = 0.011 * gaussian(t, smile_curve_t - 0.030, 0.025) * gaussian(cx, 0.0, 0.26) * (cz ** 2)
                # Cheerful smile corner dimple creases at |cx| ~ 0.46, t ~ 0.47
                dimples = -0.009 * gaussian(t, 0.425, 0.032) * gaussian(abs(cx), 0.46, 0.06) * (cz ** 2)
                rz += smile_seam + upper_lip + lower_lip + dimples

                # 4) Orbital eye sockets recession (y ~ 1.43 m -> t ~ 0.70, x ~ ±0.056 m -> cx ~ ±0.35)
                eye_sock_l = gaussian(t, 0.640, 0.048) * gaussian(cx, 0.35, 0.15)
                eye_sock_r = gaussian(t, 0.640, 0.048) * gaussian(cx, -0.35, 0.15)
                brow_boss = 0.009 * gaussian(t, 0.74, 0.042) * gaussian(abs(cx), 0.36, 0.26)
                rz = rz - 0.016 * (eye_sock_l + eye_sock_r) * (cz ** 2) + brow_boss * (cz ** 2)

            x = cx * rx
            z = cz * rz + 0.018 * smoothstep(0.0, 0.5, 1.0 - t)
            rings_head[i, j] = [x, y, z]

    uv_head = allocator.allocate("head", 3, 3)
    parts.append(
        build_closed_tube(
            rings_head,
            [0.0, 1.105, 0.018],
            [0.0, 1.614, 0.0],
            uv_head,
            "mat_skin",
            "head",
        )
    )

    # =========================================================================
    # 3. CUTE ROUNDED ROSY BUTTON NOSE (`mat_skin`):
    #    Centered at (x=0.0, y=1.365 m, z=+0.205 m), wider than tall (width ~0.096 m,
    #    height ~0.062 m), soft bulbous center with cute left/right nostril wings!
    # =========================================================================
    Nu_nose, Nv_nose = 28, 40
    th_nose = np.linspace(0.0, 2.0 * math.pi, Nv_nose, endpoint=False)
    rings_nose = np.zeros((Nu_nose, Nv_nose, 3), dtype=np.float64)
    for i in range(Nu_nose):
        s = i / (Nu_nose - 1)  # 0 at root inside face, 1 at front of rounded button tip
        dome = math.sin(math.pi * (0.06 + 0.88 * s)) ** 0.52
        z_c = 0.162 + 0.058 * smoothstep(0.0, 1.0, s)
        y_c = 1.370 - 0.006 * math.sin(s * math.pi)
        rx_n = 0.048 * dome * (1.0 + 0.15 * gaussian(s, 0.45, 0.22))
        ry_n = 0.031 * dome * (1.0 + 0.10 * gaussian(s, 0.55, 0.25))
        for j, th in enumerate(th_nose):
            cx = math.cos(th)
            cy = math.sin(th)
            # Subtle nostril wing flare on left/right sides (|cx| > 0.7, cy < 0)
            wing = 0.005 * gaussian(s, 0.48, 0.18) * (abs(cx) ** 2) * max(-cy, 0.0)
            rings_nose[i, j] = [
                cx * (rx_n + wing),
                y_c + cy * ry_n - 0.003 * wing,
                z_c,
            ]

    uv_nose = allocator.allocate("nose", 2, 1)
    parts.append(
        build_closed_tube(
            rings_nose,
            [0.0, 1.370, 0.158],
            [0.0, 1.368, 0.223],
            uv_nose,
            "mat_skin",
            "nose",
        )
    )

    # =========================================================================
    # 4. ROUNDED CARTOON EARS (`mat_skin`, visible on both sides at y=1.34..1.44 m)
    # =========================================================================
    for side_sign, side_name in [(+1.0, "ear_l"), (-1.0, "ear_r")]:
        Nu_ear, Nv_ear = 20, 28
        th_ear = np.linspace(0.0, 2.0 * math.pi, Nv_ear, endpoint=False)
        rings_ear = np.zeros((Nu_ear, Nv_ear, 3), dtype=np.float64)
        y_ear_vals = np.linspace(1.335, 1.438, Nu_ear)
        for i, y in enumerate(y_ear_vals):
            t = (y - 1.335) / (1.438 - 1.335)
            cap = math.sin(math.pi * (0.06 + 0.88 * t)) ** 0.52
            lobe_profile = 0.75 * gaussian(t, 0.20, 0.16) + 1.0 * gaussian(t, 0.65, 0.28)
            rx_e = 0.024 * lobe_profile * cap
            rz_e = 0.020 * lobe_profile * cap
            x_center = side_sign * (0.166 + 0.016 * lobe_profile * cap)
            z_center = 0.005
            for j, th in enumerate(th_ear):
                concha = -0.0055 * gaussian(t, 0.52, 0.20) * max(math.sin(th), 0.0) ** 2
                rings_ear[i, j] = [
                    x_center + rx_e * math.cos(th),
                    y,
                    z_center + (rz_e + concha) * math.sin(th),
                ]
        uv_ear = allocator.allocate(side_name, 1, 1)
        parts.append(
            build_closed_tube(
                rings_ear,
                rings_ear[0].mean(axis=0) - np.array([0.0, 0.002, 0.0]),
                rings_ear[-1].mean(axis=0) + np.array([0.0, 0.002, 0.0]),
                uv_ear,
                "mat_skin",
                side_name,
            )
        )

    # =========================================================================
    # 5. BIG EXPRESSIVE BLUE EYES, EYELIDS & THICK ARCHED GREY EYEBROWS:
    #    Centered at y = 1.430 m, x = ±0.054 m, looking warmly forward!
    # =========================================================================
    for side_sign, suffix in [(-1.0, "r"), (+1.0, "l")]:
        ex = side_sign * 0.053
        ey = 1.430
        ez = 0.156
        Nu_eye, Nv_eye = 24, 32
        th_eye = np.linspace(0.0, 2.0 * math.pi, Nv_eye, endpoint=False)
        rings_eye = np.zeros((Nu_eye, Nv_eye, 3), dtype=np.float64)
        for i in range(Nu_eye):
            u_lat = -0.85 + 1.75 * (i / (Nu_eye - 1))
            r_ring = 0.026 * math.sqrt(max(1.0 - (u_lat ** 2), 0.02))
            cornea = 0.0022 * smoothstep(0.62, 0.90, u_lat)
            z_loc = 0.025 * u_lat + cornea
            for j, th in enumerate(th_eye):
                rings_eye[i, j] = [
                    ex + r_ring * math.cos(th),
                    ey + r_ring * math.sin(th),
                    ez + z_loc,
                ]

        uv_eye = allocator.allocate(f"eye_{suffix}", 1, 1)
        parts.append(
            build_closed_tube(
                rings_eye,
                [ex, ey, ez - 0.025],
                [ex, ey, ez + 0.026],
                uv_eye,
                "mat_eye",
                f"eye_{suffix}",
            )
        )

        # Expressive upper & lower eyelids (`mat_skin`)
        for lid_name, y_off, arch_sign in [("upper", +0.015, +1.0), ("lower", -0.015, -0.65)]:
            Nu_lid, Nv_lid = 16, 18
            spine_lid = np.zeros((Nu_lid, 3), dtype=np.float64)
            rx_lid = np.zeros(Nu_lid, dtype=np.float64)
            rz_lid = np.zeros(Nu_lid, dtype=np.float64)
            for i in range(Nu_lid):
                s = -1.0 + 2.0 * (i / (Nu_lid - 1))
                lx = ex + 0.028 * s
                ly = ey + y_off + arch_sign * 0.0085 * (1.0 - s * s)
                lz = ez + 0.021 * math.sqrt(max(1.0 - 0.55 * s * s, 0.1))
                spine_lid[i] = [lx, ly, lz]
                taper = math.sqrt(max(1.0 - 0.80 * s * s, 0.08))
                rx_lid[i] = 0.0052 * taper
                rz_lid[i] = 0.0062 * taper
            uv_lid = allocator.allocate(f"eyelid_{lid_name}_{suffix}", 1, 1)
            parts.append(
                make_SweepTube(
                    spine_lid,
                    rx_lid,
                    rz_lid,
                    Nv_lid,
                    uv_lid,
                    "mat_skin",
                    f"eyelid_{lid_name}_{suffix}",
                    up_hint=(0.0, 1.0, 0.0),
                )
            )

        # Thick, expressive dark-grey eyebrows (`mat_hair` at y = 1.488 m)
        Nu_brow, Nv_brow = 16, 20
        spine_brow = np.zeros((Nu_brow, 3), dtype=np.float64)
        rx_brow = np.zeros(Nu_brow, dtype=np.float64)
        rz_brow = np.zeros(Nu_brow, dtype=np.float64)
        for i in range(Nu_brow):
            s = -1.0 + 2.0 * (i / (Nu_brow - 1))
            bx = ex + side_sign * 0.004 + side_sign * 0.034 * s
            by = 1.488 + 0.010 * (1.0 - (s - 0.12) ** 2) - 0.004 * s
            bz = 0.166 - 0.012 * (s ** 2)
            spine_brow[i] = [bx, by, bz]
            taper = math.sin(math.pi * (0.08 + 0.84 * (i / (Nu_brow - 1)))) ** 0.60
            rx_brow[i] = 0.0095 * taper
            rz_brow[i] = 0.0080 * taper
        uv_brow = allocator.allocate(f"brow_{suffix}", 1, 1)
        parts.append(
            make_SweepTube(
                spine_brow,
                rx_brow,
                rz_brow,
                Nv_brow,
                uv_brow,
                "mat_hair",
                f"brow_{suffix}",
                up_hint=(0.0, 1.0, 0.0),
            )
        )

    # =========================================================================
    # 6. SILVER-GREY HAIR TEMPLES, SIDEBURNS & BACK HAIR (`mat_hair`):
    #    Framing the temples between the ears and the hat brim (y = 1.39..1.52 m)
    # =========================================================================
    Nu_hair, Nv_hair = 32, 32
    spine_hair = np.zeros((Nu_hair, 3), dtype=np.float64)
    rx_hair = np.zeros(Nu_hair, dtype=np.float64)
    rz_hair = np.zeros(Nu_hair, dtype=np.float64)
    for i in range(Nu_hair):
        t = i / (Nu_hair - 1)
        ang = math.pi * (-0.64 + 1.28 * t)
        hx = 0.154 * math.sin(ang)
        hz = -0.146 * math.cos(ang) + 0.008
        sideburn_dip = -0.038 * (gaussian(t, 0.06, 0.09) + gaussian(t, 0.94, 0.09))
        hy = 1.472 + sideburn_dip - 0.014 * math.cos(ang * 0.8)
        spine_hair[i] = [hx, hy, hz]
        taper = math.sin(math.pi * (0.05 + 0.90 * t)) ** 0.50
        rx_hair[i] = 0.044 * taper
        rz_hair[i] = 0.024 * taper

    uv_hair = allocator.allocate("hair_sideburns", 2, 1)
    parts.append(
        make_SweepTube(
            spine_hair,
            rx_hair,
            rz_hair,
            Nv_hair,
            uv_hair,
            "mat_hair",
            "hair_sideburns",
            up_hint=(0.0, 1.0, 0.0),
        )
    )

    # =========================================================================
    # 7. BIG CHUBBY BARREL TORSO & BELLY (`mat_shirt_fabric`):
    #    Exact 1:1 match to `image_17e097.jpg` (NO fat reduction!):
    #    Spans y = 0.54 m (belt line) up to y = 1.20 m (shoulder/neck base).
    #    Wide, round, cuddly belly (width = 0.70 m, depth = 0.56 m) swelling
    #    warmly above the belt!
    # =========================================================================
    Nu_torso, Nv_torso = 48, 68
    th_torso = front_back_thetas(Nv_torso)
    y_torso_vals = np.linspace(0.540, 1.205, Nu_torso)
    rings_torso = np.zeros((Nu_torso, Nv_torso, 3), dtype=np.float64)

    for i, y in enumerate(y_torso_vals):
        t = (y - 0.540) / (1.205 - 0.540)  # 0 at belt waist (0.54 m), 1 at neck base (1.205 m)
        bot_cap = 0.25 + 0.75 * smoothstep(0.0, 0.06, t)
        top_taper = 0.25 + 0.75 * (1.0 - 0.48 * (smoothstep(0.72, 1.0, t) ** 1.35))

        # Big round belly bulge peaking around t ~ 0.34 (y ~ 0.76 m) with warm cushion above belt (t ~ 0.14)
        belly_bulge_x = 0.342 + 0.025 * gaussian(t, 0.36, 0.26)
        rx_t = belly_bulge_x * bot_cap * top_taper

        belly_bulge_z = 0.245 + 0.052 * gaussian(t, 0.34, 0.26) + 0.015 * gaussian(t, 0.12, 0.08)
        rz_front = belly_bulge_z * bot_cap * top_taper
        rz_back = (0.215 + 0.022 * smoothstep(0.1, 0.7, t)) * bot_cap * top_taper

        for j, th in enumerate(th_torso):
            cx = -math.cos(th)
            cz = math.sin(th)
            denom = (abs(cx) ** 2.15 + abs(cz) ** 2.15) ** (1.0 / 2.15)
            r_mult = 0.88 + 0.12 * min(1.0 / max(denom, 1e-4), 1.08)

            rz_dir = rz_front if cz >= 0.0 else rz_back
            # Soft radial fabric folds above the belt and toward the buttons
            waist_folds = 0.0028 * gaussian(t, 0.09, 0.05) * math.cos(10.0 * th)
            # Subtle center placket crease line on front of belly
            placket_seam = -0.0035 * gaussian(cx, 0.02, 0.025) * max(cz, 0.0) ** 2

            x = cx * rx_t * r_mult
            z = cz * (rz_dir * r_mult + waist_folds) + placket_seam + 0.010
            rings_torso[i, j] = [x, y, z]

    uv_torso = allocator.allocate("shirt_torso", 3, 3)
    parts.append(
        build_closed_tube(
            rings_torso,
            [0.0, 0.535, 0.010],
            [0.0, 1.210, 0.010],
            uv_torso,
            "mat_shirt_fabric",
            "shirt_torso",
        )
    )

    # =========================================================================
    # 8. POWDER-BLUE SHIRT COLLAR WINGS & 3 BEVELED SHIRT BUTTONS:
    #    - Two pointed powder-blue collar wings peeking out under the red
    #      neckerchief at x = ±0.145 m, y = 1.00..1.10 m!
    #    - Three round powder-blue buttons on the belly placket at y = 0.625 m,
    #      0.735 m, and 0.845 m!
    # =========================================================================
    # Pointed Powder-Blue Shirt Collar Wings peeking out beneath the Red Neckerchief
    for side_sign, col_name in [(-1.0, "collar_wing_r"), (+1.0, "collar_wing_l")]:
        Nu_cw, Nv_cw = 18, 24
        th_cw = front_back_thetas(Nv_cw)
        rings_cw = np.zeros((Nu_cw, Nv_cw, 3), dtype=np.float64)
        for i in range(Nu_cw):
            s_c = i / (Nu_cw - 1)  # 0 at pointed tip (y=0.992), 1 tucked under bottom edge of bandana roll (y=1.088)
            y_c = 0.992 + s_c * 0.096
            w_flap = 0.005 + 0.042 * (math.sin(math.pi * (0.05 + 0.88 * s_c)) ** 0.50)
            thick_flap = 0.004 + 0.006 * math.sin(math.pi * (0.06 + 0.88 * s_c))
            x_c = side_sign * (0.136 - 0.022 * s_c)
            # Compute exact shirt_torso surface Z at (x_c, y_c) so collar flap rides +8mm proud on chest everywhere,
            # and tucks -12mm behind the bandana roll at s_c -> 1
            t_tr = (y_c - 0.540) / (1.205 - 0.540)
            top_tp = 0.25 + 0.75 * (1.0 - 0.48 * (smoothstep(0.72, 1.0, t_tr) ** 1.35))
            rx_tr = (0.342 + 0.025 * gaussian(t_tr, 0.36, 0.26)) * top_tp
            rz_tr = (0.245 + 0.052 * gaussian(t_tr, 0.34, 0.26)) * top_tp
            z_surf = rz_tr * math.sqrt(max(1.0 - (x_c / rx_tr) ** 2, 0.1)) + 0.010
            z_c = z_surf + 0.008 - 0.014 * (s_c ** 2.2)
            for j, th in enumerate(th_cw):
                cx = -math.cos(th)
                cz = math.sin(th)
                rings_cw[i, j] = [
                    x_c + cx * w_flap,
                    y_c + side_sign * cx * 0.014,
                    z_c + cz * thick_flap - 0.010 * (cx * side_sign),
                ]
        uv_cw = allocator.allocate(col_name, 1, 1)
        parts.append(
            build_closed_tube(
                rings_cw,
                [rings_cw[0, :, 0].mean(), 0.989, rings_cw[0, :, 2].mean()],
                [rings_cw[-1, :, 0].mean(), 1.090, rings_cw[-1, :, 2].mean()],
                uv_cw,
                "mat_shirt_fabric",
                col_name,
            )
        )

    # Three Beveled Powder-Blue Shirt Buttons (`mat_buttons`) at y = 0.845, 0.735, 0.625 m
    for b_idx, by in enumerate([0.845, 0.735, 0.625]):
        t_torso = (by - 0.540) / (1.205 - 0.540)
        bot_cap = 0.25 + 0.75 * smoothstep(0.0, 0.06, t_torso)
        top_taper = 0.25 + 0.75 * (1.0 - 0.48 * (smoothstep(0.72, 1.0, t_torso) ** 1.35))
        belly_z = (0.245 + 0.052 * gaussian(t_torso, 0.34, 0.26) + 0.015 * gaussian(t_torso, 0.12, 0.08)) * bot_cap * top_taper + 0.013
        bx = -0.012
        bz = belly_z

        Nu_btn, Nv_btn = 12, 24
        th_btn = np.linspace(0.0, 2.0 * math.pi, Nv_btn, endpoint=False)
        rings_btn = np.zeros((Nu_btn, Nv_btn, 3), dtype=np.float64)
        for i in range(Nu_btn):
            u_b = -1.0 + 2.0 * (i / (Nu_btn - 1))
            r_b = 0.0155 * math.sqrt(max(1.0 - 0.60 * u_b * u_b, 0.12))
            z_b = bz + 0.0055 * u_b
            for j, th in enumerate(th_btn):
                rings_btn[i, j] = [bx + r_b * math.cos(th), by + r_b * math.sin(th), z_b]
        uv_btn = allocator.allocate(f"button_{b_idx}", 1, 1)
        parts.append(
            build_closed_tube(
                rings_btn,
                [bx, by, bz - 0.006],
                [bx, by, bz + 0.006],
                uv_btn,
                "mat_buttons",
                f"button_{b_idx}",
            )
        )

    # =========================================================================
    # 9. PLUMP RED NECKERCHIEF / BANDANA (`mat_tie_fabric` = Crimson Neckerchief!):
    #    Thick, folded red bandana wrapping continuously around the neck and
    #    resting proud on top of the upper chest all the way into the knot!
    # =========================================================================
    Nu_nloop, Nv_nloop = 68, 24
    th_nloop = front_back_thetas(Nu_nloop)
    phi_nloop = np.linspace(0.0, 2.0 * math.pi, Nv_nloop, endpoint=False)
    pts_nloop = np.zeros((Nu_nloop, Nv_nloop, 3), dtype=np.float64)
    for i, th in enumerate(th_nloop):
        cx = -math.cos(th)
        cz = math.sin(th)
        front_w = max(cz, 0.0)
        # Wraps warmly around neck base (y=1.185 at back/sides) and sweeps down across the upper chest
        # (staying outside the shirt chest at z reaching +0.258 m!) to meet the central knot at y=1.055 m
        y_center = 1.185 - 0.128 * (front_w ** 1.25)
        x_center = cx * (0.212 - 0.045 * (front_w ** 1.8)) - 0.012 * front_w
        z_center = cz * (0.192 + 0.074 * (front_w ** 0.72)) + 0.015

        r_xz = math.hypot(x_center, z_center - 0.014)
        nx_dir = x_center / max(r_xz, 1e-5)
        nz_dir = (z_center - 0.014) / max(r_xz, 1e-5)

        roll_scale = 1.0 - 0.15 * (front_w ** 2)
        for j, ph in enumerate(phi_nloop):
            fold_ridge = 0.0038 * math.sin(3.0 * ph + 2.0 * th)
            dr = (0.032 * roll_scale + fold_ridge) * math.cos(ph)
            dy = (0.038 * roll_scale + fold_ridge) * math.sin(ph)
            pts_nloop[i, j] = [
                x_center + nx_dir * dr,
                y_center + dy,
                z_center + nz_dir * dr,
            ]

    uv_nloop = allocator.allocate("neckerchief_loop", 2, 2)
    parts.append(
        build_closed_torus(pts_nloop, uv_nloop, "mat_tie_fabric", "neckerchief_loop")
    )

    # Plump Rounded Neckerchief Knot at (x=-0.016, y=1.048, z=+0.264)
    Nu_knot, Nv_knot = 24, 32
    th_knot = front_back_thetas(Nv_knot)
    y_knot_vals = np.linspace(1.025, 1.102, Nu_knot)
    rings_knot = np.zeros((Nu_knot, Nv_knot, 3), dtype=np.float64)
    for i, y in enumerate(y_knot_vals):
        t = (y - 1.025) / (1.102 - 1.025)
        cap = math.sin(math.pi * (0.06 + 0.88 * t)) ** 0.48
        rx_k = 0.036 * cap * (1.0 + 0.12 * math.sin(math.pi * t))
        rz_k = 0.028 * cap
        for j, th in enumerate(th_knot):
            cx = -math.cos(th)
            cz = math.sin(th)
            # Vertical fabric pinch grooves on front of knot (matching image_17e097.jpg!)
            knot_crease = -0.0035 * math.cos(4.0 * cx * math.pi) * max(cz, 0.0) * cap
            rings_knot[i, j] = [-0.014 + cx * (rx_k * 1.22), y, 0.274 + cz * (rz_k * 1.45 + knot_crease)]

    uv_knot = allocator.allocate("neckerchief_knot", 1, 1)
    parts.append(
        build_closed_tube(
            rings_knot,
            [-0.014, 1.022, 0.270],
            [-0.014, 1.105, 0.270],
            uv_knot,
            "mat_tie_fabric",
            "neckerchief_knot",
        )
    )

    # Two Curved Leaf-Shaped Pointed Neckerchief Tails hanging below the knot (y = 0.89..1.03 m)
    for tail_sign, tail_name, x_spread, y_bot in [
        (-1.0, "neckerchief_tail_r", -0.088, 0.902),
        (+1.0, "neckerchief_tail_l", +0.048, 0.892),
    ]:
        Nu_tl, Nv_tl = 24, 28
        th_tl = front_back_thetas(Nv_tl)
        y_tl_vals = np.linspace(y_bot, 1.032, Nu_tl)
        rings_tl = np.zeros((Nu_tl, Nv_tl, 3), dtype=np.float64)
        for i, y in enumerate(y_tl_vals):
            t = (y - y_bot) / (1.032 - y_bot)  # 0 at pointed bottom tip, 1 at top inside knot
            # Leaf-shaped profile: pointed at bottom tip (t=0), widest at mid-leaf (t~0.48), narrowing into knot (t=1)
            leaf_w = 0.004 + 0.032 * (math.sin(math.pi * (0.04 + 0.92 * t)) ** 0.65)
            leaf_z = 0.004 + 0.014 * (math.sin(math.pi * (0.05 + 0.90 * t)) ** 0.55)
            # Curve outward from knot (-0.016) toward x_spread
            xc = -0.016 + (x_spread + 0.016) * ((1.0 - t) ** 0.85) - tail_sign * 0.010 * math.sin(math.pi * t)
            zc = 0.266 + 0.012 * math.sin(math.pi * t) - 0.008 * (1.0 - t)
            for j, th in enumerate(th_tl):
                cx = -math.cos(th)
                cz = math.sin(th)
                # Central fabric fold flute along the front of each neckerchief tail
                flute = -0.0045 * gaussian(cx, 0.0, 0.28) * max(cz, 0.0) * math.sin(math.pi * t)
                rings_tl[i, j] = [xc + cx * leaf_w, y, zc + cz * leaf_z + flute]

        uv_tl = allocator.allocate(tail_name, 1, 1)
        parts.append(
            build_closed_tube(
                rings_tl,
                [rings_tl[0, :, 0].mean(), y_bot - 0.004, rings_tl[0, :, 2].mean()],
                [-0.016, 1.035, 0.264],
                uv_tl,
                "mat_tie_fabric",
                tail_name,
            )
        )

    # =========================================================================
    # 10. HUGE ROUNDED SHOULDERS, CURVED SLEEVES, ROLLED CUFFS & CHUBBY HANDS:
    #     Exact 1:1 silhouette from `ref_grid.png`:
    #     - Sleeves emerge from shoulder seam (x = ±0.26 m, y = 1.14 m), curve out
    #       wide around the big belly (outer elbow reaching x = ±0.52 m at y = 0.82 m),
    #       and end at thick rolled sleeve cuffs at (x = ±0.43 m, y = 0.64 m).
    #     - Plump peach hands hang from y = 0.43 m to 0.62 m with inner thumb and
    #       4 thick curled cartoon fingers!
    # =========================================================================
    for side_sign, suffix in [(-1.0, "r"), (+1.0, "l")]:
        Nu_arm, Nv_arm = 36, 40
        spine_arm = np.zeros((Nu_arm, 3), dtype=np.float64)
        rx_arm = np.zeros(Nu_arm, dtype=np.float64)
        rz_arm = np.zeros(Nu_arm, dtype=np.float64)

        for i in range(Nu_arm):
            s = i / (Nu_arm - 1)  # 0 deep inside upper chest, 1 at wrist cuff (y=0.638 m)
            # Smooth continuous shoulder-to-wrist arch with zero top bump
            ax = side_sign * (0.175 + 0.255 * (smoothstep(0.0, 1.0, s) ** 0.72) + 0.025 * math.sin(s * math.pi))
            ay = 1.095 + 0.025 * math.sin(s * 0.45 * math.pi) - 0.482 * (s ** 1.32)
            az = -0.004 + 0.028 * math.sin(s * math.pi)
            spine_arm[i] = [ax, ay, az]

            # Taper shoulder root smoothly inside torso (s < 0.15) so shoulder arch is seamless!
            root_blend = 0.55 + 0.45 * smoothstep(0.0, 0.22, s)
            upper_plump = 0.020 * gaussian(s, 0.38, 0.22)
            elbow_folds = 0.0030 * math.sin(8.0 * math.pi * s) * gaussian(s, 0.58, 0.14)
            r_sec = (0.098 * (1.0 - 0.15 * s) + upper_plump + elbow_folds) * root_blend
            rx_arm[i] = r_sec
            rz_arm[i] = r_sec * 0.95

        uv_arm = allocator.allocate(f"arm_{suffix}", 2, 2)
        parts.append(
            make_SweepTube(
                spine_arm, rx_arm, rz_arm, Nv_arm, uv_arm, "mat_shirt_fabric", f"arm_{suffix}"
            )
        )

        # Thick Rolled Sleeve Cuff (`mat_shirt_fabric`) at wrist (x = side_sign * 0.432 m, y = 0.638 m)
        wx = side_sign * 0.432
        wy = 0.638
        wz = 0.018
        Nu_cuff, Nv_cuff = 32, 18
        th_cuff = front_back_thetas(Nu_cuff)
        phi_cuff = np.linspace(0.0, 2.0 * math.pi, Nv_cuff, endpoint=False)
        pts_cuff = np.zeros((Nu_cuff, Nv_cuff, 3), dtype=np.float64)
        for i, th in enumerate(th_cuff):
            cx = -math.cos(th)
            cz = math.sin(th)
            for j, ph in enumerate(phi_cuff):
                r_c = 0.082 + 0.018 * math.cos(ph)
                y_c = wy + 0.032 * math.sin(ph)
                pts_cuff[i, j] = [wx + cx * r_c, y_c, wz + cz * (r_c * 0.94)]

        uv_cuff = allocator.allocate(f"cuff_{suffix}", 1, 1)
        parts.append(
            build_closed_torus(pts_cuff, uv_cuff, "mat_shirt_fabric", f"cuff_{suffix}")
        )

        # Chubby Cartoon Hand Palm (`mat_skin`, y = 0.515..0.625 m)
        Nu_palm, Nv_palm = 20, 28
        th_palm = front_back_thetas(Nv_palm)
        y_palm_vals = np.linspace(0.515, 0.625, Nu_palm)
        rings_palm = np.zeros((Nu_palm, Nv_palm, 3), dtype=np.float64)
        for i, y in enumerate(y_palm_vals):
            t = (y - 0.515) / (0.625 - 0.515)
            cap = math.sin(math.pi * (0.08 + 0.84 * t)) ** 0.38
            rx_p = (0.062 + 0.008 * math.sin(math.pi * t)) * cap
            rz_p = (0.048 + 0.008 * (1.0 - t)) * cap
            px = wx - side_sign * 0.006 * (1.0 - t)
            pz = wz + 0.014 * (1.0 - t)
            for j, th in enumerate(th_palm):
                cx = -math.cos(th)
                cz = math.sin(th)
                rings_palm[i, j] = [px + cx * rx_p, y, pz + cz * rz_p]

        uv_palm = allocator.allocate(f"palm_{suffix}", 1, 1)
        parts.append(
            build_closed_tube(
                rings_palm,
                [wx - side_sign * 0.006, 0.510, wz + 0.014],
                [wx, 0.628, wz],
                uv_palm,
                "mat_skin",
                f"palm_{suffix}",
            )
        )

        # Four Chubby Curled Fingers (`mat_skin`, y = 0.435..0.525 m, spread across X)
        finger_specs = [
            ("index",  -0.036, 0.074, 0.0155),
            ("middle", -0.012, 0.082, 0.0165),
            ("ring",   +0.012, 0.076, 0.0155),
            ("pinky",  +0.035, 0.065, 0.0145),
        ]
        for fname, x_local_off, flen, frad in finger_specs:
            Nu_fg, Nv_fg = 14, 16
            spine_fg = np.zeros((Nu_fg, 3), dtype=np.float64)
            rx_fg = np.zeros(Nu_fg, dtype=np.float64)
            rz_fg = np.zeros(Nu_fg, dtype=np.float64)
            for i in range(Nu_fg):
                s = i / (Nu_fg - 1)
                fx = wx + side_sign * x_local_off - side_sign * 0.012 * (s ** 1.6)
                fy = 0.522 - flen * s
                fz = wz + 0.018 - 0.022 * (s ** 1.6)
                spine_fg[i] = [fx, fy, fz]
                taper = (1.0 - 0.14 * s) * (math.sin(math.pi * (0.08 + 0.84 * s)) ** 0.32)
                rx_fg[i] = frad * taper
                rz_fg[i] = frad * taper
            uv_fg = allocator.allocate(f"finger_{fname}_{suffix}", 1, 1)
            parts.append(
                make_SweepTube(
                    spine_fg,
                    rx_fg,
                    rz_fg,
                    Nv_fg,
                    uv_fg,
                    "mat_skin",
                    f"finger_{fname}_{suffix}",
                )
            )

        # Plump Thumb on inner side of hand (`mat_skin`)
        Nu_thb, Nv_thb = 14, 16
        spine_thb = np.zeros((Nu_thb, 3), dtype=np.float64)
        rx_thb = np.zeros(Nu_thb, dtype=np.float64)
        rz_thb = np.zeros(Nu_thb, dtype=np.float64)
        for i in range(Nu_thb):
            s = i / (Nu_thb - 1)
            tx = wx - side_sign * (0.050 + 0.026 * math.sin(0.65 * math.pi * s))
            ty = 0.578 - 0.068 * s
            tz = wz + 0.024 + 0.012 * math.sin(math.pi * s)
            spine_thb[i] = [tx, ty, tz]
            taper = (1.0 - 0.14 * s) * (math.sin(math.pi * (0.08 + 0.84 * s)) ** 0.32)
            rx_thb[i] = 0.0185 * taper
            rz_thb[i] = 0.0185 * taper
        uv_thb = allocator.allocate(f"thumb_{suffix}", 1, 1)
        parts.append(
            make_SweepTube(
                spine_thb,
                rx_thb,
                rz_thb,
                Nv_thb,
                uv_thb,
                "mat_skin",
                f"thumb_{suffix}",
            )
        )

    # =========================================================================
    # 11. LOW-SLUNG BROWN LEATHER BELT, DENIM BELT LOOPS & SILVER OVAL BUCKLE:
    #     Centered at y = 0.550 m (spanning y = 0.502..0.598 m, width = 0.70 m)
    #     just as in `ref_grid.png`!
    # =========================================================================
    Nu_belt, Nv_belt = 60, 20
    th_belt = front_back_thetas(Nu_belt)
    phi_belt = np.linspace(0.0, 2.0 * math.pi, Nv_belt, endpoint=False)
    pts_belt = np.zeros((Nu_belt, Nv_belt, 3), dtype=np.float64)
    for i, th in enumerate(th_belt):
        cx = -math.cos(th)
        cz = math.sin(th)
        denom = (abs(cx) ** 2.15 + abs(cz) ** 2.15) ** (1.0 / 2.15)
        r_mult = 0.88 + 0.12 * min(1.0 / max(denom, 1e-4), 1.08)
        rx_b = 0.346 * r_mult
        rz_b = (0.252 if cz >= 0.0 else 0.220) * r_mult
        # Slight natural dip in front under the chubby belly!
        y_dip = -0.012 * max(cz, 0.0)
        for j, ph in enumerate(phi_belt):
            dr = 0.016 * math.cos(ph)
            dy = 0.044 * math.sin(ph)
            pts_belt[i, j] = [
                cx * (rx_b + dr),
                0.552 + y_dip + dy,
                cz * (rz_b + dr) + 0.010,
            ]

    uv_belt = allocator.allocate("belt_strap", 2, 1)
    parts.append(
        build_closed_torus(pts_belt, uv_belt, "mat_belt_leather", "belt_strap")
    )

    # 6 Thick Denim Belt Loops around the belt (`mat_trousers_denim`)
    loop_angles = [
        0.18 * math.pi, 0.34 * math.pi, 0.66 * math.pi, 0.82 * math.pi,
        1.25 * math.pi, 1.75 * math.pi,
    ]
    for l_idx, lang in enumerate(loop_angles):
        cx = -math.cos(lang)
        cz = math.sin(lang)
        denom = (abs(cx) ** 2.15 + abs(cz) ** 2.15) ** (1.0 / 2.15)
        r_mult = 0.88 + 0.12 * min(1.0 / max(denom, 1e-4), 1.08)
        rx_l = 0.356 * r_mult
        rz_l = (0.262 if cz >= 0.0 else 0.228) * r_mult
        y_dip = -0.012 * max(cz, 0.0)
        Nu_lp, Nv_lp = 12, 14
        spine_lp = np.zeros((Nu_lp, 3), dtype=np.float64)
        rx_lp = np.full(Nu_lp, 0.011, dtype=np.float64)
        rz_lp = np.full(Nu_lp, 0.007, dtype=np.float64)
        for i in range(Nu_lp):
            s = -1.0 + 2.0 * (i / (Nu_lp - 1))
            spine_lp[i] = [cx * rx_l, 0.552 + y_dip + 0.046 * s, cz * rz_l + 0.010]
        uv_lp = allocator.allocate(f"belt_loop_{l_idx}", 1, 1)
        parts.append(
            make_SweepTube(
                spine_lp,
                rx_lp,
                rz_lp,
                Nv_lp,
                uv_lp,
                "mat_trousers_denim",
                f"belt_loop_{l_idx}",
            )
        )

    # Thick Rounded Silver Oval Buckle (`mat_buckle_metal` at y=0.540 m, z=+0.264 m)
    # Matching `image_17e097.jpg`: thick outer oval rim + satin inner dish + two vertical capsule rings inside!
    Nu_bk, Nv_bk = 48, 22
    th_bk = np.linspace(0.0, 2.0 * math.pi, Nu_bk, endpoint=False)
    phi_bk = np.linspace(0.0, 2.0 * math.pi, Nv_bk, endpoint=False)
    pts_bk_outer = np.zeros((Nu_bk, Nv_bk, 3), dtype=np.float64)
    for i, th in enumerate(th_bk):
        for j, ph in enumerate(phi_bk):
            rx_o = 0.078 + 0.015 * math.cos(ph)
            ry_o = 0.048 + 0.015 * math.cos(ph)
            bx = rx_o * math.cos(th)
            by = 0.540 + ry_o * math.sin(th)
            bz = 0.296 + 0.013 * math.sin(ph) - 0.005 * (math.cos(th) ** 2)
            pts_bk_outer[i, j] = [bx, by, bz]

    uv_bk_outer = allocator.allocate("buckle_outer", 1, 1)
    parts.append(
        build_closed_torus(
            pts_bk_outer, uv_bk_outer, "mat_buckle_metal", "buckle_outer"
        )
    )

    # Buckle Satin Backing Dish Plate
    Nu_bkp, Nv_bkp = 18, 36
    th_bkp = np.linspace(0.0, 2.0 * math.pi, Nv_bkp, endpoint=False)
    rings_bkp = np.zeros((Nu_bkp, Nv_bkp, 3), dtype=np.float64)
    for i in range(Nu_bkp):
        u_p = -1.0 + 2.0 * (i / (Nu_bkp - 1))
        r_scale = math.sqrt(max(1.0 - 0.35 * u_p * u_p, 0.2))
        for j, th in enumerate(th_bkp):
            rings_bkp[i, j] = [
                0.074 * r_scale * math.cos(th),
                0.540 + 0.045 * r_scale * math.sin(th),
                0.291 + 0.005 * u_p - 0.005 * ((r_scale * math.cos(th)) ** 2),
            ]
    uv_bkp = allocator.allocate("buckle_plate", 1, 1)
    parts.append(
        build_closed_tube(
            rings_bkp,
            [0.0, 0.540, 0.285],
            [0.0, 0.540, 0.295],
            uv_bkp,
            "mat_buckle_metal",
            "buckle_plate",
        )
    )

    # Two Inner Vertical Capsule/Oval Rings inside the Buckle (exact match to `image_17e097.jpg` buckle!)
    for side_sign, ring_name in [(-1.0, "buckle_inner_r"), (+1.0, "buckle_inner_l")]:
        Nu_bki, Nv_bki = 32, 16
        th_bki = np.linspace(0.0, 2.0 * math.pi, Nu_bki, endpoint=False)
        phi_bki = np.linspace(0.0, 2.0 * math.pi, Nv_bki, endpoint=False)
        pts_bki = np.zeros((Nu_bki, Nv_bki, 3), dtype=np.float64)
        for i, th in enumerate(th_bki):
            for j, ph in enumerate(phi_bki):
                rx_i = 0.016 + 0.0048 * math.cos(ph)
                ry_i = 0.024 + 0.0048 * math.cos(ph)
                pts_bki[i, j] = [
                    side_sign * 0.028 + rx_i * math.cos(th),
                    0.540 + ry_i * math.sin(th),
                    0.298 + 0.0052 * math.sin(ph),
                ]
        uv_bki = allocator.allocate(ring_name, 1, 1)
        parts.append(
            build_closed_torus(pts_bki, uv_bki, "mat_buckle_metal", ring_name)
        )

    # =========================================================================
    # 12. SHORT, THICK, STOCKY DEEP-DENIM TROUSERS (`mat_trousers_denim`):
    #     Exact 1:1 proportions from `ref_grid.png`:
    #     - Spans from ankle cuffs (y = 0.125 m) up to the belt (y = 0.555 m).
    #     - Crotch arch sits low and sturdy at y = 0.285 m!
    #     - Wide, rounded hips (`width = 0.66 m` at belt) tapering smoothly down
    #       the thick thighs and calves to the ankles (`x_outer = ±0.30 m, x_inner = ±0.095 m`).
    #     - Curved front pocket seams at x = ±0.26 m, y = 0.41..0.51 m!
    # =========================================================================
    Nu_pelv, Nv_pelv = 24, 52
    th_pelv = front_back_thetas(Nv_pelv)
    y_pelv_vals = np.linspace(0.280, 0.555, Nu_pelv)
    rings_pelv = np.zeros((Nu_pelv, Nv_pelv, 3), dtype=np.float64)
    for i, y in enumerate(y_pelv_vals):
        t = (y - 0.280) / (0.555 - 0.280)  # 0 at crotch arch (0.280 m), 1 at belt line (0.555 m)
        hip_rx = 0.318 * (0.42 + 0.58 * (smoothstep(0.0, 0.90, t) ** 0.75))
        hip_rz = 0.222 * (0.55 + 0.45 * (smoothstep(0.0, 0.85, t) ** 0.75))
        for j, th in enumerate(th_pelv):
            cx = -math.cos(th)
            cz = math.sin(th)
            denom = (abs(cx) ** 2.15 + abs(cz) ** 2.15) ** (1.0 / 2.15)
            r_mult = 0.88 + 0.12 * min(1.0 / max(denom, 1e-4), 1.08)
            rings_pelv[i, j] = [
                cx * hip_rx * r_mult,
                y,
                cz * hip_rz * r_mult + 0.008,
            ]

    uv_pelv = allocator.allocate("trousers_pelvis", 2, 2)
    parts.append(
        build_closed_tube(
            rings_pelv,
            [0.0, 0.278, 0.008],
            [0.0, 0.558, 0.008],
            uv_pelv,
            "mat_trousers_denim",
            "trousers_pelvis",
        )
    )

    # Stocky Left & Right Denim Trouser Legs (`y = 0.122..0.550 m`)
    for side_sign, suffix in [(-1.0, "r"), (+1.0, "l")]:
        Nu_leg, Nv_leg = 32, 40
        th_leg = front_back_thetas(Nv_leg)
        y_leg_vals = np.linspace(0.122, 0.550, Nu_leg)
        rings_leg = np.zeros((Nu_leg, Nv_leg, 3), dtype=np.float64)
        for i, y in enumerate(y_leg_vals):
            t = (y - 0.122) / (0.550 - 0.122)  # 0 at ankle cuff (0.122 m), 1 at waist (0.550 m)
            # Outer leg contour flares smoothly from ankle (±0.285 m) up to wide hip (±0.332 m)
            x_outer = side_sign * (0.285 + 0.047 * (t ** 0.85))
            # Inner leg contour goes from ankle (±0.092 m at y=0.122 m) to crotch arch (0.0 m at y=0.285 m)
            if y <= 0.285:
                t_in = (y - 0.122) / (0.285 - 0.122)
                x_inner = side_sign * 0.092 * (1.0 - (t_in ** 1.15))
            else:
                x_inner = -side_sign * 0.025 * ((y - 0.285) / (0.550 - 0.285))

            x_center = 0.5 * (x_outer + x_inner)
            rx_l = 0.5 * abs(x_outer - x_inner)
            rz_l = 0.112 + 0.105 * (t ** 0.95)
            cuff_hem = 0.006 * gaussian(t, 0.05, 0.035)
            knee_crease = 0.003 * gaussian(t, 0.38, 0.08) * math.cos(5.0 * math.pi * t)
            for j, th in enumerate(th_leg):
                cx = -math.cos(th)
                cz = math.sin(th)
                denom = (abs(cx) ** 2.2 + abs(cz) ** 2.2) ** (1.0 / 2.2)
                r_mult = 0.86 + 0.14 * min(1.0 / max(denom, 1e-4), 1.08)
                # Sculpted curved front pocket seam ridge on upper thigh (t in [0.65..0.92], cz > 0)
                pocket_seam = (
                    0.0045
                    * gaussian(t, 0.78 + 0.12 * (1.0 - abs(cx)), 0.03)
                    * smoothstep(0.3, 0.9, side_sign * cx)
                    * max(cz, 0.0)
                )
                rings_leg[i, j] = [
                    x_center + cx * (rx_l * r_mult + cuff_hem),
                    y,
                    cz * (rz_l * r_mult + cuff_hem + knee_crease + pocket_seam) + 0.008,
                ]

        uv_leg = allocator.allocate(f"leg_{suffix}", 2, 2)
        parts.append(
            build_closed_tube(
                rings_leg,
                [side_sign * 0.188, 0.118, 0.008],
                [side_sign * 0.150, 0.553, 0.008],
                uv_leg,
                "mat_trousers_denim",
                f"leg_{suffix}",
            )
        )

    # =========================================================================
    # 13. GLOSSY BROWN LEATHER BOOTS (`mat_shoe_leather`, `mat_shoe_sole`):
    #     Exact 1:1 match to `ref_grid.png`:
    #     - Positioned under ankles at x = ±0.195 m, y = 0.000..0.145 m
    #     - Splayed outward at ±26 deg, chunky rounded toe box, raised heel block,
    #       dark stitched welt, and 3 sculpted lace ridges over the instep!
    # =========================================================================
    for side_sign, suffix in [(-1.0, "r"), (+1.0, "l")]:
        ankle_x = side_sign * 0.195
        ankle_z = 0.008
        splay_angle = side_sign * math.radians(26.0)

        # 1) Dark Brown Sole, Stitched Welt & Raised Heel Block (`mat_shoe_sole`, y = 0.000..0.038 m)
        Nu_sole, Nv_sole = 26, 34
        th_sole = np.linspace(0.0, 2.0 * math.pi, Nv_sole, endpoint=False)
        rings_sole = np.zeros((Nu_sole, Nv_sole, 3), dtype=np.float64)
        for i in range(Nu_sole):
            s = i / (Nu_sole - 1)  # 0 at heel back (-0.095 m), 1 at toe tip (+0.205 m) -> 0.300 m length!
            z_loc = -0.092 + s * 0.292
            arch_waist = 1.0 - 0.15 * gaussian(s, 0.38, 0.12)
            toe_round = math.sin(math.pi * (0.04 + 0.92 * s)) ** 0.40
            w_x = 0.084 * arch_waist * toe_round * (1.0 + 0.14 * gaussian(s, 0.74, 0.16))
            # Distinct raised heel step at back (s < 0.35)
            heel_step = 0.012 * (1.0 - smoothstep(0.32, 0.40, s))
            h_y = 0.016 + 0.005 * heel_step
            y_mid = h_y
            for j, th in enumerate(th_sole):
                sy = math.sin(th)
                if sy < 0.0:
                    yy = max(0.000, y_mid + h_y * (0.85 * sy - 0.15 * (sy ** 3)))
                else:
                    yy = y_mid + h_y * sy
                xx = w_x * math.cos(th)
                p_rot = rot_y(np.array([[xx, yy, z_loc]]), splay_angle)[0]
                rings_sole[i, j] = [ankle_x + p_rot[0], p_rot[1], ankle_z + p_rot[2]]

        p_heel = rot_y(np.array([[0.0, 0.016, -0.095]]), splay_angle)[0] + np.array([ankle_x, 0.0, ankle_z])
        p_toe = rot_y(np.array([[0.0, 0.015, +0.205]]), splay_angle)[0] + np.array([ankle_x, 0.0, ankle_z])
        uv_sole = allocator.allocate(f"shoe_sole_{suffix}", 1, 1)
        parts.append(
            build_closed_tube(
                rings_sole,
                p_heel,
                p_toe,
                uv_sole,
                "mat_shoe_sole",
                f"shoe_sole_{suffix}",
            )
        )

        # 2) Glossy Brown Leather Boot Upper (`mat_shoe_leather`, y = 0.022..0.142 m)
        Nu_sh, Nv_sh = 26, 34
        th_sh = np.linspace(0.0, 2.0 * math.pi, Nv_sh, endpoint=False)
        rings_sh = np.zeros((Nu_sh, Nv_sh, 3), dtype=np.float64)
        for i in range(Nu_sh):
            s = i / (Nu_sh - 1)
            z_loc = -0.088 + s * 0.284
            toe_round = math.sin(math.pi * (0.04 + 0.92 * s)) ** 0.44
            w_x = 0.078 * toe_round * (1.0 + 0.16 * gaussian(s, 0.74, 0.16))
            ankle_h = 0.062 * (1.0 - smoothstep(0.38, 0.70, s))
            toe_bulb = 0.018 * gaussian(s, 0.78, 0.14)
            # 3 subtle lace ridges over the instep (s in [0.42..0.62])
            laces = 0.004 * math.sin(18.0 * math.pi * s) * gaussian(s, 0.52, 0.08)
            h_y = (0.036 + ankle_h + toe_bulb + max(laces, 0.0)) * toe_round
            y_mid = 0.024 + 0.78 * h_y
            for j, th in enumerate(th_sh):
                xx = w_x * math.cos(th)
                yy = max(0.020, y_mid + h_y * math.sin(th))
                p_rot = rot_y(np.array([[xx, yy, z_loc]]), splay_angle)[0]
                rings_sh[i, j] = [ankle_x + p_rot[0], p_rot[1], ankle_z + p_rot[2]]

        p_sh_heel = rot_y(np.array([[0.0, 0.065, -0.090]]), splay_angle)[0] + np.array([ankle_x, 0.0, ankle_z])
        p_sh_toe = rot_y(np.array([[0.0, 0.042, +0.198]]), splay_angle)[0] + np.array([ankle_x, 0.0, ankle_z])
        uv_sh = allocator.allocate(f"shoe_upper_{suffix}", 1, 1)
        parts.append(
            build_closed_tube(
                rings_sh,
                p_sh_heel,
                p_sh_toe,
                uv_sh,
                "mat_shoe_leather",
                f"shoe_upper_{suffix}",
            )
        )

    # Exact global vertical normalization so y_min = 0.0000 m and y_max = 1.7500 m
    all_y_min = min(float(np.min(p["positions"][:, 1])) for p in parts)
    all_y_max = max(float(np.max(p["positions"][:, 1])) for p in parts)
    scale_y = 1.7500 / (all_y_max - all_y_min)
    for p in parts:
        p["positions"][:, 1] = (p["positions"][:, 1] - all_y_min) * scale_y

    return parts, allocator.allocations


if __name__ == "__main__":
    parts, allocs = build_character_parts()
    total_verts = sum(len(p["positions"]) for p in parts)
    total_tris = sum(len(p["indices"]) for p in parts)
    print(f"Generated {len(parts)} parts: {total_verts:,} vertices, {total_tris:,} triangles")
    os.makedirs("artifacts/file_generation/ttl=63d/intermediate/project/build", exist_ok=True)
    with open("artifacts/file_generation/ttl=63d/intermediate/project/build/uv_layout.json", "w") as f:
        json.dump(allocs, f, indent=2)
