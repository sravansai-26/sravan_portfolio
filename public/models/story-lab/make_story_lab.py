#!/usr/bin/env python3
"""Story Lab placeholder set: six hand-built SVG scenes rendered to HD PNG/JPG with Chromium.
One shared world (the rolling hills + dirt road from the character reference), one shared
palette (sky blue, meadow green, leather brown, denim blue) and one recurring spot of red
(the character's kerchief) so the six images read as a family."""
import asyncio, math, random, sys, os
from playwright.async_api import async_playwright

W, H = 1600, 1200
OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/story-lab"
SERIF = "Georgia, 'DejaVu Serif', serif"

# ---------------------------------------------------------------- helpers
def smooth(pts):
    d = f"M{pts[0][0]},{pts[0][1]}"
    n = len(pts)
    for i in range(n - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < n else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]},{p2[1]}"
    return d

def hill(pts, fill, bottom=H + 20, extra=""):
    return f'<path d="{smooth(pts)} L{pts[-1][0]},{bottom} L{pts[0][0]},{bottom} Z" fill="{fill}" {extra}/>'

def cloud(x, y, s=1.0, fill="#ffffff", shade="#d7e8f6", op=1.0):
    circles = [(-110, 8, 40), (-62, -22, 58), (4, -44, 70), (72, -20, 56), (124, 6, 40), (20, -6, 52)]
    g = f'<g transform="translate({x},{y}) scale({s})" opacity="{op}">'
    g += f'<ellipse cx="6" cy="34" rx="172" ry="26" fill="{shade}"/>'
    for cx, cy, r in circles:
        g += f'<circle cx="{cx+4}" cy="{cy+9}" r="{r}" fill="{shade}"/>'
    g += f'<ellipse cx="6" cy="26" rx="170" ry="24" fill="{fill}"/>'
    for cx, cy, r in circles:
        g += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>'
    return g + "</g>"

def hat(x, y, s=1.0, rot=0, leather="#955f36", brim="#7d4d2a", band="#4a2d1b"):
    return f'''<g transform="translate({x},{y}) scale({s}) rotate({rot})">
 <ellipse cx="0" cy="10" rx="146" ry="36" fill="#000" opacity=".18" filter="url(#b8)"/>
 <path d="M-140,-4 C-120,40 120,40 140,-4 C112,-34 -112,-34 -140,-4Z" fill="{brim}"/>
 <path d="M-136,-8 C-108,-30 108,-30 136,-8" fill="none" stroke="#b78254" stroke-width="3" opacity=".6"/>
 <path d="M-68,-6 C-80,-70 -60,-96 -26,-94 Q0,-80 26,-94 C60,-96 80,-70 68,-6 C42,10 -42,10 -68,-6Z" fill="{leather}"/>
 <path d="M-62,-62 C-56,-84 -40,-90 -26,-88" fill="none" stroke="#c28a5a" stroke-width="4" stroke-linecap="round" opacity=".55"/>
 <path d="M-69,-26 C-30,-10 30,-10 69,-26 L68,-8 C42,10 -42,10 -68,-8Z" fill="{band}"/>
</g>'''

def kerchief(x, y, s=1.0, rot=0):
    """A tied neckerchief: curved band, knot, two tails (the character's signature red)."""
    return f'''<g transform="translate({x},{y}) scale({s}) rotate({rot})">
 <path d="M-14,26 C-40,58 -58,92 -52,128 C-36,122 -14,118 -4,104 C-8,78 -6,52 -4,34Z" fill="#c42d27"/>
 <path d="M14,26 C34,52 50,80 46,112 C30,112 12,108 2,98 C8,72 10,50 8,34Z" fill="#d8372f"/>
 <path d="M-30,60 C-36,82 -40,100 -38,116 M26,56 C30,72 32,88 32,100" stroke="#8f1b17" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".5"/>
 <path d="M-100,-34 C-64,8 -22,26 0,28 C22,26 64,8 100,-34 L84,-46 C54,-10 22,6 0,8 C-22,6 -54,-10 -84,-46Z" fill="#e24339"/>
 <path d="M-84,-46 C-54,-10 -22,6 0,8 C22,6 54,-10 84,-46" fill="none" stroke="#f26f60" stroke-width="3" opacity=".7"/>
 <ellipse cx="0" cy="22" rx="22" ry="17" fill="#c42d27"/><path d="M-10,14 C-4,22 4,22 10,14" stroke="#8f1b17" stroke-width="2.6" fill="none" opacity=".55"/>
 <ellipse cx="-6" cy="16" rx="9" ry="5" fill="#f26f60" opacity=".55"/>
</g>'''

def tufts(rng, n, x0, x1, y0, y1, col="#3e7d38"):
    out = ""
    for _ in range(n):
        x, y = rng.uniform(x0, x1), rng.uniform(y0, y1)
        h = rng.uniform(10, 24)
        out += f'<path d="M{x},{y} q-4,-{h*0.6:.1f} -9,-{h:.1f} M{x},{y} q1,-{h*0.7:.1f} 1,-{h*1.2:.1f} M{x},{y} q5,-{h*0.6:.1f} 10,-{h:.1f}" stroke="{col}" stroke-width="3" fill="none" stroke-linecap="round"/>'
    return out

def common_defs():
    return """
<filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11"/>
  <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"/>
</filter>
<radialGradient id="vig" cx="50%" cy="48%" r="75%">
  <stop offset="60%" stop-color="#0b0e14" stop-opacity="0"/><stop offset="100%" stop-color="#0b0e14" stop-opacity=".3"/>
</radialGradient>
<filter id="shup" x="-10%" y="-30%" width="120%" height="150%"><feDropShadow dx="0" dy="-10" stdDeviation="10" flood-color="#1c3a22" flood-opacity=".3"/></filter>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#000" flood-opacity=".32"/></filter>
<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b4"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
"""

