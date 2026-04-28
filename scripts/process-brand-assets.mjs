// Take the master lockup PNG (mark + wordmark + tagline, transparent BG)
// and derive every production asset:
//
//   public/lockup.png         full lockup (mark + wordmark + tagline)
//   public/lockup-2x.png      retina version of the full lockup
//   public/lockup-compact.png compact (mark + wordmark, no tagline) — for
//                             tight spaces where the tagline isn't legible
//   public/lockup-compact-2x.png  retina version of compact
//   public/mark.png           bird-on-hill only, for inline use
//   public/favicon.png      96 × 96, mark on transparent
//   public/apple-touch-icon.png  180 × 180, dark-green rounded-square + cream mark
//   public/icon-192.png     PWA maskable, dark-green bg, cream mark
//   public/icon-512.png     PWA maskable, dark-green bg, cream mark
//   public/og.png           1200 × 630 share card with full lockup centered
//
// Re-run any time the source artwork changes.

import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const REF = resolve(ROOT, "ref");
const SRC_LOCKUP = resolve(REF, "goodbird-logo-wordmark@0.5x.png");

if (!existsSync(SRC_LOCKUP)) {
  console.error(`source lockup not found at ${SRC_LOCKUP}`);
  process.exit(1);
}

// ── Crop bounds, derived empirically from the source via column/row alpha
//    sampling. Re-derive if the artwork dimensions change. ────────────────
//
//    Mark column (x<345) ink runs:
//      y=26..161  bird
//      y=192..247 sage hill stroke
//      y=266..314 dark green hill stroke  ← extends BELOW tagline gap top
//
//    Wordmark column (x>=480) ink runs:
//      y=34..263  "goodbird"
//      y=294..330 tagline
//
//    The dark-green hill on the mark side and the tagline on the wordmark
//    side share roughly the same vertical band. So we ship the FULL lockup
//    intact — there is no clean rectangle that drops the tagline without
//    also amputating the second hill stroke.
const CROP = {
  mark: { left: 0, top: 0, width: 345,  height: 331 },
  full: { left: 0, top: 0, width: 1425, height: 330 },
};

// App-icon background. Cream so the mark sits on the same surface as the
// rest of the brand, not in a "reverse" dark-green app-icon treatment.
const CREAM = { r: 233, g: 226, b: 214 };  // #E9E2D6

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Solid-color rounded-square canvas. */
function solidBg(size, color) {
  return sharp({
    create: { width: size, height: size, channels: 4, background: color },
  }).png().toBuffer();
}

