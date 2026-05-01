/**
 * Capture clean, share-ready stills of goodbird.app for email + press.
 *
 * Renders at Pixel 10 Pro CSS dimensions (412×917) with deviceScaleFactor: 2,
 * dismisses the first-visit orientation card, and snapshots the home page
 * (with the habitat tile grid visible) plus the quiz screen.
 *
 * Outputs (under dist/demo/):
 *   - goodbird-still-home.png       ← lossless, ~600 KB
 *   - goodbird-still-home.jpg       ← quality-85, ~120 KB ← embed this in email
 *   - goodbird-still-quiz.png       ← lossless
 *   - goodbird-still-quiz.jpg       ← quality-85
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "dist", "demo");

const TARGET = process.env.TARGET ?? "https://goodbird.app";
const VIEWPORT = { width: 412, height: 917 };

const browser = await chromium.launch({
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  reducedMotion: "reduce",   // for stills we want the fog frozen, not mid-drift
  userAgent:
    "Mozilla/5.0 (Linux; Android 15; Pixel 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
});
const page = await context.newPage();

console.log(`→ capturing ${TARGET}…`);

// ── Home page ──
await page.goto(TARGET, { waitUntil: "networkidle", timeout: 30_000 });
await page.getByRole("button", { name: "Begin" }).click();
await page.waitForTimeout(800);   // let dismiss animation finish
const homePng = path.join(outDir, "goodbird-still-home.png");
await page.screenshot({ path: homePng, fullPage: false });

// ── Quiz screen ──
await page.goto(`${TARGET.replace(/\/$/, "")}/lesson/cs-1`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);   // let cards render + pause animation settles
const quizPng = path.join(outDir, "goodbird-still-quiz.png");
await page.screenshot({ path: quizPng, fullPage: false });

await context.close();
await browser.close();

// PNG → JPG conversion (q85, slight unsharp mask for crispness on retina).
const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });

for (const png of [homePng, quizPng]) {
  const jpg = png.replace(/\.png$/, ".jpg");
  console.log(`→ ${path.basename(jpg)}…`);
  await run("ffmpeg", ["-y", "-i", png, "-q:v", "3", jpg]);
}

const sizeKB = async (p) => Math.round((await stat(p)).size / 1024);
console.log("\n✓ done");
for (const f of ["goodbird-still-home.png", "goodbird-still-home.jpg", "goodbird-still-quiz.png", "goodbird-still-quiz.jpg"]) {
  const p = path.join(outDir, f);
  console.log(`  ${p}  (${await sizeKB(p)} KB)`);
}
