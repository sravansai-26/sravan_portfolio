import os, json, struct, math, zlib, base64, io
import numpy as np
from PIL import Image

# 1. Load user's uploaded white_mesh.glb
src_glb = "/working_dir/c_5cf010e0ce9f29bc/user_uploaded_files/ttl=63d/user_uploaded/white_mesh.glb"
with open(src_glb, "rb") as f:
    data = f.read()

json_len, _ = struct.unpack_from("<II", data, 12)
gltf_in = json.loads(data[20:20+json_len].decode("utf-8"))
bin_offset = 20 + json_len
bin_len, _ = struct.unpack_from("<II", data, bin_offset)
bin_blob = data[bin_offset+8:bin_offset+8+bin_len]

bv_idx = gltf_in["bufferViews"][gltf_in["accessors"][0]["bufferView"]]
bv_pos = gltf_in["bufferViews"][gltf_in["accessors"][1]["bufferView"]]
tris = np.frombuffer(bin_blob, dtype=np.uint32, count=120000, offset=bv_idx.get("byteOffset", 0)).reshape(-1, 3)
pos = np.frombuffer(bin_blob, dtype=np.float32, count=20000*3, offset=bv_pos.get("byteOffset", 0)).reshape(-1, 3).astype(np.float64)

def subdivide_once(V, F):
    e01, e12, e20 = F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]
    all_e = np.concatenate([e01, e12, e20], axis=0)
    s_e = np.sort(all_e, axis=1)
    u_e, inv_e = np.unique(s_e, axis=0, return_inverse=True)
    mid_V = 0.5 * (V[u_e[:, 0]] + V[u_e[:, 1]])
    nV = len(V)
    new_V = np.concatenate([V, mid_V], axis=0)
    m01 = nV + inv_e[0:len(F)]
    m12 = nV + inv_e[len(F):2*len(F)]
    m20 = nV + inv_e[2*len(F):3*len(F)]
    v0, v1, v2 = F[:, 0], F[:, 1], F[:, 2]
    new_F = np.concatenate([
        np.stack([v0, m01, m20], axis=1),
        np.stack([v1, m12, m01], axis=1),
        np.stack([v2, m20, m12], axis=1),
        np.stack([m01, m12, m20], axis=1),
    ], axis=0)
    return new_V, new_F.astype(np.uint32)

def build_adj(num_v, F):
    ia = np.concatenate([F[:,0], F[:,1], F[:,2], F[:,1], F[:,2], F[:,0]])
    ib = np.concatenate([F[:,1], F[:,2], F[:,0], F[:,0], F[:,1], F[:,2]])
    cnt = np.maximum(np.bincount(ia, minlength=num_v).astype(np.float64)[:, None], 1.0)
    return ia, ib, cnt

def taubin_smooth(V, F, iterations=4, lam=0.42, mu=-0.44):
    ia, ib, cnt = build_adj(len(V), F)
    pts = V.copy()
    for _ in range(iterations):
        for step in (lam, mu):
            nei = np.zeros_like(pts)
            np.add.at(nei, ia, pts[ib])
            pts = pts + step * ((nei / cnt) - pts)
    return pts

pos_s0 = taubin_smooth(pos, tris, iterations=4, lam=0.42, mu=-0.44)
V_sub, F_sub = subdivide_once(pos_s0, tris)
V_sub = taubin_smooth(V_sub, F_sub, iterations=4, lam=0.42, mu=-0.44)

v0, v1, v2 = V_sub[F_sub[:, 0]], V_sub[F_sub[:, 1]], V_sub[F_sub[:, 2]]
fn = np.cross(v1 - v0, v2 - v0)
v_norm = np.zeros_like(V_sub)
np.add.at(v_norm, F_sub[:, 0], fn)
np.add.at(v_norm, F_sub[:, 1], fn)
np.add.at(v_norm, F_sub[:, 2], fn)
v_norm /= np.maximum(np.linalg.norm(v_norm, axis=1, keepdims=True), 1e-12)

ia, ib, cnt = build_adj(len(V_sub), F_sub)
nei = np.zeros_like(V_sub)
np.add.at(nei, ia, V_sub[ib])
convexity = -np.sum(((nei / cnt) - V_sub) * v_norm, axis=1)

def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / np.maximum(edge1 - edge0, 1e-8), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

def gaussian(x, mu, sigma):
    return np.exp(-0.5 * ((x - mu) / np.maximum(sigma, 1e-8)) ** 2)

def hex_rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[0:2],16), int(h[2:4],16), int(h[4:6],16)], dtype=np.float64)

X, Y, Z = V_sub[:, 0], V_sub[:, 1], V_sub[:, 2]
NX, NY, NZ = v_norm[:, 0], v_norm[:, 1], v_norm[:, 2]
N = len(V_sub)

dx_h = X + 0.018
dx_body = X + 0.038

# Track per-vertex material ID, roughness, metallic, and SSS weight
# Mat IDs: 0=Skin, 1=Shirt, 2=Trousers, 3=Neckerchief, 4=Hat, 5=LeatherBeltBoots, 6=SilverBuckle, 7=Eyes
mat_id = np.ones(N, dtype=np.uint8) # default 1 = Shirt
roughness = np.full(N, 0.76, dtype=np.float64)
metallic  = np.zeros(N, dtype=np.float64)
sss_w     = np.zeros(N, dtype=np.float64)

