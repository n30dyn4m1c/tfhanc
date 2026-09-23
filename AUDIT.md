# Product, UX, UI & Accessibility Audit

**Repository:** `n30dyn4m1c/tfhanc` · **Surface audited:** `index.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/img/*`, `README.md`, `STYLE_GUIDE.md`
**Live site:** https://n30dyn4m1c.github.io/tfhanc/
**Date:** 27 August 2026 · **Commit audited:** `1ed6056`

Every finding below was verified against the files in this repository, or measured in a headless Chromium
run of the site at 320 / 375 / 390 / 667×375 / 768 / 1024 / 1280 px. Where a claim could not be verified
from the repo (e.g. what content the church intends to publish), the ticket is marked
**needs product confirmation** and a recommended default is given.

---

## 1. Executive summary

### What the product is, and who it is for

A single-page, dependency-free static website for **The Father's House, All Nations Church (TFH ANC)**,
a prayer-centred church in Port Moresby, Papua New Guinea. It is typeset as ten numbered editorial
articles (I–X) in a print-inspired design system: an ink-violet "night of prayer" hero and interludes,
warm paper for the body, hand-drawn SVG artwork throughout, and a documented editorial voice
(`STYLE_GUIDE.md`).

Three audiences, in the order the page serves them:

1. **The unchurched or seeking visitor** — arrives from a Facebook share, wants to know what this is,
   when it meets, where, and whether they are welcome. Article IV ("Begin Here") is written for them.
2. **The existing member or intercessor** — wants prayer-night timing, messages, the prophetic word,
   and a way to submit a prayer request.
3. **The wider network** — ISAAC churches, partner leaders, people checking the institutional record
   (IPA registration, apostolic covering) before associating with the house.

The primary job-to-be-done is clear and well-served at the top of the page: *"tell me when and where
this house prays, and let me stand with it."*

### Overall quality score: **6 / 10**

The craft on display is genuinely above average for a church website. The design system is coherent and
committed — one typographic voice (Fraunces + Outfit), a disciplined two-ground palette (ink / paper),
consistent 6px radii, one shadow family, an ordered numbering device (I–X, 01–03, i–iv) that gives the
page real editorial spine. `STYLE_GUIDE.md` is better than most product copy decks. Reduced-motion is
respected. The whole thing is 36 KB of HTML with no build step.

What holds the score at 6 is not polish, it is **substance and robustness**. Three things:

- The site is **entirely blank without JavaScript** — all 73 content blocks are `opacity: 0` until JS runs.
- Two of the ten articles (V Prophetic Word, IX Conferences) are **scaffolding, not content**: they describe
  the prophetic words and conferences that would be listed, and list none.
- Six different calls to action, including *"I prayed this — tell the house"*, all deposit the visitor
  in one form whose submit button says **Send Prayer Request** and whose email subject is
  `Prayer Request — {name}`.

Fix those three and the same site is an 8.

### Top 5 issues by user impact

| # | Issue | Ticket |
|---|---|---|
| 1 | Site renders completely blank if JavaScript fails, is blocked, or is slow to load. No `<noscript>`, no fallback. | T-001 |
| 2 | Every secondary CTA — salvation response, conference updates, volunteering, prophetic word, first visit — lands on a form labelled "Send Prayer Request". The person who just prayed to be saved sends an email titled "Prayer Request". | T-005 |
| 3 | Article V "Prophetic Word", the section the nav promotes, contains no prophetic words. Three accordions each open onto a paragraph describing what would be there. | T-010 |
| 4 | Links inside collapsed accordion panels stay in the keyboard tab order — five invisible tab stops, verified. Keyboard and screen-reader users tab into nothing. | T-002 |
| 5 | On mobile, every article's numeral and label ("I — THE HOUSE") lands **exactly behind the fixed nav bar** when reached from a nav or footer link. Measured: kicker top 72px, nav height 73px. | T-007 |

### What is already strong — keep doing this

- **A real design system, not a theme.** Tokens at the top of `style.css`, one radius, one shadow ramp,
  one type pairing. Component classes (`.kicker`, `.card`, `.verse`, `.accordion`, `.btn`) are reused
  consistently; there are very few one-off styles in 1,150 lines.
- **The editorial conceit is carried through.** Roman numerals in the kickers, the arch in the hero
  echoed in the logo and the footer seal, the "Record" panel as an inset ink card. It is the strongest
  thing about the product and it should be protected in every fix below.
- **`STYLE_GUIDE.md` exists and is genuinely good.** A documented voice with a citation standard and a
  publish checklist is rare. Keep it, and keep it in sync (T-022).
- **`prefers-reduced-motion` is handled** for reveals, the rotating seal, smooth scroll, and the accordion.
- **Semantics are mostly right where it counts**: implicit `<label>` wrapping on every form field,
  `aria-expanded`/`aria-controls` on the accordion and the menu toggle, `aria-hidden` on decorative
  arrows and SVG, `rel="noopener"` on every external link.
- **Performance posture is right by construction** — no framework, no build, SVG art instead of raster,
  `100svh` instead of `100vh`, `display=swap` on the font request.

---

## 2. Inventory

### Screens / routes

One document, ten in-page anchors. There is no router and no second page.

| # | Anchor | Nav label | In top nav? | In footer? |
|---|---|---|---|---|
| — | `#top` | (brand) | brand only | — |
| I | `#about` | The House | ✅ | ✅ |
| II | `#why-we-pray` | Why We Pray | ❌ | ✅ |
| III | `#leadership` | Leadership | ✅ | ✅ |
| IV | `#prayer` | Begin Here | ❌ | ✅ |
| V | `#prophecies` | Prophetic Word | ✅ | ✅ |
| VI | `#messages` | Messages | ✅ | ✅ |
| VII | `#giving` | Giving | ✅ | ✅ |
| VIII | `#services` | Gather | ✅ | ✅ |
| IX | `#conferences` | Conferences | ❌ | ✅ |
| X | `#connect` | Send a Prayer Request (CTA) | ✅ | ✅ |

Sub-anchors: `#prayer-night`, `#bio-ben`, `#bio-jonathan`, `#bio-network`, `#prop-responding`,
`#prop-png`, `#prop-global`.

### Core user flows

1. **Find out when the house meets** — hero countdown → §VIII Gather → Google Maps. *Complete.*
2. **Send a prayer request** — nav CTA / hero CTA → §X form → `mailto:` handoff. *Incomplete: no feedback,
   no fallback if no mail client, message field optional (T-006).*
3. **Respond to the salvation prayer** — §IV → "I prayed this — tell the house" → §X prayer-request form.
   *Broken promise: the destination does not match the CTA (T-005).*
4. **Read/watch messages** — §VI → three external cards → YouTube / Facebook. *Complete but one card
   points at the wrong destination (T-013).*
5. **Give** — §VII → `mailto:info@tfhanc.org?subject=Giving to TFHANC`. *Dead end: no way to actually
   give (T-014).*
6. **Volunteer / get conference updates / share a prophetic word** — all → §X prayer-request form.
   *Same mismatch as flow 3.*

### Design / system primitives found

`assets/css/style.css`, all defined as custom properties on `:root`:

- **Grounds:** `--ink #171028`, `--ink-2`, `--paper #f7f2e7`, `--paper-2 #f1eadb`, `--paper-3 #fdfaf2`
- **Text:** `--text #2b1e47`, `--text-soft #5c5174`, `--text-faint #75698a`;
  on ink: `--night-text #efe9f9`, `--night-soft #b5aacb`, `--night-faint #837796`
- **Brand:** `--violet #6d28d9`, `--violet-bright #8b5cf6`, `--violet-soft #c4b5fd`,
  `--gold #8a691c` (paper), `--gold-bright #d9b45c` (ink)
- **Type:** `--font-serif` Fraunces, `--font-sans` Outfit · **Layout:** `--nav-h 72px`, `--radius 6px`
- **Components:** `.btn` (`--primary`/`--gold`/`--ghost`/`--ghost-ink`/`--full`), `.kicker`
  (`--center`/`--dark`), `.card` (`--link`), `.verse` (`--center`), `.accordion`, `.record`, `.pillars`,
  `.creed`, `.gather`, `.countdown`, `.connect-form`, `.reveal`, `.section--tint`, `.interlude`
- **Breakpoints:** 1080px (nav → hamburger), 900px (grids → 1 column), 600px (kicker/accordion/record compaction)

### Copy sources

**All copy is hardcoded in `index.html`.** There is no CMS, no i18n layer, no data file. Additionally:

- Service **day and hour** are hardcoded a second time in `assets/js/main.js`
  (`PRAYER_NIGHT_DAY = 5`, `PRAYER_NIGHT_HOUR = 19`, `PNG_OFFSET_MS`).
- Service times and venue appear in **four** places: hero `.countdown__when`, §VIII `.gather__time`,
  footer `.footer__meta`, and `main.js`. See T-019.
- Voice and Scripture-citation rules live in `STYLE_GUIDE.md` and are **not** enforced by any tooling.

---

## 3. Findings by theme

### Theme A — Robustness (the site's single blocker)

| Sev | Eff | Finding | Evidence |
|---|---|---|---|
| **Blocker** | S | With JS disabled, **73 of 73** `.reveal` elements compute to `opacity: 0`, including the `<h1>`. The page shows only the nav and a decorative arch. | `style.css:1075-1080`; measured in headless Chromium with `javaScriptEnabled:false` → `{totalReveal:73, opacityZero:73, h1op:"0"}` |

### Theme B — Information architecture & flow completeness

| Sev | Eff | Finding | Evidence |
|---|---|---|---|
| High | S | Top nav omits three of ten articles, including **§IV "Begin Here"** — the salvation prayer, arguably the page's most important destination. | `index.html:29-37` vs `index.html:567-578` |
| High | M | Six CTAs with six different intents all resolve to `#connect`, a form headed *"How may this house pray with you?"* with a **Send Prayer Request** button. | `index.html:259, 279, 311, 328, 345, 448, 490` |
| High | M | §V Prophetic Word promises *"These are the prophetic words declared over Papua New Guinea…"* and delivers three meta-paragraphs and zero prophecies. | `index.html:294, 310, 327, 344` |
| High | M | §VII Giving contains no giving mechanism — only `mailto:` "Ask About Giving". | `index.html:403` |
| Medium | S | Nav order (…Gather, Giving) contradicts document order (Giving VII, Gather VIII). Left-to-right nav clicking scrolls backwards. | `index.html:30-36` |
| Medium | M | §IX Conferences lists three conference *types* with no dates, venue, price, or registration. | `index.html:466-491` |
| Medium | M | No active-section indicator anywhere in the nav on a ten-section page. | `main.js` — no scrollspy |
| Low | S | Accordion item 03 is titled *"The Father's House & ISAAC Network"* but summarised as *"The volunteers and department heads…"* — title and summary describe different things. | `index.html:251-252` |

### Theme C — Accessibility

| Sev | Eff | Finding | Evidence |
|---|---|---|---|
| High | S | `.accordion__panel[hidden] { display: grid }` defeats the `hidden` attribute. **Five links inside collapsed panels are reachable by Tab** (tab stops 15, 17, 20, 22, 24) and by browser find-in-page. | `style.css:846`; measured tab order |
| High | S | **No `<main>` element.** Skip link targets `#about`, bypassing the `<h1>` and both hero CTAs. | `index.html:20`; measured `{main: 0}` |
| High | M | Accordion item titles are `<strong>` inside buttons. **Six items — every leadership bio and every prophecy — are invisible to heading navigation.** The heading outline jumps H2 → H2 across all of §III and §V. | `index.html:212, 233, 251, 303, 320, 337` |
| Medium | S | Four measured contrast failures (see T-015). Worst: `--text-faint` on `--paper-2` = **4.23:1**; `--night-faint` on `--ink` = **4.42:1**; `.btn--primary:hover` white on `--violet-bright` = **4.23:1**. | computed from tokens |
| Medium | S | `.connect-form input { outline: none }` removes the UA focus ring; the replacement halo `rgba(139,92,246,.15)` measures **1.20:1** against the field. Only `.accordion__trigger` has an explicit `:focus-visible`. | `style.css:955, 961-965, 792` |
| Medium | S | Countdown wrapper is a bare `<div aria-label="…">` with no role — `aria-label` on a generic element is not reliably announced. Digits update every second with no accessible summary. | `index.html:64` |
| Medium | S | Seven `target="_blank"` links, none announcing that they open a new tab. | measured |
| Low | S | Target sizes below WCAG 2.2 AA (2.5.8, 24×24): desktop nav links **23px** tall; "Get directions →" and "Let us know you're coming →" **18px**. | measured |
| Low | S | `prefers-reduced-motion` does not disable `.btn:hover`/`.card:hover` `translateY` transforms. | `style.css:1082-1087` |

### Theme D — UI, responsive & visual

| Sev | Eff | Finding | Evidence |
|---|---|---|---|
| High | S | No `scroll-margin-top`. On mobile, `.section` padding equals `--nav-h` exactly, so anchor jumps place the article kicker **behind** the nav. Measured at 390px: kicker top **72px**, nav height **73px**. | `style.css:39, 121`; measured `#about`, `#giving` |
| High | S | Mobile menu in landscape overflows with no scroll: at 667×375 the menu extends to **521px** in a **375px** viewport; the "Send a Prayer Request" CTA is off-screen and unreachable. `overflow-y: visible`, `max-height: none`. | `style.css:1093-1107`; measured |
| High | S | `assets/img/og.png` has a **white band across the bottom ~85px** of the 1200×630 canvas — it renders as a white stripe in every Facebook and LinkedIn card. | visual inspection of the asset |
| Medium | S | Page overflows horizontally at 320px (`scrollWidth 322` vs `clientWidth 320`). Cause: `.contact-list { grid-template-columns: 96px 1fr }` cannot fit `facebook.com/tfhanc`. `body { overflow-x: hidden }` clips it silently rather than allowing scroll. | `style.css:909, 55`; measured |
| Medium | S | Mobile hero pushes the countdown — the only time-sensitive element — entirely below the fold at 390×844. | screenshot at 390×844 |
| Low | S | Countdown renders literal `0 DAYS : 00 HRS : 00 MIN : 00 SEC` in the HTML before JS runs, which reads as "the meeting is now". | `index.html:66-74` |
| Low | S | Countdown shows `0 DAYS` for the ~24h before prayer night, and immediately after 7:00 PM Friday rolls to "6 days" while the meeting is in progress. No in-session state. | `main.js:110-121` |
| Low | S | `.reveal` stagger uses `(i % 4) * 80ms` over document order, so delays bear no relation to visual grouping. | `main.js:43` |

### Theme E — Copy & content

