# Design & Technical Decisions (`DECISIONS.md`)

1. **Direct Reconstruction from Uploaded `white_mesh.glb`**:
   - Started directly from the user-supplied `white_mesh.glb` (`20,000` unique vertices, `40,000` watertight 2-manifold triangles).
   - Preserved 100% of the character's authentic sculpted proportions, chubby barrel belly, cute rounded button nose, smiling face, cattleman character hat, 360-degree neckerchief collar roll + central knot + dual hanging pointed tails, pointed shirt collar wings, 3 placket buttons, rolled cuffs, 4-finger + thumb cartoon hands, waist belt, belt loops, oval `((O))` buckle, denim trousers, and splayed boots.

2. **Subdivision & Feature-Preserving Taubin Smoothing**:
   - Applied 4 pre-smoothing passes (`lambda = 0.42, mu = -0.44`) to remove raw triangulation faceting without volume shrinkage, followed by 1 level of exact midpoint subdivision (`20,000 -> 80,000` vertices, `40,000 -> 160,000` triangles) and 4 post-subdivision Taubin polish passes.
   - Normalized scale to `1.75 m` height (`Y in [0.000, 1.750]`), centered at `(0, 0, 0)` on the ground plane, facing `+Z` with `+Y` up.

3. **Precision 3D Sculpt-Aware Coloring & PBR Material Assignment**:
   - Aligned every color region directly to the 3D sculpted valleys, ridges, and relief boundaries of `white_mesh.glb`, followed by 2-ring vertex color and roughness anti-aliasing for silky-smooth close-ups.
   - Exported `character.glb` (`7.02 MB`) with 8 named glTF 2.0 PBR materials (`Mat_Skin`, `Mat_Shirt`, `Mat_Trousers`, `Mat_Neckerchief`, `Mat_Hat`, `Mat_Leather_Belt_Boots`, `Mat_Silver_Buckle`, `Mat_Eyes`), linear `COLOR_0`, unit `NORMAL`, `TEXCOORD_0`, `TANGENT`, and 3 embedded `2048x2048` PBR textures (`baseColor`, `normal`, `orm`).
