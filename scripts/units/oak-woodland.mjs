// Oak Woodland & Bay Laurel — Inverness Ridge, Olema, Mt. Tam.
// Distinct, vocal cavity-nesters and forest songsters.

export const UNIT = {
  id: "oak-woodland",
  title: "Oak Woodland",
  habitat: "Oak Woodland & Bay Laurel",
  description: "The acorn-strewn understory of Inverness Ridge, Olema, and Mt. Tamalpais — cavity-nesters and woodland songsters.",
  accent: "amber",
};

export const SPECIES = [
  { id: "acorn-woodpecker",        commonName: "Acorn Woodpecker",        scientificName: "Melanerpes formicivorus", mnemonic: "Wheka-wheka-wheka — clown laughter" },
  { id: "oak-titmouse",            commonName: "Oak Titmouse",            scientificName: "Baeolophus inornatus",    mnemonic: "Peter-peter-peter, scratchy" },
  { id: "pacific-slope-flycatcher",commonName: "Pacific-slope Flycatcher",scientificName: "Empidonax difficilis",    mnemonic: "Rising 'pee-WEET'" },
  { id: "stellers-jay",            commonName: "Steller's Jay",           scientificName: "Cyanocitta stelleri",     mnemonic: "Harsh 'shaak-shaak-shaak'" },
  { id: "huttons-vireo",           commonName: "Hutton's Vireo",          scientificName: "Vireo huttoni",           mnemonic: "Endlessly repeated 'zu-wee'" },
  { id: "western-tanager",         commonName: "Western Tanager",         scientificName: "Piranga ludoviciana",     mnemonic: "Robin with a sore throat" },
  { id: "dark-eyed-junco",         commonName: "Dark-eyed Junco",         scientificName: "Junco hyemalis",          mnemonic: "Even, ringing trill on one pitch" },
  { id: "purple-finch",            commonName: "Purple Finch",            scientificName: "Haemorhous purpureus",    mnemonic: "Long rich warble that tumbles downward" },
  { id: "lesser-goldfinch",        commonName: "Lesser Goldfinch",        scientificName: "Spinus psaltria",         mnemonic: "Plaintive 'tee-yeer', mimics" },
  { id: "western-bluebird",        commonName: "Western Bluebird",        scientificName: "Sialia mexicana",         mnemonic: "Soft 'few' contact notes" },
  { id: "chestnut-backed-chickadee",commonName:"Chestnut-backed Chickadee",scientificName: "Poecile rufescens",       mnemonic: "Buzzy, hurried 'chick-a-dee-dee'" },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",          scientificName: "Pipilo maculatus",        mnemonic: "Drink your teeeea" },
  { id: "warbling-vireo",          commonName: "Warbling Vireo",          scientificName: "Vireo gilvus",            mnemonic: "Long, run-on warble ending up" },
];

export const LESSONS = [
  { id: "ow-1",      title: "Cavity Nesters",        speciesIds: ["acorn-woodpecker", "oak-titmouse", "chestnut-backed-chickadee", "western-bluebird"], length: 8 },
  { id: "ow-2",      title: "Songs in the Canopy",   speciesIds: ["western-tanager", "purple-finch", "warbling-vireo", "huttons-vireo"], length: 8 },
  { id: "ow-3",      title: "Understory Voices",     speciesIds: ["spotted-towhee", "dark-eyed-junco", "pacific-slope-flycatcher", "lesser-goldfinch"], length: 8 },
  { id: "ow-4",      title: "Bold & Loud",           speciesIds: ["stellers-jay", "acorn-woodpecker", "oak-titmouse"], length: 8 },
  { id: "ow-review", title: "Review: All 13",        speciesIds: [], length: 12 }, // populated below
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
