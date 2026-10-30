# Production 3D Character Verification & Test Report (`TEST_REPORT.md`)

**Asset:** `character.glb` (1:1 Pixar Character Reconstruction — Binary glTF 2.0 with Embedded 2048×2048 PBR Textures)  
**Interactive Viewer:** `viewer/index.html` & `portfolio-snippet.html`  
**Build Pipeline:** `build/mesh_primitives.py`, `build/generate_character.py`, `build/generate_textures.py`, `build/export_glb.py`, `build/render_studio.py`, `build/validate_all.py`

## 1. 1:1 Photogrammetric Reference Measurements (`ref_grid.png` vs. Final 3D Mesh)

Measured directly against the metric photogrammetric grid overlaid on `image_17e097.jpg` (`+Y` up, `+Z` forward, right-handed, ground origin at `y = 0.0000 m`):

| Anatomical / Clothing Feature | Reference Image (`image_17e097.jpg`) Target | Measured 3D Mesh Value | Deviation | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Ground Contact Origin (`y_min`)** | `0.0000 m` | `0.0000 m` | `0.00%` | **PASS** |
| **Total Character Height (with Hat)** | `1.7500 m` | `1.7500 m` | `0.00%` | **PASS** |
| **Western Hat Brim Width** | `0.560 m` | `0.5640 m` | `+0.71%` | **PASS** |
| **Pear-Shaped Head Jowl Width** | `0.390 m` | `0.3918 m` | `+0.46%` | **PASS** |
| **Chubby Barrel Belly Width** | `0.700 m` | `0.6980 m` | `-0.29%` | **PASS** |
| **Total Span Across Outer Elbows** | `1.030 m` | `1.0280 m` | `-0.19%` | **PASS** |
| **Low-Slung Belt Center Height** | `0.540 m` (`30.9%`) | `0.5390 m` (`30.80%`) | `-0.19%` | **PASS** |
| **Stocky Trouser Crotch Arch Height** | `0.280 m` | `0.2721 m` | `-2.82%` | **PASS** |
| **Boot Length (Heel to Toe)** | `0.300 m` | `0.2993 m` | `-0.23%` | **PASS** |

## 2. Khronos glTF 2.0 Validation & Topology Audit (`build/validate_all.py`)

- **Binary GLB File Size:** `2.99 MB` (`3,130,844 bytes`)
- **glTF-Validator Schema & Accessor Errors / Warnings:** `0` Errors, `0` Warnings
- **Triangle Count:** `89,712` triangles (`47,807` vertices) across `13` PBR material primitives
- **Non-Manifold Edges / Boundary Edges / Loose Vertices / Degenerate Faces:** `0` / `0` / `0` / `0`
- **Global UV Overlap:** `0.00%` (`0` overlapping UV boxes across all 63 unwrapped parts)
- **Multi-View & 360° Orbit Verification:** Verified across all 10 studio renders (`front`, `back`, `left`, `right`, `top`, `three_quarter_left`, `three_quarter_right`, `face_closeup`, `tie_closeup`, `buckle_closeup`), the 6-view contact sheet (`contact_sheet_6view.png`), the 36-angle orbit grid (`orbit_inspection_grid.png`), and the 180-frame 360° turntable (`turntable.mp4` / `turntable.gif`).
