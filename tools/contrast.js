#!/usr/bin/env node
/* WCAG 2.2 contrast check for the design tokens in assets/css/style.css.
   No dependencies:  node tools/contrast.js
   Reads the light tokens (:root), the dark theme (:root[data-theme="dark"]),
   and the .night scope, resolves var() references, and checks every
   text/background pair the components use, in all four contexts.
   Exits non-zero if any pair fails. */
"use strict";
const fs = require("fs");
const path = require("path");
const css = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "style.css"), "utf8");

function block(selector) {
  const i = css.indexOf(selector + " {");
  if (i < 0) throw new Error("Missing block " + selector);
  const body = css.slice(css.indexOf("{", i) + 1, css.indexOf("}", i));
  const out = {};
  body.replace(/--([\w-]+):\s*([^;]+);/g, (_, k, v) => { out[k] = v.trim(); });
  return out;
}
const light = block(":root");
const dark = Object.assign({}, light, block(':root[data-theme="dark"]'));
const nightMap = block(".night");
// The dark theme is written twice (system preference and manual toggle); they must match.
const darkAuto = block(':root:not([data-theme="light"])');
const darkManual = block(':root[data-theme="dark"]');
if (JSON.stringify(darkAuto) !== JSON.stringify(darkManual)) {
  console.error("The two dark-theme blocks in style.css differ. Keep them identical.");
  process.exit(1);
}

// Resolve a token to a literal colour, following var() references.
function resolve(tokens, value) {
  const m = /^var\(--([\w-]+)\)$/.exec(value);
  if (!m) return value;
  if (!(m[1] in tokens)) throw new Error("Unknown token --" + m[1]);
  return resolve(tokens, tokens[m[1]]);
}
// A context's lookup: base theme tokens, optionally with the .night swap.
function scope(base, isNight) {
  return (name) => {
    const v = isNight && name in nightMap ? nightMap[name] : base[name];
    if (v === undefined) throw new Error("Unknown token --" + name);
    return resolve(base, v);
  };
}

function hex(c) {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return null;
  return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16));
}
function lum(rgb) {
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// [foreground, background, minimum, what it is]
const TEXT = 4.5, UI = 3;
const pairs = [
  ["fg", "bg", TEXT, "body text"],
  ["fg", "bg-tint", TEXT, "body text on tinted section"],
  ["fg", "surface", TEXT, "text on cards"],
  ["fg-soft", "bg", TEXT, "secondary text"],
  ["fg-soft", "bg-tint", TEXT, "secondary text on tint"],
  ["fg-soft", "surface", TEXT, "secondary text on cards"],
  ["accent", "bg", TEXT, "labels, links"],
  ["accent", "bg-tint", TEXT, "labels, links on tint"],
  ["accent", "surface", TEXT, "links on cards"],
  ["error", "bg", TEXT, "form errors"],
  ["error", "surface", TEXT, "form errors on form card"],
  ["btn-fg", "btn-bg", TEXT, "primary button"],
  ["btn-fg", "btn-bg-hover", TEXT, "primary button, hover"],
  ["focus", "bg", UI, "focus ring"],
  ["focus", "bg-tint", UI, "focus ring on tint"],
  ["focus", "surface", UI, "focus ring on cards"],
  ["line-strong", "bg", UI, "input borders"],
  ["line-strong", "surface", UI, "input borders on form card"],
  ["btn-bg", "bg", UI, "primary button edge"]
];
const nightPairs = pairs.filter(([f, b]) => b !== "bg-tint" && !f.startsWith("btn") && b !== "btn-bg");
nightPairs.push(["btn-fg", "btn-bg", TEXT, "primary button"], ["btn-bg", "bg", UI, "primary button edge"]);

const contexts = [
  ["Light", scope(light, false), pairs],
  ["Dark", scope(dark, false), pairs],
  ["Night (light theme)", scope(light, true), nightPairs],
  ["Night (dark theme)", scope(dark, true), nightPairs]
];

let fails = 0;
const rows = [];
for (const [ctx, get, list] of contexts) {
  for (const [f, b, min, what] of list) {
    const fc = get(f), bc = get(b);
    const r = ratio(hex(fc), hex(bc));
    const ok = r >= min;
    if (!ok) fails++;
    rows.push(`| ${ctx} | ${what} | \`--${f}\` ${fc} | \`--${b}\` ${bc} | ${r.toFixed(2)}:1 | ${min}:1 | ${ok ? "pass" : "FAIL"} |`);
  }
}
console.log("| Context | Use | Foreground | Background | Ratio | Needs | Result |");
console.log("|---|---|---|---|---|---|---|");
console.log(rows.join("\n"));
console.log(`\n${rows.length} pairs checked, ${fails} failing.`);
console.log(`For reference, the previous design: #837796 on #171028 = ${ratio(hex("#837796"), hex("#171028")).toFixed(2)}:1; #8a691c on #f1eadb = ${ratio(hex("#8a691c"), hex("#f1eadb")).toFixed(2)}:1.`);
process.exit(fails ? 1 : 0);
