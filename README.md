# The Father's House, All Nations Church

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-222222?logo=github&logoColor=white)](https://n30dyn4m1c.github.io/tfhanc/)

**The website of The Father's House, All Nations Church (TFH ANC), a house of prayer in Port Moresby, Papua New Guinea.**

> Executing the Mandate. Advancing the Kingdom. It is now.

This is a static site: plain HTML, CSS and JavaScript, with no framework, no build step and no server. It is hosted on GitHub Pages.

**Live site:** <https://n30dyn4m1c.github.io/tfhanc/>

## The design: "Heaven's authority touching earth"

The site is the logo expanded into a world. The logo shows a royal purple eagle whose wing sweeps around a globe, with a family standing on it, in gold. The page follows the same vertical axis, from Heaven (deep purple sky) through gold light breaking through to the earth (the ridges of Papua New Guinea).

- **Colour:** purple is identity (`#16001F` plum, `#2A0845` royal, `#5B168F`, `#7B2CBF`), gold is glory (`#C9A227`, `#E5C76B`), ivory is heavenly light (`#F8F5EF`). "Begin here" is the one ivory section.
- **Type:** Cinzel for proclamations (it echoes the logo's capitals), Cormorant Garamond italic for Scripture and the voice of the house, DM Sans for everything a visitor acts on.
- **Motifs, used sparingly:** the gold *meridian* rule (from the globe's lines), the *orbit* (the wing's sweep), the eagle three times (hero, Friday, footer seal), and the globe once (Nations).
- **Motion:** the hero settles, clouds and light drift, and scenes parallax gently. Content rises in, rules draw across, and the manifesto lines turn gold as they are read. Under `prefers-reduced-motion`, nothing moves.

The full system is in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Run it locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

```text
index.html                 the whole site: every section, the icon sprite, JSON-LD, Open Graph
assets/css/style.css       tokens, type, components, sections in page order, motion
assets/js/main.js          SERVICE TIMES at the top, then header, parallax, dialogs, reveals,
                           next gathering, calendar files, filters, forms, dock
assets/fonts/              self-hosted Cinzel, Cormorant Garamond, DM Sans (woff2, SIL OFL)
assets/img/emblem-*        the logo emblem, cut out of the supplied logo (transparent)
assets/img/scenes/         cinematic scenes as WebP in three widths (see docs/PHOTO_BRIEFS.md)
assets/img/words/          the house's own graphics, shown full size from the Prophetic Word
                           and Friday sections
assets/img/og.jpg          1200 × 630 share image, rendered from tools/og.html
docs/DESIGN_SYSTEM.md      the design system
docs/PHOTO_BRIEFS.md       which images are generated, and how to replace them with photographs
tools/build-images.py      builds assets/img/scenes/ from master images (Pillow)
tools/contrast.js          WCAG contrast check for every colour pair: node tools/contrast.js
tools/og.html              source for og.jpg (render: node tools/render-og.js)
STYLE_GUIDE.md             voice and Scripture citation rules
```

## Page order

1. **Hero:** The Father's House, All Nations Church; "A praying family, standing for the healing of the land"; the decree; Plan your visit and Join us in prayer; both gatherings with their venues, and the next one, live
2. **A house of prayer** (`#about`): for a nation, for the nations; Mark 11:17; Prayer, Word, Presence; the record
3. **Prayer** (`#prayer`): the four pillars, James 5:16, and the manifesto
4. **Friday Night Prayer** (`#friday`): 7:00–10:00 PM at Taurama Aquatic Centre Lounge, the theme *Breaking into the Spirit of Prayer* in five movements, Acts 12:5, transport after prayer
5. **The Nations** (`#nations`): Papua New Guinea, the Pacific, the nations
6. **Prophetic Word** (`#prophetic-word`): Prophecies, PNG prophetic words, Global words, and Archive; each word links to its original graphic
7. **Leadership:** Pastor Ben Minok and Dr Jonathan David, with biographies in dialogs
8. **Messages:** the featured message (YouTube loads only on play) and three channels
9. **Conferences:** three gatherings, dates to be announced
10. **Begin here** (`#begin`): Believe, Confess, Tell the house; the prayer; Romans 10:9; a short form
11. **Giving:** Malachi 3:10, and bank details on request
12. **Plan your visit** (`#visit`): Sunday Celebration at Gordon International School and Friday Night Prayer at Taurama Aquatic Centre Lounge, with calendar files, a map that switches between the two venues, directions, and what to expect
13. **Send a prayer request** (`#connect`): contact details and the form
14. **Footer:** decree, emblem, navigation, gatherings, socials, registration

## Changing service times

Open `assets/js/main.js`. The first block, **CHANGE SERVICE TIMES HERE**, holds each gathering's day, start and end time, venue (`place`, used in calendar files, and `map`, the map search), and the timezone (`Pacific/Port_Moresby`). The next-gathering line and the calendar files read from it. The words on the page are plain HTML, so also search `index.html` for `9:00 AM`, `1:30 PM`, `7:00 PM` and `10:00 PM`, and for `"startTime"` and `"endTime"` in the JSON-LD.

## Connecting the forms to a form service

There are two forms: the main one (`#connect-form`) and the short "I prayed this" form in Begin here (`#begin-form`). By default, each opens the visitor's email app addressed to info@tfhanc.org. To receive messages directly, create a form at [Formspree](https://formspree.io), [Getform](https://getform.io) or [Basin](https://usebasin.com), and put its endpoint URL in each form's `data-endpoint`. If the service cannot be reached, the form falls back to email on its own.

## Adding a network church

In `index.html`, find `#network` inside the Leadership section. Copy an `<li class="netchurch">` into its province, or copy a whole `<div class="netprov">` for a new province. Add the church to `subOrganization` in the JSON-LD as well.

## Adding a prophetic word

In `index.html`, copy an `<article class="word" data-stream="…">` inside `[data-words]`, newest first. `data-stream` is `house` (Prophecies), `png` (PNG prophetic words) or `global` (Global words). To link the original graphic, save it as WebP in `assets/img/words/` and copy the `data-dialog="graphic"` button pattern. Only publish words the house has released.

## Content checklist

```sh
grep -n "CONTENT NEEDED\|PHOTO SLOT" index.html
```

| Item | Where | What to do |
|---|---|---|
| Real photographs | `assets/img/scenes/`, portraits | Follow `docs/PHOTO_BRIEFS.md`. Replace the generated worship crowd first. |
| PNG prophetic words | Prophetic Word | Add `data-stream="png"` entries |
| Featured message | Messages, `data-video-id` | Paste the YouTube ID, and set the title and caption |
| Bank details | Giving, `.slip__rows` | Fill each `<dd>`, and remove `slip__blank` |
| Conference dates | Conferences, `.conf__date` | Replace with `<time datetime="YYYY-MM-DD">…</time>` |
| Children's ministry, parking, PMV routes to each venue | Plan your visit, `.expect` | Replace the "to be published" text |

## Copy

Copy follows `STYLE_GUIDE.md`. Scripture is quoted exactly, with reference and translation: Mark 11:17 (NASB1995), James 5:16 (KJV), Acts 12:5 (KJV), Romans 10:9 (KJV) and Malachi 3:10 (NIV). The site states only facts the house has published: its earlier site, and its own Friday Night Prayer, 2026 and prophetic graphics. Nothing here invents dates, testimonies, account numbers or prophetic texts, and nothing should be added that does.

## Quality checks

- `node tools/contrast.js`: 30 text and background pairs, all WCAG 2.2 AA.
- Checked in Chromium at 1440 × 900 and 390 × 844: no horizontal scroll, and no console errors.
- Tested: the menu, biography and graphic dialogs (focus returns to the opener), archive filters, form validation and prefill, calendar files, reduced motion (nothing hidden), and without JavaScript (all content visible).

## Hosting on GitHub Pages

In **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save. All paths are relative, so the site works under `/tfhanc/`.

## License

[MIT](LICENSE). The fonts are under the SIL Open Font License 1.1.

## Author

**Neo Malesa** · [GitHub](https://github.com/n30dyn4m1c)