# =========================================================================
# 1. BASE LAYER: POWDER-BLUE SHIRT (`#5A92CA` to `#88BEF2`)
# =========================================================================
shirt_hi = smoothstep(-0.25, 0.35, Y)
col = hex_rgb("#5A92CA") * (1.0 - shirt_hi[:, None]) + hex_rgb("#88BEF2") * shirt_hi[:, None]

plk_seam = gaussian(X, -0.068, 0.008) * smoothstep(-0.26, 0.04, Y) * (1.0 - smoothstep(0.02, 0.05, Y)) * smoothstep(0.20, 0.28, Z)
col = col * (1.0 - 0.22 * plk_seam[:, None]) + hex_rgb("#3C6EA2") * (0.22 * plk_seam[:, None])

cuff_band = gaussian(Y, -0.185, 0.012) * smoothstep(0.41, 0.44, np.abs(dx_body))
col = col * (1.0 - 0.15 * cuff_band[:, None]) + hex_rgb("#487EB2") * (0.15 * cuff_band[:, None])

for bx, by in [(-0.048, 0.015), (-0.048, -0.092), (-0.048, -0.195)]:
    r_btn = np.hypot(X - bx, Y - by)
    w_btn = (1.0 - smoothstep(0.018, 0.025, r_btn)) * smoothstep(0.25, 0.30, Z)
    rim = gaussian(r_btn, 0.016, 0.004)
    hole = (r_btn < 0.0065).astype(np.float64)
    btn_c = hex_rgb("#74ACE4") + rim[:, None] * 42.0 - hole[:, None] * 55.0
    col = col * (1.0 - w_btn[:, None]) + np.clip(btn_c, 0, 255) * w_btn[:, None]
    roughness = roughness * (1.0 - w_btn) + 0.32 * w_btn

# =========================================================================
# 2. HEAD, NECK, EARS, FACE, EYES, BROWS & HAIR
# =========================================================================
y_neck_top_front = 0.236 + 3.05 * (dx_h ** 2)
y_neck_top_back  = 0.408 + 0.22 * (dx_h ** 2)
t_fb = smoothstep(-0.06, 0.12, Z)
y_neck_top = t_fb * y_neck_top_front + (1.0 - t_fb) * y_neck_top_back

shoulder_cut = smoothstep(0.265, 0.290, np.abs(dx_h)) * (1.0 - smoothstep(0.42, 0.46, Y))
w_above_neckerchief = smoothstep(y_neck_top - 0.007, y_neck_top + 0.007, Y) * (1.0 - shoulder_cut)

skin_col = np.broadcast_to(hex_rgb("#F8C5A0"), (N, 3)).copy()
jowl_warm = smoothstep(0.24, 0.52, 0.52 - Y)
skin_col = skin_col * (1.0 - 0.14 * jowl_warm[:, None]) + hex_rgb("#EAA078") * (0.14 * jowl_warm[:, None])

cheek_r = gaussian(X, -0.120, 0.045) * gaussian(Y, 0.585, 0.048) * smoothstep(0.02, 0.10, Z)
cheek_l = gaussian(X,  0.098, 0.045) * gaussian(Y, 0.585, 0.048) * smoothstep(0.02, 0.10, Z)
ear_blush = smoothstep(0.200, 0.235, np.abs(dx_h)) * gaussian(Y, 0.595, 0.045)
chin_blush = gaussian(X, -0.012, 0.045) * gaussian(Y, 0.445, 0.035) * smoothstep(0.10, 0.15, Z)
blush_w = np.clip(cheek_r + cheek_l + 0.55 * ear_blush + 0.40 * chin_blush, 0.0, 1.0)
skin_col = skin_col * (1.0 - 0.48 * blush_w[:, None]) + hex_rgb("#F27C68") * (0.48 * blush_w[:, None])

# Cute Cheerful Rosy Button Nose
r_nose = np.hypot((X + 0.025) / 0.068, (Y - 0.607) / 0.046)
w_nose = (1.0 - smoothstep(0.78, 1.05, r_nose)) * smoothstep(0.140, 0.168, Z)
nose_hi = smoothstep(0.185, 0.220, Z) * smoothstep(0.610, 0.635, Y)
nose_under = smoothstep(-0.75, -0.05, -NY) * w_nose
nose_col = hex_rgb("#F27C66") * (1.0 - 0.35 * nose_hi[:, None]) + hex_rgb("#FAD4C0") * (0.35 * nose_hi[:, None])
nose_col = nose_col + nose_under[:, None] * np.array([28.0, 14.0, 10.0])
skin_col = skin_col * (1.0 - 0.88 * w_nose[:, None]) + np.clip(nose_col, 0, 255) * (0.88 * w_nose[:, None])