| Sev | Eff | Finding | Evidence |
|---|---|---|---|
| High | S | §VI card 3 is labelled **"ISAAC PNG · Conference messages"** and links to `https://facebook.com/tfhanc` — the church's own Facebook page, the same URL used by the footer social icon and the contact list. Four identical `facebook.com/tfhanc` links on the page. | `index.html:379` |
| Medium | S | Scripture citations render as `2 CHRONICLES 7:14 · KJV`. `STYLE_GUIDE.md` §3.2 mandates parentheses: *2 Chronicles 7:14 (KJV)*. The guide states it prevails when copy and guide disagree. | `index.html:57, 95, 185, 400` vs `STYLE_GUIDE.md` §3 |
| Medium | S | `STYLE_GUIDE.md` §3 table still lists Mark 11:17 as **(KJV)**; the site was changed to **NASB1995** in `c3b477a` and the guide was not updated. The guide also says to retire ALL-CAPS while the NASB quotation is legitimately set in caps — no exception is documented. | `STYLE_GUIDE.md` §3, §4 vs `index.html:94-95` |
| Medium | S | "Dr Jonathan David" appears three ways on one page: `Dr Jonathan` ×2, `Dr.&nbsp;Jonathan` ×2, `Dr&nbsp;Jonathan` ×1. `STYLE_GUIDE.md` §6 sets "Dr Jonathan David". | grepped |
| Medium | S | §VI lead says *"watch, listen, and share"* — there is no audio/podcast and no share affordance. Card body copy quotes sermon lines rather than describing the destination. | `index.html:364, 370, 376, 382` |
| Low | S | Every string is hardcoded in `index.html`; no `lang` alternates. Tok Pisin is a lingua franca in Port Moresby. Needs product confirmation. | `index.html:2` |

### Theme F — Discoverability, performance & DX

| Sev | Eff | Finding | Evidence |
|---|---|---|---|
| High | S | `og:image` is a **relative** path. The Open Graph spec requires an absolute URL; several crawlers will not resolve it. Also missing: `og:url`, `og:site_name`, `og:image:width/height`, `og:image:alt`, `og:locale`, `twitter:card`, and `<link rel="canonical">`. Facebook is the church's only social channel. | `index.html:8-11` |
| Medium | S | No `Church`/`Organization` JSON-LD — no address, geo, `openingHoursSpecification`, or `sameAs`. This is the single highest-leverage SEO change for a local congregation. | `index.html` `<head>` |
| Medium | S | **`README.md` is actively misleading**: *"All text lives directly in `index.html` — service times… can be edited there."* The countdown's day and hour live in `main.js`. Editing only the HTML leaves the countdown silently contradicting the copy. | `README.md` "Updating content" vs `main.js:84-86` |
| Medium | M | Google Fonts requests 6 Fraunces variants + 4 Outfit weights from a third-party origin, with Georgia as a metrically very different fallback. Meaningful on PNG mobile networks. | `index.html:15` |
| Medium | M | No CI. An HTML validator, a link checker, and a Lighthouse budget would have caught the relative `og:image` and the duplicated Facebook link automatically. | no `.github/` directory |
| Low | S | No `sitemap.xml`, no `robots.txt`, no `theme-color`. | repo root |
| Low | S | `<img class="nav__logo">` has no `width`/`height` attributes. | `index.html:26` |

### Dimensions deliberately skipped, and why

- **Auth, settings, emails/templates, search, filters, sorting, pagination** — none exist. This is a
  brochure site with one form; there is no account system, no data set to filter, and no transactional email.
- **Dark/light mode** — not present, and not recommended. The ink/paper alternation *is* the design idea;
  a theme toggle would fight it. No ticket raised.
- **Skeleton/loading states** — no async data is fetched. Only the countdown's pre-JS state matters, covered in T-018.
- **Analytics** — none present. Mentioned once in T-005 as a way to validate the CTA split; not raised as its own ticket.

---

## 4. GitHub tickets

> Epics: **E-A Robustness** (T-001) · **E-B Contact & conversion** (T-005, T-006, T-014) ·
> **E-C Accessibility conformance** (T-002, T-011, T-012, T-015, T-016, T-017, T-021, T-030) ·
> **E-D Content completeness** (T-010, T-013, T-028) · **E-E Shareability & discovery** (T-003, T-004, T-024)

---

### T-001

**Title:** T-001 [Frontend] Render all content when JavaScript is unavailable

**Labels:** frontend, a11y, bug

**Priority:** P0
**Effort:** S

## Problem
`.reveal` sets `opacity: 0; transform: translateY(22px)` in CSS (`assets/css/style.css:1075-1080`) and only
`assets/js/main.js` adds `.is-visible`. If JavaScript is blocked, fails, or errors before line 29, **the
entire site is invisible** — nav and a decorative arch only.

Measured in headless Chromium with `javaScriptEnabled: false`:
`{ totalReveal: 73, opacityZero: 73, h1op: "0" }` — including the `<h1>`, the service times, the venue,
and the contact form.

User impact: a visitor on a restricted network, a data-saver browser, an older device, or a flaky Port
Moresby mobile connection sees a blank purple page instead of a church website. There is no `<noscript>`.

## Proposed solution
Make revealed-and-visible the default state and let JS *opt in* to animating, rather than the reverse.

1. Add to `<html>` in `index.html`: `<html lang="en" class="no-js">`
2. As the first statement in `main.js` (or an inline script in `<head>` to avoid a flash):
   `document.documentElement.classList.replace("no-js", "js");`
3. Scope the hidden state in `style.css`:
   ```css
   .js .reveal { opacity: 0; transform: translateY(22px); transition: /* unchanged */; }
   .js .reveal.is-visible { opacity: 1; transform: none; }
   ```
4. Wrap the body of `main.js`'s IIFE in `try { … } catch (e) { document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible")); }` so a runtime error cannot blank the page either.

## Acceptance criteria
- [ ] With JavaScript disabled, the `<h1>`, all ten article bodies, service times, venue, and the contact form are visible and readable.
- [ ] With JavaScript disabled, no element on the page computes to `opacity: 0` except elements intentionally hidden (collapsed accordion panels).
- [ ] With JavaScript enabled, the scroll-reveal animation behaves exactly as it does today.
- [ ] Throwing an artificial error at the top of `main.js` still leaves all content visible.
- [ ] No flash of hidden content on a normal JS-enabled load (verify the `no-js` swap runs before first paint).
- [ ] Verified at 390px and 1280px.

## Out of scope
Changing the reveal animation's timing, easing, or stagger (see T-018 notes). Adding a `<noscript>` banner —
the fix should make one unnecessary.

## Notes / references
`assets/css/style.css:1075-1087`, `assets/js/main.js:29-50`. The `@media (prefers-reduced-motion: reduce)`
block at `style.css:1082` already forces `.reveal { opacity: 1 }` — mirror that pattern.

---

### T-002

**Title:** T-002 [A11y] Remove collapsed accordion panels from the keyboard tab order

**Labels:** a11y, frontend, bug

**Priority:** P0
**Effort:** S

## Problem
`assets/css/style.css:846` contains `.accordion__panel[hidden] { display: grid; }`, which overrides the
UA stylesheet's `[hidden] { display: none }`. The panels are collapsed only visually, by
`grid-template-rows: 0fr` plus `overflow: hidden` on `.accordion__body`.

Consequence: content inside closed panels stays in the accessibility tree, the tab order, and
browser find-in-page. Measured tab order on load — **five invisible tab stops**:

| Tab stop | Element |
|---|---|
| 15 | "About Jonathan David — jonathan-david.org" (inside closed `#bio-jonathan`) |
| 17 | "Get Involved" (inside closed `#bio-network`) |
| 20 | "Share what the Spirit has shown you" (inside closed `#prop-responding`) |
| 22 | "Share what the Spirit has shown you" (inside closed `#prop-png`) |
| 24 | "Share what the Spirit has shown you" (inside closed `#prop-global`) |

A keyboard user tabbing through Leadership hits focus on nothing they can see, five times. A screen
reader announces bio and prophecy text that is not on screen.

## Proposed solution
Keep the `0fr → 1fr` height animation (it is good) but make the collapsed state genuinely inert:

```css
.accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  visibility: hidden;
  transition: grid-template-rows .35s cubic-bezier(.22,1,.36,1), visibility 0s linear .35s;
}
.accordion__item.is-open .accordion__panel {
  grid-template-rows: 1fr;
  visibility: visible;
  transition: grid-template-rows .35s cubic-bezier(.22,1,.36,1), visibility 0s;
}
.accordion__panel[hidden] { display: grid; }  /* keep — the animation needs a box */
```

`visibility: hidden` removes descendants from the tab order and the accessibility tree while still
allowing the height transition. Delaying the `visibility` transition on close preserves the closing animation.

## Acceptance criteria
- [ ] On page load, tabbing from the first focusable element to the footer produces **zero** focus stops inside a closed `.accordion__panel`.
- [ ] Browser find-in-page (Ctrl/⌘+F) does not match text inside a closed panel.
- [ ] A screen reader (VoiceOver or NVDA) does not announce closed panel content when reading the page linearly.
- [ ] Opening a panel makes its links focusable and announced; closing it removes them again.
- [ ] The open/close height animation is visually unchanged, and still disabled under `prefers-reduced-motion`.
- [ ] Verified on both accordion groups (§III Leadership, §V Prophetic Word).

## Out of scope
Changing the one-open-at-a-time behaviour, the chevron/plus affordance, or the accordion markup structure
(heading semantics are T-011).

## Notes / references
`assets/css/style.css:840-852`, `assets/js/main.js:53-81`. Pattern: WAI-ARIA APG Accordion.

---

### T-003

**Title:** T-003 [SEO] Fix Open Graph metadata: absolute og:image, og:url, canonical, Twitter card

**Labels:** seo, bug, frontend

**Priority:** P1
**Effort:** S

## Problem
`index.html:11` sets `<meta property="og:image" content="assets/img/og.png">` — a **relative** path. The
Open Graph protocol requires an absolute URL, and several crawlers (notably LinkedIn, and Facebook on
some cache paths) will not resolve a relative one. Facebook is the church's only social channel and the
`README.md` lists the OG card as a feature, so a share that renders without an image is a direct loss.

Also missing from `<head>`: `og:url`, `og:site_name`, `og:image:width`, `og:image:height`,
`og:image:alt`, `og:locale`, any `twitter:*` tags, `<link rel="canonical">`, and `theme-color`.

## Proposed solution
Replace the OG block in `index.html:8-11` with:

```html
<link rel="canonical" href="https://n30dyn4m1c.github.io/tfhanc/">
<meta name="theme-color" content="#171028">
<meta property="og:site_name" content="The Father's House, All Nations Church">
<meta property="og:locale" content="en_PG">
<meta property="og:type" content="website">
<meta property="og:url" content="https://n30dyn4m1c.github.io/tfhanc/">
<meta property="og:title" content="The Father's House, All Nations Church — A House of Breakthrough Prayer">
<meta property="og:description" content="&quot;…then will I hear from heaven … and will heal their land.&quot; — 2 Chronicles 7:14 (KJV). A house of prayer standing for Papua New Guinea and the nations, in Port Moresby.">
<meta property="og:image" content="https://n30dyn4m1c.github.io/tfhanc/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Father's House, All Nations Church — “If My people will pray…”, 2 Chronicles 7:14 (KJV).">
<meta name="twitter:card" content="summary_large_image">
```

If a custom domain is added later, these five absolute URLs are the only strings to change — note that in
`README.md`.

## Acceptance criteria
- [ ] The Facebook Sharing Debugger renders a large image card with title, description, and no warnings.
- [ ] The LinkedIn Post Inspector renders the image.
- [ ] `og:image`, `og:url`, and `canonical` are absolute `https://` URLs.
- [ ] `og:image:width`/`height` match the actual asset (1200×630).
- [ ] `README.md` notes which URLs must change if a custom domain is configured.

## Out of scope
Redesigning the card artwork (T-004). Structured data (T-024). Adding a custom domain.

## Notes / references
`index.html:6-16`. Asset verified as 1200×630, 281 KB.

---

### T-004

**Title:** T-004 [UI] Remove the white band from the bottom of the Open Graph card

**Labels:** ui, bug, design

**Priority:** P1
**Effort:** S

## Problem
`assets/img/og.png` is 1200×630, but the ink-violet artwork stops at roughly y=545. The bottom ~85px
(~13% of the card) is **pure white**. Facebook, LinkedIn, and iMessage all render the full 1.91:1 frame, so
every share of the site shows a white stripe under the Scripture citation — it reads as a rendering error,
on the church's main distribution channel.

## Proposed solution
Re-export the card at exactly 1200×630 with the ink gradient bleeding to all four edges. Keep the existing
composition (eagle mark, gold kicker line, "If My people will pray…", the 2 Chronicles citation) and re-centre
it vertically in the full frame.

While re-exporting, consider adding a single line of service information under the citation, in
`--night-soft` at the `.countdown__when` size — a share should answer "when":
`Friday 7:00 PM · Taurama Aquatic Centre Lounge · Port Moresby` — **needs design review**.

## Acceptance criteria
- [ ] `assets/img/og.png` is exactly 1200×630.
- [ ] No row of pixels in the image is the page background white `#ffffff`; the gradient reaches all four edges.
- [ ] File size stays under 300 KB.
- [ ] The card is legible at 500×262 (Facebook feed thumbnail size).
- [ ] Facebook Sharing Debugger shows the corrected image after a re-scrape.

## Out of scope
Changing the logo mark. Producing additional social sizes (square, story). Metadata changes (T-003).

## Notes / references
`assets/img/og.png`. Colours to match: `--ink #171028`, `--gold-bright #d9b45c`, `--night-text #efe9f9`
from `assets/css/style.css:8-35`.

---

### T-005

**Title:** T-005 [UX] Give the contact form a reason-for-contact field so CTAs match their destination

**Labels:** ux, copy, frontend, enhancement

**Priority:** P1
**Effort:** M

## Problem
Six calls to action with six different intents all scroll to `#connect`:

| CTA | Line | Intent |
|---|---|---|
| "I prayed this — tell the house" | `index.html:279` | Salvation response |
| "Share what the Spirit has shown you" ×3 | `311, 328, 345` | Prophetic word |
| "Get Involved" | `259` | Volunteering |
| "Let us know you're coming →" | `448` | First visit |
| "Get Conference Updates" | `490` | Conference interest |
| "Send a Prayer Request" (nav + hero) | `36, 62` | Prayer request |

`#connect` is headed *"How may this house pray with you?"*, its textarea placeholder is
*"How may this house pray with you?"*, its button says **Send Prayer Request**, and `main.js:132` sets the
subject to `Prayer Request — {name}`.

