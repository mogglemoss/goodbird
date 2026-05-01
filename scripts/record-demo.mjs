/**
 * Record a polished phone-frame demo of goodbird.app for sharing on socials.
 *
 * Captures a Playwright video walk-through at Pixel-10-Pro CSS proportions
 * (412×917, ~9:20 — taller than iPhone 14 Pro to avoid the "horizontally
 * squished" look) of: home → species detail → lesson quiz → about. Encodes
 * MP4 + GIF via ffmpeg with 3× playback speed, the same treatment the
 * canonical phone recording got.
 *
 * Usage:
 *   node scripts/record-demo.mjs              # records goodbird.app (production)
 *   TARGET=http://localhost:5173 node ...     # records local dev server
 *
 * Outputs (under dist/demo/):
 *   - goodbird-demo-playwright.mp4   ← compressed, share-ready
 *   - goodbird-demo-playwright.gif   ← compressed, share-ready
 *   - goodbird-demo-playwright.webm  ← raw playwright capture
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, rm, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "dist", "demo");
const tmpDir = path.join(outDir, "_raw");

const TARGET = process.env.TARGET ?? "https://goodbird.app";
// Pixel 10 Pro CSS viewport — 9:20.04 aspect, matches what the phone shows.
const VIEWPORT = { width: 412, height: 917 };

await mkdir(outDir, { recursive: true });
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: [
    // Let the lesson's audio actually play (the visualizer is driven by it).
    "--autoplay-policy=no-user-gesture-required",
  ],
});
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
  recordVideo: { dir: tmpDir, size: VIEWPORT },
  reducedMotion: "no-preference",  // we WANT the fog drifting
  userAgent:
    "Mozilla/5.0 (Linux; Android 15; Pixel 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
});
const page = await context.newPage();

console.log(`→ recording ${TARGET}…`);

// 1. Home — first-visit "Quick orientation" card is up. Read for a beat,
//    then dismiss to reveal the actual content.
await page.goto(TARGET, { waitUntil: "networkidle", timeout: 30_000 });
await page.waitForTimeout(2800);
await page.getByRole("button", { name: "Begin" }).click();
await page.waitForTimeout(2000);   // hero settles, fog drifts

// 2. Slow scroll reveals Bird of the Day + the habitat tile grid.
await page.mouse.wheel(0, 280);
await page.waitForTimeout(1600);
await page.mouse.wheel(0, 320);
await page.waitForTimeout(1600);

// 3. Species detail page — the "this is a real field guide" page.
await page.goto(`${TARGET.replace(/\/$/, "")}/species/wrentit`, { waitUntil: "networkidle" });
await page.waitForTimeout(2400);
await page.mouse.wheel(0, 260);
await page.waitForTimeout(1800);

// 4. Lesson quiz — the heart of the app. Backyard Regulars is the first
//    Coastal Scrub course, all common backyard species.
await page.goto(`${TARGET.replace(/\/$/, "")}/lesson/cs-1`, { waitUntil: "networkidle" });
await page.waitForTimeout(3500);   // listen, think — the audio plays during this
// Click the first answer card. Whether it's right or wrong, we get to see the
// feedback state, which is part of the gameplay loop.
const cards = page.locator('button:has-text("Wrentit"), button:has-text("Spotted"), button:has-text("California"), button:has-text("Bewick"), [role="button"]:has(img)').first();
await cards.click().catch(() => { /* selector miss is fine, just keep recording */ });
await page.waitForTimeout(2500);

// 5. About — the personal note + donate callouts. The "why" page.
await page.goto(`${TARGET.replace(/\/$/, "")}/about`, { waitUntil: "networkidle" });
await page.waitForTimeout(2400);
await page.mouse.wheel(0, 360);
await page.waitForTimeout(1800);

await context.close();   // flushes the .webm to disk
await browser.close();

// Find the .webm Playwright wrote (filename is a hash, can't predict it).
const files = await readdir(tmpDir);
const webm = files.find((f) => f.endsWith(".webm"));
if (!webm) throw new Error("no .webm produced — playwright recording failed");
const webmSrc = path.join(tmpDir, webm);
const webmOut = path.join(outDir, "goodbird-demo-playwright.webm");
await rename(webmSrc, webmOut);

const mp4Out = path.join(outDir, "goodbird-demo-playwright.mp4");
const gifOut = path.join(outDir, "goodbird-demo-playwright.gif");

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });

// MP4 — 3× speed, H.264, web-friendly. Crisp at native viewport scale.
console.log("→ encoding mp4 (3× speed)…");
await run("ffmpeg", [
  "-y", "-i", webmOut,
  "-vf", "setpts=PTS/3,fps=30,scale=412:-2:flags=lanczos",
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "22",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  "-an",
  mp4Out,
]);

// GIF — 3× speed, palette pass. Same treatment as the phone recording.
console.log("→ encoding gif (3× speed)…");
await run("ffmpeg", [
  "-y", "-i", webmOut,
  "-vf", "setpts=PTS/3,fps=14,scale=412:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=full[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5",
  "-loop", "0",
  gifOut,
]);

await rm(tmpDir, { recursive: true, force: true });

const sizeMB = async (p) => ((await stat(p)).size / 1_048_576).toFixed(2);
console.log("\n✓ done");
console.log(`  ${mp4Out}  (${await sizeMB(mp4Out)} MB)`);
console.log(`  ${gifOut}  (${await sizeMB(gifOut)} MB)`);
console.log(`  ${webmOut}  (${await sizeMB(webmOut)} MB)  — raw, keep for re-encoding`);