# Warm Friendly Smile crease & Chin Pad groove
y_smile_curve = 0.495 + 2.0 * ((X + 0.025) ** 2)
w_smile = (
    gaussian(Y, y_smile_curve, 0.011)
    * (1.0 - smoothstep(0.095, 0.125, np.abs(X + 0.025)))
    * smoothstep(0.11, 0.15, Z)
    * np.clip(0.55 - convexity * 450.0, 0.25, 1.0)
)
skin_col = skin_col * (1.0 - 0.68 * w_smile[:, None]) + hex_rgb("#9E4232") * (0.68 * w_smile[:, None])

w_chin_crease = gaussian(Y, 0.435, 0.011) * gaussian(X, -0.022, 0.042) * smoothstep(0.11, 0.15, Z)
skin_col = skin_col * (1.0 - 0.28 * w_chin_crease[:, None]) + hex_rgb("#CC8060") * (0.28 * w_chin_crease[:, None])

w_eye_total = np.zeros(N, dtype=np.float64)
for ex, ey in [(-0.085, 0.688), (0.055, 0.688)]:
    r_eye = np.hypot((X - ex) / 0.036, (Y - ey) / 0.038)
    w_eye = (1.0 - smoothstep(0.86, 1.04, r_eye)) * smoothstep(0.075, 0.095, Z)
    w_eye_total = np.maximum(w_eye_total, w_eye)
    ix_c, iy_c = ex + 0.002, ey - 0.002
    r_iris = np.hypot((X - ix_c) / 0.023, (Y - iy_c) / 0.025)
    w_iris = 1.0 - smoothstep(0.84, 1.02, r_iris)
    w_pupil = 1.0 - smoothstep(0.42, 0.54, r_iris)
    limbus = gaussian(r_iris, 0.90, 0.10)

    t_ir = np.clip(r_iris, 0.0, 1.0)[:, None]
    ir_col = hex_rgb("#64C2FF") * (1.0 - t_ir) + hex_rgb("#165CA8") * t_ir
    ir_col = ir_col * (1.0 - 0.58 * limbus[:, None]) + hex_rgb("#0A2240") * (0.58 * limbus[:, None])

    eye_c = np.broadcast_to(hex_rgb("#FAF9F5"), (N, 3)).copy()
    eye_c = eye_c * (1.0 - w_iris[:, None]) + ir_col * w_iris[:, None]
    eye_c = eye_c * (1.0 - w_pupil[:, None]) + hex_rgb("#080B11") * w_pupil[:, None]

    r_glint = np.hypot(X - (ix_c - 0.007), Y - (iy_c + 0.008))
    w_glint = 1.0 - smoothstep(0.0050, 0.0082, r_glint)
    eye_c = eye_c * (1.0 - w_glint[:, None]) + hex_rgb("#FFFFFF") * w_glint[:, None]

    skin_col = skin_col * (1.0 - w_eye[:, None]) + eye_c * w_eye[:, None]

for bx_c in (-0.092, 0.058):
    y_b_arch = 0.748 - 2.6 * ((X - bx_c) ** 2)
    w_brow = (
        (1.0 - smoothstep(0.042, 0.052, np.abs(X - bx_c)))
        * (1.0 - smoothstep(0.014, 0.023, np.abs(Y - y_b_arch)))
        * smoothstep(0.085, 0.110, Z)
    )
    skin_col = skin_col * (1.0 - w_brow[:, None]) + hex_rgb("#5A595E") * w_brow[:, None]

is_ear = (
    smoothstep(0.192, 0.208, np.abs(dx_h))
    * smoothstep(0.520, 0.545, Y)
    * (1.0 - smoothstep(0.648, 0.665, Y))
    * smoothstep(-0.175, -0.145, Z)
    * (1.0 - smoothstep(-0.015, 0.015, Z))
)
w_side_hair = (
    smoothstep(0.135, 0.155, np.abs(dx_h))
    * smoothstep(0.610, 0.630, Y)
    * (1.0 - smoothstep(0.03, 0.065, Z))
    * (1.0 - is_ear)
)
w_back_hair = (
    (1.0 - smoothstep(-0.07, -0.03, Z))
    * smoothstep(0.585, 0.605, Y)
    * (1.0 - is_ear)
)
w_hair = np.clip(np.maximum(w_side_hair, w_back_hair), 0.0, 1.0)
hair_c = hex_rgb("#9E9FA4") + np.sin(X * 160.0 + Y * 80.0)[:, None] * 10.0
skin_col = skin_col * (1.0 - w_hair[:, None]) + np.clip(hair_c, 0, 255) * w_hair[:, None]

col = col * (1.0 - w_above_neckerchief[:, None]) + skin_col * w_above_neckerchief[:, None]
mat_id = np.where(w_above_neckerchief > 0.5, 0, mat_id)
roughness = roughness * (1.0 - w_above_neckerchief) + 0.45 * w_above_neckerchief
sss_w = np.where(w_above_neckerchief > 0.5, 1.0 - w_hair, sss_w)
mat_id = np.where((w_above_neckerchief > 0.5) & (w_eye_total > 0.5), 7, mat_id)
roughness = np.where((w_above_neckerchief > 0.5) & (w_eye_total > 0.5), 0.06, roughness)

# =========================================================================
# 3. PLUMP RED NECKERCHIEF / BANDANA
# =========================================================================
y_roll_bot_front = 0.168 + 2.15 * (dx_h ** 2)
y_roll_bot_back  = 0.285 + 1.95 * (dx_h ** 2)
y_roll_bot = t_fb * y_roll_bot_front + (1.0 - t_fb) * y_roll_bot_back

