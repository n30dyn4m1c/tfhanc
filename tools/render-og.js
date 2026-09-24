#!/usr/bin/env node
/* Renders tools/og.html to assets/img/og.jpg at 1200 × 630.
   Needs Playwright (or playwright-core) and a Chromium-based browser:
     npm i -D playwright && npx playwright install chromium && node tools/render-og.js
   or point it at an installed browser:
     CHROME=/usr/bin/google-chrome node tools/render-og.js */
"use strict";
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("playwright-core")); }
(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("file://" + path.join(__dirname, "og.html"), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(__dirname, "..", "assets", "img", "og.jpg"), type: "jpeg", quality: 86 });
  await browser.close();
})();