So the person who has just prayed the salvation prayer in §IV — the highest-stakes moment on the page —
is asked to file a prayer request. The church cannot triage its inbox, and the visitor's action does not
match what they were promised one click earlier.

## Proposed solution
Add a **Reason for contact** `<select>` as the first field, pre-selected from the originating CTA, and
drive both the button label and the email subject from it.

1. Add to the form (`index.html:513`), above "Full name":
   ```html
   <label>
     <span>Reason for contact</span>
     <select name="topic" id="connectTopic" required>
       <option value="prayer">A prayer request</option>
       <option value="salvation">I prayed the prayer — I gave my life to Christ</option>
       <option value="visit">I am planning my first visit</option>
       <option value="prophetic">A prophetic word to share</option>
       <option value="serve">I would like to serve</option>
       <option value="conference">Conference updates</option>
       <option value="giving">A question about giving</option>
       <option value="other">Something else</option>
     </select>
   </label>
   ```
2. Give each CTA a topic: `<a href="#connect" data-topic="salvation" …>`. In `main.js`, on click, set the
   select's value, then scroll.
3. Map topic → subject and button label in `main.js`:
   | topic | Subject line | Button label |
   |---|---|---|
   | `prayer` | `Prayer Request — {name}` | Send Prayer Request |
   | `salvation` | `New Believer — {name}` | Tell the House |
   | `visit` | `Planning a First Visit — {name}` | Let the House Know |
   | `prophetic` | `Prophetic Word — {name}` | Share the Word |
   | `serve` | `Volunteering — {name}` | Send Message |
   | `conference` | `Conference Updates — {name}` | Send Message |
   | `giving` | `Giving — {name}` | Send Message |
   | `other` | `Message from the Website — {name}` | Send Message |
4. Update the §X heading to cover all intents while staying in voice
   (`STYLE_GUIDE.md` §4 permits a genuine question):
   **"How may this house pray with you, or serve you?"**
   Lead: *"Whether you are a first-time guest, a long-standing member, or someone who has just given their
   life to Christ, reach out. This house will answer."*
5. Style the `<select>` to match `.connect-form input` exactly — same token set, no new pattern.

## Acceptance criteria
- [ ] Clicking each of the six CTAs lands on `#connect` with the matching option pre-selected.
- [ ] The submit button label updates when the select changes, and matches the table above.
- [ ] The generated `mailto:` subject matches the table above for every option.
- [ ] The select is keyboard-operable, has a visible label, and inherits the same focus treatment as the text inputs (see T-016).
- [ ] With JS disabled, the select still renders with a usable default and the form still submits (see T-001, T-006).
- [ ] The select matches `.connect-form input` in font, size, padding, radius, border, and background at 390px, 768px, and 1280px.
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist.

## Out of scope
Replacing the `mailto:` handoff with a real form backend (T-006). Adding a conference mailing list.
Auto-routing to different email addresses.

## Notes / references
`index.html:496-531`, `assets/js/main.js:126-143`, `STYLE_GUIDE.md` §4, §9. If analytics is ever added, this
select is the natural event to measure — it would show which intents actually drive contact.

---

### T-006

**Title:** T-006 [UX] Require the message field and confirm the prayer request was sent

**Labels:** ux, frontend, copy, bug

**Priority:** P1
**Effort:** M

## Problem
Two failures in the one conversion flow on the site.

**a) The message is optional.** `index.html:524` has no `required` attribute on the textarea. Verified:
with name and email filled and the message blank, `form.checkValidity()` returns `true` and the form
submits — producing an email titled "Prayer Request — Jane" containing no prayer request.

**b) There is no feedback and no fallback.** `main.js:137` does
`window.location.href = "mailto:…"` and nothing else. If the visitor has no mail client registered
(common on desktop Chrome and on shared/kiosk devices), **nothing happens at all** — no error, no
message, no alternative. The form does not clear, no confirmation appears, and the visitor cannot tell
whether their prayer request reached anyone.

The explanatory hint *"Opens your email app — your message goes to info@tfhanc.org."* sits **below** the
button (`index.html:527`), so it is read after the decision rather than before it, and it is not
associated with the button via `aria-describedby`.

## Proposed solution
1. Add `required` and a `minlength="10"` to the textarea.
2. Move `.connect-form__hint` **above** the submit button and associate it:
   `<p class="connect-form__hint" id="connectHint">` + `aria-describedby="connectHint"` on the button.
   Revise the copy to set expectations before the click:
   **"This opens your email app with your message ready to send to info@tfhanc.org. If nothing opens,
   email us directly at info@tfhanc.org."**
3. After triggering the `mailto:`, render an inline status region in the form:
   ```html
   <p class="connect-form__status" role="status" aria-live="polite" hidden></p>
   ```
   Message: **"Your email app should now be open with your message ready to send. If it did not open,
   email info@tfhanc.org — this house will answer."**
4. Replace the default browser validation bubbles with inline errors in the house voice, shown on
   `submit` and on `blur` after the first failed submit (not on every keystroke):
   - Name empty: **"Please give the house your name."**
   - Email empty: **"An email address is needed so this house can reply."**
   - Email malformed: **"That email address does not look complete — please check it."**
   - Message empty: **"Please write your prayer request or message."**
   Errors use `--violet` text, `aria-describedby` on the field, and `aria-invalid="true"`.

## Acceptance criteria
- [ ] Submitting with an empty message is blocked and shows the message error.
- [ ] Each of the four error strings above appears verbatim for its condition.
- [ ] Errors are associated with their field via `aria-describedby` and set `aria-invalid="true"`.
- [ ] Errors are announced by a screen reader on submit.
- [ ] The status region announces the confirmation via `role="status"` after a successful handoff.
- [ ] The hint text renders **above** the submit button and is referenced by the button's `aria-describedby`.
- [ ] The direct `info@tfhanc.org` address is visible on screen without opening a mail client.
- [ ] Error and status text meets 4.5:1 contrast against `--paper-3`.
- [ ] Verified at 390px and 1280px, keyboard-only and with a screen reader.

## Out of scope
Migrating to a hosted form backend (Formspree/Netlify Forms/Google Forms) — worth a separate spike, since
it would require a privacy notice and changes the static-hosting story. The reason-for-contact select is T-005.

## Notes / references
`index.html:513-528`, `assets/js/main.js:126-143`, `assets/css/style.css:928-971`. Error styling should
reuse `--violet` and the existing `.connect-form label span` type ramp rather than introduce a red.

---

### T-007

**Title:** T-007 [UI] Add scroll-margin-top so anchor links do not land behind the fixed nav

**Labels:** ui, bug, a11y, frontend

**Priority:** P1
**Effort:** S

## Problem
The nav is `position: fixed` at `--nav-h: 72px` (`style.css:39, 220-226`) and no element defines
`scroll-margin-top` — grep confirms zero occurrences in `assets/css/style.css`.

On desktop the section padding `clamp(4.5rem, 9vw, 7.5rem)` resolves to 120px and absorbs the nav. On
**mobile it resolves to its 4.5rem minimum = 72px, exactly the nav height.** Measured at 390×844 after
`location.hash = "#about"`:

```
{ navH: 73, kickerTop: 72, h2Top: 142 }
```

The article numeral and label — "I · THE HOUSE", "VII · GIVING" — sit **1px behind** the nav bar. Every
one of the ten footer links and every nav link on mobile lands the visitor on a section whose identifying
header is hidden. Confirmed identically for `#giving`.

## Proposed solution
Add to `assets/css/style.css`:

```css
:root { --nav-h: 72px; }

.section,
.interlude,
.hero,
[id] { scroll-margin-top: calc(var(--nav-h) + 1rem); }
```

Prefer scoping it to the ten section ids plus the accordion panel ids rather than the blanket `[id]`, to
avoid surprising behaviour on `#year` and the SVG `#seal-arc`:

```css
#top, #about, #why-we-pray, #leadership, #prayer, #prophecies,
#messages, #giving, #services, #conferences, #connect,
#prayer-night { scroll-margin-top: calc(var(--nav-h) + 1rem); }
```

## Acceptance criteria
- [ ] At 390px, clicking each of the ten footer links leaves that section's `.kicker` fully visible below the nav (measured `kickerTop >= navHeight + 8`).
- [ ] Same verified at 768px and 1280px.
- [ ] Same verified when the URL is loaded with a hash directly (e.g. `…/#giving`), not only on in-page clicks.
- [ ] Behaviour is correct with `prefers-reduced-motion: reduce` (instant jump) as well as with smooth scrolling.
- [ ] The skip link's target is also correctly offset (coordinate with T-012).

## Out of scope
Changing `--nav-h`, making the nav non-fixed, or adding a scrollspy (T-031).

## Notes / references
`assets/css/style.css:39, 121, 220-226, 870`. Measured with headless Chromium at 390×844.

---

### T-008

**Title:** T-008 [UI] Make the mobile menu scrollable so the CTA is reachable in landscape

**Labels:** ui, bug, a11y, frontend

**Priority:** P1
**Effort:** S

## Problem
`assets/css/style.css:1093-1107` positions `.nav__links` as `position: fixed; top: var(--nav-h)` with no
`max-height` and no `overflow-y`. With seven items at `0.95rem` vertical padding, the menu is taller than
a landscape phone viewport.

Measured at 667×375 (iPhone SE / most Android phones held sideways) with the menu open:

```
{ menuTop: 72, menuBottom: 521, vh: 375, lastLinkBottom: 494,
  overflowY: "visible", maxHeight: "none" }
```

The menu extends **146px past the bottom of the screen**. The last two items — "Giving" and the gold
**Send a Prayer Request** CTA, the site's primary conversion action — are off-screen and cannot be
scrolled to, because the menu is a fixed-position element with no scroll container.

## Proposed solution
In the `@media (max-width: 1080px)` block:

```css
.nav__links {
  /* …existing… */
  max-height: calc(100svh - var(--nav-h));
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(1.6rem + env(safe-area-inset-bottom, 0px));
}
```

`100svh` matches the unit already used by `.hero` (`style.css:328`) and avoids the mobile URL-bar jump.

## Acceptance criteria
- [ ] At 667×375 with the menu open, all seven items including the gold CTA are reachable by scrolling within the menu.
- [ ] At 375×667 (portrait) the menu still fits without a scrollbar — no visual regression.
- [ ] Scrolling the menu does not scroll the page behind it (`overscroll-behavior: contain`).
- [ ] The CTA clears the home indicator on notched devices (`env(safe-area-inset-bottom)` respected).
- [ ] Keyboard: Tab reaches every menu item and the focused item scrolls into view.
- [ ] Verified at 667×375, 375×667, 390×844, and 1024×768.

## Out of scope
Body scroll lock, Escape-to-close, and the `aria-label` bug — all T-017. Reducing the number of nav items — T-009.

## Notes / references
`assets/css/style.css:1091-1126`, `index.html:29-40`. Measured with headless Chromium.

---

### T-009

**Title:** T-009 [IA] Add Begin Here, Why We Pray and Conferences to the nav, and fix nav order

**Labels:** ux, ia, frontend

**Priority:** P1
**Effort:** S

## Problem
Two separate wayfinding problems in `index.html:29-37`.

**a) Three of ten articles are missing from the top nav** — `#why-we-pray` (II), `#prayer` (IV "Begin
Here"), and `#conferences` (IX). All ten appear in the footer (`index.html:567-578`), so the omission is
a nav decision, not an oversight of the content.

§IV "Begin Here" contains the salvation prayer. For a church website that is the single most consequential
destination on the page, and it is reachable only by scrolling past three articles or by finding it in
the footer.

**b) Nav order contradicts document order.** Nav runs: The House, Leadership, Prophetic Word, Messages,
**Gather, Giving**. The document runs: …Giving (VII), **Gather (VIII)**… A visitor working left-to-right
through the nav scrolls *backwards* between the fifth and sixth item.

## Proposed solution
Seven items is already at the desktop limit at 1080px, so add one and reorder rather than adding three.

Recommended nav (matching document order, "Begin Here" promoted):

```html
<a href="#about">The House</a>
<a href="#leadership">Leadership</a>
<a href="#prayer">Begin Here</a>
<a href="#prophecies">Prophetic Word</a>
<a href="#messages">Messages</a>
<a href="#giving">Giving</a>
<a href="#services">Gather</a>
<a href="#connect" class="nav__cta">Send a Prayer Request</a>
```

