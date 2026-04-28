// One-shot script: turns the cream-background PNG sources from
// /Users/scott/Downloads/goodbird logo wordmark/ into production assets.
// Background removal is distance-from-cream → alpha. Cream pixels become
// transparent; brushstroke-dark pixels keep their original color and full
// opacity; anti-aliased edges get partial alpha so strokes don't look jaggy.
//
// Outputs go straight into public/ and overwrite favicon / apple-touch-icon
// / og.png. Re-run any time the source artwork changes.

import sharp from "sharp";
import { mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PREVIEW = resolve(ROOT, ".preview");
const PUBLIC = resolve(ROOT, "public");
mkdirSync(PREVIEW, { recursive: true });

// Source PNGs (already staged in .preview by hand)
const SRC_LOGO = resolve(PREVIEW, "source-logo.png");
const SRC_WORDMARK = resolve(PREVIEW, "source-wordmark.png");

// Cream background sampled from the source (approximate).
const BG_CREAM = { r: 233, g: 226, b: 214 };
// Hard threshold: pixels within this RGB distance of cream → fully transparent.
// Pixels beyond → fully opaque, original RGB. The sage stroke sits at d≈92
// from cream so it just clears this. Slight edge jaggedness is fine — the
// alternative (soft alpha) bleeds halo color when composited on dark bgs.
const BG_THRESHOLD = 80;

// Brand colors used for app-icon backgrounds.
const MOSS = { r: 23, g: 59, b: 34 };

const dist = (p, c) => Math.hypot(p.r - c.r, p.g - c.g, p.b - c.b);

/**
 * Replace the cream background with transparency via hard threshold. Edges
 * are slightly aliased but clean; no color bleed when composited on dark
 * backgrounds. RGB values for opaque pixels are preserved exactly so the
 * dark-green and sage strokes keep their original tones.
 *
 * If the source already has a transparent alpha channel (i.e. has any
 * non-opaque pixels at the corners) we skip the cream-removal step —
 * trust the artist's pre-keyed PNG.
 *
 * @param {string} inPath
 * @returns {Promise<{ data: Buffer, info: sharp.OutputInfo }>}
 */
async function makeTransparent(inPath) {
  const img = sharp(inPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  // Sniff: are the four corners transparent? If yes, source is already
  // pre-keyed and we just hand the data through unchanged.
  const C = info.channels, W = info.width, H = info.height;
  const corners = [
    [0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1],
  ];
  const allCornersTransparent = corners.every(([x, y]) => {
    const i = (y * W + x) * C;
    return data[i + 3] === 0;
  });
  if (allCornersTransparent) {
    return { data, info };
  }

  // Otherwise, do hard-threshold cream removal.
  const out = Buffer.from(data);
  for (let i = 0; i < W * H * C; i += C) {
    const px = { r: out[i], g: out[i + 1], b: out[i + 2] };
    if (dist(px, BG_CREAM) <= BG_THRESHOLD) {
      out[i] = 0; out[i + 1] = 0; out[i + 2] = 0;
      out[i + 3] = 0;
    } else {
      out[i + 3] = 255;
    }
  }
  return { data: out, info };
}

/** Trim transparent borders to a tight bounding box. */
async function trimToContent(buf, info) {
  return sharp(buf, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } });
}

