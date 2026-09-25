# Work plan to launch

**Status on 25 September 2026:** the royal purple redesign is built and pushed
to the `redesign/royal-purple` branch. GitHub Pages still serves `main`, which
holds the previous design. The site is complete in structure and design; what
remains is mostly content from the house, a few settings, testing and the
switch-over.

**Proposed launch:** Sunday 1 November 2026, announced at Friday Night Prayer
on 30 October and at Sunday Celebration. The date is a proposal. It holds only
if the content in Week 2 arrives on time; if it does not, see "If content is
late" below.

Owners: **Web** is the site maintainer (Neo). **House** is the Senior Pastor or
whoever he names to gather content and approve it.

## Where things stand

| Area | State |
|---|---|
| Design, layout, motion | Done. See `docs/DESIGN_SYSTEM.md`. |
| Sections and copy | Done, except the items marked `CONTENT NEEDED` in `index.html`. |
| Leadership and network churches | Done. Portraits are monograms until photographs arrive. |
| Prophetic Word | Five words published (house and global). The PNG stream is empty. |
| Imagery | Generated scenes stand in for photographs. The worship crowd is not the congregation. |
| Forms | Working, via the visitor's email app. No form service connected yet. |
| Messages | Channels linked. No featured video ID yet. |
| Accessibility | 30 colour pairs pass WCAG 2.2 AA. Keyboard, dialogs and reduced motion tested. |
| Hosting | GitHub Pages at `n30dyn4m1c.github.io/tfhanc/`. No custom domain. |
| SEO basics | Canonical, Open Graph and JSON-LD in place. No `robots.txt`, `sitemap.xml` or `404.html`. |

## Week 1 · 28 September to 4 October: review and requests

| Task | Owner | Done when |
|---|---|---|
| Share the preview with the Senior Pastor and leaders (run locally, or a temporary Pages build from the branch) | Web | Leaders have seen it on a phone |
| Collect corrections to names, titles, biographies and the network churches | House | One consolidated list returned |
| Confirm Scripture references and translations as used on the site | House | Signed off |
| Send the content request below to the house, with a return date of 11 October | Web | Request sent |
| Decide the address: stay on `github.io`, or use `tfhanc.org` (the email domain already exists) | House + Web | Decision recorded here |
| Choose a form service (Formspree, Getform or Basin) and which inbox receives messages | House + Web | Account created |

**Content request to the house**

1. Photographs, following `docs/PHOTO_BRIEFS.md`: Sunday worship with consent (this replaces the generated crowd first), Friday Night Prayer at the Lounge, the Gordon International School venue, and a portrait of Pastor Ben Minok (4:5).
2. Written permission and an official portrait for Dr Jonathan David, from All Nations Sanctuary, Muar.
3. Bank details for Giving, confirmed in writing by the treasurer.
4. Conference dates and places for the three gatherings, or confirmation that "Dates to be announced" stays.
5. Children's ministry arrangements, parking, and PMV routes to each venue.
6. The YouTube ID of the message to feature.
7. Any PNG prophetic words the house has released for publication.
8. The correct Facebook and YouTube handles, to check against `sameAs` in the JSON-LD.

## Week 2 · 5 to 11 October: content arrives

| Task | Owner | Done when |
|---|---|---|
| Gather and return the content request | House | All eight items answered, even if the answer is "not yet" |
| Apply leaders' corrections from Week 1 | Web | Committed on the branch |
| Add `robots.txt`, `sitemap.xml` and a `404.html` in the site's style | Web | Committed |
| If using `tfhanc.org`: check who controls the domain's DNS and get access | House | Login confirmed |

## Week 3 · 12 to 18 October: integrate

| Task | Owner | Done when |
|---|---|---|
| Run supplied photographs through `tools/build-images.py`; adjust `object-position` where needed | Web | Worship scene is real; generated images reviewed one by one |
| Add portraits at the `PHOTO SLOT` comments | Web | Monograms replaced where photographs exist |
| Fill bank details, conference dates, children, parking and PMV text | Web | `grep -n "CONTENT NEEDED" index.html` returns only items the house chose to defer |
| Set the featured message's `data-video-id` | Web | The video plays on click |
| Add PNG prophetic words, if any were released | Web | The PNG filter is not empty, or the filter button is removed |
| Put the form endpoint in `data-endpoint` on both forms; send a test from each | Web | Test messages arrive in the chosen inbox |
| Re-render `og.jpg` if the share image should change | Web | Checked in a Facebook share preview |

## Week 4 · 19 to 25 October: test and approve

| Task | Owner | Done when |
|---|---|---|
| `node tools/contrast.js` | Web | 0 failing |
| Browser pass at 1440 × 900 and 390 × 844, plus real Android phones on a PNG mobile network | Web | No horizontal scroll, no console errors, hero loads acceptably on 3G/4G |
| Lighthouse on mobile (performance, accessibility, SEO) | Web | Scores recorded here; anything under 90 has a reason |
| Keyboard and screen reader pass (menu, dialogs, filters, forms) | Web | No blockers |
| Calendar files open correctly on Android and iPhone for both gatherings | Web | Right venue and time in each |
| Map switch shows both venues correctly | Web | Checked |
| Final read of every section by the house | House | Written approval to launch |

## Week 5 · 26 October to 1 November: launch

| Task | Owner | When |
|---|---|---|
| Open a pull request from `redesign/royal-purple` to `main`; review and merge | Web | Mon 26 Oct |
| If using `tfhanc.org`: add `CNAME`, set the custom domain and HTTPS in Settings → Pages, point DNS, and replace `n30dyn4m1c.github.io/tfhanc/` in the canonical, Open Graph, Twitter and JSON-LD URLs | Web | Tue 27 Oct (DNS can take up to 48 hours) |
| Check the live site end to end, including forms and share previews | Web | Wed 28 Oct |
| Update the Facebook page and YouTube channel links to the site | House | Thu 29 Oct |
| Announce at Friday Night Prayer | House | Fri 30 Oct |
| **Launch:** announce at Sunday Celebration and post on Facebook | House | **Sun 1 Nov** |

**Rollback:** if something is badly wrong after the merge, revert the merge
commit on `main`. Pages redeploys the previous design within a few minutes.

## After launch · November

- Watch the form inbox daily for the first two weeks, and answer prayer requests and "I prayed this" messages promptly.
- Register the site in Google Search Console and submit the sitemap.
- Replace the remaining generated scenes as real photographs come in (see `docs/PHOTO_BRIEFS.md`).
- Add each new prophetic word and conference date as the house releases it (see the README).
- Review service times in `assets/js/main.js` whenever a gathering moves.

## If content is late

The site can launch without the deferred items. It already says "to be
announced" or "on request" where facts are missing, and it never invents them.
Two items should not be deferred:

- **The worship photograph.** If no real photograph has arrived, swap the
  generated crowd for a scene without people (for example `dawn`) before launch,
  so no one mistakes it for the congregation.
- **The form service.** Email fallback works, but a connected form makes
  prayer requests far more reliable on phones without a mail app set up.

If either of these, or the house's written approval, is missing on 25 October,
move the launch to Sunday 8 November and keep the same order of work.

## Decisions log

| Date | Decision | By |
|---|---|---|
| | Address: `github.io` or `tfhanc.org` | |
| | Form service and receiving inbox | |
| | Launch date confirmed | |
