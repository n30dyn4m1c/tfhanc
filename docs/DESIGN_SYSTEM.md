# Design system: "Heaven's authority touching earth"

The site is the logo expanded into a world. The logo holds everything: a royal
purple eagle whose wing sweeps in a circle, cradling a globe on which a family
stands, with gold lands and gold meridians. The site reads the same way, from
top to bottom:

| Layer | Meaning | On the page |
|---|---|---|
| **Heaven** | authority, the throne | deep purple sky, clouds, storm light |
| **Gold light** | glory breaking through | light rays, gold rules, gold numerals |
| **The eagle** | vision, watchfulness, ascent | the hero, Friday Night Prayer, the footer seal |
| **The globe** | the nations | the Nations section, the meridian motif |
| **Earth** | Papua New Guinea | mountain ridges, the harbour, the venue |

Every section sits somewhere on that vertical axis. Heaven-heavy sections are
dark plum. "Heavenly light" sections (Begin here, Giving) are warm ivory. There
are only two surfaces, and the page alternates between them for rhythm.

## 1. Colour

Purple is identity. Gold is glory. Ivory is heavenly light. Black is depth.
The values below come from the brief, checked against the supplied logo. The
logo's purple is a saturated violet (about `#7B2CBF` to `#8E3FFF` in the
highlights, `#5B168F` in the shadows).

| Token | Hex | Use |
|---|---|---|
| `--plum` | `#16001F` | page ground, footer |
| `--royal` | `#2A0845` | raised dark surfaces, header on scroll |
| `--purple` | `#5B168F` | brand fills, ivory-section headings |
| `--violet` | `#7B2CBF` | glows, focus halos, active states |
| `--electric` | `#8E3FFF` | light-source glow only (never text) |
| `--lavender` | `#C9A7E8` | secondary text on dark |
| `--gold` | `#C9A227` | rules, numerals, icons, primary buttons |
| `--champagne` | `#E5C76B` | gold text on dark, highlights |
| `--ivory` | `#F8F5EF` | light surface, primary text on dark |
| `--ink` | `#0A0712` | deepest shadow, text on gold |

Rules:

- Body text on dark is ivory at 100% or lavender. Never mid-purple on plum.
- Gold is never body text on ivory (it fails contrast). On ivory, headings are
  `--purple` and text is `--royal`; gold appears there only as rules and fills.
- One gold primary action per view. Secondary actions are ivory outlines.
- `node tools/contrast.js` checks every text pair against WCAG 2.2 AA.

## 2. Type

| Role | Face | Setting |
|---|---|---|
| Display (proclamations) | **Cinzel** 500 to 700 | uppercase by nature; tracking +0.02 to +0.06em; `clamp()` up to 8rem |
| Voice (Scripture, the lede, emotive lines) | **Cormorant Garamond** italic 500 | 1.25 to 2.4rem, line-height 1.25 |
| Interface and body | **DM Sans** 400 to 600 | 1.0625rem body, 1.6 line-height, short measure (62ch) |
| Labels | DM Sans 600 | 0.75rem, uppercase, tracking 0.18em, gold or lavender |

Cinzel echoes the Trajan-style capitals of the logo's wordmark. Cormorant
carries the "voice" of Scripture. DM Sans stays out of the way. There is one
label style only, used sparingly.

## 3. Space and grid

- 12-column grid with a 1280px maximum content width and 1440px for full-bleed art.
- Gutter `clamp(1rem, 4vw, 3rem)`, which gives a 16px side margin on phones.
- Section rhythm `clamp(5rem, 12vw, 10rem)`, so each section is its own "scene".
- Radius: 2px (near-square, architectural). Circles are reserved for the seal,
  the globe and play buttons, following the logo's circular movement.

## 4. Motifs (use with restraint)

- **The meridian.** A thin gold line, taken from the globe's latitude lines. It
  draws itself across as a section enters. It is the only recurring ornament.
- **The orbit.** A partial gold circle (the logo's wing sweep) behind the seal,
  the globe and the Friday time.
- **The eagle** appears exactly three times: hero photograph, Friday Night Prayer
  photograph, footer seal.
- **The globe** appears in the Nations section only, plus the seal.
- **Light rays** fall in the hero and the Prophetic Word section only.
- No crosses-as-clip-art, no doves, no crowns. The logo does not use them.

## 5. Imagery

Text-free cinematic scenes in the palette: purple sky, gold light, PNG ridges.
They were generated for this site (see `docs/PHOTO_BRIEFS.md`) and are to be
replaced by real photographs of the house as they become available. Every
image sits under a plum gradient so that text contrast never depends on the
picture. There are no faked portraits. The leaders' slots keep an engraved
monogram until real photographs are supplied.

## 6. Components

- **Button.** Gold solid (primary), ivory outline (secondary), text link with
  arrow (tertiary). 48px minimum height. On hover, a light sweep crosses the
  gold and the arrow advances 4px.
- **Label.** The single small-caps style (see Type).
- **Scene.** A full-bleed section with a background image, a gradient veil, and
  content on the grid.
- **Pillar.** A gold numeral (Cinzel), a meridian rule, and a Cinzel statement
  with DM Sans support text.
- **Scroll card.** A prophetic word: date, title, source, text, and a link to the
  original graphic.
- **Portrait.** 4:5, gold hairline frame, orbit arc, and name in Cinzel.
- **Dialog.** Biographies, the menu, and prophetic graphics. Native `<dialog>`,
  with Escape to close and focus returned to the opener.

## 7. Motion

Motion is atmosphere, not spectacle, and it is enhancement only.

- The hero image settles (scale 1.08 to 1 over 2.4s), then drifts with scroll parallax.
- Two soft cloud layers pass slowly across the hero (60s and 90s loops).
- Light rays breathe (opacity 0.5 to 0.8, 8s).
- Content fades and rises 24px as it enters. Meridian rules draw left to right.
- The manifesto lines turn from lavender to gold as they cross the centre of the screen.
- Hover: images zoom 1.04 over 1.2s, and cards lift 4px.
- Under `prefers-reduced-motion`, nothing moves, nothing is hidden, and nothing parallaxes.

## 8. Voice

Unchanged: `STYLE_GUIDE.md` governs. It is governmental, exact about Scripture,
and never invents facts. All facts come from the published site and the
promotional graphics the house supplied (the Friday theme, times, transport and
the 2026 word).