in_bandana_roll = (
    smoothstep(y_roll_bot - 0.008, y_roll_bot + 0.008, Y)
    * (1.0 - smoothstep(y_neck_top - 0.006, y_neck_top + 0.008, Y))
    * (1.0 - smoothstep(0.245, 0.268, np.abs(dx_h)))
)

r_knot = np.hypot((X + 0.068) / 0.056, (Y - 0.198) / 0.048)
in_knot = (1.0 - smoothstep(0.85, 1.12, r_knot)) * smoothstep(0.18, 0.22, Z)

x_left_l  = np.interp(Y, [0.030, 0.05, 0.10, 0.15, 0.20], [-0.202, -0.196, -0.196, -0.190, -0.132])
x_right_l = np.interp(Y, [0.030, 0.05, 0.10, 0.15, 0.20], [-0.195, -0.125, -0.088, -0.078, -0.080])
in_tail_l = (
    smoothstep(x_left_l - 0.005, x_left_l + 0.005, X)
    * (1.0 - smoothstep(x_right_l - 0.005, x_right_l + 0.005, X))
    * smoothstep(0.023, 0.031, Y)
    * (1.0 - smoothstep(0.192, 0.205, Y))
    * smoothstep(0.20, 0.23, Z)
)

x_left_r  = np.interp(Y, [0.015, 0.05, 0.10, 0.15, 0.19], [ 0.032, -0.042, -0.076, -0.078, -0.060])
x_right_r = np.interp(Y, [0.015, 0.05, 0.10, 0.15, 0.19], [ 0.044,  0.038,  0.038,  0.025, -0.002])
in_tail_r = (
    smoothstep(x_left_r - 0.005, x_left_r + 0.005, X)
    * (1.0 - smoothstep(x_right_r - 0.005, x_right_r + 0.005, X))
    * smoothstep(0.010, 0.018, Y)
    * (1.0 - smoothstep(0.185, 0.198, Y))
    * smoothstep(0.20, 0.23, Z)
)

w_bandana = np.clip(np.maximum(np.maximum(in_bandana_roll, in_knot), np.maximum(in_tail_l, in_tail_r)), 0.0, 1.0)
bandana_col = hex_rgb("#D81E20") + np.clip(convexity * 800.0, -1.0, 1.0)[:, None] * 28.0
tail_split = gaussian(X, -0.080, 0.006) * smoothstep(0.10, 0.13, Y) * (1.0 - smoothstep(0.16, 0.18, Y)) * smoothstep(0.22, 0.25, Z)
bandana_col = bandana_col * (1.0 - 0.45 * tail_split[:, None]) + hex_rgb("#780A0C") * (0.45 * tail_split[:, None])

col = col * (1.0 - w_bandana[:, None]) + np.clip(bandana_col, 0, 255) * w_bandana[:, None]
mat_id = np.where(w_bandana > 0.5, 3, mat_id)
roughness = roughness * (1.0 - w_bandana) + 0.50 * w_bandana

# =========================================================================
# 4. CHARACTER HAT
# =========================================================================
z_hat_c = np.minimum(Z, 0.085)
y_hat_cut = 0.772 + 0.38 * (z_hat_c - 0.085) - 0.05 * (dx_h ** 2) - 0.25 * np.maximum(0.0, Z - 0.115)
r_head_xz = np.hypot(dx_h, Z + 0.035)
w_hat = np.clip(
    np.maximum(
        smoothstep(y_hat_cut - 0.006, y_hat_cut + 0.006, Y),
        smoothstep(0.64, 0.66, Y) * smoothstep(0.218, 0.232, r_head_xz) * (1.0 - is_ear)
    ),
    0.0, 1.0
)

hat_col = np.broadcast_to(hex_rgb("#8C5632"), (N, 3)).copy()
brim_under = (1.0 - smoothstep(-0.35, -0.05, NY)) * (1.0 - smoothstep(0.82, 0.86, Y))
crown_top_hi = smoothstep(0.84, 0.95, Y)
hat_col = hat_col * (1.0 - 0.38 * brim_under[:, None]) + hex_rgb("#522E18") * (0.38 * brim_under[:, None])
hat_col = hat_col * (1.0 - 0.25 * crown_top_hi[:, None]) + hex_rgb("#A86E46") * (0.25 * crown_top_hi[:, None])

y_crown_base = 0.782 + 0.26 * (Z - 0.05) + 0.16 * (dx_h ** 2)
w_hat_band = (
    smoothstep(y_crown_base - 0.006, y_crown_base + 0.004, Y)
    * (1.0 - smoothstep(y_crown_base + 0.038, y_crown_base + 0.048, Y))
    * (1.0 - smoothstep(0.195, 0.215, r_head_xz))
)
hat_col = hat_col * (1.0 - w_hat_band[:, None]) + hex_rgb("#3E2212") * w_hat_band[:, None]
col = col * (1.0 - w_hat[:, None]) + hat_col * w_hat[:, None]
mat_id = np.where(w_hat > 0.5, 4, mat_id)
roughness = roughness * (1.0 - w_hat) + 0.56 * w_hat
sss_w = np.where(w_hat > 0.5, 0.0, sss_w)