def svg(inner, defs_extra="", grain=0.28, vignette=True):
    v = f'<rect width="{W}" height="{H}" fill="url(#vig)"/>' if vignette else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs>{common_defs()}{defs_extra}</defs>
{inner}
{v}
<rect width="{W}" height="{H}" filter="url(#grain)" style="mix-blend-mode:overlay" opacity="{grain}"/>
</svg>'''

# ---------------------------------------------------------------- shared landscape (Setting + Rival)
PATH_D = ("M600,1215 C640,1100 880,1060 770,960 C700,890 830,850 800,800 C795,775 805,760 806,748 "
          "L820,748 C822,765 832,780 840,800 C880,850 760,900 850,965 C960,1065 800,1110 1010,1215 Z")

def landscape(rng, hills, path_fill=("#e2b678", "#b88649"), tuft="#3e7d38"):
    a, b, c = hills
    s = ""
    s += hill([(-50, 700), (250, 640), (520, 690), (800, 655), (1100, 705), (1400, 640), (1700, 690)], a)
    s += hill([(-50, 790), (280, 722), (600, 772), (800, 746), (1000, 766), (1350, 702), (1700, 772)], b, extra='filter="url(#shup)"')
    s += hill([(-50, 905), (300, 835), (700, 885), (1100, 852), (1700, 905)], c, extra='filter="url(#shup)"')
    s += f'''<defs><clipPath id="pclip"><path d="{PATH_D}"/></clipPath>
<linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{path_fill[0]}"/><stop offset="1" stop-color="{path_fill[1]}"/></linearGradient></defs>'''
    s += f'<path d="{PATH_D}" fill="url(#pg)"/>'
    s += '<g clip-path="url(#pclip)">'
    for _ in range(46):
        y = rng.uniform(780, 1210)
        x = 810 + (rng.random() - .5) * (60 + (y - 748) * .9)
        r = rng.uniform(2, 3 + (y - 748) / 70)
        s += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{r*1.5:.1f}" ry="{r:.1f}" fill="#8f6233" opacity=".55"/>'
    s += '<path d="M700,1215 C730,1110 830,1070 780,965 M900,1215 C880,1110 840,1060 835,965" stroke="#a7783f" stroke-width="7" fill="none" opacity=".35" stroke-linecap="round"/>'
    s += '</g>'
    s += f'<path d="{PATH_D}" fill="none" stroke="#7d5a2e" stroke-width="3" opacity=".35"/>'
    s += tufts(rng, 36, 40, 560, 930, 1180, tuft) + tufts(rng, 36, 1040, 1560, 930, 1180, tuft)
    return s

def bush(x, y, s=1.0, base="#4d9544", hi="#6fb35a"):
    return f'''<g transform="translate({x},{y}) scale({s})">
 <ellipse cx="0" cy="8" rx="120" ry="18" fill="#000" opacity=".18" filter="url(#b8)"/>
 <circle cx="-48" cy="-24" r="52" fill="{base}"/><circle cx="14" cy="-48" r="64" fill="{base}"/><circle cx="62" cy="-20" r="48" fill="{base}"/>
 <circle cx="0" cy="-8" r="54" fill="{base}"/>
 <path d="M-70,-50 C-50,-82 -10,-96 20,-90" stroke="{hi}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".7"/>
</g>'''

# ---------------------------------------------------------------- 1. THE SETTING
def scene_setting():
    rng = random.Random(1)
    defs = '''<linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c9eeb"/><stop offset=".7" stop-color="#9fd3f6"/><stop offset="1" stop-color="#dcf0fc"/></linearGradient>
<radialGradient id="sun1" cx="78%" cy="18%" r="45%"><stop offset="0" stop-color="#fff8dc" stop-opacity=".45"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></radialGradient>
<linearGradient id="pole" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a4125"/><stop offset=".45" stop-color="#9a6a3f"/><stop offset="1" stop-color="#5b3820"/></linearGradient>'''
    s = f'<rect width="{W}" height="820" fill="url(#sky1)"/><rect width="{W}" height="820" fill="url(#sun1)"/>'
    s += cloud(300, 250, 1.3) + cloud(1260, 190, 1.05) + cloud(930, 380, .62, op=.92) + cloud(90, 560, .7, op=.95) + cloud(1500, 520, .6, op=.95)
    for bx, by, sc in [(640, 150, 1), (700, 118, .8), (586, 110, .75)]:
        s += f'<path d="M{bx},{by} q14,-14 28,0 q14,-14 28,0" stroke="#2a4a68" stroke-width="3.4" fill="none" stroke-linecap="round" transform="scale({sc}) translate({bx*(1/sc-1):.0f},{by*(1/sc-1):.0f})"/>'
    s += landscape(rng, ("#b4df99", "#8ec96b", "#63a64f"))
    s += bush(150, 960, 1.05) + bush(1470, 930, .95) + bush(1330, 800, .5, "#5aa24d", "#7ec062")
    # signpost
    px, py = 468, 1040
    s += f'<ellipse cx="{px+30}" cy="{py+6}" rx="120" ry="14" fill="#000" opacity=".22" filter="url(#b8)"/>'
    s += f'<rect x="{px-17}" y="640" width="34" height="{py-640}" rx="8" fill="url(#pole)"/>'
    s += f'<path d="M{px-17},640 q17,-26 34,0z" fill="#7a4d2c"/>'
    def plank(cx, cy, w, h, d, rot, q=True):
        pts = [(-w/2, -h/2), (w/2 - h*.6, -h/2), (w/2, 0), (w/2 - h*.6, h/2), (-w/2, h/2)]
        if d < 0: pts = [(-x, y) for x, y in pts]
        poly = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        g = f'<g transform="translate({cx},{cy}) rotate({rot})" filter="url(#sh)">'
        g += f'<polygon points="{poly}" fill="#efd39d" stroke="#8a5a32" stroke-width="5" stroke-linejoin="round"/>'
        for gy in (-h*.22, h*.12, h*.3):
            g += f'<path d="M{-w*.38*(1 if d>0 else 1):.0f},{gy:.0f} q{w*.2:.0f},-5 {w*.45:.0f},0 t{w*.25:.0f},0" stroke="#c9a06a" stroke-width="2.5" fill="none" opacity=".8"/>'
        nx = -w/2 + 24 if d > 0 else w/2 - 24
        g += f'<circle cx="{nx}" cy="0" r="5" fill="#6a4125"/>'
        if q:
            tx = -w*.05 if d > 0 else w*.05
            g += f'<text x="{tx}" y="{h*.22:.0f}" text-anchor="middle" font-family="{SERIF}" font-size="{h*.78:.0f}" font-weight="700" fill="#8a5a32" opacity=".78">?</text>'
        return g + "</g>"
    s += plank(px + 70, 700, 300, 74, 1, -5) + plank(px - 60, 796, 280, 70, -1, 4) + plank(px + 52, 888, 250, 64, 1, -2)
    s += '<g filter="url(#sh)">' + kerchief(px, 962, .4, 0) + '</g>'
    return svg(s, defs)