That is 7 links + CTA. Verify it still fits at 1080px before the hamburger breakpoint; if it does not,
drop "Messages" from the nav (it is well served by the footer and by §VI's own cards) rather than
dropping "Begin Here".

`#why-we-pray` and `#conferences` stay footer-only: II reads as the argument for I, and IX has no dated
content to navigate to yet (T-028). Revisit IX once it does. **Needs product confirmation** on whether
"Begin Here" should be the label in the nav or something warmer such as "Know Christ".

## Acceptance criteria
- [ ] Nav item order matches document order for every item present.
- [ ] `#prayer` (Begin Here) is reachable from the top nav on desktop and mobile.
- [ ] At 1080px the nav does not wrap or overlap the brand — verified by measurement, not by eye.
- [ ] Footer nav still lists all ten articles in document order.
- [ ] Nav labels match their section `.kicker__label` text exactly.

## Out of scope
Renaming section ids (`#services` → `#gather`) — churn with no user benefit. Adding a scrollspy (T-031).
Adding new sections.

## Notes / references
`index.html:29-37` (nav), `index.html:567-578` (footer). Section labels: `index.html:86, 154, 198, 273, 289, 359, 394, 413, 459, 500`.

---

### T-010

**Title:** T-010 [Content] Publish actual prophetic words in Article V, or reframe the section

**Labels:** content, ux, copy

**Priority:** P1
**Effort:** M

## Problem
§V Prophetic Word (`index.html:285-352`) is promoted in the top nav, and its lead reads:

> "These are the prophetic words declared over Papua New Guinea, the Pacific, and the nations. This house
> does not file them away; it takes them into the prayer room and contends until they come to pass."

Opening any of the three accordions delivers a paragraph *about* prophetic words rather than any prophetic
word. In full, panel 01:

> "As a house, we posture ourselves to hear and respond to what the Spirit is saying. These are the
> prophetic words that The Father's House, All Nations Church is actively standing on and stewarding a
> response to — words spoken over this house, this city, and this nation."

Panels 02 and 03 are the same shape. All three end with an identical "Share what the Spirit has shown
you" button. A visitor who came for the prophetic word — the thing the nav promised — finds a description
of a section that has not been written.

This is also the section most likely to be shared within the ISAAC network, so the emptiness is visible
to exactly the audience the house most wants to reach.

## Proposed solution
Two options. **Recommended default: option A**, with option B as the honest interim if the words are not
ready to publish.

**A — Publish the words.** For each accordion, replace the meta-paragraph with the actual prophecies, each as:
- a `.verse`-styled block quote of the word itself,
- who spoke it, where, and the date in `STYLE_GUIDE.md` §6 form (*9 April 2021*),
- one or two sentences on how this house is responding.

This reuses `.verse`, `.accordion__body p`, and `.accordion__source` — no new components. **Needs product
confirmation** from Pastor Ben Minok on which words are cleared for publication.

**B — Reframe honestly until then.** Change the §V lead to state what the section is *for* and invite
contribution, rather than claiming content that is not there:

> Heading: **"This house prays the promises God has spoken."**
> Lead: **"The prophetic words spoken over this house, this city, and this nation are being gathered and
> prepared for publication. As each is released here, this house will take it into the prayer room and
> contend until it comes to pass. If the Spirit has shown you something for this house, send it — it will
> be weighed by the leadership."**

Then collapse the three empty accordions into a single "Share a prophetic word" CTA. Do not leave three
expandable items that expand onto nothing.

## Acceptance criteria
- [ ] Every accordion in §V either contains at least one specific prophetic word with speaker and date, or the section is reframed per option B and the empty accordions removed.
- [ ] No panel in §V opens onto a paragraph that only describes the section.
- [ ] Every quoted word carries an attribution and a date in `STYLE_GUIDE.md` §6 form.
- [ ] Any Scripture within follows `STYLE_GUIDE.md` §3 (reference + translation).
- [ ] The section reuses `.verse`, `.accordion`, and `.accordion__source` — no new component classes.
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist.

## Out of scope
Building a CMS or a dated archive. Adding prophecy submission moderation. §IX Conferences is T-028.

## Notes / references
`index.html:285-352`, `STYLE_GUIDE.md` §3, §6, §9. Existing patterns to reuse: `.verse` (`style.css:624-656`),
`.accordion__source` (`style.css:861-863`). **Needs product confirmation.**

---

### T-011

**Title:** T-011 [A11y] Wrap accordion triggers in headings so bios and prophecies are navigable

**Labels:** a11y, frontend

**Priority:** P1
**Effort:** M

## Problem
Each accordion trigger holds its title in a `<strong>` (`index.html:212, 233, 251, 303, 320, 337`), not a
heading. The measured heading outline runs:

```
H2  Shepherds who lead this house on their knees.     ← §III
H2  The most important prayer anyone can pray.        ← §IV
```

Pastor Ben Minok, Dr Jonathan David, The Father's House & ISAAC Network, and all three prophecy titles
appear nowhere in it. A screen-reader user navigating by heading — the primary way blind users skim a long
page — cannot reach or enumerate any of the six items. `<strong>` also conveys no structural meaning,
only visual weight.

## Proposed solution
Wrap each trigger in an `<h3>`, per the WAI-ARIA APG accordion pattern, and demote the `<strong>` to a `<span>`:

```html
<article class="accordion__item reveal">
  <h3 class="accordion__title">
    <button class="accordion__trigger" type="button" aria-expanded="false" aria-controls="bio-ben" id="trigger-ben">
      <span class="accordion__no">01</span>
      <span class="accordion__heading">
        <span class="accordion__name">Pastor Ben Minok</span>
        <span class="accordion__summary">Founder &amp; Senior Elder…</span>
      </span>
      <span class="accordion__chevron" aria-hidden="true"></span>
    </button>
  </h3>
  …
</article>
```

CSS: add `.accordion__title { margin: 0; font: inherit; }` and rename the
`.accordion__heading strong` rule (`style.css:803-809`) to `.accordion__name`. **The rendered design must
not change** — this is a semantics-only refactor.

`<h3>` is the correct level: both accordion groups sit under a section `<h2>`.

## Acceptance criteria
- [ ] The heading outline includes all six accordion titles at H3, nested under their section's H2.
- [ ] Screen-reader heading navigation (VoiceOver rotor / NVDA H key) reaches each of the six.
- [ ] `aria-expanded` and `aria-controls` remain on the `<button>`, not the `<h3>`.
- [ ] Rendered appearance is pixel-identical to before at 390px, 768px, and 1280px (compare screenshots).
- [ ] No heading level is skipped anywhere on the page.
- [ ] Both accordion groups (§III, §V) updated consistently.

## Out of scope
Changing accordion open/close behaviour, or the collapsed-panel focus bug (T-002).

## Notes / references
`index.html:206-264, 297-350`, `assets/css/style.css:769-864`. Pattern: WAI-ARIA APG Accordion
("if the accordion header is a heading, wrap the button in the heading element").

---

### T-012

**Title:** T-012 [A11y] Add a main landmark and point the skip link at it

**Labels:** a11y, frontend

**Priority:** P1
**Effort:** S

## Problem
Measured landmark counts: `{ main: 0, header: 11, footer: 1, nav: 2, section: 11 }`. There is **no
`<main>` element**, so screen-reader users have no "skip to main content" landmark and no way to jump past
the navigation using landmark navigation.

The skip link (`index.html:20`) reads "Skip to content" but targets `#about` — Article I. It therefore
skips the `<h1>` ("If My people will pray…"), the governing Scripture, and **both hero CTAs**. A keyboard
user who takes the skip link never sees the primary calls to action.

`#about` also has no `tabindex="-1"`, so focus is not actually moved to it — only the scroll position
changes, and the next Tab press continues from the skip link.

## Proposed solution
1. Wrap everything between `</header>` and `<footer>` in `<main id="main" tabindex="-1">` —
   i.e. from the `<section class="hero" id="top">` opening tag through the close of §X.
2. Point the skip link at it: `<a class="skip-link" href="#main">Skip to content</a>`.
3. Add `#main { scroll-margin-top: calc(var(--nav-h) + 1rem); }` (coordinate with T-007) and
   `#main:focus { outline: none; }` so the programmatic focus does not draw a ring around the whole page.
4. While in `<head>`: the eleven `.kicker` `<header>` elements are correct as sectioning headers and need
   no change.

## Acceptance criteria
- [ ] The document contains exactly one `<main>` element containing all ten articles and the hero.
- [ ] The skip link targets `#main` and moves keyboard focus there (the next Tab lands on the first hero CTA, not on a nav link).
- [ ] The skip link is visible on focus with a contrast ratio of at least 4.5:1 against its background.
- [ ] Screen-reader landmark navigation lists banner, main, and contentinfo.
- [ ] `#main` clears the fixed nav when jumped to at 390px.
- [ ] No visual change to the rendered page.

## Out of scope
Changing the `.skip-link` visual design. Adding landmark roles to the ten sections
(`<section aria-labelledby>` would be a nice follow-up but is not required for conformance).

## Notes / references
`index.html:20, 42-45, 531-534`, `assets/css/style.css:62-67`.

---

### T-013

**Title:** T-013 [Content] Fix the "ISAAC PNG — Conference messages" card, which links to the church's own Facebook page

**Labels:** content, bug, copy

**Priority:** P1
**Effort:** S

## Problem
`index.html:379-384`, the third card in §VI Messages:

```html
<a class="card card--link" href="https://facebook.com/tfhanc" target="_blank" rel="noopener">
  <span class="card__kicker">ISAAC PNG</span>
  <h3>Conference messages</h3>
  <p>Representing Heaven's authority in the everyday places God has sent you.</p>
  <span class="card__go">Watch on Facebook →</span>
</a>
```

The card is labelled **ISAAC PNG** and promises **conference messages**, but `facebook.com/tfhanc` is
TFH ANC's own page — the same URL used by the footer social icon (`index.html:581`) and the contact list
(`index.html:509`). Four identical links to one destination on the page, one of them mislabelled.

A visitor clicking "ISAAC PNG · Conference messages · Watch on Facebook" lands on the page they were
already on the website of, and finds no conference messages. Either the URL is a placeholder that was
never replaced, or the label is wrong.

The card's body copy also describes a sermon rather than the destination — as do the other two cards
("Faith does not wait for a convenient season", "Understanding the assignment of the house").

## Proposed solution
Determine the correct destination (**needs product confirmation**), then:

- **If ISAAC PNG has its own page/channel:** replace the `href` with it.
- **If conference messages live in a playlist on the church's own channel:** change the kicker to
  `TFH ANC`, the heading to `Conference messages`, and link to that playlist URL, not the page root.
- **If neither exists yet:** remove the card and let §VI run two cards. `.cards` is
  `grid-template-columns: repeat(3, 1fr)` (`style.css:660-665`) — either add `.cards--two { grid-template-columns: repeat(2, 1fr) }`
  or let the two cards sit in the first two columns; do not leave a mislabelled third.

Rewrite all three card bodies to describe the destination rather than quote a sermon:

| Card | Suggested copy |
|---|---|
| TFH ANC | "Sunday messages and prayer-night teaching from this house, published as they are preached." |
| ANS Muar | "Teaching from All Nations Sanctuary, Muar — the apostolic source this house relates to." |
| Third card | "Messages from the conferences and encounters this house gathers for through the year." |

## Acceptance criteria
- [ ] No two cards in §VI link to the same URL.
- [ ] Every card's kicker, heading, and destination describe the same thing.
- [ ] Each card body describes what the visitor will find at the destination, not a sermon excerpt.
- [ ] If the third card is removed, `.cards` renders without a gap or a stretched card at 390px, 768px, and 1280px.
- [ ] The §VI lead no longer promises "listen" and "share" unless both exist (see T-027).
- [ ] All external links keep `target="_blank" rel="noopener"`.

## Out of scope
Embedding video players. Building a message archive or a podcast feed.

## Notes / references
`index.html:355-387`, `assets/css/style.css:658-714`. **Needs product confirmation** on the ISAAC PNG destination.

---

### T-014

**Title:** T-014 [UX] Give visitors a way to actually give in Article VII

**Labels:** ux, content, enhancement

**Priority:** P1
**Effort:** M

## Problem
§VII Giving (`index.html:390-406`) makes the case for giving — heading, lead, Malachi 3:10 — and then
offers exactly one action:

```html
<a class="btn btn--primary" href="mailto:info@tfhanc.org?subject=Giving%20to%20TFHANC">Ask About Giving</a>
```

A visitor persuaded to give must compose an email, wait for a reply, and act on it later. In practice
almost none will. This is the only article on the page whose stated purpose has no mechanism behind it,
and the CTA copy ("Ask About Giving") admits it.

## Proposed solution
**Needs product confirmation** — publishing account details is the church leadership's call, not a
design decision. Recommended default: publish the bank details, which is standard practice for churches
in Papua New Guinea and how most local giving actually happens.

Add a `.record`-styled panel (reusing the ink card already used for "The Record" in §I,
`style.css:514-558`) containing:

```
ACCOUNT NAME    The Father's House Inc.
BANK            [bank name]
BSB / BRANCH    [branch code]
ACCOUNT NUMBER  [number]
REFERENCE       Your name, and "Tithe" or "Offering"
```

Add a "Copy account number" button using the Clipboard API, with a `role="status"` confirmation
("Account number copied."). Keep the existing `mailto:` as a secondary `.btn--ghost-ink` labelled
**"Ask a question about giving"**.

Add one line of reassurance under the panel, in voice:
**"Every gift is received by The Father's House Inc. (IPA 5-109620) and applied to the work of this house."**

If leadership prefers not to publish account details, the honest alternative is to say so rather than
imply a mechanism exists:
**"Giving details are provided in person at the gathering, or on request — write to info@tfhanc.org."**

## Acceptance criteria
- [ ] §VII contains either published giving details or an explicit statement of how to obtain them.
- [ ] If details are published, they reuse the existing `.record` component and its tokens — no new panel style.
- [ ] The copy-to-clipboard button announces success via `role="status"` and degrades gracefully where the Clipboard API is unavailable.
- [ ] Account details are selectable text (not an image) so they can be copied on any device.
- [ ] The panel is legible and does not overflow at 320px and 390px.
- [ ] Contrast of all text in the panel meets 4.5:1 (the `.record` `dt` colour currently does not — see T-015).
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist.

## Out of scope
Online card payments, PayPal, or any payment processor — out of scope for a static site with no backend.
Recurring giving. Tax-receipting.

## Notes / references
`index.html:390-406`, `.record` component at `assets/css/style.css:514-558`, entity details at
`index.html:104-108`. **Needs product confirmation.**

---

### T-015

**Title:** T-015 [A11y] Fix four measured colour-contrast failures in the token palette

**Labels:** a11y, ui, design

**Priority:** P2
**Effort:** S

## Problem
Four token pairings fall below WCAG 2.1 AA (4.5:1 for body text). Ratios computed from the values in
`assets/css/style.css:8-35`:

| Ratio | Foreground | Background | Where it appears |
|---|---|---|---|
| **4.23:1** | `--text-faint #75698a` | `--paper-2 #f1eadb` | `.contact-list li span` labels in §X (a `.section--tint` section) |
| **4.26:1** | `--gold #8a691c` | `--paper-2 #f1eadb` | `.kicker__no` numerals and borders in §II, §VI, §VIII, §X |
| **4.42:1** | `--night-faint #837796` | `--ink #171028` | `.footer__copy`, `.footer__tag`, `.countdown__label`, `.hero__verse cite`, `.record__row dt` |
| **4.23:1** | `#ffffff` | `--violet-bright #8b5cf6` | `.btn--primary:hover` — the label loses contrast on hover |

The `--night-faint` case is the widest-reaching: it covers the copyright line, the footer tagline, the
countdown's "THE HOUSE CONVENES IN" label, the hero's Scripture citation, and every `dt` in "The Record"
(entity, registration, senior pastor, covering). Several are also set at 0.7–0.78rem with wide
letter-spacing, which compounds the difficulty.

Borderline but passing, worth noting: `--text-faint` on `--paper` = 4.54:1 and `--gold` on `--paper` = 4.57:1
leave no margin.

## Proposed solution
Darken three tokens and add a hover-safe primary. Values below were chosen to hold the existing hue and
still clear 4.5:1 on the worst background each is used against:

```css
--text-faint: #6b5f80;   /* 4.23 → 5.02 on --paper-2 */
--gold:       #7d5f16;   /* 4.26 → 5.06 on --paper-2 */
--night-faint: #948aa6;  /* 4.42 → 5.55 on --ink   */
```

For the button, keep `--violet-bright` for borders and accents but darken the hover fill:

```css
.btn--primary:hover { background: #5b21b6; }  /* #fff on #5b21b6 = 8.9:1 */
```

This keeps the hover *darker* rather than lighter, which also reads as a firmer press.

## Acceptance criteria
- [ ] Every text/background pairing on the page measures at least 4.5:1 (3:1 for text at 24px+ or 18.66px+ bold), verified with an automated checker over the rendered page in both the ink and paper sections.
- [ ] `.btn--primary` label contrast is at least 4.5:1 in the default **and** hover states.
- [ ] `.kicker__no` border remains at least 3:1 against its background (non-text contrast, WCAG 1.4.11).
- [ ] No hue shift large enough to change the design's character — reviewed against the current screenshots.
- [ ] Verified in both `.section` and `.section--tint` contexts, and on `--ink`.

## Out of scope
Redesigning the palette, adding a dark/light toggle, or changing type sizes. Focus indicators (T-016).

## Notes / references
`assets/css/style.css:8-41`. Ratios computed with the WCAG 2.x relative-luminance formula against the
literal token values.

---

### T-016

**Title:** T-016 [A11y] Add a visible focus indicator to every interactive element

**Labels:** a11y, ui, frontend

**Priority:** P2
**Effort:** S

## Problem
`assets/css/style.css:955` sets `outline: none` on `.connect-form input, .connect-form textarea`,
removing the browser's focus ring. The replacement is a 1px border colour change plus
`box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15)`.

Measured on a keyboard-focused field, after the transition settles:

- Halo composited over the field: **1.20:1** against `--paper-3` — effectively invisible.
- Border: `--violet` at **6.36:1**, but only 1px wide.

So the focus indicator on the site's only form is a single-pixel border colour change.

Elsewhere, only `.accordion__trigger` has an explicit `:focus-visible` (`style.css:792`). Everything else —
`.btn`, `.nav__links a`, `.footer__links a`, `.card--link`, `.link`, `.contact-list a`, `.footer__social`,
`.nav__toggle`, `.skip-link` — relies on Chrome's default `outline: auto 1px rgb(16,16,16)`, which is a
near-black hairline that is hard to see against `--ink` sections and is inconsistent across browsers.

## Proposed solution
Define one focus token and apply it globally:

```css
:root { --focus: #8b5cf6; }

:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  border-radius: var(--radius);
}

/* Keep the existing inset treatment where an offset ring would be clipped */
.accordion__trigger:focus-visible { outline: 3px solid var(--focus); outline-offset: -3px; }

/* Strengthen the form field ring rather than removing the outline */
.connect-form input:focus-visible,
.connect-form textarea:focus-visible,
.connect-form select:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  border-color: var(--violet);
}
```

Remove `outline: none` from `style.css:955`. `--violet-bright #8b5cf6` measures 3.79:1 against `--paper`
and 5.9:1 against `--ink`, clearing the 3:1 non-text requirement (WCAG 1.4.11) on both grounds.

Also add the missing reduced-motion guards while in this file:

```css
@media (prefers-reduced-motion: reduce) {
  .btn:hover, .card:hover, .btn--primary:hover, .btn--gold:hover,
  .btn--ghost:hover, .btn--ghost-ink:hover { transform: none; }
}
```

## Acceptance criteria
- [ ] Tabbing through the entire page shows a clearly visible focus ring on every interactive element, on both the ink and paper grounds.
- [ ] The focus indicator measures at least 3:1 against every background it appears on.
- [ ] `outline: none` appears nowhere in `assets/css/style.css` without a replacement indicator on the same selector.
- [ ] Mouse clicks do not draw a focus ring (`:focus-visible`, not `:focus`).
- [ ] The skip link is visible on focus and its ring is not clipped by `overflow: hidden`.
- [ ] `prefers-reduced-motion: reduce` disables all hover `translateY` transforms.
- [ ] Verified in Chrome, Firefox, and Safari.

## Out of scope
Palette contrast for text (T-015). Adding focus styling to non-interactive elements.

## Notes / references
`assets/css/style.css:792, 946-965, 1082-1087`. WCAG 2.4.7 Focus Visible (AA), 1.4.11 Non-text Contrast (AA).

---

### T-017

**Title:** T-017 [A11y] Fix mobile menu state: stale aria-label, no Escape, no outside click, no scroll lock

**Labels:** a11y, ux, frontend, bug

**Priority:** P2
**Effort:** S

## Problem
`assets/js/main.js:13-26`. Four issues in the mobile menu:

1. **Stale `aria-label`.** The toggle handler sets `aria-label` to "Close menu"/"Open menu"
   (`main.js:19`), but the link-click handler (`main.js:21-26`) only resets `aria-expanded`. Verified:
   after choosing a menu item, the button reports `{ ariaExpanded: "false", ariaLabel: "Close menu" }` —
   a screen reader announces "Close menu" on a menu that is shut.
2. **No Escape key.** The menu cannot be dismissed from the keyboard without tabbing back to the toggle.
3. **No outside click / no dismissal on scroll.** Tapping the page behind the open menu does nothing.
4. **No body scroll lock.** The menu is `position: fixed`; the page scrolls freely behind it, so a
   scroll gesture aimed at the menu moves the content underneath instead.

## Proposed solution
Refactor `main.js:13-26` around a single `setMenu(open)`:

```js
function setMenu(open) {
  links.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("is-menu-open", open);
}
toggle.addEventListener("click", function () {
  setMenu(!links.classList.contains("is-open"));
});
links.addEventListener("click", function (e) {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && links.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
});
document.addEventListener("click", function (e) {
  if (links.classList.contains("is-open") && !links.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
});
```

CSS: `body.is-menu-open { overflow: hidden; }` inside the `@media (max-width: 1080px)` block only.

Note `e.target.closest("a")` also fixes a latent bug: the current `e.target.tagName === "A"` check fails
if a link ever contains a child element.

## Acceptance criteria
- [ ] After selecting a menu item, the toggle reports `aria-expanded="false"` **and** `aria-label="Open menu"`.
- [ ] Escape closes the menu and returns focus to the toggle button.
- [ ] Tapping or clicking outside the open menu closes it.
- [ ] The page behind the open menu does not scroll; scroll position is preserved on close.
- [ ] The scroll lock applies only below 1080px and never on desktop.
- [ ] Keyboard: Tab cycles through the menu items while open; the menu closes on selection.
- [ ] Verified at 390×844 and 667×375.

## Out of scope
Menu overflow/scrolling in landscape (T-008). A full focus trap — with scroll lock, Escape, and outside-click,
a trap is not required for a menu of this size; revisit if the item list grows.

## Notes / references
`assets/js/main.js:13-26`, `assets/css/style.css:1091-1126`.

---

### T-018

**Title:** T-018 [UX] Fix countdown states: pre-JS zeros, "0 DAYS", no in-session state, unlabelled region

**Labels:** ux, a11y, frontend

**Priority:** P2
**Effort:** M

## Problem
The hero countdown (`index.html:64-76`, `assets/js/main.js:83-124`) has four state problems:

1. **Pre-JS state reads as "now".** The HTML ships literal `0 / 00 / 00 / 00`
   (`index.html:67-73`), so before JS runs — and permanently if JS fails (T-001) — the hero announces
   `0 DAYS : 00 HRS : 00 MIN : 00 SEC`, i.e. "the meeting is starting this instant".
2. **"0 DAYS" for a full day.** For the ~24 hours before prayer night the display leads with a zero.
3. **No in-session state.** `nextServiceTime()` rolls forward the moment the clock passes 7:00 PM Friday
   (`main.js:94-96`), so during the meeting itself the hero says "6 days 23 hrs" — the least useful thing
   it could say at the most useful moment.
4. **Unlabelled region.** `index.html:64` is `<div class="countdown" aria-label="Countdown to the next
   Breakthrough Prayer Night">` — `aria-label` on a `<div>` with no role is not reliably announced. The
   digits also change every second with no accessible summary of what they mean.

## Proposed solution
1. Replace the hardcoded zeros with `<span data-unit="days">–</span>` etc., so the pre-JS state reads as
   "not yet known" rather than "now".
2. Hide the days cell when the value is 0: `cells.days.closest(".countdown__cell").hidden = (days === 0)`,
   and hide the separator after it.
3. Add an in-session window. Prayer night runs Friday 7:00 PM; assume a 2-hour window
   (**needs product confirmation** on the actual end time) and, while `now` falls inside it, replace the grid with:
   **"The house is in prayer now."** in `--gold-bright`, keeping `.countdown__when` beneath it.
4. Accessibility:
   - Change the wrapper to `<section class="countdown" aria-labelledby="countdownLabel">` and give
     `.countdown__label` the id `countdownLabel`.
   - Mark `.countdown__grid` `aria-hidden="true"` (per-second digit changes are noise to a screen reader).
   - Add a visually hidden, `aria-live="off"` sentence that carries the real information:
     **"The next Breakthrough Prayer Night is on Friday at 7:00 PM at Taurama Aquatic Centre Lounge,
     Port Moresby."**
5. Pause the interval when the tab is hidden (`document.visibilitychange`) and resync on return.

## Acceptance criteria
- [ ] Before JS runs, the countdown shows placeholder dashes, not zeros.
- [ ] The days cell and its separator are hidden when days is 0.
- [ ] During the prayer-night window the hero shows the in-session message instead of a countdown to next week.
- [ ] After the window ends, the countdown rolls to the following Friday.
- [ ] A screen reader announces the venue-and-time sentence once and does not announce ticking digits.
- [ ] The countdown region is exposed as a labelled landmark or region.
- [ ] The interval stops while the tab is hidden and the display is correct on return.
- [ ] Verified across a timezone boundary (set the browser to UTC-8 and to UTC+12; the target must stay Friday 7:00 PM Port Moresby time).

## Out of scope
A second countdown for Sunday Celebration. Calendar/ICS export. Changing the countdown's visual design.

## Notes / references
`index.html:64-76`, `assets/js/main.js:83-124`, `assets/css/style.css:448-501`. The PNG offset handling
(`PNG_OFFSET_MS = 10h`, no DST) is correct — do not change it. See also T-019 (times duplicated across files).

---

### T-019

**Title:** T-019 [DX] Move service times to one source and correct the README's "Updating content" section

**Labels:** docs, dx, frontend

**Priority:** P2
**Effort:** M

## Problem
`README.md` tells editors:

> "All text lives directly in `index.html` — service times, location, messages, leadership bios,
> prophecies, and contact details can be edited there."

This is not true of service times. The prayer-night day and hour are also hardcoded in
`assets/js/main.js:84-86`:

```js
var PNG_OFFSET_MS = 10 * 60 * 60 * 1000;
var PRAYER_NIGHT_DAY = 5;   // Friday
var PRAYER_NIGHT_HOUR = 19; // 7:00 PM
```

Service information appears in **four** places:

| Location | Content |
|---|---|
| `index.html:75` | "Friday · 7:00 PM · Taurama Aquatic Centre Lounge" |
| `index.html:424, 432, 440` | Gather section times and venue |
| `index.html:580` | Footer meta block |
| `main.js:84-86` | Countdown target |

If the church moves prayer night to Saturday and an editor follows the README, the hero copy will say
Saturday while the countdown silently counts to Friday — a wrong time displayed with total confidence, on
the site's most prominent element.

## Proposed solution
1. Drive the countdown from the DOM instead of from constants. Put the canonical values on the countdown
   element as data attributes:
   ```html
   <p class="countdown__grid" id="countdown" data-day="5" data-hour="19" data-utc-offset="10">
   ```
   and read them in `main.js` with the current constants as fallbacks. One file to edit, and the value
   sits next to the copy it must agree with.
2. Add a clearly marked block near the top of `index.html` listing every place service information
   appears, as an HTML comment, so an editor updating one updates all:
   ```html
   <!-- SERVICE TIMES appear in 4 places: hero countdown (data-day/data-hour + .countdown__when),
        §VIII Gather (.gather__time ×2), the footer (.footer__meta). Update all four together. -->
   ```
3. Correct the README's "Updating content" section to say exactly this, and add the missing local-preview
   line:
   ```markdown
   ### Previewing locally
   No build step is required. Serve the folder and open it in a browser:
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```
   Opening `index.html` directly from the filesystem also works, but serving it matches how GitHub Pages behaves.
   ```

## Acceptance criteria
- [ ] Changing `data-day`/`data-hour` on `#countdown` changes the countdown target, with no edit to `main.js`.
- [ ] `main.js` still works if the data attributes are absent (falls back to the current constants).
- [ ] `README.md` no longer claims all editable text lives only in `index.html`, and names every file and place service times appear.
- [ ] `README.md` includes a local-preview command.
- [ ] Changing the prayer night to a different day in `index.html` alone produces a page where the hero copy, the Gather section, the footer, and the countdown all agree.

## Out of scope
Introducing a build step, a templating language, or a JSON content file. Full CMS.

## Notes / references
`README.md` "Updating content", `assets/js/main.js:83-98`, `index.html:75, 421-441, 580`. Related: T-018.

---

### T-020

**Title:** T-020 [UI] Fix horizontal overflow at 320px in the contact list

**Labels:** ui, bug, frontend

**Priority:** P2
**Effort:** S

## Problem
At a 320px viewport the document overflows horizontally: measured `scrollWidth 322` against
`clientWidth 320`. The overflowing elements are `.contact-list` and its rows in §X, with
`.split__text`, its `h2`, its `.lead`, and `.connect-form` all reported at `right: 322`.

Cause: `.contact-list li { grid-template-columns: 96px 1fr; gap: 1rem; }`
(`assets/css/style.css:907-916`). At 320px the container is `92vw = 294px`, leaving 182px for the value
column — not enough for the un-breakable string `facebook.com/tfhanc`, which forces the grid wider than
its container.

`body { overflow-x: hidden }` (`style.css:55`) means this does not produce a scrollbar — it **silently
clips** the right edge of the section instead, so the defect is invisible in testing but real for users
on 320px-class devices (iPhone SE 1st gen, Galaxy Fold cover screen, older Android handsets common in PNG).

## Proposed solution
Stack the contact list below 480px, matching how `.record__row` already handles the same problem
(`style.css:1147`):

```css
@media (max-width: 480px) {
  .contact-list li { grid-template-columns: 1fr; gap: 0.15rem; }
}
.contact-list a { overflow-wrap: anywhere; }
```

Separately, consider removing `overflow-x: hidden` from `body` once overflow sources are fixed — it is
currently masking this class of bug. **Needs design review** on whether the hero's decorative layers
depend on it; `.hero` already has its own `overflow: hidden` (`style.css:334`), so it likely does not.

## Acceptance criteria
- [ ] At 320px, `document.documentElement.scrollWidth === clientWidth`.
- [ ] The same holds at 280px (Galaxy Fold cover screen).
- [ ] `facebook.com/tfhanc` and `info@tfhanc.org` are fully visible and tappable at 320px.
- [ ] No visual regression to the contact list at 390px, 768px, or 1280px.
- [ ] Verified at 320, 375, 390, 768, 1024, and 1280px.

## Out of scope
Restructuring §X layout. Removing `overflow-x: hidden` (raise separately if the design review agrees).

## Notes / references
`assets/css/style.css:55, 902-926, 1138-1149`, `index.html:507-511`. Measured with headless Chromium.

---

### T-021

**Title:** T-021 [A11y] Tell users when a link opens in a new tab

**Labels:** a11y, copy, frontend

**Priority:** P2
**Effort:** S

## Problem
Seven links use `target="_blank"` and none of them say so — verified, all have `aria-label: null` except
the footer social icon, whose label is just "Facebook":

| Link | Destination |
|---|---|
| "About Jonathan David — jonathan-david.org" | jonathan-david.org |
| "Messages from this house" card | youtube.com/@tfhanc |
| "All Nations Sanctuary, Muar" card | youtube.com/@ISAACGLOCAL |
| "Conference messages" card | facebook.com/tfhanc |
| "Get directions →" | maps.google.com |
| "facebook.com/tfhanc" | facebook.com/tfhanc |
| Footer social icon | facebook.com/tfhanc |

WCAG 3.2.5 (AAA) and long-standing usability practice: an unannounced context change disorients screen
reader users and anyone who then presses Back and finds nothing happens. On mobile the new-tab jump is
particularly disruptive for a first-time visitor mid-flow.

## Proposed solution
Add a small visually-marked-and-announced indicator on every external link, reusing the existing
`.card__go` arrow pattern rather than adding an icon set.

1. Add a shared visually hidden utility:
   ```css
   .u-visually-hidden {
     position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
     overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
   }
   ```
2. Append to each external link's accessible name:
   `<span class="u-visually-hidden"> (opens in a new tab)</span>`
3. For the footer social icon, change `aria-label="Facebook"` to
   `aria-label="The Father's House on Facebook (opens in a new tab)"`.
4. For the three `.card--link` cards, the `.card__go` line already carries "Watch on YouTube →" — append
   the hidden span there so it lands at the end of the accessible name.

## Acceptance criteria
- [ ] Every `target="_blank"` link's accessible name ends with "(opens in a new tab)".
- [ ] The added text is invisible on screen and does not affect layout at any breakpoint.
- [ ] The footer social icon's accessible name names both the destination and the behaviour.
- [ ] Verified with a screen reader on at least three of the seven links.
- [ ] No change to rendered appearance (compare screenshots at 390px and 1280px).

## Out of scope
Removing `target="_blank"`. Adding a visible external-link glyph — **needs design review** if desired;
the editorial design deliberately avoids icon clutter.

## Notes / references
`index.html:242, 367, 373, 379, 441, 509, 581`. WCAG 3.2.5 Change on Request.

---

### T-022

**Title:** T-022 [Copy] Align Scripture citation format with STYLE_GUIDE §3, and update the guide for NASB1995

**Labels:** copy, docs

**Priority:** P2
**Effort:** S

## Problem
Two related drifts between the site and its own style guide.

**a) Citation format.** `STYLE_GUIDE.md` §3.2 mandates parentheses around the translation:

