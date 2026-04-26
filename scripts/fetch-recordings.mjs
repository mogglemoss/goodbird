#!/usr/bin/env node
// Builds src/data/<unit-id>.json for every unit in scripts/units/.
// Source preference: xeno-canto v3 (requires XC_API_KEY) → iNaturalist (no key).
//
// Usage:
//   node scripts/fetch-recordings.mjs                   # all units
//   node scripts/fetch-recordings.mjs coastal-scrub     # just one
//
// xeno-canto v3 docs: https://xeno-canto.org/explore/api
// Wikipedia REST API: https://en.wikipedia.org/api/rest_v1/
// iNaturalist API:    https://api.inaturalist.org/v1/docs/

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UNITS_DIR = path.resolve(__dirname, "units");
const OUT_DIR = path.resolve(__dirname, "../src/data");

const XC_BASE = "https://xeno-canto.org/api/3/recordings";
const WIKI_BASE = "https://en.wikipedia.org/api/rest_v1/page/summary";
const INAT_BASE = "https://api.inaturalist.org/v1/observations";
const XC_KEY = process.env.XC_API_KEY;
const SOURCE = XC_KEY ? "xc" : "inat";

async function fetchXC(species) {
  const [gen, sp] = species.scientificName.split(" ");
  const query = `gen:${gen} sp:${sp} q:A len_lt:15 cnt:"United States"`;
  const url = `${XC_BASE}?query=${encodeURIComponent(query)}&key=${XC_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`xeno-canto ${species.commonName}: ${res.status}`);
  const data = await res.json();
  let recs = data.recordings || [];
  if (recs.length < 3) {
    const fb = `gen:${gen} sp:${sp} q:A len_lt:15`;
    const r2 = await fetch(`${XC_BASE}?query=${encodeURIComponent(fb)}&key=${XC_KEY}`);
    const d2 = await r2.json();
    recs = d2.recordings || recs;
  }
  recs.sort((a, b) => {
    const qa = a.q === "A" ? 0 : 1;
    const qb = b.q === "A" ? 0 : 1;
    if (qa !== qb) return qa - qb;
    return Math.abs(parseLen(a.length) - 8) - Math.abs(parseLen(b.length) - 8);
  });
  const filtered = recs.filter((r) => {
    const t = (r.type || "").toLowerCase();
    if (t.includes("alarm") && !t.includes("song") && !t.includes("call")) return false;
    if ((r["playback-used"] || "").toLowerCase() === "yes") return false;
    return true;
  });
  const picks = (filtered.length >= 3 ? filtered : recs).slice(0, 3);
  return picks.map((r) => ({
    id: `XC${r.id}`,
    url: r.file?.startsWith("//") ? `https:${r.file}` : r.file,
    duration: parseLen(r.length),
    type: r.type,
    recordist: r.rec,
    location: [r.loc, r.cnt].filter(Boolean).join(", "),
    license: r.lic,
    sourceUrl: r.url?.startsWith("//") ? `https:${r.url}` : r.url,
  }));
}

function parseLen(str) {
  if (!str) return 0;
  const parts = str.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(str) || 0;
}

async function fetchInat(species) {
  // place_id 14 = California
  const url = `${INAT_BASE}?taxon_name=${encodeURIComponent(species.scientificName)}&sounds=true&quality_grade=research&per_page=20&place_id=14&order_by=votes`;
  let res = await fetch(url);
  let data = await res.json();
  let obs = (data.results || []).filter((o) => o.sounds?.length);
  if (obs.length < 3) {
    const fb = `${INAT_BASE}?taxon_name=${encodeURIComponent(species.scientificName)}&sounds=true&quality_grade=research&per_page=20&order_by=votes`;
    res = await fetch(fb);
    data = await res.json();
    obs = (data.results || []).filter((o) => o.sounds?.length);
  }
  return obs.slice(0, 3).map((o) => {
    const s = o.sounds[0];
    return {
      id: `iNat${o.id}-${s.id}`,
      url: s.file_url,
      duration: 0,
      type: "song/call",
      recordist: o.user?.login || "unknown",
      location: o.place_guess || "",
      license: s.license_code || "",
      sourceUrl: `https://www.inaturalist.org/observations/${o.id}`,
    };
  });
}

async function fetchImage(species) {
  const title = (species.wikipediaTitle ?? species.commonName).replace(/ /g, "_");
  const res = await fetch(`${WIKI_BASE}/${encodeURIComponent(title)}`);
  if (!res.ok) {
    const r2 = await fetch(`${WIKI_BASE}/${encodeURIComponent(species.scientificName.replace(/ /g, "_"))}`);
    if (!r2.ok) return null;
    const d2 = await r2.json();
    return d2.thumbnail?.source ?? d2.originalimage?.source ?? null;
  }
  const data = await res.json();
  return data.thumbnail?.source ?? data.originalimage?.source ?? null;
}

async function buildUnit(unitFile) {
  const mod = await import(unitFile);
  const { UNIT, SPECIES, LESSONS } = mod;
  console.log(`\n=== ${UNIT.title} (${UNIT.id}) ===`);
  const enriched = [];
  for (const sp of SPECIES) {
    process.stdout.write(`  • ${sp.commonName.padEnd(30)} `);
    try {
      const fetchAudio = SOURCE === "xc" ? fetchXC : fetchInat;
      const [recordings, imageUrl] = await Promise.all([fetchAudio(sp), fetchImage(sp)]);
      enriched.push({ ...sp, imageUrl, recordings });
      console.log(`${recordings.length} clips${imageUrl ? "" : " (no image)"}`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      enriched.push({ ...sp, imageUrl: null, recordings: [] });
    }
  }
  const validIds = new Set(enriched.map((s) => s.id));
  for (const lesson of LESSONS) {
    for (const id of lesson.speciesIds) {
      if (!validIds.has(id)) console.warn(`    ! lesson ${lesson.id} references unknown species '${id}'`);
    }
  }
  const manifest = { unit: UNIT, species: enriched, lessons: LESSONS };
  const outPath = path.join(OUT_DIR, `${UNIT.id}.json`);
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(manifest, null, 2));
  const totalClips = enriched.reduce((n, s) => n + s.recordings.length, 0);
  console.log(`  → wrote ${outPath} (${enriched.length} species, ${totalClips} recordings)`);
}

async function main() {
  console.log(`Source: ${SOURCE === "xc" ? "xeno-canto (curated)" : "iNaturalist (no key)"}`);
  const filter = process.argv[2];
  const files = (await fs.readdir(UNITS_DIR))
    .filter((f) => f.endsWith(".mjs"))
    .filter((f) => !filter || f === `${filter}.mjs`)
    .sort();
  if (!files.length) {
    console.error(`No unit files matched.`);
    process.exit(1);
  }
  for (const f of files) {
    await buildUnit(path.join(UNITS_DIR, f));
  }
  console.log(`\nDone. Built ${files.length} unit(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