# ---------------------------------------------------------------- 2. THE COMPANION
def flame(x, y, s, c1, c2):
    return f'''<g transform="translate({x},{y}) scale({s})"><path d="M0,0 C-52,-6 -60,-78 -14,-132 C-14,-92 22,-96 18,-150 C70,-104 70,-14 0,0Z" fill="{c1}"/>
<path d="M0,-4 C-30,-8 -34,-52 -6,-86 C-6,-60 16,-62 14,-96 C42,-62 38,-12 0,-4Z" fill="{c2}"/></g>'''

def scene_companion():
    rng = random.Random(2)
    defs = '''<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26346b"/><stop offset=".45" stop-color="#8c5f93"/><stop offset=".78" stop-color="#f59f6b"/><stop offset="1" stop-color="#ffd59a"/></linearGradient>
<radialGradient id="glow2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffb24a" stop-opacity=".75"/><stop offset=".5" stop-color="#ff8a3a" stop-opacity=".25"/><stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/></radialGradient>
<radialGradient id="sunD" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff2c8"/><stop offset=".6" stop-color="#ffd27a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<linearGradient id="log" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a06a3d"/><stop offset=".5" stop-color="#7a4a2a"/><stop offset="1" stop-color="#4a2d1b"/></linearGradient>'''
    s = f'<rect width="{W}" height="860" fill="url(#sky2)"/>'
    for _ in range(70):
        x, y = rng.uniform(0, W), rng.uniform(10, 380)
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rng.uniform(.8, 2.2):.1f}" fill="#fff" opacity="{rng.uniform(.3, .9) * (1 - y/460):.2f}"/>'
    s += '<circle cx="800" cy="735" r="320" fill="url(#sunD)" opacity=".75"/><circle cx="800" cy="738" r="70" fill="#fff0c0"/>'
    s += cloud(330, 330, 1.0, "#ffd6b8", "#c58aa0", .8) + cloud(1280, 470, .75, "#ffd1b0", "#c08299", .75)
    s += hill([(-50, 730), (250, 685), (520, 725), (800, 745), (1100, 715), (1400, 680), (1700, 725)], "#8c5f8e")
    s += hill([(-50, 800), (280, 748), (600, 790), (900, 770), (1300, 745), (1700, 795)], "#6a4a7c")
    s += hill([(-50, 880), (320, 830), (760, 872), (1200, 838), (1700, 880)], "#45365f")
    s += '<rect x="0" y="880" width="1600" height="340" fill="#6b4630"/>'
    s += hill([(-50, 880), (320, 870), (760, 884), (1200, 868), (1700, 880)], "#6b4630")
    s += '<rect x="0" y="900" width="1600" height="320" fill="#6e4730"/>'
    s += '<path d="M0,900 C300,880 500,930 800,915 C1100,900 1300,935 1600,905 L1600,1200 L0,1200Z" fill="#7a5036"/>'
    s += tufts(rng, 28, 40, 1560, 905, 960, "#4b6d3a")
    # firelight pool on ground
    s += '<ellipse cx="800" cy="1000" rx="620" ry="230" fill="url(#glow2)" style="mix-blend-mode:screen"/>'
    # big log seat with hat + kerchief
    s += '<ellipse cx="480" cy="1068" rx="220" ry="16" fill="#000" opacity=".35" filter="url(#b8)"/>'
    s += '<rect x="260" y="960" width="440" height="100" rx="48" fill="url(#log)"/>'
    s += '<path d="M290,975 C420,966 560,966 670,976" stroke="#c99466" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>'
    s += '<ellipse cx="676" cy="1010" rx="30" ry="48" fill="#b98557"/><ellipse cx="676" cy="1010" rx="19" ry="33" fill="none" stroke="#7a4a2a" stroke-width="3"/><ellipse cx="676" cy="1010" rx="9" ry="17" fill="none" stroke="#7a4a2a" stroke-width="3"/>'
    s += hat(420, 960, .72, -8)
    s += kerchief(585, 962, .5, 8)
    # small stump + bowl (the unknown companion)
    s += '<ellipse cx="1190" cy="1062" rx="110" ry="14" fill="#000" opacity=".35" filter="url(#b8)"/>'
    s += '<rect x="1110" y="980" width="150" height="82" rx="20" fill="url(#log)"/><ellipse cx="1185" cy="982" rx="75" ry="20" fill="#c99466"/><ellipse cx="1185" cy="982" rx="52" ry="12" fill="none" stroke="#8a5a32" stroke-width="3"/><ellipse cx="1185" cy="982" rx="28" ry="6" fill="none" stroke="#8a5a32" stroke-width="3"/>'
    s += '<ellipse cx="1000" cy="1100" rx="62" ry="16" fill="#000" opacity=".3" filter="url(#b4)"/><path d="M944,1070 C950,1120 1050,1120 1056,1070Z" fill="#c9ced6"/><ellipse cx="1000" cy="1070" rx="56" ry="13" fill="#8a909c"/><ellipse cx="1000" cy="1072" rx="46" ry="9" fill="#5b3d28"/><path d="M956,1078 C970,1106 1000,1108 1030,1104" stroke="#fff" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"/>'
    # prints: boot + paw, arriving from the left
    def boot(x, y, r):
        return f'<g transform="translate({x},{y}) rotate({r})" opacity=".35"><ellipse cx="0" cy="0" rx="17" ry="30" fill="#3a2418"/><ellipse cx="0" cy="38" rx="14" ry="12" fill="#3a2418"/></g>'
    def paw(x, y, r):
        return f'<g transform="translate({x},{y}) rotate({r})" opacity=".35" fill="#3a2418"><ellipse cx="0" cy="0" rx="12" ry="10"/><circle cx="-14" cy="-14" r="5"/><circle cx="-5" cy="-21" r="5"/><circle cx="6" cy="-21" r="5"/><circle cx="15" cy="-14" r="5"/></g>'
    s += boot(120, 1150, 62) + boot(205, 1108, 70) + boot(290, 1130, 60)
    s += paw(150, 1100, 64) + paw(230, 1072, 70) + paw(330, 1090, 62)
    # campfire
    s += '<ellipse cx="820" cy="965" rx="190" ry="24" fill="#2b1a10" opacity=".55" filter="url(#b8)"/>'
    s += '<g transform="translate(820,945)"><rect x="-105" y="-8" width="210" height="28" rx="14" fill="#4a2d1b" transform="rotate(14)"/><rect x="-105" y="-8" width="210" height="28" rx="14" fill="#5a3722" transform="rotate(-14)"/></g>'
    s += '<circle cx="820" cy="925" r="150" fill="url(#glow2)" style="mix-blend-mode:screen"/>'
    s += flame(790, 950, 1.25, "#f0601c", "#ffb53a") + flame(850, 955, 1.0, "#ee7a22", "#ffd86a") + flame(820, 958, .65, "#ffcf5a", "#fff4c2")
    for _ in range(26):
        x, y = 820 + rng.gauss(0, 44), 780 - rng.random() * 300
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rng.uniform(1.4, 3.2):.1f}" fill="#ffc15a" opacity="{rng.uniform(.4, .95):.2f}"/>'
    # warm rim light overlay on the nearby objects
    s += '<rect width="1600" height="1200" fill="url(#glow2)" opacity=".18" style="mix-blend-mode:screen" transform="translate(-120,0) scale(1.15,1)"/>'
    return svg(s, defs, grain=.3)

