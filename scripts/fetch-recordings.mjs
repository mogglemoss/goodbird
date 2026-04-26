#!/usr/bin/env node
// One-shot script to build src/data/coastal-scrub.json from xeno-canto + Wikipedia.
// Usage: node scripts/fetch-recordings.mjs
//
// xeno-canto API v2 docs: https://xeno-canto.org/explore/api
// Wikipedia REST API: https://en.wikipedia.org/api/rest_v1/

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, "../src/data/coastal-scrub.json");

const SPECIES = [
  { id: "wrentit",                 commonName: "Wrentit",                scientificName: "Chamaea fasciata",       mnemonic: "Bouncing ping-pong ball" },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",         scientificName: "Pipilo maculatus",       mnemonic: "Drink your teeeea" },
  { id: "california-towhee",       commonName: "California Towhee",      scientificName: "Melozone crissalis",     mnemonic: "Metallic chink-chink" },
  { id: "white-crowned-sparrow",   commonName: "White-crowned Sparrow",  scientificName: "Zonotrichia leucophrys", mnemonic: "Oh-sweet-pretty-little-Canada" },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",      mnemonic: "Madge-madge-madge put-on-your-tea-kettle" },
  { id: "bewicks-wren",            commonName: "Bewick's Wren",          scientificName: "Thryomanes bewickii",    mnemonic: "Buzzy trill with a flourish" },
  { id: "house-wren",              commonName: "House Wren",             scientificName: "Troglodytes aedon",      mnemonic: "Bubbly cascading chatter", wikipediaTitle: "Northern house wren" },
  { id: "california-quail",        commonName: "California Quail",       scientificName: "Callipepla californica", mnemonic: "Chi-CA-go!" },
  { id: "california-scrub-jay",    commonName: "California Scrub-Jay",   scientificName: "Aphelocoma californica", mnemonic: "Harsh shreeenk!" },
  { id: "annas-hummingbird",       commonName: "Anna's Hummingbird",     scientificName: "Calypte anna",           mnemonic: "Scratchy squeaky-gate song" },
  { id: "northern-mockingbird",    commonName: "Northern Mockingbird",   scientificName: "Mimus polyglottos",      mnemonic: "Anything, repeated three times" },
  { id: "california-thrasher",     commonName: "California Thrasher",    scientificName: "Toxostoma redivivum",    mnemonic: "Long musical medley, each phrase twice" },
  { id: "bushtit",                 commonName: "Bushtit",                scientificName: "Psaltriparus minimus",   mnemonic: "High tinkling 'pit-pit' contact calls" },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",     mnemonic: "Wichity-wichity-wichity" },
  { id: "bullocks-oriole",         commonName: "Bullock's Oriole",       scientificName: "Icterus bullockii",      mnemonic: "Whistled, chattery, conversational" },
];

const UNIT = {
  id: "coastal-scrub",
  title: "Coastal Scrub",
  habitat: "Coastal Scrub",
  description: "The chaparral, scrub, and brushy edges along the Point Reyes, Bolinas, and Tomales coastline.",
};

const LESSONS = [
  { id: "cs-1", title: "Backyard Regulars",     speciesIds: ["california-towhee", "anna's-hummingbird", "california-scrub-jay", "white-crowned-sparrow"].map(s => s.replace("'","")), length: 8 },
  { id: "cs-2", title: "Brushy Edges",          speciesIds: ["wrentit", "spotted-towhee", "bewicks-wren", "song-sparrow"], length: 8 },
  { id: "cs-3", title: "Voices in the Thicket", speciesIds: ["california-thrasher", "house-wren", "common-yellowthroat", "northern-mockingbird"], length: 8 },
  { id: "cs-4", title: "Flock & Field",         speciesIds: ["california-quail", "bushtit", "bullocks-oriole"], length: 8 },
  { id: "cs-review", title: "Review: All 15",        speciesIds: SPECIES.map(s => s.id), length: 12 },
];

