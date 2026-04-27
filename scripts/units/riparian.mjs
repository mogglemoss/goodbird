// Riparian / Creekside — Lagunitas Creek, Pine Gulch, alders & willows.

export const UNIT = {
  id: "riparian",
  title: "Creekside",
  habitat: "Riparian Corridors",
  description: "Lagunitas Creek, Pine Gulch, and the alder-willow tangles where streamside songsters concentrate.",
  tagline: "Warblers at the water's edge.",
  accent: "sky",
};

export const SPECIES = [
  { id: "pacific-wren",            commonName: "Pacific Wren",           scientificName: "Troglodytes pacificus",   mnemonic: "Endless tinkling, fast and loud", field: "Year-round in mossy creek bottoms beneath conifer cover. The song packs roughly 50 notes per second — among the highest rates of any North American songbird."  },
  { id: "wilsons-warbler",         commonName: "Wilson's Warbler",       scientificName: "Cardellina pusilla",      mnemonic: "Staccato 'chi-chi-chi-chi-chi'", field: "April through September in willow and alder thickets. The black cap is the male's only striking field mark; females and immatures lack it."  },
  { id: "swainsons-thrush",        commonName: "Swainson's Thrush",      scientificName: "Catharus ustulatus",      mnemonic: "Spiraling, ethereal flute", field: "May through August in alder and willow understory. Sings only at dawn and dusk; the spiraling notes ascend and gradually fade."  },
  { id: "black-headed-grosbeak",   commonName: "Black-headed Grosbeak",  scientificName: "Pheucticus melanocephalus", mnemonic: "A robin on caffeine", field: "April through August in riparian edges and oak canyons. Both males and females sing; males also incubate, unusual among grosbeaks." },
  { id: "warbling-vireo",          commonName: "Western Warbling-Vireo", scientificName: "Vireo swainsoni",         xcAlias: "Vireo gilvus",                  mnemonic: "Long run-on warble ending up", field: "April through September in tall riparian and oak gallery. The slow-building warble is delivered from a single mid-canopy perch. Split from Eastern Warbling-Vireo in the 66th AOS Supplement (2025)." },
  { id: "belted-kingfisher",       commonName: "Belted Kingfisher",      scientificName: "Megaceryle alcyon",       mnemonic: "Loud dry rattle, like a fishing reel", field: "Year-round along streams and lagoons. Both sexes excavate burrows in earthen banks; the female is more colorful, with an extra rufous belt." },
  { id: "yellow-warbler",          commonName: "Yellow Warbler",         scientificName: "Setophaga petechia",      mnemonic: "Sweet sweet sweet, I'm so sweet", field: "April through August in willow and alder near water. Brood parasitism by cowbirds is common; some Yellow Warblers build a new nest floor over the cowbird's egg." },
  { id: "black-phoebe",            commonName: "Black Phoebe",           scientificName: "Sayornis nigricans",      mnemonic: "Crisp 'fee-bee'", field: "Year-round near any open water. Tail-pumping from a low perch is diagnostic; nests under bridges and eaves are made of mud pellets." },
  { id: "pacific-slope-flycatcher",commonName: "Western Flycatcher",scientificName: "Empidonax difficilis",   mnemonic: "Rising 'pee-WEET'", field: "April through September in shaded oak and conifer canyons. Nests on rock ledges and within house eaves throughout coastal California." },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",      mnemonic: "Wichity-wichity-wichity", field: "Year-round in damp brush, often along marsh edges. Males sing from cattail tops and willow thickets; the black mask is unmistakable." },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",       mnemonic: "Madge-madge-madge put-on-your-tea-kettle", field: "Year-round in any low brush near water. Each male sings 8 to 10 distinct songs, learned from neighbors as a juvenile." },
  { id: "lazuli-bunting",          commonName: "Lazuli Bunting",         scientificName: "Passerina amoena",        mnemonic: "Jumpy phrase: 'fire fire — where? where? — here here!'", field: "April through August in dense scrub near water. Young males assemble their first-year song from neighbors' phrases; resulting 'song neighborhoods' persist for years." },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",         scientificName: "Pipilo maculatus",        mnemonic: "Drink your teeeea", field: "Year-round in dense scrub. Forages by 'double-scratching' both feet backward in leaf litter — the rustle is often the first sign of the bird." },
  { id: "western-wood-pewee",      commonName: "Western Wood-Pewee",     scientificName: "Contopus sordidulus",     mnemonic: "Burry, slurred 'peeer'", field: "May through September in oak and riparian edges. Sings the burry 'pee-er' from an exposed perch, often returning to the same one between sallies." },
  // Cavity-nester of slow stream backwaters and willow ponds
  { id: "wood-duck",               commonName: "Wood Duck",              scientificName: "Aix sponsa",              mnemonic: "Squealing 'oo-EEK oo-EEK' rising whistle (female)", field: "Year-round on slow creek backwaters and willow-shaded ponds. Cavity nester; ducklings leap from the nest hole hours after hatching. Drakes one of the most striking ducks in North America." },
];

export const LESSONS = [
  { id: "rp-1",      title: "Streamside Songsters", speciesIds: ["pacific-wren", "swainsons-thrush", "wilsons-warbler", "yellow-warbler"], length: 8 },
  { id: "rp-2",      title: "Flycatchers & Phoebes",speciesIds: ["black-phoebe", "pacific-slope-flycatcher", "western-wood-pewee", "warbling-vireo"], length: 8 },
  { id: "rp-3",      title: "Brushy Banks",         speciesIds: ["song-sparrow", "spotted-towhee", "common-yellowthroat", "lazuli-bunting"], length: 8 },
  { id: "rp-4",      title: "Loud & Liquid",        speciesIds: ["black-headed-grosbeak", "belted-kingfisher", "pacific-wren"], length: 8 },
  { id: "rp-5",      title: "Backwater Quiet",      speciesIds: ["wood-duck", "belted-kingfisher", "black-phoebe"], length: 8 },
  { id: "rp-review", title: "Review: All 15",       speciesIds: [], length: 14 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