# ---------------------------------------------------------------- 3. THE ADVENTURE
def mountain(x, y, s=1.0):
    return f'''<g transform="translate({x},{y}) scale({s})" stroke="#4e321c" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" fill="#e6cf9a">
<path d="M-70,0 L-20,-86 L12,-44 L34,-70 L86,0Z"/><path d="M-20,-86 L-4,-30 M34,-70 L40,-20 M-44,-36 L-34,-8 M-30,-48 L-24,-24 M54,-30 L62,-8" fill="none" stroke-width="2.4"/></g>'''

def tree(x, y, s=1.0):
    return f'<g transform="translate({x},{y}) scale({s})" stroke="#4e321c" stroke-width="2.6" stroke-linecap="round"><path d="M0,0 v-14" fill="none"/><circle cx="0" cy="-26" r="14" fill="#cfd89a"/><path d="M-6,-28 q4,-6 8,0" fill="none" stroke-width="1.8"/></g>'

def scene_adventure():
    rng = random.Random(3)
    defs = '''<filter id="torn" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="5" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="woodgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.32" numOctaves="3" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 0.10  0 0 0 0 0.06  0 0 0 0 0.03  0 0 0 1.5 -0.5"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.30  0 0 0 0 0.12  0 0 0 1.1 -0.35"/></filter>
<radialGradient id="parch" cx="50%" cy="48%" r="70%"><stop offset="0" stop-color="#f4e6bd"/><stop offset=".75" stop-color="#ecd9a8"/><stop offset="1" stop-color="#c99f66"/></radialGradient>
<linearGradient id="foldv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient>
<linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d27a"/><stop offset=".5" stop-color="#b98a2f"/><stop offset="1" stop-color="#7a5418"/></linearGradient>'''
    s = '<rect width="1600" height="1200" fill="#3d2b20"/>'
    for i in range(8):
        y = i * 150
        tone = ["#463226", "#3b2a1f", "#4a3629", "#3f2d22"][i % 4]
        s += f'<rect x="0" y="{y}" width="1600" height="150" fill="{tone}"/><rect x="0" y="{y}" width="1600" height="4" fill="#1e140d"/>'
    s += '<rect width="1600" height="1200" filter="url(#woodgrain)" opacity=".75"/>'
    for i in range(8):
        for x in (60, 1540):
            s += f'<circle cx="{x}" cy="{i*150+75}" r="6" fill="#1e140d" opacity=".6"/>'
    # map
    mx, my = 230, 150
    s += f'<g transform="rotate(-2 800 600)">'
    s += f'<rect x="{mx+14}" y="{my+22}" width="1140" height="880" fill="#000" opacity=".5" filter="url(#b20)"/>'
    s += f'<g filter="url(#torn)"><rect x="{mx}" y="{my}" width="1140" height="880" fill="url(#parch)"/></g>'
    s += f'<g transform="translate({mx},{my})">'
    s += '<rect width="1140" height="880" filter="url(#paper)" opacity=".5"/>'
    s += '<rect x="565" y="0" width="20" height="880" fill="url(#foldv)"/><rect x="0" y="425" width="1140" height="3" fill="#000" opacity=".1"/><rect x="0" y="428" width="1140" height="3" fill="#fff" opacity=".25"/>'
    s += '<rect x="30" y="30" width="1080" height="820" rx="10" fill="none" stroke="#6a4727" stroke-width="3" opacity=".55"/><rect x="42" y="42" width="1056" height="796" rx="6" fill="none" stroke="#6a4727" stroke-width="1.5" opacity=".45"/>'
    # river
    s += '<path d="M560,44 C520,150 650,210 604,320 S470,470 560,570 S760,650 800,760 L830,838" fill="none" stroke="#4d7ba8" stroke-width="7" stroke-linecap="round" opacity=".85"/>'
    s += '<path d="M572,44 C532,150 662,210 616,320 S482,470 572,570 S772,650 812,760 L842,838" fill="none" stroke="#4d7ba8" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>'
    # mountains, forest, hills, village
    s += mountain(140, 200, 1.0) + mountain(250, 160, .8) + mountain(330, 215, 1.05)
    placed = []
    tries = 0
    while len(placed) < 22 and tries < 4000:
        tries += 1
        tx, ty = rng.uniform(790, 1030), rng.uniform(110, 250)
        if all((tx - px_) ** 2 + (ty - py_) ** 2 > 44 ** 2 for px_, py_ in placed):
            placed.append((tx, ty))
    for tx, ty in sorted(placed, key=lambda p: p[1]):
        s += tree(tx, ty, rng.uniform(.8, 1.1))
    for hx, hy in [(120, 520), (210, 500), (300, 530), (170, 590)]:
        s += f'<path d="M{hx-52},{hy} q52,-64 104,0" fill="#e6cf9a" stroke="#4e321c" stroke-width="3" stroke-linecap="round"/><path d="M{hx-20},{hy-10} q12,-12 28,-6" fill="none" stroke="#4e321c" stroke-width="2"/>'
    for vx, vy in [(150, 730), (200, 760), (118, 780), (250, 725)]:
        s += f'<g stroke="#4e321c" stroke-width="2.8" stroke-linejoin="round" fill="#f1dfae"><rect x="{vx-16}" y="{vy-16}" width="32" height="24"/><path d="M{vx-22},{vy-16} L{vx},{vy-36} L{vx+22},{vy-16}Z" fill="#c4733d"/></g>'
    # unexplored regions
    for bx, by, r in [(430, 330, 105), (770, 690, 120), (940, 420, 70)]:
        s += f'<path d="{smooth([(bx-r,by),(bx-r*.6,by-r*.8),(bx+r*.3,by-r*.95),(bx+r*.9,by-r*.3),(bx+r*.8,by+r*.6),(bx,by+r*.95),(bx-r*.8,by+r*.5),(bx-r,by)])}" fill="#f3e4b8" fill-opacity=".55" stroke="#6a4727" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round"/>'
        s += f'<text x="{bx}" y="{by+r*.38:.0f}" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-size="{r*1.05:.0f}" fill="#6a4727" opacity=".55">?</text>'
    # route
    route = [(250, 740), (340, 690), (440, 706), (520, 650), (610, 612), (720, 540), (810, 482), (900, 520), (980, 440), (1010, 330)]
    s += f'<path d="{smooth(route)}" fill="none" stroke="#c3342c" stroke-width="6" stroke-dasharray="16 14" stroke-linecap="round"/>'
    s += '<circle cx="250" cy="742" r="12" fill="#c3342c"/><circle cx="250" cy="742" r="5" fill="#f3e4b8"/>'
    s += '<path d="M984,304 L1036,356 M1036,304 L984,356" stroke="#c3342c" stroke-width="13" stroke-linecap="round"/>'
    # compass rose
    cx, cy = 980, 735
    s += f'<g transform="translate({cx},{cy})" stroke="#4e321c" stroke-linejoin="round"><circle r="78" fill="none" stroke-width="3"/><circle r="64" fill="none" stroke-width="1.5"/><path d="M0,-92 L14,-14 L92,0 L14,14 L0,92 L-14,14 L-92,0 L-14,-14Z" fill="#e6cf9a" stroke-width="3"/><path d="M0,-92 L14,-14 L-14,-14Z" fill="#c3342c" stroke-width="2"/><path d="M0,0 L50,-50 M0,0 L-50,-50 M0,0 L50,50 M0,0 L-50,50" stroke-width="1.6" fill="none"/></g>'
    s += '</g>'  # end map-local
    s += '</g>'
    # tape on corners
    s += '<g transform="rotate(-38 250 190)"><rect x="196" y="168" width="110" height="38" fill="#f4e7b4" opacity=".85" filter="url(#sh)"/></g>'
    s += '<g transform="rotate(34 1350 190)"><rect x="1296" y="170" width="110" height="38" fill="#f4e7b4" opacity=".85" filter="url(#sh)"/></g>'
    # props: kerchief weight (top right), magnifier, pencil
    s += '<g filter="url(#sh)">' + kerchief(1425, 215, .95, 28) + '</g>'
    s += '<g filter="url(#sh)" transform="translate(190,950) rotate(-28)"><rect x="-8" y="60" width="16" height="130" rx="8" fill="#5a3722"/><circle r="84" fill="none" stroke="url(#brass)" stroke-width="16"/><circle r="76" fill="#cfe9f5" opacity=".32"/><path d="M-50,-36 q22,-30 60,-26" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".7"/></g>'
    s += '<g filter="url(#sh)" transform="translate(700,1100) rotate(-5)"><rect x="0" y="0" width="520" height="24" rx="4" fill="#d6a33a"/><rect x="0" y="0" width="520" height="7" fill="#f1cd6a"/><polygon points="520,0 580,12 520,24" fill="#e9c9a0"/><polygon points="562,6 580,12 562,18" fill="#2b2b2b"/><rect x="-30" y="0" width="30" height="24" rx="4" fill="#c3342c"/></g>'
    return svg(s, defs, grain=.3)

