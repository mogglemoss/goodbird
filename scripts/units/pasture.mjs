// Pasture & Open Country — Pt. Reyes pastoral zone, Chileno Valley, ag fields.

export const UNIT = {
  id: "pasture",
  title: "Pasture & Open Country",
  habitat: "Open Country",
  description: "The dairy pastures of the Pt. Reyes pastoral zone and the rolling grassland of Chileno Valley.",
  accent: "rose",
};

export const SPECIES = [
  { id: "western-meadowlark",      commonName: "Western Meadowlark",     scientificName: "Sturnella neglecta",      mnemonic: "Liquid bubbling whistle from a fence post" },
  { id: "savannah-sparrow",        commonName: "Savannah Sparrow",       scientificName: "Passerculus sandwichensis", mnemonic: "Insect-like 'tsi-tsi-tsi-zheee'" },
  { id: "western-bluebird",        commonName: "Western Bluebird",       scientificName: "Sialia mexicana",         mnemonic: "Soft 'few' contact notes" },
  { id: "white-tailed-kite",       commonName: "White-tailed Kite",      scientificName: "Elanus leucurus",         mnemonic: "Whistled 'keep keep keep'" },
  { id: "loggerhead-shrike",       commonName: "Loggerhead Shrike",      scientificName: "Lanius ludovicianus",     mnemonic: "Harsh squeaks plus mimicry" },
  { id: "american-kestrel",        commonName: "American Kestrel",       scientificName: "Falco sparverius",        mnemonic: "Sharp 'klee-klee-klee'" },
  { id: "red-tailed-hawk",         commonName: "Red-tailed Hawk",        scientificName: "Buteo jamaicensis",       mnemonic: "Iconic raspy descending scream" },
  { id: "horned-lark",             commonName: "Horned Lark",            scientificName: "Eremophila alpestris",    mnemonic: "Tinkling 'tsee-tinkly-tinkly'" },
  { id: "brewers-blackbird",       commonName: "Brewer's Blackbird",     scientificName: "Euphagus cyanocephalus",  mnemonic: "Squeaky-hinge 'k-shee'" },
  { id: "western-kingbird",        commonName: "Western Kingbird",       scientificName: "Tyrannus verticalis",     mnemonic: "Sharp twittering 'kit-kit-kit'" },
  { id: "mourning-dove",           commonName: "Mourning Dove",          scientificName: "Zenaida macroura",        mnemonic: "Soft mournful 'oo-AHH-ooo-oo'" },
  { id: "american-crow",           commonName: "American Crow",          scientificName: "Corvus brachyrhynchos",   mnemonic: "Plain 'caw caw caw'" },
  { id: "lark-sparrow",            commonName: "Lark Sparrow",           scientificName: "Chondestes grammacus",    mnemonic: "Bubbly varied warble" },
  { id: "bullocks-oriole",         commonName: "Bullock's Oriole",       scientificName: "Icterus bullockii",       mnemonic: "Whistled, chattery, conversational" },
];

export const LESSONS = [
  { id: "ps-1",      title: "Voices on Fence Posts",  speciesIds: ["western-meadowlark", "savannah-sparrow", "western-bluebird", "lark-sparrow"], length: 8 },
  { id: "ps-2",      title: "Hawks & Kites",          speciesIds: ["red-tailed-hawk", "white-tailed-kite", "american-kestrel", "loggerhead-shrike"], length: 8 },
  { id: "ps-3",      title: "Crows & Kingbirds",      speciesIds: ["american-crow", "brewers-blackbird", "western-kingbird", "mourning-dove"], length: 8 },
  { id: "ps-4",      title: "Open Sky",               speciesIds: ["horned-lark", "western-meadowlark", "bullocks-oriole"], length: 8 },
  { id: "ps-review", title: "Review: All 14",         speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
