// Oak Woodland & Bay Laurel — Inverness Ridge, Olema, Mt. Tam.
// Distinct, vocal cavity-nesters and forest songsters.

export const UNIT = {
  id: "oak-woodland",
  title: "Oak Woodland",
  habitat: "Oak Woodland & Bay Laurel",
  description: "The acorn-strewn understory of Inverness Ridge, Olema, and Mt. Tamalpais — cavity-nesters and woodland songsters.",
  tagline: "Acorn woodpeckers in dappled cathedrals.",
  accent: "amber",
};

export const SPECIES = [
  { id: "acorn-woodpecker",        commonName: "Acorn Woodpecker",        scientificName: "Melanerpes formicivorus", mnemonic: "Wheka-wheka-wheka — clown laughter", field: "Year-round in oak woodland. Lives in cooperative groups of up to a dozen, anchored to a single granary tree pierced with thousands of acorn-storage holes."  },
  { id: "oak-titmouse",            commonName: "Oak Titmouse",            scientificName: "Baeolophus inornatus",    mnemonic: "Peter-peter-peter, scratchy", field: "Year-round resident of oak woodland. Pairs occupy a single territory year after year and defend it duet-style in late winter."  },
  { id: "pacific-slope-flycatcher",commonName: "Western Flycatcher",scientificName: "Empidonax difficilis",    mnemonic: "Rising 'pee-WEET'", field: "April through September in shaded oak and conifer canyons. Nests on rock ledges and within house eaves throughout coastal California." },
  { id: "stellers-jay",            commonName: "Steller's Jay",           scientificName: "Cyanocitta stelleri",     mnemonic: "Harsh 'shaak-shaak-shaak'", field: "Year-round in coniferous and oak forest. Mimics Red-tailed Hawk calls — possibly to clear feeders of competitors." },
  { id: "huttons-vireo",           commonName: "Hutton's Vireo",          scientificName: "Vireo huttoni",           mnemonic: "Endlessly repeated 'zu-wee'", field: "Year-round in evergreen oak. Often confused with Ruby-crowned Kinglet by sight; the repetitive 'zu-wee' song is diagnostic." },
  { id: "western-tanager",         commonName: "Western Tanager",         scientificName: "Piranga ludoviciana",     mnemonic: "Robin with a sore throat", field: "April through September in mixed oak and conifer. Adult males' red crowns develop only after molt on the breeding grounds and fade again before fall migration."  },
  { id: "dark-eyed-junco",         commonName: "Dark-eyed Junco",         scientificName: "Junco hyemalis",          mnemonic: "Even, ringing trill on one pitch", field: "Year-round in oak and conifer edges; numbers swell in winter. The flashing white outer tail feathers are flicked open in alarm." },
  { id: "purple-finch",            commonName: "Purple Finch",            scientificName: "Haemorhous purpureus",    mnemonic: "Long rich warble that tumbles downward", field: "Year-round in mixed oak-fir; more numerous in winter. Adult males develop their raspberry plumage gradually over their second year." },
  { id: "lesser-goldfinch",        commonName: "Lesser Goldfinch",        scientificName: "Spinus psaltria",         mnemonic: "Plaintive 'tee-yeer', mimics", field: "Year-round in open oak country and weedy edges. Often nests in loose colonies; juveniles begin to sing within two months of fledging." },
  { id: "western-bluebird",        commonName: "Western Bluebird",        scientificName: "Sialia mexicana",         mnemonic: "Soft 'few' contact notes", field: "Year-round in oak savanna and pasture edges. Cavity nester; competes with starlings, swallows, and other bluebirds for nest holes." },
  { id: "chestnut-backed-chickadee",commonName:"Chestnut-backed Chickadee",scientificName: "Poecile rufescens",       mnemonic: "Buzzy, hurried 'chick-a-dee-dee'", field: "Year-round in mixed evergreen forest. Often the lead species in mixed-flock foraging movements through the winter canopy." },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",          scientificName: "Pipilo maculatus",        mnemonic: "Drink your teeeea", field: "Year-round in dense scrub. Forages by 'double-scratching' both feet backward in leaf litter — the rustle is often the first sign of the bird." },
  { id: "warbling-vireo",          commonName: "Western Warbling-Vireo",  scientificName: "Vireo swainsoni",         xcAlias: "Vireo gilvus",                  mnemonic: "Long, run-on warble ending up", field: "April through September in tall riparian and oak gallery. The slow-building warble is delivered from a single mid-canopy perch. Split from Eastern Warbling-Vireo in the 66th AOS Supplement (2025)." },
  // Small woodpeckers of West Marin oak country
  { id: "downy-woodpecker",        commonName: "Downy Woodpecker",        scientificName: "Dryobates pubescens",     mnemonic: "High descending whinny; sharp 'pik' call", field: "Year-round in oak and riparian edges. Smallest North American woodpecker; the short stubby bill (about a third the head's length) separates it from the otherwise identical Hairy Woodpecker." },
  { id: "nuttalls-woodpecker",     commonName: "Nuttall's Woodpecker",    scientificName: "Dryobates nuttallii",     mnemonic: "Sharp rattling 'prrrt'; sharper than Downy's whinny", field: "Year-round in California oak woodland — a near-endemic to California (just barely into Baja). Black-and-white ladder-backed; barely overlaps with Downy in habitat preference." },
];

export const LESSONS = [
  { id: "ow-1",      title: "Cavity Nesters",        speciesIds: ["acorn-woodpecker", "oak-titmouse", "chestnut-backed-chickadee", "western-bluebird"], length: 8 },
  { id: "ow-2",      title: "Songs in the Canopy",   speciesIds: ["western-tanager", "purple-finch", "warbling-vireo", "huttons-vireo"], length: 8 },
  { id: "ow-3",      title: "Understory Voices",     speciesIds: ["spotted-towhee", "dark-eyed-junco", "pacific-slope-flycatcher", "lesser-goldfinch"], length: 8 },
  { id: "ow-4",      title: "Bold & Loud",           speciesIds: ["stellers-jay", "acorn-woodpecker", "oak-titmouse"], length: 8 },
  { id: "ow-5",      title: "Small Woodpeckers",     speciesIds: ["downy-woodpecker", "nuttalls-woodpecker", "acorn-woodpecker"], length: 8 },
  { id: "ow-review", title: "Review: All 15",        speciesIds: [], length: 14 }, // populated below
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
