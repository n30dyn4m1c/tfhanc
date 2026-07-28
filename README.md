# The Father's House, All Nations Church

Official website for The Father's House, All Nations Church — Port Moresby, Papua New Guinea.

> Executing the Mandate. Advancing the Kingdom. It is now.

## About this site

A fast, modern static website — no build step, no framework, no server required.
Everything lives on a single page, typeset as ten numbered articles in an
editorial, print-inspired design: an ink-violet "night of prayer" hero and
interludes, and a warm paper body for the record of the house. All artwork —
the eagle mark, the door-of-the-house arch, the footer seal, and the icons —
is hand-drawn SVG, so it stays crisp at every size with no heavy images.

```
index.html           — the whole site (single page, ten articles)
assets/css/style.css — design system: tokens, typography, components
assets/js/main.js    — countdown, nav, reveal, accordion, prayer request form
assets/img/logo.svg  — the eagle-through-the-door mark (nav, favicon, seal)
assets/img/og.png    — social sharing card (Open Graph image)
```

## Hosting on GitHub Pages

1. Go to the repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Choose the `main` branch and the `/ (root)` folder, then **Save**.
4. The site will be live at `https://<username>.github.io/tfhanc/` within a minute or two.

The `.nojekyll` file tells GitHub Pages to serve the files as-is.

## The mark

The emblem at `assets/img/logo.svg` is an eagle rising through the golden
door of the house — wings breaking beyond the frame, for breakthrough prayer.
It appears in the navigation bar, as the favicon, and (redrawn in one colour)
inside the circular seal in the footer. To use a different official logo,
replace that file and keep the name `logo.svg`, or update the paths in
`index.html`.

## Updating content

All text lives directly in `index.html` — service times, location, messages,
leadership bios, prophecies, and contact details can be edited there.
Expandable sections use the `.accordion` markup pattern; article headers use
the `.kicker` pattern. Colours and fonts are defined as CSS variables at the
top of `assets/css/style.css`.

Copy follows the editorial register set out in `STYLE_GUIDE.md` —
governmental, professional, and authoritative, with Scripture cited exactly
(reference and translation, e.g. *2 Chronicles 7:14 (KJV)*).