# ---------------------------------------------------------------- 4. THE QUIRKS
def scene_quirks():
    rng = random.Random(4)
    defs = '''<filter id="vgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.30 0.012" numOctaves="3" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0.06  0 0 0 0 0.10  0 0 0 0 0.18  0 0 0 1.5 -0.5"/></filter>
<filter id="woodgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.3" numOctaves="3" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 0.10  0 0 0 0 0.06  0 0 0 0 0.03  0 0 0 1.5 -0.45"/></filter>
<radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd88a" stop-opacity=".9"/><stop offset=".4" stop-color="#ffb347" stop-opacity=".35"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset="1" stop-color="#ffbe55"/></linearGradient>
<linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d27a"/><stop offset=".5" stop-color="#b98a2f"/><stop offset="1" stop-color="#7a5418"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98558"/><stop offset="1" stop-color="#7a4a2a"/></linearGradient>
<linearGradient id="jar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9eef7" stop-opacity=".55"/><stop offset=".3" stop-color="#ffffff" stop-opacity=".18"/><stop offset="1" stop-color="#a9cbe0" stop-opacity=".5"/></linearGradient>'''
    s = ''
    tones = ["#4f78a6", "#46709d", "#5280ae", "#4a73a1", "#4c76a3", "#5580ad", "#47719e", "#4f78a6"]
    for i, t in enumerate(tones):
        s += f'<rect x="{i*200}" y="0" width="200" height="1200" fill="{t}"/><rect x="{i*200}" y="0" width="4" height="1200" fill="#1e3550" opacity=".7"/>'
        for ny in (60, 1140):
            s += f'<circle cx="{i*200+100}" cy="{ny}" r="5" fill="#1e3550" opacity=".5"/>'
    s += '<rect width="1600" height="1200" filter="url(#vgrain)" opacity=".7"/>'
    # peg rail
    s += '<g filter="url(#sh)"><rect x="150" y="320" width="1300" height="80" rx="10" fill="url(#wood)"/><rect x="150" y="320" width="1300" height="10" fill="#d9a979" opacity=".7"/></g><rect x="150" y="320" width="1300" height="80" filter="url(#woodgrain)" opacity=".6"/>'
    pegs = [330, 620, 900, 1170]
    for x in pegs:
        s += f'<g filter="url(#sh)"><rect x="{x-12}" y="360" width="24" height="52" rx="10" fill="#8a5a32"/><circle cx="{x}" cy="412" r="18" fill="#b78254"/><circle cx="{x-5}" cy="407" r="6" fill="#d9a979" opacity=".8"/></g>'
    # items on pegs
    # 1. hat hanging slightly off-kilter (front view)
    s += '<g transform="translate(320,478) rotate(11)" filter="url(#sh)">'
    s += '<path d="M-160,92 C-130,138 130,138 160,92 C130,60 -130,60 -160,92Z" fill="#7d4d2a"/>'
    s += '<path d="M-70,86 C-86,10 -66,-30 -30,-30 Q0,-12 30,-30 C66,-30 86,10 70,86 C40,108 -40,108 -70,86Z" fill="#955f36"/>'
    s += '<path d="M-66,48 C-30,66 30,66 66,48 L70,86 C40,108 -40,108 -70,86Z" fill="#4a2d1b"/>'
    s += '<path d="M-60,-6 C-56,-24 -44,-30 -32,-28" stroke="#c28a5a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>'
    s += '<path d="M-164,92 C-132,148 132,148 164,92" fill="none" stroke="#a97444" stroke-width="4" opacity=".7"/></g>'
    # spider on a thread beside the hat
    s += '<path d="M470,400 L470,640" stroke="#e7eef5" stroke-width="2" opacity=".75"/>'
    s += '<g transform="translate(470,660)" stroke="#12161d" stroke-width="3" stroke-linecap="round" fill="none"><path d="M-8,-4 q-18,-14 -26,0 q-6,10 -4,22 M-8,0 q-22,-2 -30,12 q-4,8 -6,18 M8,-4 q18,-14 26,0 q6,10 4,22 M8,0 q22,-2 30,12 q4,8 6,18"/><circle cx="0" cy="2" r="13" fill="#12161d"/><circle cx="0" cy="-12" r="8" fill="#12161d"/><circle cx="-3" cy="-14" r="2" fill="#fff" stroke="none"/><circle cx="3" cy="-14" r="2" fill="#fff" stroke="none"/></g>'
    # 2. kerchief
    s += '<g filter="url(#sh)">' + kerchief(620, 392, 1.5, 0) + '</g>'
    # 3. lantern
    s += '<circle cx="900" cy="560" r="330" fill="url(#lanternGlow)" style="mix-blend-mode:screen"/>'
    s += '<g filter="url(#sh)"><path d="M900,414 C860,380 850,330 900,330" stroke="url(#brass)" stroke-width="7" fill="none"/>'
    s += '<path d="M860,470 q40,-36 80,0 l8,24 h-96z" fill="url(#brass)"/><rect x="852" y="494" width="96" height="190" rx="8" fill="url(#glass)" stroke="#8a6420" stroke-width="5"/>'
    s += '<path d="M852,494 h96 M900,494 v190" stroke="#8a6420" stroke-width="4"/><ellipse cx="900" cy="640" rx="14" ry="28" fill="#fff6d6"/><path d="M846,684 h108 l-10,26 h-88z" fill="url(#brass)"/><path d="M868,500 v160" stroke="#fff" stroke-width="6" opacity=".5" stroke-linecap="round"/></g>'
    # 4. brass bell
    s += '<g filter="url(#sh)"><path d="M1170,430 v34" stroke="#5a3722" stroke-width="6"/><path d="M1110,590 C1110,520 1130,478 1170,478 C1210,478 1230,520 1230,590 C1245,596 1250,606 1250,616 H1090 C1090,606 1095,596 1110,590Z" fill="url(#brass)"/><circle cx="1170" cy="632" r="14" fill="#7a5418"/><path d="M1128,500 C1118,530 1120,560 1124,580" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".45"/></g>'
    # shelf
    s += '<g filter="url(#sh)"><rect x="230" y="880" width="1140" height="36" rx="6" fill="url(#wood)"/><rect x="230" y="880" width="1140" height="7" fill="#d9a979" opacity=".7"/><path d="M300,916 v70 l70,-70z M1230,916 l70,70 v-70z" fill="#6a4125"/></g><rect x="230" y="880" width="1140" height="36" filter="url(#woodgrain)" opacity=".5"/>'
    # jar of buttons
    s += '<g filter="url(#sh)"><rect x="330" y="690" width="170" height="190" rx="26" fill="#bfe0ee" fill-opacity=".35" stroke="#e8f4fa" stroke-width="4"/>'
    cols = ["#d8372f", "#f2c14e", "#2f5d9c", "#8fc46a", "#f6ecd6", "#e07a5f", "#7a4a2a"]
    for _ in range(34):
        bx, by = rng.uniform(350, 480), rng.uniform(750, 868)
        s += f'<circle cx="{bx:.0f}" cy="{by:.0f}" r="{rng.uniform(9, 14):.0f}" fill="{rng.choice(cols)}"/><circle cx="{bx-3:.0f}" cy="{by-3:.0f}" r="2" fill="#000" opacity=".4"/><circle cx="{bx+3:.0f}" cy="{by+3:.0f}" r="2" fill="#000" opacity=".4"/>'
    s += '<rect x="330" y="690" width="170" height="190" rx="26" fill="url(#jar)"/><rect x="342" y="660" width="146" height="34" rx="10" fill="#c9ced6"/><rect x="342" y="660" width="146" height="10" rx="5" fill="#fff" opacity=".5"/></g>'
    # stacked books
    s += '<g filter="url(#sh)"><rect x="580" y="828" width="220" height="52" rx="5" fill="#2f5d9c"/><rect x="590" y="778" width="200" height="50" rx="5" fill="#c3342c" transform="rotate(-3 690 803)"/><rect x="600" y="730" width="180" height="48" rx="5" fill="#e0b341" transform="rotate(4 690 754)"/>'
    s += '<path d="M590,846 h200 M606,800 h170 M614,752 h150" stroke="#f6ecd6" stroke-width="4" opacity=".7"/></g>'
    # tin mug with steam
    s += '<g filter="url(#sh)"><path d="M860,780 h110 l-8,100 h-94z" fill="#cdd2da"/><path d="M970,800 c40,-4 40,60 0,56" stroke="#cdd2da" stroke-width="12" fill="none"/><ellipse cx="915" cy="780" rx="55" ry="10" fill="#6a4125"/><path d="M880,790 v80" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/></g>'
    s += '<path d="M900,750 c-16,-24 16,-34 0,-60 M930,752 c-16,-24 16,-34 0,-60" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>'
    # round cactus (echo of reference bushes)
    s += '<g filter="url(#sh)"><path d="M1050,880 l12,-60 h86 l12,60z" fill="#c4733d"/><rect x="1046" y="812" width="128" height="22" rx="6" fill="#d98a52"/><ellipse cx="1110" cy="772" rx="42" ry="46" fill="#4f9446"/><path d="M1082,740 v62 M1110,730 v74 M1138,740 v62" stroke="#3c7a35" stroke-width="4"/><circle cx="1110" cy="724" r="6" fill="#f08aa0"/></g>'
    # striped sock draped over shelf
    sock = "M1256,880 L1256,1010 C1256,1056 1300,1066 1352,1062 C1392,1058 1396,1016 1366,1006 L1340,998 L1340,880Z"
    s += f'<defs><clipPath id="sockclip"><path d="{sock}"/></clipPath></defs><g filter="url(#sh)"><path d="{sock}" fill="#f6ecd6"/></g>'
    s += '<g clip-path="url(#sockclip)">'
    for i, y in enumerate((900, 936, 972)):
        s += f'<rect x="1250" y="{y}" width="150" height="16" fill="{"#d8372f" if i % 2 == 0 else "#2f5d9c"}"/>'
    s += '<path d="M1340,1004 C1360,1000 1400,1010 1400,1040 L1400,1080 L1300,1080 C1290,1050 1320,1030 1340,1004Z" fill="#d8372f"/><path d="M1256,1010 C1256,1056 1300,1066 1352,1062 L1352,1090 L1250,1090Z" fill="#2f5d9c" opacity=".0"/>'
    s += '<path d="M1262,890 V1010" stroke="#fff" stroke-width="6" opacity=".5"/></g>'
    s += f'<path d="{sock}" fill="none" stroke="#b9a98a" stroke-width="2.5"/>'
    s += '<path d="M1256,880 h84" stroke="#8a5a32" stroke-width="4"/>'
    # lantern light on the wall + soft floor shade
    s += '<rect width="1600" height="1200" fill="url(#lanternGlow)" opacity=".2" style="mix-blend-mode:screen" transform="translate(-100,-60) scale(1.15,1.2)"/>'
    return svg(s, defs, grain=.3)

