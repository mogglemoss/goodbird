// Riparian / Creekside — Lagunitas Creek, Pine Gulch, alders & willows.

export const UNIT = {
  id: "riparian",
  title: "Creekside",
  habitat: "Riparian Corridors",
  description: "Lagunitas Creek, Pine Gulch, and the alder-willow tangles where streamside songsters concentrate.",
  accent: "sky",
};

export const SPECIES = [
  { id: "pacific-wren",            commonName: "Pacific Wren",           scientificName: "Troglodytes pacificus",   mnemonic: "Endless tinkling, fast and loud", field: "Year-round in mossy creek bottoms; loud song from low cover." },
  { id: "wilsons-warbler",         commonName: "Wilson's Warbler",       scientificName: "Cardellina pusilla",      mnemonic: "Staccato 'chi-chi-chi-chi-chi'", field: "April–September in willow-lined creeks; sings from low branches." },
  { id: "swainsons-thrush",        commonName: "Swainson's Thrush",      scientificName: "Catharus ustulatus",      mnemonic: "Spiraling, ethereal flute", field: "May–August in alder/willow; sings at dawn and dusk from deep cover." },
  { id: "black-headed-grosbeak",   commonName: "Black-headed Grosbeak",  scientificName: "Pheucticus melanocephalus", mnemonic: "A robin on caffeine" },
  { id: "warbling-vireo",          commonName: "Warbling Vireo",         scientificName: "Vireo gilvus",            mnemonic: "Long run-on warble ending up" },
  { id: "belted-kingfisher",       commonName: "Belted Kingfisher",      scientificName: "Megaceryle alcyon",       mnemonic: "Loud dry rattle, like a fishing reel" },
  { id: "yellow-warbler",          commonName: "Yellow Warbler",         scientificName: "Setophaga petechia",      mnemonic: "Sweet sweet sweet, I'm so sweet" },
  { id: "black-phoebe",            commonName: "Black Phoebe",           scientificName: "Sayornis nigricans",      mnemonic: "Crisp 'fee-bee'" },
  { id: "pacific-slope-flycatcher",commonName: "Pacific-slope Flycatcher",scientificName: "Empidonax difficilis",   mnemonic: "Rising 'pee-WEET'" },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",      mnemonic: "Wichity-wichity-wichity" },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",       mnemonic: "Madge-madge-madge put-on-your-tea-kettle" },
  { id: "lazuli-bunting",          commonName: "Lazuli Bunting",         scientificName: "Passerina amoena",        mnemonic: "Jumpy phrase: 'fire fire — where? where? — here here!'" },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",         scientificName: "Pipilo maculatus",        mnemonic: "Drink your teeeea" },
  { id: "western-wood-pewee",      commonName: "Western Wood-Pewee",     scientificName: "Contopus sordidulus",     mnemonic: "Burry, slurred 'peeer'" },
];

export const LESSONS = [
  { id: "rp-1",      title: "Streamside Songsters", speciesIds: ["pacific-wren", "swainsons-thrush", "wilsons-warbler", "yellow-warbler"], length: 8 },
  { id: "rp-2",      title: "Flycatchers & Phoebes",speciesIds: ["black-phoebe", "pacific-slope-flycatcher", "western-wood-pewee", "warbling-vireo"], length: 8 },
  { id: "rp-3",      title: "Brushy Banks",         speciesIds: ["song-sparrow", "spotted-towhee", "common-yellowthroat", "lazuli-bunting"], length: 8 },
  { id: "rp-4",      title: "Loud & Liquid",        speciesIds: ["black-headed-grosbeak", "belted-kingfisher", "pacific-wren"], length: 8 },
  { id: "rp-review", title: "Review: All 14",       speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
