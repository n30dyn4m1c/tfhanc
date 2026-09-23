# The Father's House, All Nations Church

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-222222?logo=github&logoColor=white)](https://n30dyn4m1c.github.io/tfhanc/)

**Official website for The Father's House, All Nations Church (TFH ANC), Port Moresby, Papua New Guinea.**

> Executing the Mandate. Advancing the Kingdom. It is now.

A fast static site with no build step, no framework and no server. The design, "Evening at the house", uses the colours of a Port Moresby dusk: sand for the day, deep plum for the night of prayer, ember for the altar fire and for action, and gold for light on the night. The page follows a first-time visitor's questions in order: what this place is, when and where to come, what will happen, who leads, and how to reach the house.

**Live site:** [https://n30dyn4m1c.github.io/tfhanc/](https://n30dyn4m1c.github.io/tfhanc/)

## Page order

1. **Hero:** the statement, 2 Chronicles 7:14 (KJV), both gatherings, and a countdown to whichever gathering comes next
2. **Plan your visit:** times, venue, directions, "Add to calendar", what to expect
3. **Who we are:** the house, Mark 11:17, the Record (a formal register of institutional facts), and the three pillars
4. **Why we pray** (night section): James 5:16 set as a large spread, and four convictions
5. **Leadership:** portrait cards with the full biography in a dialog
6. **Messages:** the featured sermon (loads YouTube only when clicked) and channel links
7. **Begin here** (night section): the prayer of salvation
8. **Prophetic word:** three streams and a register for dated words
9. **Conferences:** events with date slots
10. **Giving:** Malachi 3:10 (NIV)
11. **Connect:** contact details and the prayer request form
12. **Footer:** seal, motto, grouped links, gatherings, registration line

## Features

- Light and dark themes: follows the system setting, with a manual toggle remembered in `localStorage`
- A sticky header that highlights the active section; below 920px, a focus-trapped menu that closes with Escape
- A floating "Send a prayer request" button that appears after the hero
- Generated `.ics` calendar files for Sunday Celebration and Breakthrough Prayer Night
- A contact form with inline validation, a copy-address button, and a `mailto:` fallback. It can post to a form service instead (see below).
- Swipeable card rails on phones to keep the page short; everything stacks or sits in grids on wider screens
- Honours `prefers-reduced-motion`. The site has no looping animation.
- Self-hosted fonts (Fraunces and Figtree, `woff2`, `font-display: swap`); deferred JS; one CSS file under 40 KB
- Open Graph and Twitter cards, a canonical link, and `Church` JSON-LD with both weekly gatherings

## Structure

```text
index.html                       the whole site (single page)
assets/css/style.css             design system: tokens, themes, components (header comment explains it)
assets/js/main.js                theme, menu and dialogs, nav, countdown, calendar, video, form
assets/fonts/                    self-hosted woff2 fonts (SIL Open Font License)
assets/img/logo.svg              the eagle-through-the-door mark (header, favicon, seal)
assets/img/og.png                social sharing card, rendered from tools/og.html
assets/img/placeholders/         duotone stand-ins for photographs (generate.py rebuilds them)
tools/contrast.js                WCAG contrast check for every colour pair: node tools/contrast.js
tools/og.html, render-og.js      source and renderer for og.png
STYLE_GUIDE.md                   editorial voice and Scripture citation rules
```

## Replacing placeholder content

Every slot that still needs real content is marked in `index.html` with a comment that begins `CONTENT NEEDED:`. To list them all:

```sh
grep -n "CONTENT NEEDED" index.html
```

### Photographs

| Slot | File to replace | Suggested size |
|---|---|---|
| Hero (congregation at Sunday Celebration) | `assets/img/placeholders/hero.svg` | 1200 × 1400, portrait |
| Venue (Taurama Aquatic Centre Lounge) | `assets/img/placeholders/venue.svg` | 1200 × 900 |
| Breakthrough Prayer Night band | `assets/img/placeholders/prayer-night.svg` | 1600 × 720, wide |
| Pastor Ben Minok | `assets/img/placeholders/portrait-ben.svg` | 800 × 1000, 4:5 |
| Dr Jonathan David (with permission) | `assets/img/placeholders/portrait-jonathan.svg` | 800 × 1000, 4:5 |
| Featured sermon thumbnail | `assets/img/placeholders/sermon.svg` | 1280 × 720, 16:9 |

To swap a photograph:

1. Save a compressed JPEG or WebP (ideally under 250 KB) in `assets/img/`, for example `assets/img/hero.jpg`.
2. In `index.html`, change the `<img>` `src`, set `width` and `height` to the new file's real pixel size (this prevents layout shift), and rewrite the `alt` text to describe the photograph. Replace "Placeholder for a photograph of…" with what the picture actually shows.
3. Delete the `CONTENT NEEDED` comment above it.

Images are cropped to their frames with `object-fit: cover`, so any reasonable aspect ratio works.

### Featured sermon

In the Messages section, put the YouTube video ID in `data-video-id` on the `<figure class="video">`. For `https://www.youtube.com/watch?v=abc123XYZ`, the ID is `abc123XYZ`. Also update `data-video-title` and the caption text. With an ID set, a click loads the video from `youtube-nocookie.com` in place. With no ID, the poster links to the channel.

### Form service

The form opens the visitor's email app by default. To receive submissions through a service such as Formspree, put the service's URL in the form's `data-endpoint` attribute:

```html
<form class="form" id="connect-form" ... data-endpoint="https://formspree.io/f/your-id">
```

If a submission to the endpoint fails, the form falls back to email automatically.

### Other slots

- **Dated prophetic words:** copy the commented `<article class="word">` pattern in the Prophetic word section, one per word, newest first, and remove the "being prepared" entry.
- **Conference dates:** replace each "Dates to be announced" with `<time datetime="YYYY-MM-DD">…</time>`.
- **Children's ministry, parking and transport, the Prayer Night closing time, giving details:** replace the dashed `<span class="tbc">` notes in the relevant section.

## Editing colours and type

All colours are CSS custom properties at the top of `assets/css/style.css`. Components use only the semantic tokens (`--bg`, `--fg`, `--accent`, and so on). An element with the `night` class swaps in the night set, and the dark theme redefines the same tokens. The dark theme is written twice, once for the system setting and once for the manual toggle, and the two blocks must stay identical. After changing any colour, run:

```sh
node tools/contrast.js
```

It checks every text and UI pair against WCAG 2.2 AA in light, dark and night contexts, and it fails if the two dark blocks differ.

Copy follows `STYLE_GUIDE.md`. Cite Scripture exactly, with its reference and translation, e.g. *2 Chronicles 7:14 (KJV)*.

## Hosting on GitHub Pages

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Choose the `main` branch and the `/ (root)` folder, then **Save**.
4. The site will be live at `https://n30dyn4m1c.github.io/tfhanc/` within a minute or two.

The `.nojekyll` file tells GitHub Pages to serve the files as they are. All paths are relative, so the site works under `/tfhanc/`.

## License

This project is licensed under the [MIT License](LICENSE). The fonts are licensed under the SIL Open Font License 1.1.

## Author

**Neo Malesa**  
[GitHub](https://github.com/n30dyn4m1c)