# ---------------------------------------------------------------- 5. THE RIVAL
def scene_rival():
    rng = random.Random(5)
    defs = '''<linearGradient id="sky5" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="#47a0e6"/><stop offset=".38" stop-color="#8bc8ee"/><stop offset=".62" stop-color="#6b7a98"/><stop offset="1" stop-color="#2d2f45"/></linearGradient>
<linearGradient id="stormland" x1="0" y1="0" x2="1" y2="0"><stop offset=".3" stop-color="#1b1830" stop-opacity="0"/><stop offset="1" stop-color="#1b1830" stop-opacity=".62"/></linearGradient>
<linearGradient id="dust" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c79a63" stop-opacity=".95"/><stop offset=".6" stop-color="#8a6a52" stop-opacity=".7"/><stop offset="1" stop-color="#4a4358" stop-opacity="0"/></linearGradient>'''
    s = f'<rect width="{W}" height="820" fill="url(#sky5)"/>'
    s += cloud(250, 260, 1.15, "#ffffff", "#d3e5f4", .95) + cloud(640, 170, .8, "#f1f6fb", "#c6d8ea", .9)
    # storm clouds
    for cx, cy, rx, ry, col, op in [(1150, 200, 330, 120, "#2a2b40", .95), (1350, 330, 330, 140, "#232437", .95), (1000, 380, 260, 100, "#3a3d57", .9), (1500, 130, 300, 120, "#1f2032", .98), (1230, 460, 340, 110, "#34364f", .9)]:
        s += f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{col}" opacity="{op}" filter="url(#b20)"/>'
    s += landscape(rng, ("#a9cf8f", "#82b863", "#5a9a4a"), ("#d9ab70", "#a97b44"), "#3b7336")
    s += '<rect x="0" y="0" width="1600" height="1200" fill="url(#stormland)"/>'
    s += '<ellipse cx="1060" cy="470" rx="150" ry="190" fill="#fff6c9" opacity=".22" filter="url(#b40)"/>'
    s += '<path d="M1090,300 L1028,466 L1084,466 L1008,650 L1142,428 L1080,428 L1132,300Z" fill="#fff6c9" opacity=".9" filter="url(#b4)"/>'
    s += '<path d="M1090,300 L1028,466 L1084,466 L1008,650 L1142,428 L1080,428 L1132,300Z" fill="#fffdf0"/>'
    # dust wall
    for cx, cy, rx, ry in [(1180, 740, 300, 80), (1400, 700, 260, 110), (1000, 755, 220, 60), (1550, 740, 200, 150), (1250, 690, 220, 120)]:
        s += f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#dust)" filter="url(#b20)"/>'
    # the stranger
    fx, fy = 1005, 772
    s += f'<g transform="translate({fx},{fy})" fill="#14121f"><ellipse cx="2" cy="2" rx="36" ry="5" opacity=".5"/>'
    s += '<g transform="scale(1.12)"><rect x="-13" y="-24" width="10" height="26" rx="2"/><rect x="3" y="-24" width="10" height="26" rx="2"/>'
    s += '<path d="M-15,-98 C-20,-80 -24,-54 -27,-20 L27,-20 C24,-54 20,-80 15,-98 C8,-103 -8,-103 -15,-98Z"/><ellipse cx="0" cy="-112" rx="10" ry="13"/>'
    s += '<rect x="-12" y="-150" width="24" height="34" rx="2"/><rect x="-26" y="-122" width="52" height="6" rx="3"/>'
    s += '<path d="M24,-64 L38,0" stroke="#14121f" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="24" cy="-66" r="4.5"/></g></g>'
    s += '<path d="M1005,772 L1190,846" stroke="#14121f" stroke-width="22" opacity=".18" filter="url(#b8)"/>'
    s += bush(150, 975, 1.0, "#3f8a3b", "#5da050")
    # tumbleweed + wind-blown kerchief
    s += '<g transform="translate(1290,1015)"><ellipse cx="6" cy="62" rx="80" ry="12" fill="#000" opacity=".25" filter="url(#b8)"/><circle r="58" fill="none" stroke="#8a6a3c" stroke-width="3"/>'
    for _ in range(18):
        a = rng.uniform(0, math.pi * 2); b = a + rng.uniform(1.2, 2.6); r = 56
        s += f'<path d="M{r*math.cos(a):.0f},{r*math.sin(a):.0f} Q{rng.uniform(-30,30):.0f},{rng.uniform(-30,30):.0f} {r*math.cos(b):.0f},{r*math.sin(b):.0f}" stroke="#8a6a3c" stroke-width="2.6" fill="none"/>'
    s += '</g>'
    s += '<g transform="translate(470,960) rotate(-14)" filter="url(#sh)">' + kerchief(0, 0, .8, 0) + '</g>'
    s += '<path d="M600,900 q60,-8 110,10 M590,930 q70,2 130,22 M610,956 q50,6 90,20" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".55"/>'
    for _ in range(40):
        x, y = rng.uniform(900, 1600), rng.uniform(780, 1120)
        s += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rng.uniform(8, 30):.0f}" ry="1.6" fill="#e3c597" opacity="{rng.uniform(.18, .5):.2f}"/>'
    return svg(s, defs, grain=.3)

