#!/usr/bin/env node
/* Renders tools/og.html to assets/img/og.png at 1200 × 630.
   Needs Playwright with Chromium available:  node tools/render-og.js */
"use strict";
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); }
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("file://" + path.join(__dirname, "og.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(__dirname, "..", "assets", "img", "og.png") });
  await browser.close();
})();
