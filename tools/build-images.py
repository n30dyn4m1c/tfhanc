#!/usr/bin/env python3
"""Build the web images in assets/img/ from full-size sources.

    python3 tools/build-images.py SOURCE_DIR

SOURCE_DIR holds the master files named below (PNG or JPEG, any size). Each
scene is written as WebP at several widths, for use in `srcset`. To replace
a generated scene with a real photograph, put the photograph in SOURCE_DIR
under the same name and run this again. The widths and names stay the same,
so index.html needs no change. Requires Pillow.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "scenes"

# name: (widths, quality)
SCENES = {
    "hero":      ((960, 1600, 2048), 72),
    "mountains": ((960, 1600, 2048), 70),
    "friday":    ((720, 1200, 1536), 72),
    "scroll":    ((960, 1600, 2048), 70),
    "earth":     ((960, 1600, 2048), 72),
    "worship":   ((960, 1600, 2048), 70),
    "dawn":      ((960, 1600, 2048), 70),
    "word":      ((960, 1600, 2048), 72),
}


def find(src: Path, name: str) -> Path | None:
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = src / (name + ext)
        if p.exists():
            return p
    return None


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (widths, q) in SCENES.items():
        path = find(src, name)
        if not path:
            print(f"skip {name}: no source")
            continue
        im = Image.open(path).convert("RGB")
        for w in widths:
            w = min(w, im.width)
            h = round(im.height * w / im.width)
            out = OUT / f"{name}-{w}.webp"
            im.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=q, method=6)
            print(f"{out.relative_to(ROOT)}  {w}x{h}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