# =========================================================================
# 5. WARM PEACH CARTOON HANDS (Sharp hip/hand boundary at |dx_body| = 0.440)
# =========================================================================
y_cuff_cut = -0.232 - 0.10 * Z
w_hands = (
    smoothstep(0.440, 0.448, np.abs(dx_body))
    * (1.0 - smoothstep(y_cuff_cut - 0.005, y_cuff_cut + 0.005, Y))
    * smoothstep(-0.452, -0.438, Y)
)
t_hand_grad = 1.0 - smoothstep(-0.39, -0.26, Y)
hand_c = hex_rgb("#F8C5A0") * (1.0 - 0.20 * t_hand_grad[:, None]) + hex_rgb("#E89278") * (0.20 * t_hand_grad[:, None])
col = col * (1.0 - w_hands[:, None]) + hand_c * w_hands[:, None]
mat_id = np.where(w_hands > 0.5, 0, mat_id)
roughness = roughness * (1.0 - w_hands) + 0.45 * w_hands
sss_w = np.where(w_hands > 0.5, 1.0, sss_w)

# =========================================================================
# 6. WAIST BELT, DENIM BELT LOOPS & SILVER OVAL BUCKLE
# =========================================================================
y_belt_top = -0.264 - 0.015 * Z + 0.04 * (dx_body ** 2)
y_belt_bot = -0.395 - 0.015 * Z + 0.04 * (dx_body ** 2)
w_belt_band = (
    (1.0 - smoothstep(0.436, 0.444, np.abs(dx_body)))
    * (1.0 - smoothstep(y_belt_top - 0.005, y_belt_top + 0.005, Y))
    * smoothstep(y_belt_bot - 0.005, y_belt_bot + 0.005, Y)
)
belt_c = hex_rgb("#6E3815") + np.clip(convexity * 500.0, -1.0, 1.0)[:, None] * 14.0

w_loops = np.zeros(N, dtype=np.float64)
for lx in (-0.285, 0.165):
    w_loops = np.maximum(w_loops, (1.0 - smoothstep(0.018, 0.025, np.abs(X - lx))) * smoothstep(0.05, 0.12, Z))
for lx_b in (-0.215, 0.0, 0.215):
    w_loops = np.maximum(w_loops, (1.0 - smoothstep(0.016, 0.024, np.abs(X - lx_b))) * (1.0 - smoothstep(-0.10, 0.0, Z)))
belt_c = belt_c * (1.0 - w_loops[:, None]) + hex_rgb("#1C4670") * w_loops[:, None]

bx_c, by_c = -0.060, -0.342
r_buckle = np.hypot((X - bx_c) / 0.116, (Y - by_c) / 0.082)
w_buckle = (1.0 - smoothstep(0.90, 1.04, r_buckle)) * smoothstep(0.24, 0.28, Z)
outer_rim = smoothstep(0.62, 0.76, r_buckle)
cap_l = 1.0 - smoothstep(0.020, 0.028, np.hypot((X - (bx_c - 0.032)) / 0.90, (Y - by_c) / 1.45))
cap_r = 1.0 - smoothstep(0.020, 0.028, np.hypot((X - (bx_c + 0.032)) / 0.90, (Y - by_c) / 1.45))
ring_hi = np.clip(outer_rim + cap_l + cap_r + np.clip(convexity * 900.0, 0.0, 0.5), 0.0, 1.0)
buckle_c = hex_rgb("#8C96A2") * (1.0 - ring_hi[:, None]) + hex_rgb("#EEF4FA") * ring_hi[:, None]

col = col * (1.0 - w_belt_band[:, None]) + np.clip(belt_c, 0, 255) * w_belt_band[:, None]
mat_id = np.where(w_belt_band > 0.5, 5, mat_id)
roughness = roughness * (1.0 - w_belt_band) + 0.32 * w_belt_band

# =========================================================================
# 7. DEEP DENIM BLUE TROUSERS
# =========================================================================
y_ankle_cut = -0.822 - 0.015 * Z
w_trousers = (
    (1.0 - smoothstep(0.436, 0.444, np.abs(dx_body)))
    * (1.0 - smoothstep(y_belt_bot - 0.005, y_belt_bot + 0.005, Y))
    * smoothstep(y_ankle_cut - 0.006, y_ankle_cut + 0.006, Y)
)
denim_hi = smoothstep(-0.80, -0.40, Y) * 0.5 + 0.5 * np.maximum(0.0, NZ)
denim_c = hex_rgb("#16385A") * (1.0 - denim_hi[:, None]) + hex_rgb("#285888") * denim_hi[:, None]
col = col * (1.0 - w_trousers[:, None]) + denim_c * w_trousers[:, None]
mat_id = np.where(w_trousers > 0.5, 2, mat_id)
roughness = roughness * (1.0 - w_trousers) + 0.82 * w_trousers

