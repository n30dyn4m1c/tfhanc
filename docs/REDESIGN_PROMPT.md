# Site Design Review & Redesign Prompt

> **Historical.** This review and prompt led to the royal purple redesign. The current system is in `docs/DESIGN_SYSTEM.md`, and the work to launch is in `docs/LAUNCH_PLAN.md`.

Review of the current site (`index.html`, `assets/css/style.css`, `assets/js/main.js`)
as of September 2026, followed by a ready-to-use prompt for a full redesign.

---

## Part 1 — Design review

### What works (keep the spirit of these)

- **A real concept.** "The charter of a praying house": ink-violet night and warm
  paper, numbered articles, a seal. It is distinctive and fits the editorial voice
  in `STYLE_GUIDE.md`.
- **A disciplined system.** Colour tokens on `:root`, two type families, one radius,
  and consistent component patterns.
- **Hand-drawn SVG mark and seal.** Crisp at every size and light to load.
- **Solid accessibility basics.** Skip link, ARIA-wired accordions,
  `prefers-reduced-motion` support, visible focus on triggers, semantic `dl`/`ol`/`blockquote`.
- **Zero build, fast, static.** It suits GitHub Pages.

### What holds it back

**1. Monotonous rhythm on a very long page.**
All ten sections use the same pattern: boxed numeral kicker, then an H2 with a violet
italic tail, then a grey lead paragraph, then a three-up grid or accordion. The only
change from one section to the next is the background (paper or tint). The page is
about 11,400 px tall on desktop and 14,600 px on mobile, and only two dark sections
(the "Begin Here" interlude and the Gather card) interrupt the paper. By Article V the
eye has stopped registering new sections.

**2. No people and no place.**
There are no photographs of the congregation, the pastor, worship, Port Moresby, or
the venue. A church site with no faces reads as an institution rather than a family.
Leadership is two lines of text hidden behind a "+" button.

**3. The visitor's key questions are answered late.**
A first-time visitor wants to know when, where, what to expect, and who leads. "Gather"
(service times, location, first visit) is Article VIII, below Giving and the Prophetic
Word. The hero countdown covers Friday prayer only. Sunday Celebration, the main
service, is barely present above the fold.

**4. Content is hidden or thin.**
- Accordions hide the leaders' bios and all three "prophecy" panels.
- The prophecy panels hold generic placeholder paragraphs, not actual words. Opening
  one is an anticlimax.
- The Messages cards have no thumbnails, embeds, or latest-sermon preview. They are
  outbound links styled as cards.
- The Conferences cards have no dates.

**5. The formula shows in the headings.**
Every H2 ends in a violet italic phrase ("*and for the nations.*", "*on their knees.*",
"*with us.*"). Once is striking. Ten times reads as a template.

**6. Too many tiny tracked-caps labels.**
The page has about 20 styles of small, widely letter-spaced uppercase sans text between
0.62 rem and 0.82 rem: kickers, cites, `dt`s, card kickers, times, button labels, form
labels, and countdown units. They compete with one another and are hard to read,
especially on mobile.

**7. The CTA hierarchy competes with itself.**
There are three primary-looking button styles: a gold gradient (hero and nav), a solid
violet with a glow (sections), and ghost buttons. The nav CTA ("Send a Prayer Request")
and the hero's first CTA ("Join Breakthrough Prayer Night") push different actions.