> **"…then will I hear from heaven … and will heal their land."**
> — 2 Chronicles 7:14 (KJV)

All four citations on the site instead use a middot and are uppercased by
`.verse cite { text-transform: uppercase }` (`style.css:638-648`):

| Line | Rendered |
|---|---|
| `index.html:57` | `2 CHRONICLES 7:14 · KJV` |
| `index.html:95` | `MARK 11:17 · NASB1995` |
| `index.html:185` | `JAMES 5:16 · KJV` |
| `index.html:400` | `MALACHI 3:10 · NIV` |

`STYLE_GUIDE.md` states plainly: *"when copy and this guide disagree, the guide prevails."* So either the
copy is wrong on all four, or the guide is out of date — right now the project has no single answer.

**b) The guide's table is stale.** `STYLE_GUIDE.md` §3 lists Mark 11:17 as **(KJV)**. Commit `c3b477a`
changed the site to **NASB1995** and the guide was never updated. The NASB1995 rendering also legitimately
uses full capitals for the Old Testament quotation ("MY HOUSE SHALL BE CALLED…"), which reads as a direct
contradiction of §4's "retire ALL-CAPS shouting" with no documented exception.

## Proposed solution
Recommended default — keep the site's typographic treatment and update the guide, since the middot
separator is a deliberate design decision consistent across the whole page:

