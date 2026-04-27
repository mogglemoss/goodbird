// Pasture & Open Country — Pt. Reyes pastoral zone, Chileno Valley, ag fields.

export const UNIT = {
  id: "pasture",
  title: "Pasture & Open Country",
  habitat: "Open Country",
  description: "The dairy pastures of the Pt. Reyes pastoral zone and the rolling grassland of Chileno Valley.",
  tagline: "Kestrels hovering above gold hills.",
  accent: "rose",
};

export const SPECIES = [
  { id: "western-meadowlark",      commonName: "Western Meadowlark",     scientificName: "Sturnella neglecta",      mnemonic: "Liquid bubbling whistle from a fence post", field: "Year-round in pasture and grassland. Singing peaks March through July from elevated perches; the flute-like song carries up to a kilometer in still air."  },
  { id: "savannah-sparrow",        commonName: "Savannah Sparrow",       scientificName: "Passerculus sandwichensis", mnemonic: "Insect-like 'tsi-tsi-tsi-zheee'", field: "Year-round in coastal grassland. Many local subspecies; the 'Belding's' Savannah Sparrow is a tidal-marsh specialist of the southern California coast." },
  { id: "western-bluebird",        commonName: "Western Bluebird",       scientificName: "Sialia mexicana",         mnemonic: "Soft 'few' contact notes", field: "Year-round in oak savanna and pasture edges. Cavity nester; competes with starlings, swallows, and other bluebirds for nest holes." },
  { id: "white-tailed-kite",       commonName: "White-tailed Kite",      scientificName: "Elanus leucurus",         mnemonic: "Whistled 'keep keep keep'", field: "Year-round in open grassland. Hovers over tall grass to spot voles; nests in isolated trees within ranchland." },
  { id: "loggerhead-shrike",       commonName: "Loggerhead Shrike",      scientificName: "Lanius ludovicianus",     mnemonic: "Squeaky 'gri-grew gri-grew' — the butcher bird", field: "Year-round in open country with scattered shrubs. Impales prey — large insects, lizards, small rodents — on thorns and barbed wire." },
  { id: "american-kestrel",        commonName: "American Kestrel",       scientificName: "Falco sparverius",        mnemonic: "Sharp 'klee-klee-klee'", field: "Year-round in open habitats. Smallest North American falcon; often perches on power lines along ranch roads." },
  { id: "red-tailed-hawk",         commonName: "Red-tailed Hawk",        scientificName: "Buteo jamaicensis",       mnemonic: "Iconic raspy descending scream", field: "Year-round in open and edge habitats throughout the region. The screaming call is so often used in films that it serves as the default cinematic 'eagle.'" },
  { id: "horned-lark",             commonName: "Horned Lark",            scientificName: "Eremophila alpestris",    mnemonic: "Tinkling 'tsee-tinkly-tinkly'", field: "Year-round in short-grass pasture and bare ground. Males perform a sky-larking display flight up to 250 meters, singing throughout." },
  { id: "brewers-blackbird",       commonName: "Brewer's Blackbird",     scientificName: "Euphagus cyanocephalus",  mnemonic: "Squeaky-hinge 'k-shee'", field: "Year-round in pastures, parking lots, and town edges. Walks rather than hops; iridescent males catch sunlight in striking purples and greens." },
  { id: "western-kingbird",        commonName: "Western Kingbird",       scientificName: "Tyrannus verticalis",     mnemonic: "Sharp twittering 'kit-kit-kit'", field: "April through September in open country with scattered trees. Defends nest sites aggressively against hawks and corvids of much greater size." },
  { id: "mourning-dove",           commonName: "Mourning Dove",          scientificName: "Zenaida macroura",        mnemonic: "Soft mournful 'oo-AHH-ooo-oo'", field: "Year-round across most habitats. The whistled wing-rise on takeoff is mechanical, not vocal." },
  { id: "american-crow",           commonName: "American Crow",          scientificName: "Corvus brachyrhynchos",   mnemonic: "The crow caw — flat, three or four in a row", field: "Year-round in nearly all habitats. Cooperative breeders; helpers from previous broods assist with nesting and territory defense." },
  { id: "lark-sparrow",            commonName: "Lark Sparrow",           scientificName: "Chondestes grammacus",    mnemonic: "Bright varied warble with buzzes and trills mixed in", field: "Year-round in open ground with scattered cover. Pairs breed in loose colonies; juveniles wear a quail-like striped face useful for identification." },
  { id: "bullocks-oriole",         commonName: "Bullock's Oriole",       scientificName: "Icterus bullockii",       mnemonic: "Whistled, chattery, conversational", field: "April through August in tall riparian and scrub-oak. Builds a pendulous woven nest, often suspended from the tip of a sycamore branch." },
  // The big ground bird and the swallows that wheel above the dairies
  { id: "wild-turkey",             commonName: "Wild Turkey",            scientificName: "Meleagris gallopavo",     mnemonic: "Resonant gobble; soft 'putt-putt' contact calls", field: "Year-round in oak savanna and pasture edges; introduced/reintroduced and now thriving across West Marin. Toms display in spring with fanned tails and bare red wattles." },
  { id: "cliff-swallow",           commonName: "Cliff Swallow",          scientificName: "Petrochelidon pyrrhonota", mnemonic: "Squeaky chattering at the colony; harsh 'churr'", field: "April through August around bridges, barns, and cliff faces. Builds gourd-shaped mud nests in dense colonies. Square tail and pale forehead distinguish from Barn Swallow." },
  { id: "barn-swallow",            commonName: "Barn Swallow",           scientificName: "Hirundo rustica",         mnemonic: "Twittering 'vit-vit-vit' chatter, often in flight", field: "April through September around farms and open water. Long deeply-forked tail streamers and rusty throat are diagnostic. Famous for nesting inside barns and outbuildings." },
  { id: "violet-green-swallow",    commonName: "Violet-green Swallow",   scientificName: "Tachycineta thalassina",  mnemonic: "Soft 'chee-chee' chips and chittering at cavity nest", field: "March through September in oak savanna and conifer edges. Iridescent green back and violet rump above; the white face wraps clearly behind the eye, distinguishing from Tree Swallow." },
];

export const LESSONS = [
  { id: "ps-1",      title: "Voices on Fence Posts",  speciesIds: ["western-meadowlark", "savannah-sparrow", "western-bluebird", "lark-sparrow"], length: 8 },
  { id: "ps-2",      title: "Hawks & Kites",          speciesIds: ["red-tailed-hawk", "white-tailed-kite", "american-kestrel", "loggerhead-shrike"], length: 8 },
  { id: "ps-3",      title: "Crows & Kingbirds",      speciesIds: ["american-crow", "brewers-blackbird", "western-kingbird", "mourning-dove"], length: 8 },
  { id: "ps-4",      title: "Open Sky",               speciesIds: ["horned-lark", "western-meadowlark", "bullocks-oriole"], length: 8 },
  { id: "ps-5",      title: "Swallows of the Pastures", speciesIds: ["cliff-swallow", "barn-swallow", "violet-green-swallow"], length: 8 },
  { id: "ps-6",      title: "Big Ground Birds",       speciesIds: ["wild-turkey", "american-crow", "mourning-dove"], length: 8 },
  { id: "ps-review", title: "Review: All 18",         speciesIds: [], length: 14 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