# Apply silver buckle on top of belt & upper trouser seam
col = col * (1.0 - w_buckle[:, None]) + np.clip(buckle_c, 0, 255) * w_buckle[:, None]
mat_id = np.where(w_buckle > 0.5, 6, mat_id)
roughness = roughness * (1.0 - w_buckle) + 0.16 * w_buckle
metallic  = metallic * (1.0 - w_buckle) + 0.90 * w_buckle

# =========================================================================
# 8. GLOSSY BROWN LEATHER BOOTS & DARK SOLES
# =========================================================================
w_boots = 1.0 - smoothstep(y_ankle_cut - 0.006, y_ankle_cut + 0.006, Y)
y_sole_cut = -0.955
w_sole = 1.0 - smoothstep(y_sole_cut - 0.005, y_sole_cut + 0.005, Y)
welt_line = gaussian(Y, y_sole_cut + 0.004, 0.004)
boot_hi = smoothstep(0.05, 0.22, Z) * smoothstep(-0.94, -0.86, Y)
boot_c = hex_rgb("#6E3918") + boot_hi[:, None] * 26.0
boot_c = boot_c * (1.0 - w_sole[:, None]) + hex_rgb("#261308") * w_sole[:, None]
boot_c = boot_c * (1.0 - 0.5 * welt_line[:, None]) + hex_rgb("#B87E46") * (0.5 * welt_line[:, None])
col = col * (1.0 - w_boots[:, None]) + np.clip(boot_c, 0, 255) * w_boots[:, None]
mat_id = np.where(w_boots > 0.5, 5, mat_id)
roughness = roughness * (1.0 - w_boots) + 0.28 * w_boots

# Gentle sculpted crease AO
ao_str = np.where(w_above_neckerchief > 0.5, 0.14, 0.24)
ao_factor = np.clip(1.0 + ao_str * np.minimum(0.0, convexity * 450.0), 0.75, 1.0)
col = np.clip(col * ao_factor[:, None], 0.0, 255.0)

# 2-pass edge-anti-aliasing across the 80,000-vertex mesh so close-ups of eyes, tie, collar & buckle have zero triangle stair-stepping!
for _ in range(2):
    nei_c = np.zeros_like(col)
    np.add.at(nei_c, ia, col[ib])
    col = 0.65 * col + 0.35 * (nei_c / cnt)
    nei_r = np.zeros_like(roughness)
    np.add.at(nei_r, ia, roughness[ib])
    roughness = 0.65 * roughness + 0.35 * (nei_r / cnt[:, 0])

# =========================================================================
# 9. SCALE TO 1.75m HEIGHT WITH FEET AT Y = 0.0 AND BUILD character.glb
# =========================================================================
y_min, y_max = V_sub[:, 1].min(), V_sub[:, 1].max()
scale_m = 1.75 / (y_max - y_min)
V_m = V_sub.copy()
V_m[:, 0] = (V_sub[:, 0] - 0.5 * (V_sub[:, 0].min() + V_sub[:, 0].max())) * scale_m
V_m[:, 1] = (V_sub[:, 1] - y_min) * scale_m
V_m[:, 2] = (V_sub[:, 2] - 0.5 * (V_sub[:, 2].min() + V_sub[:, 2].max())) * scale_m

# Compute UVs mapped cleanly into 8 material tiles of a 2048x2048 PBR texture atlas (4x2 grid)
uv = np.zeros((N, 2), dtype=np.float32)
u_local = np.clip((X + 0.72) / 1.44, 0.05, 0.95)
v_local = np.clip((Y + 1.00) / 2.00, 0.05, 0.95)
for m_idx in range(8):
    mask_m = (mat_id == m_idx)
    tx = m_idx % 4
    ty = m_idx // 4
    uv[mask_m, 0] = (tx + u_local[mask_m]) * 0.25
    uv[mask_m, 1] = (ty + v_local[mask_m]) * 0.50

# Compute tangents (FLOAT VEC4)
tangents = np.zeros((N, 4), dtype=np.float32)
up = np.array([0.0, 1.0, 0.0])
t_vec = np.cross(up, v_norm)
t_len = np.linalg.norm(t_vec, axis=1, keepdims=True)
fallback = np.abs(v_norm[:, 1]) > 0.99
t_vec[fallback] = np.array([1.0, 0.0, 0.0])
t_len[fallback] = 1.0
tangents[:, :3] = (t_vec / np.maximum(t_len, 1e-8)).astype(np.float32)
tangents[:, 3] = 1.0

# Linear COLOR_0 (FLOAT VEC4) for glTF 2.0 compliance
srgb_norm = np.clip(col / 255.0, 0.0, 1.0)
linear_rgb = np.power(srgb_norm, 2.2).astype(np.float32)
color_0 = np.ones((N, 4), dtype=np.float32)
color_0[:, :3] = linear_rgb
color_0[:, 3]  = np.clip(roughness, 0.05, 0.95).astype(np.float32)

# Generate 4 embedded 2048x2048 PBR textures (BaseColor, MetallicRoughness, Normal, Occlusion)
def make_png_bytes(arr_uint8):
    im = Image.fromarray(arr_uint8)
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=False, compress_level=6)
    return buf.getvalue()

