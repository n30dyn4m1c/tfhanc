# The Father's House, All Nations Church

Official website for The Father's House, All Nations Church — Port Moresby, Papua New Guinea.

> Executing the Mandate. Advancing the Kingdom. It is NOW!

## About this site

A fast, modern static website — no build step, no framework, no server required.

```
index.html          — the whole site (single page)
assets/css/style.css — design system & styles
assets/js/main.js    — countdown, nav, reveal animations, connect form
assets/img/          — logo & photography
```

## Hosting on GitHub Pages

1. Go to the repository **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Choose the `main` branch and the `/ (root)` folder, then **Save**.
4. The site will be live at `https://<username>.github.io/tfhanc/` within a minute or two.

The `.nojekyll` file tells GitHub Pages to serve the files as-is.

## Replacing the logo

The eagle mark at `assets/img/logo.svg` is a placeholder drawn to match the church's
purple eagle branding. To use the official logo, replace that file (keep the name
`logo.svg`, or update the paths in `index.html`) — it appears in the navigation bar,
the footer, and as the favicon.

## Updating content

All text lives directly in `index.html` — service times, location, messages, and
contact details can be edited there. Colors and fonts are defined as CSS variables
at the top of `assets/css/style.css`.