# ---------------------------------------------------------------- 6. THE MEMORY
def lantern(x, y, s, gid, blur=0):
    f = f' filter="url(#b{blur})"' if blur else ""
    return f'''<g transform="translate({x:.0f},{y:.0f}) scale({s:.2f})"{f}>
<circle r="92" fill="url(#lg_{gid})" opacity=".55" style="mix-blend-mode:screen"/>
<path d="M-24,-30 C-34,-6 -30,28 -18,40 H18 C30,28 34,-6 24,-30 C12,-38 -12,-38 -24,-30Z" fill="url(#lb_{gid})"/>
<path d="M-24,-30 H24" stroke="#5a3722" stroke-width="3"/><path d="M-18,40 H18" stroke="#5a3722" stroke-width="3"/>
<path d="M-8,-32 C-12,-6 -10,24 -6,40 M8,-32 C12,-6 10,24 6,40" stroke="#b8541d" stroke-width="1.4" fill="none" opacity=".5"/>
<path d="M0,40 v22 M-4,62 h8" stroke="#f3c876" stroke-width="2.2" opacity=".8"/></g>'''

def scene_memory():
    rng = random.Random(6)
    pal = {"a": ("#ffe9a8", "#ffb347", "#e0732a"), "b": ("#fff3c8", "#ffc766", "#e8892f"), "r": ("#ffd0b8", "#ff6a4d", "#c3342c")}
    defs = '''<linearGradient id="sky6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14183f"/><stop offset=".45" stop-color="#4c3a7d"/><stop offset=".8" stop-color="#d9788a"/><stop offset="1" stop-color="#ffb37a"/></linearGradient>
<radialGradient id="moon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4d8" stop-opacity=".6"/><stop offset="1" stop-color="#fff4d8" stop-opacity="0"/></radialGradient>'''
    for k, (c0, c1, c2) in pal.items():
        defs += f'<radialGradient id="lb_{k}" cx="50%" cy="55%" r="65%"><stop offset="0" stop-color="{c0}"/><stop offset=".55" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></radialGradient>'
        defs += f'<radialGradient id="lg_{k}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{c1}" stop-opacity=".9"/><stop offset="1" stop-color="{c1}" stop-opacity="0"/></radialGradient>'
    s = f'<rect width="{W}" height="900" fill="url(#sky6)"/>'
    for _ in range(90):
        x, y = rng.uniform(0, W), rng.uniform(10, 420)
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rng.uniform(.7, 2):.1f}" fill="#fff" opacity="{rng.uniform(.3, .85) * (1 - y/520):.2f}"/>'
    s += '<circle cx="1260" cy="190" r="170" fill="url(#moon)"/><circle cx="1260" cy="190" r="48" fill="#fff4d8"/><circle cx="1278" cy="178" r="48" fill="#4c3a7d" opacity=".0"/>'
    s += cloud(300, 420, .9, "#e9a7b4", "#9c5f8c", .55) + cloud(1050, 520, .7, "#f0b3a8", "#a2638c", .5)
    # distant train on the far ridge
    s += '<g fill="#2a1f45">'
    s += '<rect x="1000" y="748" width="60" height="30" rx="3"/><rect x="1000" y="730" width="10" height="20"/><rect x="1028" y="718" width="8" height="30"/><rect x="1036" y="738" width="24" height="12"/>'
    for i in range(5):
        s += f'<rect x="{1070+i*44}" y="752" width="38" height="26" rx="3"/>'
    s += '</g>'
    for i in range(5):
        s += f'<rect x="{1078+i*44}" y="758" width="6" height="7" fill="#ffd27a" opacity=".9"/><rect x="{1092+i*44}" y="758" width="6" height="7" fill="#ffd27a" opacity=".9"/>'
    for i in range(7):
        s += f'<circle cx="{1020 - i*34}" cy="{700 - i*14}" r="{14 + i*5}" fill="#f1cfd6" opacity="{.5 - i*.06:.2f}" filter="url(#b4)"/>'
    s += hill([(-50, 790), (300, 745), (650, 776), (1000, 772), (1350, 774), (1700, 742)], "#6a4b83")
    s += hill([(-50, 850), (360, 800), (760, 846), (1200, 812), (1700, 852)], "#3f3466")
    s += hill([(-50, 940), (400, 900), (860, 944), (1250, 910), (1700, 950)], "#262250")
    s += hill([(-50, 1040), (300, 1000), (700, 1048), (1200, 1010), (1700, 1050)], "#171538")
    # lanterns, far to near
    layers = [(34, .22, .42, 0, 150, 760), (26, .5, .8, 2, 120, 820), (14, .9, 1.35, 0, 80, 800), (6, 1.5, 2.2, 4, 60, 700)]
    keys = ["a", "b"]
    for n, s0, s1, blur, ytop, ybot in layers:
        for _ in range(n):
            x = rng.uniform(40, 1560); y = rng.uniform(ytop, ybot)
            if 940 < x < 1480 and 640 < y < 830:  # keep the little train readable
                continue
            s += lantern(x, y, rng.uniform(s0, s1), rng.choice(keys), blur)
    s += lantern(760, 380, 1.45, "r", 0)  # the one red lantern (the kerchief's colour)
    # warm haze + film tint
    s += f'<rect y="560" width="{W}" height="360" fill="#ffb37a" opacity=".12" filter="url(#b40)"/>'
    s += f'<rect width="{W}" height="{H}" fill="#ffb070" opacity=".07" style="mix-blend-mode:soft-light"/>'
    return svg(s, defs, grain=.34)

