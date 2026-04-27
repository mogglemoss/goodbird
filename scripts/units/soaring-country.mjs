// Soaring Country — the "look up" unit. Vultures, ravens, and the raptors
// of West Marin's open skies. Some of these (Turkey Vulture, Bald Eagle) are
// remarkably quiet for their size; we include them anyway because spotting
// them is a daily occurrence and learning their *uncommon* vocalizations
// is part of the field skill.

export const UNIT = {
  id: "soaring-country",
  title: "Soaring Country",
  habitat: "Raptors & Open Sky",
  description: "Hawks, vultures, and ravens — what to look up for when you're between habitats.",
  tagline: "Patience above the ridge — wings working a thermal.",
  accent: "slate",
};

export const SPECIES = [
  { id: "turkey-vulture",        commonName: "Turkey Vulture",       scientificName: "Cathartes aura",         mnemonic: "Mostly silent — soft hisses at the kill", field: "Year-round, riding thermals on dihedral wings (V-shape) that wobble. The naked red head and silent flight are diagnostic. Vocalizations are rare; mostly hisses near a carcass." },
  { id: "common-raven",          commonName: "Common Raven",         scientificName: "Corvus corax",           mnemonic: "Deep guttural 'krrruk-krrruk'", field: "Year-round throughout West Marin. Larger than crows, with a wedge-shaped tail and shaggy throat. Far more varied vocally than crows — knocking, gurgling, and bell-like notes." },
  { id: "bald-eagle",            commonName: "Bald Eagle",           scientificName: "Haliaeetus leucocephalus", mnemonic: "Surprisingly weak chittering whistles", field: "Year-round around Tomales Bay and Nicasio Reservoir; population recovering. Calls sound thinner than expected for such a large bird — not the Hollywood scream (that's a Red-tailed Hawk dub)." },
  { id: "coopers-hawk",          commonName: "Cooper's Hawk",        scientificName: "Accipiter cooperii",      mnemonic: "Loud rapid 'kek-kek-kek-kek' near the nest", field: "Year-round in wooded yards and edges. Hunts smaller birds in fast pursuit through cover. Almost identical to Sharp-shinned but larger, with a more rounded tail tip." },
  { id: "sharp-shinned-hawk",    commonName: "Sharp-shinned Hawk",   scientificName: "Accipiter striatus",     mnemonic: "High thin 'kik-kik-kik' faster than Cooper's", field: "October through April in West Marin; some breeders in conifer forests. Smaller than Cooper's, with a square tail tip and pencil-thin legs. Calls are higher and faster." },
  { id: "red-shouldered-hawk",   commonName: "Red-shouldered Hawk",  scientificName: "Buteo lineatus",         mnemonic: "Loud descending 'kee-aah, kee-aah'", field: "Year-round in oak-riparian edges. Smaller than Red-tailed, with banded tail and rusty shoulder. The piercing 'kee-aah' is one of the most familiar raptor calls in West Marin woods." },
  { id: "northern-harrier",      commonName: "Northern Harrier",     scientificName: "Circus hudsonius",       mnemonic: "Mostly silent in winter; nasal 'eh-eh-eh' at nest", field: "October through April in pasture and marsh — males pale gray, females and juveniles brown. Distinctive low coursing flight with wings held in a shallow V and a white rump patch." },
  { id: "osprey",                commonName: "Osprey",               scientificName: "Pandion haliaetus",      mnemonic: "Sharp piercing whistles, often a series", field: "March through October at Tomales Bay and Bolinas Lagoon; some winter. Plunge-dives feet-first for fish from a hover. The whistle is a clear, evenly-spaced series — totally distinct from a hawk's scream." },
  { id: "peregrine-falcon",      commonName: "Peregrine Falcon",     scientificName: "Falco peregrinus",       mnemonic: "Harsh 'kak-kak-kak' near eyrie", field: "Year-round on the cliffs of Pt. Reyes and Marin Headlands. Pointed wings and short tail in flight. Diving stoop reaches 200+ mph — fastest animal on earth." },
  // The fast cliff-side aerialist
  { id: "white-throated-swift",  commonName: "White-throated Swift",  scientificName: "Aeronautes saxatalis",   mnemonic: "Loud descending chittering 'kee-kee-kee-kee' from overhead", field: "March through October on coastal cliffs and inland canyons (Pt. Reyes lighthouse cliffs, Bolinas headlands). Black-and-white roller-coaster flight; courtship pairs lock together and tumble through the air." },
];

export const LESSONS = [
  { id: "sc-1",      title: "Big Soarers",            speciesIds: ["turkey-vulture", "common-raven", "bald-eagle"], length: 8 },
  { id: "sc-2",      title: "Pursuit & Stoop",        speciesIds: ["coopers-hawk", "sharp-shinned-hawk", "peregrine-falcon"], length: 8 },
  { id: "sc-3",      title: "Field & Marsh Hunters",  speciesIds: ["red-shouldered-hawk", "northern-harrier", "osprey"], length: 8 },
  { id: "sc-4",      title: "Cliffs & Canyons",       speciesIds: ["white-throated-swift", "peregrine-falcon", "common-raven"], length: 8 },
  { id: "sc-review", title: "Review: All 10",         speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
