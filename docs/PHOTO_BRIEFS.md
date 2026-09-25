# Photo briefs

**Direction: "Heaven's authority touching earth."** Deep purple sky, gold light
breaking through, and the land of Papua New Guinea below. See
`docs/DESIGN_SYSTEM.md`.

## What is on the site now

The scenes in `assets/img/scenes/` are **generated images** (Higgsfield, Z Image
model). They are not photographs of the house, its people or its venue. They
hold the atmosphere until real photographs exist. Two of them show people or
places that could be mistaken for the house:

- `worship-*` shows a generated crowd with raised hands. It is **not the congregation**.
  Replace it first.
- `friday-*` shows a generated coastline, not a specific Port Moresby location.

If no real worship photograph has arrived by launch, swap `worship` for a scene
without people (see "If content is late" in `docs/LAUNCH_PLAN.md`).

The leaders' portraits are deliberately **not** generated. They show an engraved
monogram until real, consented photographs are supplied.

| File | Used in | Replace with |
|---|---|---|
| `hero` | Hero (full screen, 16:9) | Eagle or sky over PNG ridges at dawn. Keep the left half calm for the title. |
| `mountains` | "A house of prayer" | PNG highlands or the Owen Stanley range at first light |
| `friday` | Friday Night Prayer (3:4) | The Lounge filling on a Friday night, or Port Moresby at dusk |
| `earth` | The Nations | Keep (a globe is a globe), or a licensed NASA/ESA Earth image |
| `scroll` | Prophetic Word background | Keep, or a real altar and Scripture detail from the house |
| `word` | Messages, featured poster | The real thumbnail of the featured message |
| `worship` | Conferences, message card | **Real** worship at a TFH ANC conference, with consent |
| `dawn` | Begin here | Keep, or a real sunrise over Port Moresby |

## Shared direction for real photographs

- **Palette.** Purple dusk and night, gold light. Grade toward plum shadows and
  warm highlights. Avoid blue-white LED light and green casts.
- **People.** Real members of the house, with consent. Faces lit by warm light.
  Photograph children only with a parent's permission, and do not caption them by name.
- **Place, honestly.** Port Moresby as it is. No tourist postcards or staged
  "tribal" imagery.
- **Technical.** Deliver at least 2048 px on the long edge, sRGB. Keep key
  subjects out of the outer 10%, because scenes crop with `object-fit: cover`.

## Replacing a scene

1. Put the new master in a folder under its scene name, for example `masters/worship.jpg`.
2. Run `python3 tools/build-images.py masters`. It writes every width as WebP to
   `assets/img/scenes/` under the same file names, so `index.html` needs no change.
3. If the new picture's focal point differs, adjust that section's
   `object-position` in `assets/css/style.css`.

## Portraits (Leadership)

- **Pastor Ben Minok.** 800 × 1000 (4:5), waist-up, in warm light against a dark
  or purple background. Dignified and direct, not a pulpit shot.
- **Dr Jonathan David.** Request an official portrait from All Nations Sanctuary,
  Muar, with written permission to use it.

Save each as `assets/img/photos/ben-minok.webp` or `jonathan-david.webp`, and
follow the `PHOTO SLOT` comment in `index.html`: add the `<img>` inside
`.portrait`, remove `.portrait__mono`, and remove `aria-hidden="true"` from the
portrait so the `alt` text is read.
