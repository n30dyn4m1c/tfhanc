# Generates the duotone placeholder photographs in assets/img/placeholders/.
import os
OUT = "assets/img/placeholders"
PLUM, PLUM2, EMBER, GOLD, SAND = "#2a1934", "#4a2b57", "#b0441c", "#e2b866", "#f4ece2"

def arch(cx, base, w, top, sw, op):
    r = w / 2
    return (f'<path d="M{cx-r} {base} V{top+r} A{r} {r} 0 0 1 {cx+r} {top+r} V{base}" '
            f'fill="none" stroke="{GOLD}" stroke-width="{sw}" stroke-opacity="{op}"/>')

def figure(cx, base, s, op):
    # a quiet head-and-shoulders form, no likeness
    return (f'<g fill="{SAND}" fill-opacity="{op}">'
            f'<circle cx="{cx}" cy="{base-2.35*s}" r="{0.42*s}"/>'
            f'<path d="M{cx-1.05*s} {base} C{cx-1.05*s} {base-1.25*s} {cx-0.6*s} {base-1.75*s} {cx} {base-1.75*s} '
            f'C{cx+0.6*s} {base-1.75*s} {cx+1.05*s} {base-1.25*s} {cx+1.05*s} {base} Z"/></g>')

def svg(name, w, h, label, body, glow=(0.72, 0.9)):
    gx, gy = glow
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{PLUM}"/><stop offset=".62" stop-color="{PLUM2}"/><stop offset="1" stop-color="{EMBER}"/></linearGradient>
<radialGradient id="l" cx="{gx}" cy="{gy}" r=".7"><stop offset="0" stop-color="{GOLD}" stop-opacity=".55"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="{w}" height="{h}" fill="url(#g)"/><rect width="{w}" height="{h}" fill="url(#l)"/>
{body}
<text x="{0.05*w:.0f}" y="{0.05*h + min(w,h)*0.032:.0f}" font-family="system-ui, sans-serif" font-size="{max(14, round(min(w,h)*0.032))}" fill="{SAND}" fill-opacity=".82">Photograph to come · {label}</text>
</svg>
'''
    with open(os.path.join(OUT, name), "w") as f:
        f.write(s)

def crowd(w, h, n, base, s, op):
    return "".join(figure(w*(i+0.5)/n + (s*0.3 if i % 2 else -s*0.2), base + (s*0.25 if i % 2 else 0), s, op) for i in range(n))

svg("hero.svg", 1200, 1400, "Sunday Celebration",
    arch(600, 1400, 760, 170, 3, .55) + arch(600, 1400, 620, 290, 1.5, .35)
    + crowd(1200, 1400, 7, 1400, 120, .16) + crowd(1200, 1400, 6, 1330, 90, .10), (0.5, 0.35))
svg("prayer-night.svg", 1600, 720, "Breakthrough Prayer Night",
    arch(800, 720, 520, 60, 2.5, .5) + crowd(1600, 720, 11, 720, 95, .14), (0.5, 0.2))
svg("venue.svg", 1200, 900, "Taurama Aquatic Centre Lounge",
    f'<g stroke="{SAND}" stroke-opacity=".22" stroke-width="2" fill="none">'
    + "".join(f'<path d="M0 {560+i*38} Q300 {540+i*38} 600 {560+i*38} T1200 {560+i*38}"/>' for i in range(8)) + '</g>'
    + arch(600, 560, 300, 150, 3, .6), (0.5, 0.55))
for key, lab in (("ben", "Pastor Ben Minok"), ("jonathan", "Dr Jonathan David")):
    svg(f"portrait-{key}.svg", 800, 1000, lab,
        arch(400, 1000, 560, 120, 2.5, .5) + figure(400, 1000, 250, .22), (0.5, 0.3))
svg("sermon.svg", 1280, 720, "Latest message",
    arch(640, 720, 420, 90, 2.5, .5) + figure(640, 720, 150, .2), (0.5, 0.3))
