// Marsh & Freshwater — Olema Marsh, Five Brooks Pond, Abbott's Lagoon edges.

export const UNIT = {
  id: "marsh-freshwater",
  title: "Marsh & Wetland",
  habitat: "Cattails & Ponds",
  description: "Cattails, sedges, and quiet ponds — Olema Marsh, Five Brooks, the freshwater edges of Abbott's Lagoon.",
  tagline: "Hidden rails and patient herons.",
  accent: "emerald",
};

export const SPECIES = [
  { id: "marsh-wren",              commonName: "Marsh Wren",             scientificName: "Cistothorus palustris",   mnemonic: "Buzzy, sewing-machine chatter", field: "Year-round in cattail marsh. Males build several 'dummy' nests in addition to the breeding nest, possibly to confuse predators."  },
  { id: "red-winged-blackbird",    commonName: "Red-winged Blackbird",   scientificName: "Agelaius phoeniceus",     mnemonic: "Konk-a-reee!", field: "Year-round in cattail marsh. Polygynous males defend territories from cattail tops; the red epaulets are exposed only when asserting territory."  },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",      mnemonic: "Wichity-wichity-wichity", field: "Year-round in damp brush, often along marsh edges. Males sing from cattail tops and willow thickets; the black mask is unmistakable." },
  { id: "sora",                    commonName: "Sora",                   scientificName: "Porzana carolina",        mnemonic: "Descending whinny, plaintive 'ker-WEE'", wikipediaTitle: "Sora (bird)", field: "Year-round in dense marsh. Calls more often heard than the bird is seen; the descending whinny carries across still water at dawn."  },
  { id: "virginia-rail",           commonName: "Virginia Rail",          scientificName: "Rallus limicola",         mnemonic: "Grunting 'kid-ick kid-ick'", field: "Year-round in dense cattail and tule. The body is laterally compressed for moving through reeds." },
  { id: "pied-billed-grebe",       commonName: "Pied-billed Grebe",      scientificName: "Podilymbus podiceps",     mnemonic: "Hooting 'wuk-wuk-wuk-cow-cow'", field: "Year-round on freshwater ponds. Submerges by expelling air rather than diving; the head sometimes vanishes alone, leaving the body at the surface." },
  { id: "american-bittern",        commonName: "American Bittern",       scientificName: "Botaurus lentiginosus",   mnemonic: "Pump-er-lunk pump-er-lunk", field: "April through October in dense marsh. The 'pump-er-lunk' call, low and resonant, is produced by a specialized esophageal sac." },
  { id: "mallard",                 commonName: "Mallard",                scientificName: "Anas platyrhynchos",      mnemonic: "The duck quack — descending, in twos and threes", field: "Year-round on any open water. The vocal 'quack' is the female's; males give a softer, raspier 'reb-reb'." },
  { id: "tree-swallow",            commonName: "Tree Swallow",           scientificName: "Tachycineta bicolor",     mnemonic: "Liquid chittering, in flight", field: "Year-round on the coast; widespread breeder. Cavity nester; lines the nest cup with white feathers, often gathered in mid-air from other birds." },
  { id: "great-blue-heron",        commonName: "Great Blue Heron",       scientificName: "Ardea herodias",          mnemonic: "Harsh prehistoric croak", field: "Year-round at all wetland edges. Wing strokes are slow, about two per second; rookery nests are stick platforms in tall trees, often near water." },
  { id: "black-crowned-night-heron",commonName:"Black-crowned Night-Heron",scientificName:"Nycticorax nycticorax",  mnemonic: "Hollow, abrupt 'quok!'", field: "Year-round at wetland edges. Forages by night; daytime roosts are communal in dense waterside trees." },
  { id: "killdeer",                commonName: "Killdeer",               scientificName: "Charadrius vociferus",    mnemonic: "KILL-deer KILL-deer", field: "Year-round in open ground near water — pastures, gravel parking lots, golf-course edges. Feigns a broken wing to lure intruders from the nest." },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",       mnemonic: "Madge-madge-madge put-on-your-tea-kettle", field: "Year-round in any low brush near water. Each male sings 8 to 10 distinct songs, learned from neighbors as a juvenile." },
  // Dabbling ducks of West Marin freshwater ponds and lagoon edges
  { id: "american-wigeon",         commonName: "American Wigeon",        scientificName: "Mareca americana",        mnemonic: "Whistled three-note 'WHEW-whew-whew' (males)", field: "October through April on Five Brooks, Olema Marsh, and Bolinas Lagoon. Males have a green eye-stripe and white forehead; the high whistle is unmistakable in winter mixed flocks." },
  { id: "northern-shoveler",       commonName: "Northern Shoveler",      scientificName: "Spatula clypeata",        mnemonic: "Soft 'took-took' grunts; mostly a quiet duck", field: "October through April on quiet ponds. The huge spatulate bill is diagnostic; flocks often spin in circles to stir up plankton." },
  { id: "cinnamon-teal",           commonName: "Cinnamon Teal",          scientificName: "Spatula cyanoptera",      mnemonic: "Mostly silent; soft chatter and rattling 'kerek'", field: "March through October on shallow freshwater. Males a brilliant cinnamon-red; smaller and more secretive than other dabblers, often hugging the marsh edge." },
  { id: "american-coot",           commonName: "American Coot",          scientificName: "Fulica americana",        mnemonic: "Grunting 'puhlk', clucking, and harsh squawks", field: "Year-round on freshwater. Not a duck — a rail with lobed toes. Often in dense rafts; squabbles loudly when feeding." },
  // Long-legged waders of the freshwater pond edges
  { id: "black-necked-stilt",      commonName: "Black-necked Stilt",     scientificName: "Himantopus mexicanus",    mnemonic: "Loud yapping 'kek-kek-kek-kek'", field: "March through October on shallow freshwater and brackish edges (Limantour, Abbott's Lagoon). Sky-pink legs absurdly long; bold black-and-white pattern." },
  { id: "american-avocet",         commonName: "American Avocet",        scientificName: "Recurvirostra americana", mnemonic: "Sharp piping 'wheek-wheek-wheek'", field: "August through May on shallow ponds and lagoon edges. The upturned needle bill sweeps side-to-side through soft mud; in breeding plumage the head and neck flush rusty buff." },
];

export const LESSONS = [
  { id: "mw-1",      title: "Voices in the Cattails", speciesIds: ["marsh-wren", "red-winged-blackbird", "common-yellowthroat", "song-sparrow"], length: 8 },
  { id: "mw-2",      title: "Hidden in the Reeds",    speciesIds: ["sora", "virginia-rail", "american-bittern", "pied-billed-grebe"], length: 8 },
  { id: "mw-3",      title: "Pond & Edge",            speciesIds: ["mallard", "great-blue-heron", "black-crowned-night-heron", "killdeer"], length: 8 },
  { id: "mw-4",      title: "Skies Over Water",       speciesIds: ["tree-swallow", "killdeer", "red-winged-blackbird"], length: 8 },
  { id: "mw-5",      title: "Dabbling Ducks",         speciesIds: ["american-wigeon", "northern-shoveler", "cinnamon-teal", "american-coot"], length: 8 },
  { id: "mw-6",      title: "Long-legged Waders",     speciesIds: ["black-necked-stilt", "american-avocet", "great-blue-heron"], length: 8 },
  { id: "mw-review", title: "Review: All 19",         speciesIds: [], length: 14 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