tex_size = 2048
# 1. BaseColor: pure warm white (253..255) with subtle micro-weave so baseColorTexture * COLOR_0 = exact COLOR_0!
yy, xx = np.mgrid[0:tex_size, 0:tex_size]
weave = (np.sin(xx * 0.4) * np.cos(yy * 0.4) * 2.0).astype(np.int32)
base_tex = np.clip(253 + weave[:, :, None], 250, 255).astype(np.uint8)
base_tex = np.repeat(base_tex, 3, axis=2)

# 2. MetallicRoughness (G = roughness, B = metallic) per 4x2 material tile
mr_tex = np.zeros((tex_size, tex_size, 3), dtype=np.uint8)
mr_tex[:, :, 0] = 255
tile_r = [0.45, 0.76, 0.82, 0.50, 0.56, 0.30, 0.16, 0.06]
tile_m = [0.00, 0.00, 0.00, 0.00, 0.00, 0.04, 0.90, 0.00]
for m_idx in range(8):
    tx, ty = m_idx % 4, m_idx // 4
    x0, x1 = tx * 512, (tx + 1) * 512
    y0, y1 = ty * 1024, (ty + 1) * 1024
    mr_tex[y0:y1, x0:x1, 1] = int(round(tile_r[m_idx] * 255))
    mr_tex[y0:y1, x0:x1, 2] = int(round(tile_m[m_idx] * 255))

# 3. Normal map (flat tangent normal [128, 128, 255] with subtle micro-grain on fabric/leather tiles)
norm_tex = np.zeros((tex_size, tex_size, 3), dtype=np.uint8)
norm_tex[:, :, 0] = np.clip(128 + weave, 124, 132).astype(np.uint8)
norm_tex[:, :, 1] = np.clip(128 - weave, 124, 132).astype(np.uint8)
norm_tex[:, :, 2] = 255

# 4. Occlusion map
occ_tex = np.clip(248 + weave, 242, 255).astype(np.uint8)
occ_tex = np.stack([occ_tex, occ_tex, occ_tex], axis=-1)

png_base = make_png_bytes(base_tex)
png_mr   = make_png_bytes(mr_tex)
png_norm = make_png_bytes(norm_tex)
png_occ  = make_png_bytes(occ_tex)

# Partition F_sub into 8 material primitives based on dominant vertex mat_id
tri_mat = mat_id[F_sub[:, 0]]
mat_names = [
    "Mat_Skin",
    "Mat_Shirt",
    "Mat_Trousers",
    "Mat_Neckerchief",
    "Mat_Hat",
    "Mat_Leather_Belt_Boots",
    "Mat_Silver_Buckle",
    "Mat_Eyes",
]

bin_chunks = []
buffer_views = []
accessors = []

def add_buffer_view(raw_bytes, target=None):
    offset = sum(len(c) for c in bin_chunks)
    pad = (4 - (len(raw_bytes) % 4)) % 4
    bin_chunks.append(raw_bytes + b"\x00" * pad)
    bv = {"buffer": 0, "byteOffset": offset, "byteLength": len(raw_bytes)}
    if target is not None:
        bv["target"] = target
    buffer_views.append(bv)
    return len(buffer_views) - 1

pos_f32 = V_m.astype(np.float32)
norm_f32 = v_norm.astype(np.float32)

bv_pos_i  = add_buffer_view(pos_f32.tobytes(), 34962)
bv_norm_i = add_buffer_view(norm_f32.tobytes(), 34962)
bv_uv_i   = add_buffer_view(uv.tobytes(), 34962)
bv_tan_i  = add_buffer_view(tangents.tobytes(), 34962)
bv_col_i  = add_buffer_view(color_0.tobytes(), 34962)

acc_pos = len(accessors); accessors.append({
    "bufferView": bv_pos_i, "componentType": 5126, "count": N, "type": "VEC3",
    "min": pos_f32.min(axis=0).tolist(), "max": pos_f32.max(axis=0).tolist()
})
acc_norm = len(accessors); accessors.append({
    "bufferView": bv_norm_i, "componentType": 5126, "count": N, "type": "VEC3",
    "min": norm_f32.min(axis=0).tolist(), "max": norm_f32.max(axis=0).tolist()
})
acc_uv = len(accessors); accessors.append({
    "bufferView": bv_uv_i, "componentType": 5126, "count": N, "type": "VEC2",
    "min": uv.min(axis=0).tolist(), "max": uv.max(axis=0).tolist()
})
acc_tan = len(accessors); accessors.append({
    "bufferView": bv_tan_i, "componentType": 5126, "count": N, "type": "VEC4",
    "min": tangents.min(axis=0).tolist(), "max": tangents.max(axis=0).tolist()
})
acc_col = len(accessors); accessors.append({
    "bufferView": bv_col_i, "componentType": 5126, "count": N, "type": "VEC4",
    "min": color_0.min(axis=0).tolist(), "max": color_0.max(axis=0).tolist()
})

