// Town & Garden — backyard and street-edge birds of Pt. Reyes Station,
// Inverness, Bolinas, Olema, and Stinson Beach. The voices a West Marin
// resident hears from the kitchen window without going anywhere.
//
// Includes the introduced species (House Sparrow, European Starling, Rock
// Pigeon, Brown-headed Cowbird) that aren't strictly West Marin natives but
// are unavoidable parts of the local soundscape — useful to know for the
// purpose of *ruling them out* when you're listening for natives.

export const UNIT = {
  id: "town-garden",
  title: "Town & Garden",
  habitat: "Backyard & Street Edge",
  description: "Yards, hedgerows, and parking lots — Pt. Reyes Station, Inverness, Bolinas, the everyday voices.",
  tagline: "What you hear from the kitchen window.",
  accent: "fuchsia",
};

export const SPECIES = [
  { id: "american-robin",        commonName: "American Robin",       scientificName: "Turdus migratorius",     mnemonic: "Cheerful 'cheer-up, cheerily, cheer-up' phrases", field: "Year-round on lawns and under fruit trees. The classic dawn-chorus voice in town — long carolling phrases, slightly slurred, often before sunrise." },
  { id: "northern-flicker",      commonName: "Northern Flicker",     scientificName: "Colaptes auratus",       mnemonic: "Loud rolling 'wik-wik-wik-wik' (long series)", field: "Year-round in open yards and edges; the 'red-shafted' subspecies is local. Often forages on the ground for ants. White rump flashes in flight." },
  { id: "brown-headed-cowbird",  commonName: "Brown-headed Cowbird", scientificName: "Molothrus ater",         mnemonic: "Liquid bubbling 'glug-glug-glee'", field: "April through September on lawns, fences, and parking lots. Brood parasite — never builds its own nest. Males do a fluttering 'topple-over' bow when calling." },
  { id: "allens-hummingbird",    commonName: "Allen's Hummingbird",  scientificName: "Selasphorus sasin",      mnemonic: "Sharp metallic 'tsip' chips; courtship dive 'pip-pip-WHEEEW'", field: "February through August in coastal scrub and gardens. Males have a coppery back (separating from Anna's, which is fully green-backed). The dive-display whoosh is diagnostic." },
  { id: "house-finch",           commonName: "House Finch",          scientificName: "Haemorhous mexicanus",   mnemonic: "Long warbling jumble ending in a buzzy 'zreee'", field: "Year-round in towns and yards. Males have variable raspberry-red on the head and breast. Song is a sustained tumbling warble, longer than Purple Finch's." },
  { id: "american-goldfinch",    commonName: "American Goldfinch",   scientificName: "Spinus tristis",         mnemonic: "Bouncy 'po-ta-to-chip' in flight; long 'per-CHEE' song", field: "Year-round on weedy edges, sunflowers, and feeders. Males brilliant yellow with black cap in summer; both sexes drabber in winter. Undulating flight." },
  { id: "yellow-rumped-warbler", commonName: "Yellow-rumped Warbler", scientificName: "Setophaga coronata",    mnemonic: "Sharp 'chek' calls; thin warbled trill in spring", field: "October through April — the most common winter warbler in West Marin. Yellow rump patch always visible in flight. Two forms occur: 'Audubon's' (yellow throat) and 'Myrtle' (white throat)." },
  { id: "ruby-crowned-kinglet",  commonName: "Ruby-crowned Kinglet", scientificName: "Corthylio calendula",    mnemonic: "Tiny scolding 'che-dit'; loud disjointed song much bigger than the bird", field: "October through April flicking through oaks and yard shrubs. Tiny, olive, with a broken eye-ring. Males rarely flash a red crown patch when agitated." },
  { id: "cedar-waxwing",         commonName: "Cedar Waxwing",        scientificName: "Bombycilla cedrorum",    mnemonic: "Very high thin whistled 'sreeeee'", field: "Year-round in mixed flocks, often at fruiting trees (toyon, pyracantha, madrone). Sleek crest, masked face, yellow-tipped tail. Voice is so high some adults can't hear it." },
  { id: "house-sparrow",         commonName: "House Sparrow",        scientificName: "Passer domesticus",      mnemonic: "Endless cheerful 'chirrup chirrup'", field: "Year-round at feed stores, parking lots, and dense hedges. Introduced from Europe in the 1850s. Males have black bib and gray cap; females nondescript brown." },
  { id: "european-starling",     commonName: "European Starling",    scientificName: "Sturnus vulgaris",       mnemonic: "Wheezy whistles, clicks, and mimicry of other species", field: "Year-round in town flocks; introduced 1890. A relentless mimic — can copy meadowlarks, Killdeer, even car alarms. Glossy black with white spots in fall, plain glossy in spring." },
  { id: "rock-pigeon",           commonName: "Rock Pigeon",          scientificName: "Columba livia",          mnemonic: "Soft cooing 'oh-roo-coo-coo'", field: "Year-round around buildings, bridges, and barns. The familiar feral pigeon, ancestrally a cliff-nester. Highly variable plumage — feral flocks include white, blue-bar, checker, and red morphs." },
  // Migration-only hummingbird; passes through West Marin gardens spring & fall
  { id: "rufous-hummingbird",    commonName: "Rufous Hummingbird",   scientificName: "Selasphorus rufus",      mnemonic: "Sharp metallic 'tip' chips; wing buzz 'zzeee'", field: "March through May (spring migration) and July through September (fall) at flowering shrubs and feeders. Males are entirely rusty-orange. Aggressive at feeders, often dominating Anna's and Allen's despite smaller size." },
];

export const LESSONS = [
  { id: "tg-1",      title: "Lawn Birds",             speciesIds: ["american-robin", "northern-flicker", "brown-headed-cowbird"], length: 8 },
  { id: "tg-2",      title: "Hummers & Finches",      speciesIds: ["allens-hummingbird", "rufous-hummingbird", "house-finch", "american-goldfinch"], length: 8 },
  { id: "tg-3",      title: "Winter Visitors",        speciesIds: ["yellow-rumped-warbler", "ruby-crowned-kinglet", "cedar-waxwing"], length: 8 },
  { id: "tg-4",      title: "Introduced Townies",     speciesIds: ["house-sparrow", "european-starling", "rock-pigeon"], length: 8 },
  { id: "tg-review", title: "Review: All 13",         speciesIds: [], length: 14 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