1. Amend `STYLE_GUIDE.md` §3.2 to allow the site's display form:
   > "In prose, name the translation in parentheses: *2 Chronicles 7:14 (KJV)*. In display citation
   > blocks (`.verse cite`, `.hero__verse cite`), the reference and translation are set as a single
   > small-caps line separated by a middot: *2 Chronicles 7:14 · KJV*. Both forms are the same citation;
   > do not mix them within one context."
2. Update the §3 table: Mark 11:17 → **(NASB1995)**.
3. Add an exception to §4:
   > "Exception: where a translation sets Old Testament quotations in capitals as an editorial convention
   > (NASB renders them so), reproduce them as the translation prints them. §3.3 (quote exactly) prevails
   > over §4's prohibition on capitals."
4. Verify all four quotations word-for-word against their named translations, and confirm the ellipses
   mark real omissions per §3.3.

## Acceptance criteria
- [ ] `STYLE_GUIDE.md` §3 documents both the prose and display citation forms with an example of each.
- [ ] The §3 table lists Mark 11:17 as NASB1995.
- [ ] §4 carries a documented exception for translation-set capitals, cross-referenced from §3.
- [ ] All four on-page quotations are verified verbatim against their named translation.
- [ ] Every quotation on the page carries both a reference and a translation (§9 checklist item 1).
- [ ] No further disagreement remains between `STYLE_GUIDE.md` and `index.html`.

## Out of scope
Changing which translations are used. Changing `.verse cite` typography. Adding more Scripture.

## Notes / references
`STYLE_GUIDE.md` §3, §4, §9; `index.html:55-58, 93-96, 183-186, 398-401`; `assets/css/style.css:638-648`.
Commit `c3b477a` made the NASB1995 change.

---

### T-023

**Title:** T-023 [Copy] Standardise "Dr Jonathan David" across the page

**Labels:** copy, bug

**Priority:** P2
**Effort:** S