# ---------------------------------------------------------------- render
SCENES = [("1-the-setting", scene_setting), ("2-the-companion", scene_companion), ("3-the-adventure", scene_adventure),
          ("4-the-quirks", scene_quirks), ("5-the-rival", scene_rival), ("6-the-memory", scene_memory)]

async def main():
    os.makedirs(f"{OUT}/svg", exist_ok=True)
    os.makedirs(f"{OUT}/png", exist_ok=True)
    os.makedirs(f"{OUT}/jpg", exist_ok=True)
    only = set(sys.argv[2:])
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1.2)
        for name, fn in SCENES:
            if only and name.split("-")[0] not in only:
                continue
            svg_s = fn()
            open(f"{OUT}/svg/{name}.svg", "w").write(svg_s)
            await pg.set_content(f'<html><body style="margin:0;background:#15191e">{svg_s}</body></html>')
            await pg.wait_for_timeout(300)
            await pg.screenshot(path=f"{OUT}/png/{name}.png", clip={"x": 0, "y": 0, "width": W, "height": H}, type="png")
            await pg.screenshot(path=f"{OUT}/jpg/{name}.jpg", clip={"x": 0, "y": 0, "width": W, "height": H}, type="jpeg", quality=92)
            print("rendered", name)
        await b.close()

asyncio.run(main())