async function processLogo() {
  console.log("→ processing logo…");
  const { data, info } = await makeTransparent(SRC_LOGO);
  const trimmed = await trimToContent(data, info);

  // 1) Master transparent mark, full resolution. Used as a master for
  //    runtime <img> tags via downsample.
  await trimmed.clone().toFile(resolve(PREVIEW, "logo-master.png"));

  // 2) Production sizes for use in the React app
  await trimmed.clone().resize({ width: 256 }).toFile(resolve(PUBLIC, "mark.png"));   // ~retina for header md/lg
  await trimmed.clone().resize({ width: 512 }).toFile(resolve(PUBLIC, "mark-2x.png")); // OG / about hero

  // 3) Favicon — small, square. Pad to square with transparent.
  const favicon = await trimmed.clone()
    .resize({ width: 96, height: 96, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp(favicon).toFile(resolve(PUBLIC, "favicon.png"));

  // 4) Apple touch icon — 180×180 with rounded square dark-green background
  //    so iOS doesn't get a transparent-on-white look. iOS auto-rounds.
  const appleBg = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: MOSS,
    },
  }).png().toBuffer();
  // Render the mark in cream so it has contrast on dark-green.
  const creamMark = await trimmed.clone()
    .resize({ width: 130, height: 130, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Recolor: any non-transparent pixel becomes cream.
  const cm = creamMark.data;
  for (let i = 0; i < cm.length; i += 4) {
    if (cm[i + 3] > 0) {
      cm[i] = 233; cm[i + 1] = 226; cm[i + 2] = 214; // E9E2D6 cream
    }
  }
  const recoloredMark = await sharp(cm, { raw: { width: creamMark.info.width, height: creamMark.info.height, channels: 4 } })
    .png()
    .toBuffer();
  await sharp(appleBg)
    .composite([{ input: recoloredMark, gravity: "center" }])
    .toFile(resolve(PUBLIC, "apple-touch-icon.png"));

  // 5) Maskable PWA icons (192 / 512). iOS / Android need 4:1 safe area —
  //    the maskable spec wants the meaningful content inside the central
  //    80% of the canvas.
  for (const size of [192, 512]) {
    const inner = Math.floor(size * 0.7);
    const innerMark = await trimmed.clone()
      .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .raw()
      .toBuffer({ resolveWithObject: true });
    // Recolor to cream
    const im = innerMark.data;
    for (let i = 0; i < im.length; i += 4) {
      if (im[i + 3] > 0) { im[i] = 233; im[i + 1] = 226; im[i + 2] = 214; }
    }
    const recolored = await sharp(im, { raw: { width: innerMark.info.width, height: innerMark.info.height, channels: 4 } })
      .png()
      .toBuffer();
    const bg = await sharp({
      create: { width: size, height: size, channels: 4, background: MOSS },
    }).png().toBuffer();
    await sharp(bg)
      .composite([{ input: recolored, gravity: "center" }])
      .toFile(resolve(PUBLIC, `icon-${size}.png`));
  }

  console.log("  ✓ logo done");
}

async function processWordmark() {
  console.log("→ processing wordmark…");
  const { data, info } = await makeTransparent(SRC_WORDMARK);
  const trimmed = await trimToContent(data, info);

  await trimmed.clone().toFile(resolve(PREVIEW, "wordmark-master.png"));

  // Production: a couple of natural sizes. Header is ~280px wide @ md;
  // ship 2x for retina. About uses lg → ~480px wide.
  await trimmed.clone().resize({ width: 720 }).toFile(resolve(PUBLIC, "wordmark.png"));
  await trimmed.clone().resize({ width: 1440 }).toFile(resolve(PUBLIC, "wordmark-2x.png"));

  console.log("  ✓ wordmark done");
}

async function buildOgPreview() {
  console.log("→ building og.png with new lockup…");
  const { width: ogW, height: ogH } = { width: 1200, height: 630 };
  const CREAM = { r: 247, g: 250, b: 246 };

  const bg = await sharp({
    create: { width: ogW, height: ogH, channels: 4, background: CREAM },
  }).png().toBuffer();

  // Scale logo + wordmark into a centered horizontal lockup.
  const markH = 220;
  const wordmarkH = 220;
  const logoBuf = await sharp(resolve(PREVIEW, "logo-master.png"))
    .resize({ height: markH }).toBuffer();
  const wmBuf = await sharp(resolve(PREVIEW, "wordmark-master.png"))
    .resize({ height: wordmarkH }).toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();
  const wmMeta = await sharp(wmBuf).metadata();
  const gap = 40;
  const totalW = (logoMeta.width ?? 0) + gap + (wmMeta.width ?? 0);
  const x0 = Math.round((ogW - totalW) / 2);
  const y = Math.round((ogH - Math.max(markH, wordmarkH)) / 2) - 30;

  const composed = await sharp(bg)
    .composite([
      { input: logoBuf, top: y, left: x0 },
      { input: wmBuf, top: y + Math.round((markH - wordmarkH) / 2), left: x0 + (logoMeta.width ?? 0) + gap },
    ])
    .png()
    .toBuffer();

  // Add the tagline below in dark green, baseline-aligned.
  // sharp can't render text on its own without buildtime fonts — render
  // tagline as an SVG and composite.
  const taglineSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="60">
      <text x="${ogW / 2}" y="40" font-family="ui-monospace, Menlo, Monaco, monospace" font-size="24" letter-spacing="6" fill="#173B22" opacity="0.7" text-anchor="middle">A FIELD GUIDE YOU CAN HEAR</text>
    </svg>`);

  await sharp(composed)
    .composite([{ input: taglineSvg, top: y + Math.max(markH, wordmarkH) + 30, left: 0 }])
    .toFile(resolve(PUBLIC, "og.png"));

  console.log("  ✓ og.png updated");
}

async function buildPreviewSheet() {
  console.log("→ building .preview/brand-preview.png for review…");
  const W = 1400, H = 900;
  const CREAM = { r: 247, g: 250, b: 246 };
  const bg = await sharp({
    create: { width: W, height: H, channels: 4, background: CREAM },
  }).png().toBuffer();

  const logo = await sharp(resolve(PREVIEW, "logo-master.png")).resize({ width: 240 }).toBuffer();
  const wordmark = await sharp(resolve(PREVIEW, "wordmark-master.png")).resize({ width: 600 }).toBuffer();
  const lockup = await sharp({
    create: { width: 1200, height: 320, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).png()
    .composite([
      { input: logo, top: 40, left: 60 },
      { input: wordmark, top: 100, left: 360 },
    ])
    .toBuffer();

  const darkBg = await sharp({
    create: { width: 600, height: 200, channels: 4, background: MOSS },
  }).png().toBuffer();
  const logoCream = await (async () => {
    const meta = await sharp(logo).metadata();
    const raw = await sharp(logo).raw().toBuffer();
    for (let i = 0; i < raw.length; i += 4) {
      if (raw[i + 3] > 0) { raw[i] = 233; raw[i + 1] = 226; raw[i + 2] = 214; }
    }
    return sharp(raw, { raw: { width: meta.width, height: meta.height, channels: 4 } }).png().toBuffer();
  })();

  await sharp(bg)
    .composite([
      { input: lockup, top: 60, left: 0 },
      { input: darkBg, top: 460, left: 60 },
      { input: logoCream, top: 480, left: 280 },
    ])
    .toFile(resolve(PREVIEW, "brand-preview.png"));

  console.log("  ✓ preview sheet ready at .preview/brand-preview.png");
}

(async () => {
  await processLogo();
  await processWordmark();
  await buildOgPreview();
  await buildPreviewSheet();
  // Replace the OG svg fallback as a pointer (browsers prefer .png anyway)
  copyFileSync(resolve(PUBLIC, "og.png"), resolve(PUBLIC, "og.png")); // noop guard
  console.log("done.");
})().catch((e) => { console.error(e); process.exit(1); });
