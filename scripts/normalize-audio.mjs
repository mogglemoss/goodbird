#!/usr/bin/env node
// Measures integrated loudness (LUFS) of every recording in src/data/*.json
// using ffmpeg's loudnorm filter, then writes a per-recording `gain` multiplier
// that brings everything to a common target loudness.
//
// Why: xeno-canto recordings vary wildly in level — some clips peg the meter,
// others are barely audible. Without normalization, learners spend more time
// reaching for the volume knob than learning songs.
//
// Strategy: peak/loudness measurement is done once at build time (this script).
// At runtime, AudioPlayer reads the stored `gain` and passes it to Howl.volume().
// Since HTMLAudioElement.volume is clamped to [0,1], we use a *quiet* target
// (-30 LUFS) so virtually every measurement lands above the target — the gain
// then attenuates each clip down to land at the same loudness. Users turn their
// device volume up; clips are equal *relative* to each other.
//
// Usage:
//   node scripts/normalize-audio.mjs                # all units, only un-measured
//   node scripts/normalize-audio.mjs --force        # remeasure everything
//   node scripts/normalize-audio.mjs tomales-bay    # one unit
//
// Requires: ffmpeg in PATH.

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../src/data");
const TARGET_LUFS = -30; // intentionally quiet — see header comment

const args = process.argv.slice(2);
const force = args.includes("--force");
const filter = args.find((a) => !a.startsWith("--"));

function dbToGain(db) {
  return Math.pow(10, db / 20);
}

async function downloadToTmp(url, suffix = ".mp3") {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tmp = path.join(os.tmpdir(), `goodbird-norm-${Date.now()}-${Math.random().toString(36).slice(2)}${suffix}`);
  await fs.writeFile(tmp, buf);
  return tmp;
}

/** Run ffmpeg loudnorm in print-only mode and parse the JSON it emits. */
function measureLoudness(inputPath) {
  return new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", [
      "-hide_banner",
      "-nostats",
      "-i", inputPath,
      "-af", "loudnorm=print_format=json",
      "-f", "null",
      "-",
    ]);
    let stderr = "";
    ff.stderr.on("data", (d) => { stderr += d.toString(); });
    ff.on("error", reject);
    ff.on("close", (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(-300)}`));
      // ffmpeg prints the loudnorm JSON to stderr after the run.
      const start = stderr.lastIndexOf("{");
      const end = stderr.lastIndexOf("}");
      if (start < 0 || end < 0) return reject(new Error("no loudnorm JSON in ffmpeg output"));
      try {
        const j = JSON.parse(stderr.slice(start, end + 1));
        resolve({
          integrated: parseFloat(j.input_i),
          truePeak: parseFloat(j.input_tp),
          lra: parseFloat(j.input_lra),
        });
      } catch (e) {
        reject(new Error(`couldn't parse loudnorm JSON: ${e.message}`));
      }
    });
  });
}

async function processUnit(jsonPath) {
  const raw = await fs.readFile(jsonPath, "utf8");
  const data = JSON.parse(raw);
  let touched = 0;
  let skipped = 0;
  console.log(`\n=== ${data.unit.title} (${data.unit.id}) ===`);
  for (const sp of data.species) {
    for (const rec of sp.recordings) {
      if (!force && typeof rec.gain === "number") {
        skipped++;
        continue;
      }
      process.stdout.write(`  • ${sp.commonName.padEnd(28)} ${rec.id.padEnd(14)} `);
      let tmp;
      try {
        tmp = await downloadToTmp(rec.url);
        const m = await measureLoudness(tmp);
        // Clamp: if a clip is *already* below target, leave gain at 1.0 (no boost possible).
        if (!isFinite(m.integrated) || m.integrated <= TARGET_LUFS) {
          rec.gain = 1.0;
        } else {
          const dropDb = TARGET_LUFS - m.integrated; // negative
          rec.gain = Math.max(0.05, Math.min(1.0, dbToGain(dropDb)));
        }
        console.log(`LUFS ${m.integrated.toFixed(1)} → gain ${rec.gain.toFixed(3)}`);
        touched++;
      } catch (e) {
        console.log(`FAILED: ${e.message}`);
        rec.gain = 1.0; // safe default
      } finally {
        if (tmp) await fs.unlink(tmp).catch(() => {});
      }
    }
  }
  if (touched > 0) {
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    console.log(`  → wrote ${jsonPath}  (${touched} measured, ${skipped} cached)`);
  } else {
    console.log(`  (nothing to do — ${skipped} already cached)`);
  }
}

async function main() {
  const files = (await fs.readdir(DATA_DIR))
    .filter((f) => f.endsWith(".json"))
    .filter((f) => !filter || f === `${filter}.json`)
    .sort();
  if (!files.length) {
    console.error("No data files matched.");
    process.exit(1);
  }
  console.log(`Target loudness: ${TARGET_LUFS} LUFS  (force=${force})`);
  for (const f of files) {
    await processUnit(path.join(DATA_DIR, f));
  }
  console.log(`\nDone.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