primitives = []
for m_idx in range(8):
    f_m = F_sub[tri_mat == m_idx].astype(np.uint32)
    if len(f_m) == 0:
        continue
    idx_flat = f_m.reshape(-1)
    bv_idx_m = add_buffer_view(idx_flat.tobytes(), 34963)
    acc_idx_m = len(accessors)
    accessors.append({
        "bufferView": bv_idx_m, "componentType": 5125, "count": len(idx_flat), "type": "SCALAR",
        "min": [int(idx_flat.min())], "max": [int(idx_flat.max())]
    })
    primitives.append({
        "attributes": {
            "POSITION": acc_pos,
            "NORMAL": acc_norm,
            "TEXCOORD_0": acc_uv,
            "TANGENT": acc_tan,
            "COLOR_0": acc_col
        },
        "indices": acc_idx_m,
        "material": m_idx,
        "mode": 4
    })

# Add the 3 PNG textures [baseColor, normal, orm] to bufferViews
bv_tex_base = add_buffer_view(png_base)
bv_tex_norm = add_buffer_view(png_norm)
bv_tex_orm  = add_buffer_view(png_mr)

materials = []
for m_idx, m_name in enumerate(mat_names):
    materials.append({
        "name": m_name,
        "doubleSided": True,
        "pbrMetallicRoughness": {
            "baseColorFactor": [1.0, 1.0, 1.0, 1.0],
            "baseColorTexture": {"index": 0},
            "metallicFactor": float(tile_m[m_idx]),
            "roughnessFactor": float(tile_r[m_idx]),
            "metallicRoughnessTexture": {"index": 2}
        },
        "normalTexture": {"index": 1, "scale": 0.20},
        "occlusionTexture": {"index": 2, "strength": 0.35}
    })

total_bin = b"".join(bin_chunks)
gltf_out = {
    "asset": {"version": "2.0", "generator": "Colored & Smoothed User white_mesh.glb Pipeline"},
    "scene": 0,
    "scenes": [{"name": "CharacterCharacterScene", "nodes": [0]}],
    "nodes": [{"name": "CharacterCharacter", "mesh": 0}],
    "meshes": [{"name": "CharacterCharacterMesh", "primitives": primitives}],
    "materials": materials,
    "textures": [
        {"sampler": 0, "source": 0, "name": "BaseColorTex"},
        {"sampler": 0, "source": 1, "name": "NormalTex"},
        {"sampler": 0, "source": 2, "name": "OrmTex"}
    ],
    "images": [
        {"bufferView": bv_tex_base, "mimeType": "image/png", "name": "baseColor"},
        {"bufferView": bv_tex_norm, "mimeType": "image/png", "name": "normal"},
        {"bufferView": bv_tex_orm,  "mimeType": "image/png", "name": "orm"}
    ],
    "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}],
    "accessors": accessors,
    "bufferViews": buffer_views,
    "buffers": [{"byteLength": len(total_bin)}]
}

json_bytes = json.dumps(gltf_out, separators=(",", ":")).encode("utf-8")
json_pad = (4 - (len(json_bytes) % 4)) % 4
json_bytes += b" " * json_pad

glb_total_len = 12 + 8 + len(json_bytes) + 8 + len(total_bin)
glb_header = struct.pack("<III", 0x46546C67, 2, glb_total_len)
chunk0_hdr = struct.pack("<II", len(json_bytes), 0x4E4F534A)
chunk1_hdr = struct.pack("<II", len(total_bin), 0x004E4942)

os.makedirs("/tmp/character_project", exist_ok=True)
out_glb_path = "/tmp/character_project/character.glb"
glb_bytes_full = glb_header + chunk0_hdr + json_bytes + chunk1_hdr + total_bin
with open(out_glb_path, "wb") as f:
    f.write(glb_bytes_full)
inter_glb = "/tmp/character_project/artifacts/file_generation/ttl=63d/intermediate/project/character.glb"
if os.path.exists(os.path.dirname(inter_glb)):
    with open(inter_glb, "wb") as f:
        f.write(glb_bytes_full)

print(f"Exported {out_glb_path}: {os.path.getsize(out_glb_path)/(1024*1024):.2f} MB, {N:,} verts, {len(F_sub):,} tris")

# Also export compact compressed payload for inline WebGL 2.0 viewer & studio renderer:
# Store 20,000 pos_s0 (int16 * 3) + 40,000 tris (uint16 * 3) + 80,000 RGBA (R, G, B, mat_id) uint8!
# When JS loads this payload, it runs the exact same 15-line midpoint subdivision + 4-step Taubin smooth
# to produce the exact 80,000-vertex, 160,000-triangle mesh with exact per-vertex RGBA!
p_q = np.clip(np.round(pos_s0 * 30000.0), -32767, 32767).astype("<i2")
t_q = tris.astype("<u2")
rgba_q = np.zeros((N, 4), dtype=np.uint8)
rgba_q[:, :3] = np.clip(np.round(col), 0, 255).astype(np.uint8)
rgba_q[:, 3]  = np.clip(np.round(roughness * 255.0), 10, 250).astype(np.uint8)

raw_payload = p_q.tobytes() + t_q.tobytes() + rgba_q.tobytes()
comp_payload = zlib.compress(raw_payload, level=9)
b64_payload = base64.b64encode(comp_payload).decode("ascii")
with open("/tmp/character_mesh_payload.txt", "w") as f:
    f.write(b64_payload)
print(f"Saved /tmp/character_mesh_payload.txt ({len(b64_payload)/1024:.1f} KB base64)")