**8. Contrast failures (WCAG AA, small text).**
- `--night-faint` (#837796) on `--ink` measures **4.42:1**. It is used for the hero
  motto line, the countdown label, verse cites on dark, and the copyright.
- `--gold` (#8a691c) on `--paper-2` measures **4.26:1**. It is used for kicker numerals,
  pillar and accordion numbers, and gather times on tinted sections.
- `--text-faint` on `--paper` sits at 4.54:1, right on the edge.

**9. Navigation and interaction gaps.**
- The nav collapses to a hamburger at **1080 px**, which covers most laptops at zoom
  and every tablet.
- The nav omits Why We Pray and Conferences, although the footer lists them.
- There is no active-section indicator while scrolling.
- The contact form is a `mailto:` handoff. It fails silently on devices with no mail
  client and shows no confirmation state.
- The seal in the footer spins continuously, which adds motion for no reason.

**10. Smaller details.**
- The roman-numeral "Articles I–X" means something to the author but not to visitors.
- There is no dark or light theme preference support.
- `og:image` uses a relative path, so most social scrapers need an absolute URL.
- The Google Fonts request loads 7 Fraunces and 4 Outfit variants.
- The "ISAAC PNG — Conference messages" card links to `facebook.com/tfhanc`.
- The hero eyebrow wraps to three lines on a 390 px phone.

---

## Part 2 — Redesign prompt

Copy everything inside the block below into your AI coding tool (Claude Code or
similar) with this repository open.

```text
You are a senior product designer and front-end engineer. Redesign and rebuild the
website in this repository from the ground up: the official site of The Father's House,
All Nations Church (TFH ANC), a prayer-centred, apostolic and prophetic church in Port
Moresby, Papua New Guinea, part of the ISAAC Network under Dr Jonathan David.

## Read first
1. `STYLE_GUIDE.md`. It governs all copy: voice, Scripture citation form, names,
   titles, dates, Commonwealth spelling. Every word you write or keep must pass its
   §9 checklist.
2. `index.html`, `assets/css/style.css`, `assets/js/main.js`. Treat the current content
   as the source of truth for facts, and treat the current design as the thing to
   replace.
3. `docs/REDESIGN_PROMPT.md` Part 1. It is the design review that motivates this
   redesign. Every numbered problem there must be solved.

## Hard constraints
- Static site on GitHub Pages: plain HTML, CSS, and vanilla JS. No framework, no build
  step, no npm dependencies. Keep `.nojekyll`. Relative paths must work under
  `/tfhanc/`.
- Preserve every fact exactly: names, titles, IPA registration 5-109620 (31 March 2021),
  9 April 2021 and 20 April 2021, service times (Sunday 9:00 AM – 1:30 PM; Friday
  Breakthrough Prayer Night 7:00 PM), venue (Taurama Aquatic Centre Lounge, Port
  Moresby), info@tfhanc.org, the YouTube and Facebook links, every Scripture quotation
  with its reference and translation, the Dr Jonathan David source link, and the motto
  "Executing the Mandate. Advancing the Kingdom. It is now."
- Keep the eagle-through-the-door mark (`assets/img/logo.svg`). You may refine how it
  is used, but not what it depicts.
- Do not invent facts, testimonies, prophecies, dates, or staff. Where real content is
  missing (photos, sermon titles, conference dates, prophetic words), design a clearly
  marked slot with a tasteful placeholder and an HTML comment such as
  `<!-- CONTENT NEEDED: ... -->`, and list every slot in your final summary.

## Design goals, in priority order
1. **Warm and human first, institutional second.** A first-time visitor should feel
   invited into a praying family, and then see the authority and order behind it. Keep
   the gravitas of the current voice but lose the coldness. Design for photography:
   the hero, leadership portraits, a worship or prayer-night image, and the venue.
   Use `<img>` slots with `loading="lazy"`, width and height, and meaningful `alt`
   text, and make them look intentional before real photos arrive (for example, duotone
   treatments in the brand colours).
2. **Answer the visitor's questions in order.** What is this place? When and where do
   I come? What will happen? Who leads? How do I reach out? Sunday Celebration and
   Friday Breakthrough Prayer Night should both be visible within the first screen or
   immediately after it. Reorder the page to match. Suggested flow (you may improve
   it): Hero → Plan your visit (times, place, what to expect, map link) → Who we are
   (house, three pillars, the Record) → Why we pray → Leadership → Messages → Begin
   here (salvation prayer) → Prophetic word → Conferences → Giving → Connect → Footer.
3. **Rhythm and pacing.** Every section should not share one skeleton. Vary the
   layouts: full-bleed image bands, a large pull-quote spread for a governing verse,
   asymmetric splits, a timeline or record table, and one or two dark "night" sections
   placed on purpose. The page should feel shorter than it is. Target at least 30%
   less scroll height on mobile than today (about 14,600 px at 390 px wide) without
   deleting required content. Move long content into progressive disclosure only where
   it helps.
4. **Show, don't hide.** Leaders get visible cards (portrait slot, name, title, a
   two-line summary) with a "Read full biography" disclosure or modal. Messages get a
   featured-sermon block (a YouTube thumbnail or embed slot; use `youtube-nocookie`
   and load it on click) plus channel links. Conferences get date slots. Prophetic
   words get a proper layout for dated entries.
5. **Clear action hierarchy.** Use one primary button style, one secondary, and one
   text link. Choose a single primary site-wide action (recommended: "Plan your
   visit"). Offer "Send a prayer request" as the secondary, persistent action. Make it
   a sticky bottom bar or floating button on mobile.

## Visual direction
Propose 2–3 distinct directions in a few sentences each, for example: (a) evolved
editorial charter; (b) warm Pacific contemporary, drawing on Papua New Guinea colour
and pattern with respect and without cliché or appropriation; (c) cinematic night of
prayer. Pick the one that best meets the goals above, state why, and build it. Whatever
you choose:
- Evolve the palette rather than keep violet and gold by default. If you keep them,
  retune them. Define all colours as tokens on `:root`. Support
  `prefers-color-scheme` with a proper dark theme and a manual toggle that persists
  in `localStorage`, wrapped in try/catch.
- Use at most two typefaces and at most five weights in total. Self-host as `woff2`
  if practical; otherwise trim the Google Fonts request. Set a fluid modular type
  scale with `clamp()`. Body text is at least 1.0625 rem (17px) on mobile.
- Keep tracked uppercase labels to one small style used sparingly, and do not letter-space
  body-size text.
- Drop the "violet italic tail on every H2" formula. Use emphasis only where the
  sentence earns it.
- Replace or reframe the "Article I–X" roman numerals with something that serves
  visitors (for example, a quiet section index, or nothing at all).
- Use motion with restraint: subtle reveal-on-scroll and meaningful hover and focus
  states only. No continuously spinning or looping elements. Honour
  `prefers-reduced-motion` fully.

## Components and behaviour
- **Header.** Keep it compact. Show full links down to about 900px. Highlight the
  active section on scroll with IntersectionObserver. The mobile menu must be a
  focus-trapped, Escape-closable panel that restores focus on close.
- **Hero.** One strong statement grounded in 2 Chronicles 7:14 (KJV), cited per the
  style guide. Include both gatherings and one primary CTA. The countdown (keep the
  existing PNG UTC+10 logic) should count to whichever of Sunday 9:00 AM or Friday
  7:00 PM comes next and name that gathering. Make it visually secondary and
  `aria-live="off"` so screen readers are not spammed.
- **Plan your visit.** Show times, address, a directions link, a "what to expect"
  list (length, worship style, children and family, what to wear, parking or getting
  there as placeholders), and "Let us know you're coming". Add an "Add to calendar"
  link for each gathering using generated `.ics` data URLs.
- **The Record.** Keep it as a formal, well-typeset table of institutional facts. It
  is the governmental register made visible.
- **Scripture blocks.** Use one consistent, beautiful component for block citations,
  with the reference and translation exactly as in the style guide.
- **Connect form.** Keep `mailto:` as the fallback. Add inline validation, a visible
  success or fallback message ("If your email app did not open, write to
  info@tfhanc.org"), and a copy-address button. Structure the markup so a form
  endpoint (such as Formspree) can be dropped in later through one `data-endpoint`
  attribute.
- **Footer.** Include the seal (static), the motto, grouped links, times and place,
  social links, and the registration line.

## Quality bar (verify before you finish)
- WCAG 2.2 AA: every text/background pair is at least 4.5:1 (3:1 for large text and
  UI boundaries). The review found #837796 on #171028 (4.42:1) and #8a691c on
  #f1eadb (4.26:1). No new pair may fail. Include a short script or table in your
  summary that proves the ratios.
- Everything is keyboard operable, focus is visible everywhere, there is one `h1`,
  heading levels are logical, landmarks are present, and there are no ARIA misuse
  warnings.
- It is responsive from 320px to 1920px with no horizontal scroll. Check at 320, 390,
  768, 1024, 1280, and 1440 widths.
- Performance: no layout shift from fonts or images (explicit dimensions,
  `font-display: swap`), no render-blocking JS (`defer`), and CSS kept to one file
  under about 40 KB unminified.
- SEO and sharing: absolute `og:image` and `og:url` for
  https://n30dyn4m1c.github.io/tfhanc/, a Twitter card, a canonical link, and
  `Church` JSON-LD structured data (name, address, events for the two weekly
  gatherings, sameAs social links).
- Copy: run every string, including button labels, alt text, and meta
  descriptions, through the `STYLE_GUIDE.md` §9 checklist. No exclamation marks, no
  all-caps shouting in the source text (CSS `text-transform` for small labels is
  fine), and Commonwealth spelling throughout.
- Take Playwright screenshots (Chromium is available) at 390px and 1440px of every
  section, review them critically, and fix what looks off before you finish.

## Deliverables
1. The rebuilt `index.html`, `assets/css/style.css`, and `assets/js/main.js`, plus any
   new assets under `assets/`.
2. An updated `README.md` (structure, features, how to replace placeholder photos and
   content) and an updated design-system header comment at the top of `style.css`.
3. A final summary that covers the chosen direction and why, the new page order, the
   design tokens, how each of the 10 review problems was solved, the list of
   `CONTENT NEEDED` slots, and the contrast table.

Work in small, reviewable commits on a feature branch.
```
