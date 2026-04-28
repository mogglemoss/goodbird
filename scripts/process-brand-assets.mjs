// Take the master lockup PNG (mark + wordmark + tagline, transparent BG)
// and derive every production asset:
//
//   public/lockup.png       compact (mark + 'goodbird', no tagline) for header/About
//   public/lockup-2x.png    retina version of the same
//   public/lockup-full.png  full lockup (with tagline) for hero / About
//   public/mark.png         bird-on-hill only, for inline use
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
//    overall content bbox: x=7..1425, y=27..321
//    mark/wordmark gap:    x=332..470  → mark fits inside x ≤ 345
//    goodbird/tagline gap: y=263..293  → "goodbird" fits inside y ≤ 275
const CROP = {
  mark:    { left: 0,    top: 0,   width: 345,  height: 331 },
  compact: { left: 0,    top: 0,   width: 1425, height: 263 }, // mark + "goodbird" (above tagline gap)
  full:    { left: 0,    top: 0,   width: 1425, height: 330 }, // + tagline
};

// Brand colors
const MOSS = { r: 23, g: 59, b: 34 };       // #173B22
const CREAM = { r: 233, g: 226, b: 214 };   // #E9E2D6

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * Recolor every non-transparent pixel of a buffer to the target color.
 * Used to render the dark mark in cream against a dark-green app-icon bg.
 */
async function recolor(srcBuf, color) {
  const { data, info } = await sharp(srcBuf).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] > 0) {
      out[i] = color.r; out[i + 1] = color.g; out[i + 2] = color.b;
    }
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

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

  // 2) Compact lockup — mark + 'goodbird', no tagline
  // Skip trim(): content already extends to the right edge (the 'd' of 'goodbird').
  const compactBuf = await sharp(SRC_LOCKUP).extract(CROP.compact).toBuffer();
  await sharp(compactBuf).resize({ width: 720 }).toFile(resolve(PUBLIC, "lockup.png"));
  await sharp(compactBuf).resize({ width: 1440 }).toFile(resolve(PUBLIC, "lockup-2x.png"));
  console.log("✓ lockup.png + lockup-2x.png (compact, no tagline)");

  // 3) Full lockup — with tagline
  const fullBuf = await sharp(SRC_LOCKUP).extract(CROP.full).toBuffer();
  await sharp(fullBuf).resize({ width: 1440 }).toFile(resolve(PUBLIC, "lockup-full.png"));
  console.log("✓ lockup-full.png (with tagline)");

  // 4) Favicon — pad mark to square
  await sharp(markBuf)
    .resize({ width: 88, height: 88, fit: "contain", background: TRANSPARENT })
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: TRANSPARENT })
    .toFile(resolve(PUBLIC, "favicon.png"));
  console.log("✓ favicon.png (96 × 96)");

  // 5) Apple touch icon — 180×180 dark-green, cream mark inside
  const cream180Mark = await recolor(
    await sharp(markBuf).resize({ width: 130, height: 130, fit: "contain", background: TRANSPARENT }).toBuffer(),
    CREAM,
  );
  await sharp(await solidBg(180, MOSS))
    .composite([{ input: cream180Mark, gravity: "center" }])
    .toFile(resolve(PUBLIC, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png (180 × 180, dark green + cream mark)");

  // 6) PWA maskable icons — 4:1 safe area = mark covers central 70%
  for (const size of [192, 512]) {
    const inner = Math.floor(size * 0.7);
    const creamInner = await recolor(
      await sharp(markBuf).resize({ width: inner, height: inner, fit: "contain", background: TRANSPARENT }).toBuffer(),
      CREAM,
    );
    await sharp(await solidBg(size, MOSS))
      .composite([{ input: creamInner, gravity: "center" }])
      .toFile(resolve(PUBLIC, `icon-${size}.png`));
  }
  console.log("✓ icon-192.png + icon-512.png (PWA maskable)");

  // 7) OG image — 1200 × 630 cream canvas with full lockup centered
  const OG_W = 1200, OG_H = 630;
  const CREAM_BG = { r: 247, g: 250, b: 246 }; // app's cream/sand bg
  const ogBg = await sharp({
    create: { width: OG_W, height: OG_H, channels: 4, background: CREAM_BG },
  }).png().toBuffer();
  // Scale full lockup to ~92% of canvas width — at 1425×330 source aspect
  // (~4.3:1), 1100 wide → ~255 tall, leaving generous vertical breathing room.
  const lockupForOg = await sharp(fullBuf).resize({ width: 1100 }).toBuffer();
  const lockupMeta = await sharp(lockupForOg).metadata();
  await sharp(ogBg)
    .composite([{
      input: lockupForOg,
      top: Math.round((OG_H - (lockupMeta.height ?? 0)) / 2),
      left: Math.round((OG_W - (lockupMeta.width ?? 0)) / 2),
    }])
    .toFile(resolve(PUBLIC, "og.png"));
  console.log("✓ og.png (1200 × 630)");

  console.log("\ndone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