const XC_BASE = "https://xeno-canto.org/api/3/recordings";
const WIKI_BASE = "https://en.wikipedia.org/api/rest_v1/page/summary";
const INAT_BASE = "https://api.inaturalist.org/v1/observations";
const XC_KEY = process.env.XC_API_KEY;
const SOURCE = XC_KEY ? "xc" : "inat";
console.log(`Source: ${SOURCE === "xc" ? "xeno-canto (curated, requires key)" : "iNaturalist (no key, variable quality)"}\n`);

async function fetchXC(species) {
  const [gen, sp] = species.scientificName.split(" ");
  // Quality A, < 15s, prefer United States. We'll filter further client-side.
  const query = `gen:${gen} sp:${sp} q:A len_lt:15 cnt:"United States"`;
  const url = `${XC_BASE}?query=${encodeURIComponent(query)}&key=${XC_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`xeno-canto ${species.commonName}: ${res.status}`);
  const data = await res.json();
  let recs = data.recordings || [];
  if (recs.length < 3) {
    // Relax: drop country filter
    const fallback = `gen:${gen} sp:${sp} q:A len_lt:15`;
    const r2 = await fetch(`${XC_BASE}?query=${encodeURIComponent(fallback)}&key=${XC_KEY}`);
    const d2 = await r2.json();
    recs = d2.recordings || recs;
  }
  // Sort by quality (A is best), then by length closer to 8s sweet spot
  recs.sort((a, b) => {
    const qa = a.q === "A" ? 0 : 1;
    const qb = b.q === "A" ? 0 : 1;
    if (qa !== qb) return qa - qb;
    const la = parseLen(a.length);
    const lb = parseLen(b.length);
    return Math.abs(la - 8) - Math.abs(lb - 8);
  });
  // Prefer "song" / "call" types; skip alarm-only or playback
  const wanted = recs.filter((r) => {
    const t = (r.type || "").toLowerCase();
    if (t.includes("alarm") && !t.includes("song") && !t.includes("call")) return false;
    if ((r["playback-used"] || "").toLowerCase() === "yes") return false;
    return true;
  });
  const picks = (wanted.length >= 3 ? wanted : recs).slice(0, 3);
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
  // Pull research-grade observations that have sounds, in California where possible.
  // place_id 14 = California on iNat.
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
  const picks = obs.slice(0, 3);
  return picks.map((o) => {
    const s = o.sounds[0];
    return {
      id: `iNat${o.id}-${s.id}`,
      url: s.file_url,
      duration: 0, // unknown from this endpoint
      type: "song/call",
      recordist: o.user?.login || "unknown",
      location: o.place_guess || "",
      license: s.license_code || "",
      sourceUrl: `https://www.inaturalist.org/observations/${o.id}`,
    };
  });
}

async function fetchImage(species) {
  // Wikipedia summaries reliably provide a thumbnail.
  const title = (species.wikipediaTitle ?? species.commonName).replace(/ /g, "_");
  const res = await fetch(`${WIKI_BASE}/${encodeURIComponent(title)}`);
  if (!res.ok) {
    // Try scientific name
    const r2 = await fetch(`${WIKI_BASE}/${encodeURIComponent(species.scientificName.replace(/ /g, "_"))}`);
    if (!r2.ok) return null;
    const d2 = await r2.json();
    return d2.thumbnail?.source ?? d2.originalimage?.source ?? null;
  }
  const data = await res.json();
  return data.thumbnail?.source ?? data.originalimage?.source ?? null;
}

async function main() {
  const enriched = [];
  for (const sp of SPECIES) {
    process.stdout.write(`• ${sp.commonName.padEnd(28)} `);
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

  // Sanity check that lesson speciesIds resolve.
  const validIds = new Set(enriched.map((s) => s.id));
  for (const lesson of LESSONS) {
    for (const id of lesson.speciesIds) {
      if (!validIds.has(id)) console.warn(`  ! lesson ${lesson.id} references unknown species '${id}'`);
    }
  }

  const manifest = { unit: UNIT, species: enriched, lessons: LESSONS };
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${OUT_PATH}`);
  const totalClips = enriched.reduce((n, s) => n + s.recordings.length, 0);
  console.log(`${enriched.length} species, ${totalClips} recordings.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