## Problem
`STYLE_GUIDE.md` §6 sets the form as **Dr Jonathan David** (no full stop, Commonwealth convention,
consistent with §7's Commonwealth spelling rule). The page uses three forms:

| Form | Count | Lines |
|---|---|---|
| `Dr Jonathan` | 2 | `index.html:233, 240` |
| `Dr. Jonathan` | 2 | `index.html:220` (twice, in Pastor Ben's bio) |
| `Dr&nbsp;Jonathan` | 1 | `index.html:120` (The Record) |

Line 220 contains both a "Dr. Jonathan David Permanent School of the Prophets" and "He relates to
Dr. Jonathan David…" within one paragraph, while the accordion header two items below reads "Dr Jonathan
David". On a page whose whole argument is institutional precision, the inconsistency is visible.

## Proposed solution
Normalise all five occurrences to **Dr Jonathan David** (no full stop). Keep the non-breaking space in
"The Record" (`Dr&nbsp;Jonathan David`) — it prevents an awkward line break in the narrow `dd` column —
and add the same `&nbsp;` treatment in the accordion header where the column is also narrow.

Also confirm the school's official name while editing line 220: the site renders it as "the Dr. Jonathan
David Permanent School of the Prophets" here and "the Permanent School Of the Prophets" at line 241, with
an inconsistent capital "Of". Standardise to **the Permanent School of the Prophets** and check the
official form against jonathan-david.org — **needs product confirmation**.

Add a line to `STYLE_GUIDE.md` §6 covering the school name once settled.

## Acceptance criteria
- [ ] `grep -c "Dr\. Jonathan" index.html` returns 0.
- [ ] All occurrences render as "Dr Jonathan David".
- [ ] "Permanent School of the Prophets" is capitalised identically in both places.
- [ ] `STYLE_GUIDE.md` §6 documents the school's name form.
- [ ] No line-break awkwardness introduced in "The Record" or the accordion header at 320px and 390px.

## Out of scope
Rewriting the bios. Verifying biographical facts beyond the name forms.

## Notes / references
`index.html:120, 220, 233, 240-241`, `STYLE_GUIDE.md` §6, §7.

---

### T-024

**Title:** T-024 [SEO] Add Church structured data with address, service times and social profiles

**Labels:** seo, enhancement, frontend

**Priority:** P2
**Effort:** S

## Problem
The `<head>` (`index.html:3-17`) contains no structured data. For a local congregation, `Church` JSON-LD
is the single highest-leverage discovery change available: it is what feeds Google's knowledge panel,
"church near me" results, and the service-times card. Someone searching "prayer meeting Port Moresby" or
"All Nations Church Port Moresby" currently gets nothing structured from this site.

## Proposed solution
Add before `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "The Father's House, All Nations Church",
  "alternateName": "TFH ANC",
  "url": "https://n30dyn4m1c.github.io/tfhanc/",
  "logo": "https://n30dyn4m1c.github.io/tfhanc/assets/img/logo.svg",
  "image": "https://n30dyn4m1c.github.io/tfhanc/assets/img/og.png",
  "email": "info@tfhanc.org",
  "slogan": "Executing the Mandate. Advancing the Kingdom. It is now.",
  "description": "A house of breakthrough prayer in Port Moresby, standing for Papua New Guinea and the nations.",
  "address": {
    "@type": "PostalAddress",
    "name": "Taurama Aquatic Centre Lounge",
    "addressLocality": "Port Moresby",
    "addressCountry": "PG"
  },
  "parentOrganization": { "@type": "Organization", "name": "The Father's House Inc." },
  "sameAs": [
    "https://facebook.com/tfhanc",
    "https://www.youtube.com/@tfhanc"
  ],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "19:00", "closes": "21:00", "name": "Breakthrough Prayer Night" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "13:30", "name": "Sunday Celebration" }
  ]
}
</script>
```

Also add `robots.txt` and `sitemap.xml` at the repo root (one URL each — trivial, but they signal the
canonical host to crawlers).

Prayer-night close time and the street address / suburb need confirming — **needs product confirmation**.
Recommended defaults above: 21:00 close, address at venue-name level only.

## Acceptance criteria
- [ ] The JSON-LD validates with no errors in Google's Rich Results Test and schema.org validator.
- [ ] `openingHoursSpecification` times match the times shown in §VIII Gather and the footer.
- [ ] `sameAs` lists only URLs that actually exist and are reachable.
- [ ] All URLs inside the JSON-LD are absolute.
- [ ] `robots.txt` and `sitemap.xml` are served (`.nojekyll` already ensures files are served as-is).
- [ ] The structured data is kept in sync when service times change (add to the T-019 comment block).

## Out of scope
`geo` coordinates (add once the exact venue location is confirmed). `Event` markup for conferences —
revisit once §IX has dated events (T-028). Google Business Profile setup.

## Notes / references
`index.html:3-17`, times at `index.html:424, 432, 580`, venue at `index.html:440-441`.
Coordinate absolute URLs with T-003.

---

### T-025

**Title:** T-025 [Perf] Reduce the Google Fonts payload and provide a metrics-matched fallback

**Labels:** performance, frontend

**Priority:** P2
**Effort:** M

## Problem
`index.html:15` requests, from a third-party origin, six Fraunces variants (300/400/500/600 upright plus
300/400/500 italic, on a 9–144 optical-size axis) and four Outfit weights. Text does not paint until
either the fonts arrive or the `display=swap` timeout fires.

Two consequences on the slow mobile connections common in Port Moresby:

1. A third-party DNS + TLS + fetch round trip sits on the critical path before styled text appears.
   `preconnect` (`index.html:13-14`) helps but does not remove it.
2. The fallback stack is `Georgia, "Times New Roman", serif` (`style.css:37`). Georgia's metrics differ
   substantially from Fraunces, so the swap produces a visible reflow of the entire page — most obviously
   the `clamp(3rem, 9vw, 6.4rem)` hero headline.

## Proposed solution
1. **Trim the request.** Audit which weights are actually used. Grep of `style.css` shows
   `font-weight: 300, 400, 500, 600` for Fraunces and `300, 400, 500, 600` for Outfit, with italics used
   at 300/400 only. Drop any variant with no usage and request a narrower optical-size range.
2. **Preload the two critical faces** (the hero headline face and the nav/kicker sans) with
   `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
3. **Give the fallbacks matched metrics** so the swap does not reflow:
   ```css
   @font-face {
     font-family: "Fraunces Fallback";
     src: local("Georgia");
     size-adjust: 105%;      /* tune against the real face */
     ascent-override: 90%;
     descent-override: 22%;
   }
   :root { --font-serif: "Fraunces", "Fraunces Fallback", Georgia, serif; }
   ```
   Tune the percentages by measuring both faces at the same size, not by guessing.
4. **Consider self-hosting** the woff2 files under `assets/fonts/`. It removes the third-party origin
   entirely, works if fonts.googleapis.com is slow or blocked, and suits a repo that already prides itself
   on having no external dependencies. Check the Fraunces and Outfit licences (both SIL OFL) permit
   redistribution — they do. **Needs design review** on the added repo weight (~200–400 KB).

## Acceptance criteria
- [ ] The font request lists only weights and styles actually used in `assets/css/style.css`.
- [ ] Cumulative Layout Shift attributable to the font swap is below 0.05, measured in Lighthouse on a simulated Slow 4G profile.
- [ ] Largest Contentful Paint on Slow 4G improves against the current baseline (record the baseline first).
- [ ] The page renders with correct proportions before webfonts load — verify by blocking `fonts.gstatic.com`.
- [ ] No visual change to the final rendered typography.

## Out of scope
Changing the typefaces. Variable-font subsetting by unicode-range unless it falls out of the self-hosting work.

## Notes / references
`index.html:13-15`, `assets/css/style.css:37-38`. Record a Lighthouse baseline before changing anything.

---

### T-026

**Title:** T-026 [UX] Surface the prayer-night countdown above the fold on mobile

**Labels:** ux, ui, design

**Priority:** P2
**Effort:** M

## Problem
On a 390×844 device — a typical modern phone — the hero renders, in order: place line (3 lines of
letterspaced caps), H1, Scripture blockquote, citation, "This house stands on that word…", two full-width
stacked CTAs, and only then the countdown. The countdown and its
"Friday · 7:00 PM · Taurama Aquatic Centre Lounge" line are **entirely below the fold**; verified by
screenshot.

The countdown is the one element on the page that answers the visitor's actual question ("when does this
happen?") and the one that creates urgency. Mobile is the dominant device for this audience. Right now it
requires a scroll that many visitors will not make.

Contributing factors: `.hero__place` at `letter-spacing: 0.32em` wraps to three lines at 390px;
`.hero__title` uses `clamp(3rem, 9vw, 6.4rem)`; `.hero__actions .btn { width: 100% }` below 600px
(`style.css:1148`) stacks the two CTAs to full height.

## Proposed solution
**Needs design review** — the hero is the strongest thing on the site and should not be flattened. Three
options, in order of preference:

**A (recommended).** Below 600px, compress the hero's vertical rhythm and move the countdown above the CTAs:
- `.hero__place`: reduce to `letter-spacing: 0.2em`, `font-size: 0.68rem` so it fits two lines.
- `.hero__stand`: hide below 600px — it restates the Scripture that sits directly above it.
- Reorder with flex `order` so the sequence is: place → title → verse → **countdown** → CTAs.
- Reduce `.hero__title` margin-bottom from `2rem` to `1.2rem` below 600px.

**B.** Keep the order and add a compact one-line "next prayer night" strip directly under the CTAs
(`Next: Friday 7:00 PM · Taurama Aquatic Centre Lounge`) with the full countdown remaining below.

**C.** Do nothing to the hero and instead make the sticky nav show the countdown once scrolled past the hero.
More engineering, and it competes with the nav CTA.

## Acceptance criteria
- [ ] At 390×844, the countdown digits and the "Friday · 7:00 PM · Taurama Aquatic Centre Lounge" line are fully visible without scrolling.
- [ ] Same at 375×667 (iPhone SE).
- [ ] The H1 and at least one CTA remain above the fold at both sizes.
- [ ] No regression to the desktop hero at 1280×800 — compare screenshots.
- [ ] The hero still fills at least `100svh` and the arch artwork is not clipped awkwardly.
- [ ] Verified at 320, 375, 390, 768, and 1280px.

## Out of scope
Redesigning the hero for desktop. Removing the Scripture citation or either CTA. Countdown state logic (T-018).

## Notes / references
`index.html:44-79`, `assets/css/style.css:324-501, 1138-1149`. **Needs design review.**

---

### T-027

**Title:** T-027 [Copy] Fix the Messages section lead and card descriptions

**Labels:** copy

**Priority:** P2
**Effort:** S

## Problem
§VI's lead (`index.html:364`) reads:

> "Sunday messages from this house and the houses it stands with — watch, listen, and share."

The section offers three links to video platforms. There is **no audio or podcast** ("listen") and **no
share affordance** ("share"). Two of three promised verbs are unmet.

The three card bodies also quote sermon lines rather than describing what the visitor will find:

| Card | Current body |
|---|---|
| TFH ANC | "Faith does not wait for a convenient season. Step into what God is doing today." |
| ANS Muar | "Understanding the assignment of the house — advancing the Kingdom, now." |
| ISAAC PNG | "Representing Heaven's authority in the everyday places God has sent you." |

None tells the visitor what is at the other end of the link, which is what a card body is for. This is also
inconsistent with §VIII and §IX, where card bodies do describe their subject.

## Proposed solution
Lead (`index.html:364`):

> **"Messages from this house and the houses it stands with. Watch on YouTube and Facebook."**

Card bodies — see T-013 for the third card's destination, which must be settled first:

| Card | Proposed body |
|---|---|
| TFH ANC | **"Sunday messages and prayer-night teaching from this house, published as they are preached."** |
| ANS Muar | **"Teaching from All Nations Sanctuary, Muar — the apostolic source this house relates to."** |
| Third | **"Messages from the conferences and encounters this house gathers for through the year."** |

If a podcast or audio feed does exist, add it as a fourth card and restore "listen" to the lead —
**needs product confirmation**.

## Acceptance criteria
- [ ] The §VI lead promises only what the section delivers.
- [ ] Each card body describes its destination rather than quoting a sermon.
- [ ] Card `.card__kicker`, `<h3>`, body, and `.card__go` all describe the same destination.
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist (governmental register, no hype, Commonwealth spelling).
- [ ] Cards do not change height enough to break the three-column grid at 1280px, or stack awkwardly at 390px.

## Out of scope
Adding a podcast, embedding players, or building a message archive. The third card's destination is T-013.

## Notes / references
`index.html:355-387`, `STYLE_GUIDE.md` §4, §9.

---

### T-028

**Title:** T-028 [Content] Give Article IX Conferences dates and a way to register, or fold it into Gather

**Labels:** content, ux

**Priority:** P2
**Effort:** M

## Problem
§IX Conferences (`index.html:455-493`) describes three conference *types* — Annual Conference, Leadership
Summit, Youth & Young Adults Encounter — with no date, no venue, no duration, no cost, and no
registration. Its lead says "Throughout the year this house gathers for conferences and encounters" and
the section's only action, "Get Conference Updates", scrolls to the prayer-request form (see T-005).

A visitor who wants to attend a conference cannot learn when one is, and cannot register interest through
anything other than an email titled "Prayer Request". The section reads as a placeholder.

## Proposed solution
**Needs product confirmation** on whether dated conferences exist for the coming year.

**If they do:** add to each card a date line using the existing `.gather__time` treatment
(`style.css:759-767`) and a venue line, then replace the section CTA with a per-card action. Once dates
exist, add `Event` JSON-LD (see T-024).

**If they do not (recommended interim):** be explicit rather than implying a schedule that is not
published. Revise the lead:

> **"Throughout the year this house gathers for conferences and encounters — days of contending prayer,
> impartation, and prophetic ministry. Dates for the coming year are announced here and on Facebook as
> they are set."**

and change the CTA to **"Tell me when dates are announced"**, wired to the `conference` topic from T-005.

If neither dates nor a notification route can be supported, fold the three cards into §VIII Gather as a
short "Through the year" note and remove §IX — a nine-article page with substance beats a ten-article page
with a placeholder.

## Acceptance criteria
- [ ] §IX either lists at least one dated conference, or states plainly that dates are announced when set.
- [ ] The section CTA lands somewhere that matches its label (depends on T-005).
- [ ] No card implies a schedule that is not published.
- [ ] If §IX is removed, the article numerals I–IX renumber correctly in both the kickers and the footer nav, and no anchor 404s.
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist.

## Out of scope
Ticketing or payment. Building an events calendar. Adding `Event` structured data before dates exist.

## Notes / references
`index.html:455-493`, `.gather__time` at `assets/css/style.css:759-767`, related T-005, T-024.
**Needs product confirmation.**

---

### T-029

**Title:** T-029 [DX] Add a CI workflow: HTML validation, link check, and a Lighthouse budget

**Labels:** dx, ci, enhancement

**Priority:** P2
**Effort:** M

## Problem
There is no `.github/` directory and no automated checking of any kind. Several findings in this audit
are exactly what a five-minute CI job catches automatically:

- the relative `og:image` (T-003) — flagged by any metadata linter,
- four links to the same URL with one mislabelled (T-013) — flagged by a link checker,
- contrast failures (T-015) and the missing `<main>` (T-012) — flagged by axe,
- the JS-disabled blank page (T-001) — flagged by a Lighthouse run.

Without CI, every one of these has to be caught by a human reading 592 lines of HTML, and each will
regress the next time someone edits the file.

## Proposed solution
Add `.github/workflows/checks.yml` running on push and pull request:

1. **HTML validation** — `html-validate` or the W3C Nu validator against `index.html`.
2. **Link check** — `lychee` over `index.html` and `README.md`, with `--exclude mailto:`. Fails on any 404
   and reports redirects.
3. **Accessibility** — `@axe-core/cli` or `pa11y-ci` against a locally served copy, failing on serious and
   critical violations.
4. **Lighthouse** — `treosh/lighthouse-ci-action` with a budget:
   `performance ≥ 0.90`, `accessibility ≥ 0.95`, `best-practices ≥ 0.95`, `seo ≥ 0.95`.

Serve the site for steps 3–4 with `python3 -m http.server` — no build step exists and none should be added.

Record the current scores in the PR that adds this so the budget starts from a real baseline rather than
an aspiration, and set thresholds at or just below today's numbers, tightening as the tickets above land.

## Acceptance criteria
- [ ] A workflow runs on every push and pull request to `main` and to `claude/*` branches.
- [ ] The workflow fails on invalid HTML, a broken link, a serious/critical axe violation, or a Lighthouse score below budget.
- [ ] Current baseline scores are recorded in the workflow file as a comment.
- [ ] The workflow completes in under three minutes.
- [ ] `README.md` gains a short "Checks" section describing what runs and how to run it locally.
- [ ] No build step or `package.json` is added to the repo root that changes the "no build step" story — pin tool versions inside the workflow.

## Out of scope
Deployment automation (GitHub Pages already deploys from `main`). Visual regression testing. Adding a bundler.

## Notes / references
No `.github/` directory currently exists. `README.md` "Hosting on GitHub Pages" documents the deploy path.

---

### T-030

**Title:** T-030 [A11y] Raise interactive targets to 24×24 minimum

**Labels:** a11y, ui

**Priority:** P3
**Effort:** S

## Problem
Measured element heights against WCAG 2.2 AA 2.5.8 (Target Size — Minimum, 24×24 CSS px):

| Element | Height | Where |
|---|---|---|
| `.nav__links a` | **23px** | Desktop nav (7 links) |
| "Get directions →" | **18px** | §VIII Location card |
| "Let us know you're coming →" | **18px** | §VIII Your First Time card |
| `.footer__links a` | 25px | Footer nav (10 links) — passes, with no margin |

The two `.link` arrows sit on their own line at the end of a card rather than inline within a sentence,
so the "inline in a block of text" exception in 2.5.8 does not cleanly apply to them. Mobile nav links
(0.95rem padding) and `.nav__toggle` (44px) are fine.

Small, hard-to-hit targets particularly affect visitors with motor impairments and anyone using the site
one-handed on a phone.

## Proposed solution
```css
.nav__links a { padding-block: 0.35rem; }   /* 23px → 30px, no layout shift at 1080px+ */

.link {
  display: inline-block;
  padding-block: 0.25rem;                    /* 18px → 26px */
}

.footer__links { gap: 0.9rem 2rem; }         /* was 0.7rem — more separation between 25px targets */
```

Verify `.nav__links a` padding does not push the nav past `--nav-h: 72px` or force a wrap at the 1080px
breakpoint.

## Acceptance criteria
- [ ] Every interactive element on the page measures at least 24×24 CSS px, or has at least 24px of clear spacing around it.
- [ ] The nav still fits on one line at 1080px without wrapping or overlapping the brand.
- [ ] `--nav-h` is unchanged and the nav height does not grow.
- [ ] No visual change beyond the increased hit areas — compare screenshots at 390px, 768px, and 1280px.
- [ ] Verified by measurement, not by eye.

## Out of scope
Redesigning the nav or footer. Increasing font sizes.

## Notes / references
`assets/css/style.css:108-114, 278-289, 1036-1049`. Measured with headless Chromium at 1280×900.
WCAG 2.2 2.5.8 Target Size (Minimum), AA.

---

### T-031

**Title:** T-031 [UX] Highlight the current article in the nav while scrolling

**Labels:** ux, frontend, enhancement

**Priority:** P3
**Effort:** M

## Problem
The page is one document with ten articles and roughly ten screens of scroll. The nav gives no indication
of where the visitor currently is — `assets/js/main.js` has no scrollspy, and `assets/css/style.css` has
no active-state rule for `.nav__links a`.

On a long single-page site the nav is the only orientation device available. Without an active state it
functions as a jump menu but not as a map, and a visitor who scrolls organically (rather than clicking)
has no idea which article they are reading or how far through they are.

## Proposed solution
Reuse the `IntersectionObserver` already in `main.js:30-45` rather than adding a scroll handler:

```js
var sections = document.querySelectorAll("main section[id]");
var navMap = {};
document.querySelectorAll('.nav__links a[href^="#"]').forEach(function (a) {
  navMap[a.getAttribute("href").slice(1)] = a;
});
var spy = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    var link = navMap[e.target.id];
    if (!link) return;
    link.classList.toggle("is-current", e.isIntersecting);
    if (e.isIntersecting) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(function (s) { spy.observe(s); });
```

Style it with the existing gold accent rather than a new colour:

```css
.nav__links a.is-current { color: var(--night-text); }
.nav.is-scrolled .nav__links a.is-current { color: var(--text); }
.nav__links a.is-current::after {
  content: ""; display: block; height: 1px; margin-top: 3px;
  background: var(--gold-bright);
}
```

The underline must not shift layout when it appears — reserve the 4px with a transparent border in the
base rule.

## Acceptance criteria
- [ ] Scrolling through the page highlights exactly one nav link at a time.
- [ ] The highlighted link carries `aria-current="true"` and no other link does.
- [ ] Sections not present in the nav (`#why-we-pray`, `#prayer`, `#conferences`) do not clear the highlight — the nearest preceding nav section stays marked.
- [ ] The active indicator meets 3:1 non-text contrast on both the transparent-over-hero and `is-scrolled` nav states.
- [ ] No layout shift when the indicator appears or disappears.
- [ ] Works on mobile inside the open menu.
- [ ] Degrades silently where `IntersectionObserver` is unavailable (`main.js:30` already branches on this).

## Out of scope
A progress bar. Changing nav contents (T-009). Deep-linking or URL hash updates on scroll.

## Notes / references
`assets/js/main.js:28-50`, `assets/css/style.css:272-300`. Depends on T-012 (`<main>`) for the selector above.

---

### T-032

**Title:** T-032 [UX] Decide whether to publish a phone or WhatsApp contact route

**Labels:** ux, content, needs-product-confirmation

**Priority:** P3
**Effort:** S

## Problem
The only contact routes on the site are `info@tfhanc.org` (`index.html:508`, plus the `mailto:` form
handoff) and `facebook.com/tfhanc` (`index.html:509`). There is **no phone number and no WhatsApp link**
anywhere on the page.

In Papua New Guinea, mobile-first contact — a phone call, an SMS, or WhatsApp — is how most people reach
an organisation, and email is a comparatively distant second. A visitor who wants to ask "is there a
service tonight?" or "how do I find the lounge?" has no fast route, and the `mailto:` handoff is itself
fragile (T-006).

This is a product decision, not a design one: a church may deliberately not publish a personal number.

## Proposed solution
**Needs product confirmation.** Recommended default: publish a single ministry contact number (not a
personal one) as a `tel:` link and a WhatsApp deep link in the §X contact list, reusing the existing
`.contact-list` markup with no new component:

```html
<li><span>Phone</span><a href="tel:+675XXXXXXX">+675 XXX XXXX</a></li>
<li><span>WhatsApp</span><a href="https://wa.me/675XXXXXXX" target="_blank" rel="noopener">Message the house</a></li>
```

Add the same number to the footer `.footer__meta` block (`index.html:580`) and to the JSON-LD `telephone`
field (T-024).

If leadership prefers not to publish a number, say so rather than leaving the gap unexplained — add to the
§X lead: **"Written requests are answered within the week; for anything urgent, speak to a leader at the
Friday gathering."**

## Acceptance criteria
- [ ] §X either publishes a phone/WhatsApp route or states the expected response time for written contact.
- [ ] Any published number uses `tel:` and `https://wa.me/` links that work on a real handset.
- [ ] The number is reproduced identically in §X, the footer, and the JSON-LD.
- [ ] The contact list does not overflow at 320px with the added rows (see T-020).
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist.

## Out of scope
A live chat widget. An SMS prayer line. Contact form backends (T-006).

## Notes / references
`index.html:507-511, 580`, `.contact-list` at `assets/css/style.css:902-926`.
**Needs product confirmation.**

---

### T-033

**Title:** T-033 [Frontend] Decide the i18n position for a Port Moresby audience

**Labels:** i18n, content, needs-product-confirmation

**Priority:** P3
**Effort:** L

## Problem
Every string on the site is hardcoded in `index.html` with `lang="en"` (`index.html:2`). There is no
translation layer, no `hreflang` alternates, and no externalised copy.

Tok Pisin is one of Papua New Guinea's official languages and a lingua franca in Port Moresby. A
meaningful share of the intended audience — particularly first-time visitors reached through Facebook —
may read Tok Pisin more comfortably than the site's deliberately formal, governmental English register,
which is demanding even for confident English readers.

This is raised as a **decision to make**, not a defect to fix. The site's editorial voice is a genuine
asset and a bilingual site would double the copy-maintenance burden on a volunteer team.

## Proposed solution
**Needs product confirmation.** Three options, cheapest first:

**A (recommended default).** Stay English-only, and do the two things that cost nothing: keep `lang="en"`
accurate, and translate only the highest-stakes passage — the §IV salvation prayer — adding it beneath the
English as a second block with `lang="tpi"`. That is the one paragraph where comprehension matters most
and where a mistranslation is least likely.

**B.** Add a second static page `index.tpi.html` with `<link rel="alternate" hreflang="tpi">` and a
language switch in the nav. Doubles the maintenance surface; only worth it if a translator is committed
long-term.

**C.** Externalise all copy to a JSON file and render with a small runtime. Rejected — it would break the
"no build step, works from a file" property the README rightly advertises, and it conflicts with T-001
(content must render without JS).

Whichever is chosen, record it in `STYLE_GUIDE.md` so it is not re-litigated.

## Acceptance criteria
- [ ] A decision is recorded in `STYLE_GUIDE.md` with its rationale.
- [ ] If any non-English content is added, it carries a correct `lang` attribute on its container.
- [ ] `hreflang` alternates are present only if a translated page actually exists.
- [ ] `og:locale` (T-003) matches the decision.
- [ ] Any Tok Pisin copy is reviewed by a fluent speaker before publication.

## Out of scope
Building a translation pipeline. Machine translation of the site. Right-to-left support.

## Notes / references
`index.html:2`, §IV at `index.html:268-282`, `STYLE_GUIDE.md` §7.
**Needs product confirmation.**

---

### T-034

**Title:** T-034 [UI] Tie reveal animation stagger to visual grouping instead of document index

**Labels:** ui, frontend, polish

**Priority:** P3
**Effort:** S

## Problem
`assets/js/main.js:43` assigns each `.reveal` element a transition delay of `(i % 4) * 80ms`, where `i` is
its index among **all 73** reveal elements in document order.

Because the modulo runs across the whole document rather than within each visual group, the delays bear no
relation to what the visitor actually sees entering the viewport. A three-item `.pillars` grid can get
delays of 240ms, 0ms, 80ms — the middle item animating first, then the left, then the right. The effect
reads as jitter rather than as a stagger.

This is polish, not a defect — but it undercuts an animation the design clearly intends to feel composed.

## Proposed solution
Compute the delay per group rather than per document:

```js
document.querySelectorAll(".section, .interlude, .hero").forEach(function (group) {
  group.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i, 3) * 80 + "ms";
  });
});
```

`Math.min(i, 3)` caps the delay so a long section does not end with elements waiting half a second.

Alternatively, stagger only within direct sibling sets (`.pillars li`, `.creed li`, `.cards .card`,
`.gather article`) and give everything else a delay of 0 — this is the more restrained option and probably
the better fit for the editorial design. **Needs design review** on which reads better.

## Acceptance criteria
- [ ] Within any grid of sibling cards, the reveal delay increases left-to-right, top-to-bottom.
- [ ] No element has a transition delay above 240ms.
- [ ] `prefers-reduced-motion: reduce` still disables reveals entirely.
- [ ] The observer still unobserves each element after it fires (no repeated animation on scroll-back).
- [ ] Verified at 390px (single column) and 1280px (multi-column) — the order must be correct in both.

## Out of scope
Changing the reveal's easing, distance, or duration. Adding new animations. The `no-js` fallback is T-001.

## Notes / references
`assets/js/main.js:28-50`, `assets/css/style.css:1073-1087`. Depends on T-001 landing first.

---

### T-035

**Title:** T-035 [Content] Fix the title/summary mismatch on the third Leadership accordion

**Labels:** content, copy, bug

**Priority:** P3
**Effort:** S

## Problem
`index.html:250-258`, the third item in §III Leadership:

- Title: **"The Father's House & ISAAC Network"**
- Summary: *"The volunteers and department heads who make every gathering possible"*
- Body: *"The Father's House and ISAAC Network bring together the volunteers and department heads who serve
  this house — from worship to welcome, hospitality to logistics."*

The title names two institutions; the summary and body describe a volunteer team. A visitor scanning the
accordion headers reads "The Father's House & ISAAC Network" and expects an explanation of the network
relationship — which the page has established as significant in "The Record" (`index.html:122-125`) and in
Dr Jonathan David's bio.

It also sits in a group whose other two items are named people, so a third item named after institutions
breaks the pattern the reader has just learned.

## Proposed solution
Split the conflated ideas. Recommended: retitle this item to describe what it actually contains, and keep
the network relationship where it is already well covered (The Record and item 02).

- Title: **"The Team of This House"**
- Summary: **"The volunteers and department heads who serve every gathering"**
- Body: keep the existing text, with the opening changed to
  **"The team of this house brings together the volunteers and department heads who serve it — from
  worship to welcome, hospitality to logistics. Their faithful service behind the scenes makes every
  gathering possible."**
- CTA: keep "Get Involved", wired to the `serve` topic from T-005.

If the intent was genuinely to explain the ISAAC Network relationship, that is a different item and should
be written as one — **needs product confirmation** on which was meant.

## Acceptance criteria
- [ ] The accordion item's title, summary, and body describe the same subject.
- [ ] The §III accordion group is internally consistent in what its titles name.
- [ ] The CTA destination matches the item's subject (depends on T-005).
- [ ] Copy passes the `STYLE_GUIDE.md` §9 checklist.
- [ ] `aria-controls`/`id` pairs remain valid if the panel id changes.

## Out of scope
Adding named volunteer profiles. Restructuring §III. Explaining the ISAAC Network at length.

## Notes / references
`index.html:247-262`, network context at `index.html:122-125, 240-241`.
**Needs product confirmation.**

---

### Ticket summary

| ID | Title | Priority | Effort | Labels | Milestone |
|---|---|---|---|---|---|
| T-001 | Render all content when JavaScript is unavailable | P0 | S | frontend, a11y, bug | Now |
| T-002 | Remove collapsed accordion panels from the keyboard tab order | P0 | S | a11y, frontend, bug | Now |
| T-003 | Fix Open Graph metadata: absolute og:image, og:url, canonical, Twitter card | P1 | S | seo, bug, frontend | Now |
| T-004 | Remove the white band from the bottom of the Open Graph card | P1 | S | ui, bug, design | Now |
| T-005 | Give the contact form a reason-for-contact field so CTAs match their destination | P1 | M | ux, copy, frontend, enhancement | Now |
| T-006 | Require the message field and confirm the prayer request was sent | P1 | M | ux, frontend, copy, bug | Now |
| T-007 | Add scroll-margin-top so anchor links do not land behind the fixed nav | P1 | S | ui, bug, a11y, frontend | Now |
| T-008 | Make the mobile menu scrollable so the CTA is reachable in landscape | P1 | S | ui, bug, a11y, frontend | Now |
| T-009 | Add Begin Here, Why We Pray and Conferences to the nav, and fix nav order | P1 | S | ux, ia, frontend | Now |
| T-010 | Publish actual prophetic words in Article V, or reframe the section | P1 | M | content, ux, copy | Now |
| T-011 | Wrap accordion triggers in headings so bios and prophecies are navigable | P1 | M | a11y, frontend | Next |
| T-012 | Add a main landmark and point the skip link at it | P1 | S | a11y, frontend | Now |
| T-013 | Fix the "ISAAC PNG — Conference messages" card, which links to the church's own Facebook page | P1 | S | content, bug, copy | Now |
| T-014 | Give visitors a way to actually give in Article VII | P1 | M | ux, content, enhancement | Next |
| T-015 | Fix four measured colour-contrast failures in the token palette | P2 | S | a11y, ui, design | Next |
| T-016 | Add a visible focus indicator to every interactive element | P2 | S | a11y, ui, frontend | Next |
| T-017 | Fix mobile menu state: stale aria-label, no Escape, no outside click, no scroll lock | P2 | S | a11y, ux, frontend, bug | Next |
| T-018 | Fix countdown states: pre-JS zeros, "0 DAYS", no in-session state, unlabelled region | P2 | M | ux, a11y, frontend | Next |
| T-019 | Move service times to one source and correct the README's "Updating content" section | P2 | M | docs, dx, frontend | Next |
| T-020 | Fix horizontal overflow at 320px in the contact list | P2 | S | ui, bug, frontend | Next |
| T-021 | Tell users when a link opens in a new tab | P2 | S | a11y, copy, frontend | Next |
| T-022 | Align Scripture citation format with STYLE_GUIDE §3, and update the guide for NASB1995 | P2 | S | copy, docs | Next |
| T-023 | Standardise "Dr Jonathan David" across the page | P2 | S | copy, bug | Next |
| T-024 | Add Church structured data with address, service times and social profiles | P2 | S | seo, enhancement, frontend | Next |
| T-025 | Reduce the Google Fonts payload and provide a metrics-matched fallback | P2 | M | performance, frontend | Later |
| T-026 | Surface the prayer-night countdown above the fold on mobile | P2 | M | ux, ui, design | Later |
| T-027 | Fix the Messages section lead and card descriptions | P2 | S | copy | Next |
| T-028 | Give Article IX Conferences dates and a way to register, or fold it into Gather | P2 | M | content, ux | Later |
| T-029 | Add a CI workflow: HTML validation, link check, and a Lighthouse budget | P2 | M | dx, ci, enhancement | Next |
| T-030 | Raise interactive targets to 24×24 minimum | P3 | S | a11y, ui | Later |
| T-031 | Highlight the current article in the nav while scrolling | P3 | M | ux, frontend, enhancement | Later |
| T-032 | Decide whether to publish a phone or WhatsApp contact route | P3 | S | ux, content, needs-product-confirmation | Later |
| T-033 | Decide the i18n position for a Port Moresby audience | P3 | L | i18n, content, needs-product-confirmation | Later |
| T-034 | Tie reveal animation stagger to visual grouping instead of document index | P3 | S | ui, frontend, polish | Later |
| T-035 | Fix the title/summary mismatch on the third Leadership accordion | P3 | S | content, copy, bug | Later |

---

## 5. Suggested implementation order

Sequenced for maximum user-visible improvement per unit of effort. Each batch is independently shippable.

### Batch 1 — Stop the bleeding (half a day, all S)
`T-001` → `T-002` → `T-007` → `T-012` → `T-003` → `T-004`

Six small changes that between them fix the site being blank without JS, five phantom tab stops, every
anchor landing behind the nav on mobile, a broken skip link, and social shares rendering without an image.
Ship as one PR — they touch different files and cannot conflict. **T-001 first**, since nothing else
matters if the page does not render.

### Batch 2 — Make the conversion path honest (two to three days)
`T-005` → `T-006` → `T-009` → `T-013`

The reason-for-contact field is the highest-value product change on the list: it turns one mislabelled form
into six working intents, and it is a prerequisite for T-014, T-028, and T-032. Do T-006 in the same PR —
they touch the same 30 lines. T-009 and T-013 are small and make the page's promises match its destinations.

### Batch 3 — Fill the empty rooms (depends on the church, not on engineering)
`T-010` → `T-014` → `T-028`

All three need decisions from leadership before code. **Send these three questions now, in parallel with
Batch 1**, so the answers are back when engineering capacity is:
1. Which prophetic words may be published, with speaker and date?
2. May bank details be published for giving, and which account?
3. Are there dated conferences for the coming year?

If any answer is "not yet", ship the reframed-copy fallback in each ticket. An honest empty section beats a
section that describes content it does not have.

### Batch 4 — Accessibility conformance (two days, mostly S)
`T-015` → `T-016` → `T-011` → `T-017` → `T-021` → `T-020` → `T-030`

With Batch 1's structural fixes in place, these close the remaining WCAG 2.1 AA gaps. T-015 and T-016 are
token-level and touch every screen at once. T-011 is the largest of the group but is a pure semantics
refactor with a pixel-identical acceptance criterion.

### Batch 5 — Lock it in, then polish
`T-029` first — CI is what stops Batches 1–4 from silently regressing, and it should land before the
polish work starts.

Then: `T-019` → `T-022` → `T-023` → `T-027` → `T-024` → `T-018` → `T-025` → `T-026` → `T-031` → `T-034` → `T-035`,
with `T-032` and `T-033` slotted in whenever the product answers arrive.

### Sequencing constraints

- **T-001 blocks T-034** (the reveal refactor must not reintroduce the blank page).
- **T-005 blocks T-014, T-028, T-032** (all three depend on the topic field existing).
- **T-012 blocks T-031** (the scrollspy selector needs `<main>`).
- **T-013 blocks T-027** (the third card's copy depends on where it points).
- **T-003 and T-024 share absolute URLs** — do them together or make T-003 first.
- **T-007 and T-012 both touch scroll offsets** — same PR.
- **T-029 should land before Batch 5** so the polish work has a safety net.

---

*Audit performed against commit `1ed6056`. Layout, contrast, tab order, and no-JS behaviour were measured
in headless Chromium at 320 / 375 / 390 / 667×375 / 768 / 1024 / 1280 px; contrast ratios were computed
from the literal token values in `assets/css/style.css`. Findings marked "needs product confirmation" or
"needs design review" require a decision from the church or a designer and are given a recommended default.*
