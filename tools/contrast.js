#!/usr/bin/env node
/* WCAG 2.2 contrast check for the colour tokens in assets/css/style.css.
   No dependencies:  node tools/contrast.js
   Reads the palette (:root) and the ivory scope (.light), and checks every
   text/background pair the components use. Exits non-zero if any pair fails. */
"use strict";
const fs = require("fs");
const path = require("path");
const css = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "style.css"), "utf8");

function block(selector) {
  const i = css.indexOf("\n" + selector + " {");
  if (i < 0) throw new Error("Missing block " + selector);
  const body = css.slice(css.indexOf("{", i) + 1, css.indexOf("}", i));
  const out = {};
  body.replace(/--([\w-]+):\s*([^;]+);/g, (_, k, v) => { out[k] = v.trim(); });
  return out;
}
const root = block(":root");
const light = Object.assign({}, root, block(".light"));

function hex(tokens, v, n = 0) {
  const m = /^var\(--([\w-]+)\)$/.exec(v);
  if (m) { if (n > 10 || !(m[1] in tokens)) throw new Error("Unknown token --" + m[1]); return hex(tokens, tokens[m[1]], n + 1); }
  if (v in tokens) return hex(tokens, tokens[v], n + 1);
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  throw new Error("Not a solid colour: " + v);
}
function rgb(c) { return [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16)); }
function lum(c) {
  const [r, g, b] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }

const TEXT = 4.5, UI = 3;
// Dark grounds the page actually uses: plum, royal, the Friday/visit plum, and ink.
const DARK_GROUNDS = ["plum", "royal", "#1b0529", "ink"];
const pairs = [];
for (const g of DARK_GROUNDS) {
  pairs.push([root, "fg", g, TEXT, "body text"], [root, "soft", g, TEXT, "secondary text"],
             [root, "champagne", g, TEXT, "labels, gold text"], [root, "lavender", g, TEXT, "lavender text"],
             [root, "gold", g, UI, "gold rules, icons, button edges"]);
}
pairs.push(
  [root, "ink", "gold", TEXT, "text on gold button (darkest stop)"],
  [root, "ink", "champagne", TEXT, "text on gold button (lightest stop)"],
  [root, "ink", "#b08a1a", TEXT, "text on gold button (shadow stop)"],
  [root, "ivory", "purple", TEXT, "text on purple button"],
  [light, "fg", "ivory", TEXT, "ivory: body text"],
  [light, "soft", "ivory", TEXT, "ivory: secondary text"],
  [light, "soft", "#ffffff", TEXT, "ivory: card text"],
  [light, "purple", "ivory", TEXT, "ivory: headings, labels"],
  [light, "purple", "#ffffff", TEXT, "ivory: card headings"],
  [light, "gold", "#ffffff", 1, "ivory: gold is decoration only (no requirement)"]
);

let fails = 0;
for (const [tokens, f, b, min, what] of pairs) {
  const r = ratio(hex(tokens, f), hex(tokens, b));
  const ok = r >= min;
  if (!ok) fails++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${f} on ${b}  ${what}`);
}
console.log(`\n${pairs.length} pairs checked, ${fails} failing.`);
process.exit(fails ? 1 : 0);