async function main() {
  // Reusing one sharp() across extracts trips an "extract area" error (state
  // sticks across clones). Fresh sharp() per extract is safe.

  // 1) Mark only — left segment, then trim transparent borders
  const markBuf = await sharp(SRC_LOCKUP).extract(CROP.mark).trim({ background: TRANSPARENT }).toBuffer();
  await sharp(markBuf).resize({ width: 256 }).toFile(resolve(PUBLIC, "mark.png"));
  await sharp(markBuf).resize({ width: 512 }).toFile(resolve(PUBLIC, "mark-2x.png"));
  console.log("✓ mark.png + mark-2x.png");

  // 2) Full lockup — both hill strokes + tagline. Canonical brand asset.
  //    Skip trim(): content already extends to image edges.
  const fullBuf = await sharp(SRC_LOCKUP).extract(CROP.full).toBuffer();
  await sharp(fullBuf).resize({ width: 720 }).toFile(resolve(PUBLIC, "lockup.png"));
  await sharp(fullBuf).resize({ width: 1440 }).toFile(resolve(PUBLIC, "lockup-2x.png"));
  console.log("✓ lockup.png + lockup-2x.png (full lockup with tagline)");

  // 3) Compact lockup — both hill strokes but NO tagline. Built by
  //    compositing: full-height mark column on the left + wordmark-text
  //    column (cropped above the tagline) on the right, on a transparent
  //    canvas. Can't use a rectangular crop because the second hill and
  //    the tagline share roughly the same vertical band in different
  //    x columns.
  const markCol = await sharp(SRC_LOCKUP)
    .extract({ left: 0, top: 0, width: 345, height: 330 }).toBuffer();
  const wordmarkTextOnly = await sharp(SRC_LOCKUP)
    .extract({ left: 345, top: 0, width: 1080, height: 275 }).toBuffer();
  const compactBuf = await sharp({
    create: { width: 1425, height: 330, channels: 4, background: TRANSPARENT },
  }).png()
    .composite([
      { input: markCol, top: 0, left: 0 },
      { input: wordmarkTextOnly, top: 0, left: 345 },
    ])
    .trim({ background: TRANSPARENT })
    .toBuffer();
  await sharp(compactBuf).resize({ width: 720 }).toFile(resolve(PUBLIC, "lockup-compact.png"));
  await sharp(compactBuf).resize({ width: 1440 }).toFile(resolve(PUBLIC, "lockup-compact-2x.png"));
  console.log("✓ lockup-compact.png + lockup-compact-2x.png (no tagline, both hills)");

  // 4) Favicon — pad mark to square
  await sharp(markBuf)
    .resize({ width: 88, height: 88, fit: "contain", background: TRANSPARENT })
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: TRANSPARENT })
    .toFile(resolve(PUBLIC, "favicon.png"));
  console.log("✓ favicon.png (96 × 96)");

  // 5) Apple touch icon — 180×180 cream background + the original dark-green
  //    mark on top. Same direction as the lockup; no inverted "reverse"
  //    treatment that read as too app-icon-y.
  const mark180 = await sharp(markBuf)
    .resize({ width: 130, height: 130, fit: "contain", background: TRANSPARENT })
    .toBuffer();
  await sharp(await solidBg(180, CREAM))
    .composite([{ input: mark180, gravity: "center" }])
    .toFile(resolve(PUBLIC, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png (180 × 180, cream + dark-green mark)");

  // 6) PWA maskable icons — 4:1 safe area = mark in central 70% on cream
  for (const size of [192, 512]) {
    const inner = Math.floor(size * 0.7);
    const innerMark = await sharp(markBuf)
      .resize({ width: inner, height: inner, fit: "contain", background: TRANSPARENT })
      .toBuffer();
    await sharp(await solidBg(size, CREAM))
      .composite([{ input: innerMark, gravity: "center" }])
      .toFile(resolve(PUBLIC, `icon-${size}.png`));
  }
  console.log("✓ icon-192.png + icon-512.png (cream + dark-green mark)");

  // 7) OG image — 1200 × 630, cream canvas, lockup visually centered
  //    above a wavy fog/hill band that mirrors the Hero section. The
  //    "visual center" trick: shift the lockup up by ~30 px so the
  //    BIRD/wordmark line (not including the tagline) sits on the
  //    page's optical center, not the strict geometric center.
  const OG_W = 1200, OG_H = 630;
  const CREAM_BG = { r: 247, g: 250, b: 246 };
  const FOG_H = 200; // bottom band height
  const ogBg = await sharp({
    create: { width: OG_W, height: OG_H, channels: 4, background: CREAM_BG },
  }).png().toBuffer();

  // Wavy fog band — same Q→T smooth-quadratic chain as Hero.tsx. Four
  // layers fading from pale sage to deeper sage. Colors use hex+alpha
  // because librsvg (sharp's SVG renderer) doesn't parse oklch();
  // these are the precise sRGB equivalents of the Hero's oklch tokens.
  // preserveAspectRatio="none" stretches the 800×100 design grid across
  // 1200 × FOG_H.
  const fogSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${FOG_H}" viewBox="0 0 800 100" preserveAspectRatio="none">
      <path d="M0,48 Q 100,22 200,48 T 400,48 T 600,48 T 800,48 L 800,100 L 0,100 Z" fill="#d8eee1" fill-opacity="0.55"/>
      <path d="M0,64 Q 80,42 180,62 T 380,62 T 580,62 T 800,64 L 800,100 L 0,100 Z" fill="#b8d6c5" fill-opacity="0.7"/>
      <path d="M0,78 Q 130,58 260,76 T 520,76 T 800,78 L 800,100 L 0,100 Z" fill="#93bca5" fill-opacity="0.8"/>
      <path d="M0,90 Q 60,80 120,89 T 240,89 T 360,89 T 480,89 T 600,89 T 720,89 T 800,90 L 800,100 L 0,100 Z" fill="#6ca083" fill-opacity="0.88"/>
    </svg>
  `);

  // Lockup at ~92% canvas width
  const lockupForOg = await sharp(fullBuf).resize({ width: 1100 }).toBuffer();
  const lockupMeta = await sharp(lockupForOg).metadata();
  const lockupTop = Math.round((OG_H - FOG_H) / 2 - (lockupMeta.height ?? 0) / 2);
  const lockupLeft = Math.round((OG_W - (lockupMeta.width ?? 0)) / 2);

  await sharp(ogBg)
    .composite([
      { input: fogSvg, top: OG_H - FOG_H, left: 0 },
      { input: lockupForOg, top: lockupTop, left: lockupLeft },
    ])
    .toFile(resolve(PUBLIC, "og.png"));
  console.log("✓ og.png (1200 × 630, with fog band)");

  console.log("\ndone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
