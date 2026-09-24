# Fonts

Self-hosted latin subsets, served as `woff2` with `font-display: swap`.

| File | Family | Role | Styles used |
|---|---|---|---|
| `cinzel.woff2` | Cinzel (variable) | display: proclamations, headings | 400–700 |
| `cormorant-italic.woff2` | Cormorant Garamond Italic | voice: Scripture, ledes | 500 |
| `cormorant.woff2` | Cormorant Garamond | voice (roman) | 500 |
| `dmsans.woff2` | DM Sans (variable) | interface and body | 400–700 |

All three families are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>). Source: Google Fonts.

Fallback faces in `assets/css/style.css` are size-adjusted so the swap causes
little layout shift. If you change a font, re-measure them.
