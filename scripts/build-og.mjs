#!/usr/bin/env node
// Rasterizes public/og.svg to public/og.png at 1200×630.
// Run via: npm run build:og

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SVG_PATH = path.resolve(__dirname, "../public/og.svg");
const PNG_PATH = path.resolve(__dirname, "../public/og.png");

const svg = await fs.readFile(SVG_PATH);
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true },
  background: "rgba(247, 250, 246, 1)",
});
const png = resvg.render().asPng();
await fs.writeFile(PNG_PATH, png);
const stat = await fs.stat(PNG_PATH);
console.log(`Wrote ${PNG_PATH} (${(stat.size / 1024).toFixed(1)} KB)`);
