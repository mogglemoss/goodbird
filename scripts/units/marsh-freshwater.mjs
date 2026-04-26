// Marsh & Freshwater — Olema Marsh, Five Brooks Pond, Abbott's Lagoon edges.

export const UNIT = {
  id: "marsh-freshwater",
  title: "Marsh & Wetland",
  habitat: "Cattails & Ponds",
  description: "Cattails, sedges, and quiet ponds — Olema Marsh, Five Brooks, the freshwater edges of Abbott's Lagoon.",
  accent: "emerald",
};

export const SPECIES = [
  { id: "marsh-wren",              commonName: "Marsh Wren",             scientificName: "Cistothorus palustris",   mnemonic: "Buzzy, sewing-machine chatter", field: "Year-round in cattail marshes; chatters constantly from low in the reeds." },
  { id: "red-winged-blackbird",    commonName: "Red-winged Blackbird",   scientificName: "Agelaius phoeniceus",     mnemonic: "Konk-a-reee!", field: "Year-round in marshes; males display from cattail tops in spring." },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",      mnemonic: "Wichity-wichity-wichity" },
  { id: "sora",                    commonName: "Sora",                   scientificName: "Porzana carolina",        mnemonic: "Descending whinny, plaintive 'ker-WEE'", wikipediaTitle: "Sora (bird)", field: "Year-round in dense marsh; calls mostly at dawn and dusk from cover." },
  { id: "virginia-rail",           commonName: "Virginia Rail",          scientificName: "Rallus limicola",         mnemonic: "Grunting 'kid-ick kid-ick'" },
  { id: "pied-billed-grebe",       commonName: "Pied-billed Grebe",      scientificName: "Podilymbus podiceps",     mnemonic: "Hooting 'wuk-wuk-wuk-cow-cow'" },
  { id: "american-bittern",        commonName: "American Bittern",       scientificName: "Botaurus lentiginosus",   mnemonic: "Pump-er-lunk pump-er-lunk" },
  { id: "mallard",                 commonName: "Mallard",                scientificName: "Anas platyrhynchos",      mnemonic: "The duck quack — descending, in twos and threes" },
  { id: "tree-swallow",            commonName: "Tree Swallow",           scientificName: "Tachycineta bicolor",     mnemonic: "Liquid chittering, in flight" },
  { id: "great-blue-heron",        commonName: "Great Blue Heron",       scientificName: "Ardea herodias",          mnemonic: "Harsh prehistoric croak" },
  { id: "black-crowned-night-heron",commonName:"Black-crowned Night-Heron",scientificName:"Nycticorax nycticorax",  mnemonic: "Hollow, abrupt 'quok!'" },
  { id: "killdeer",                commonName: "Killdeer",               scientificName: "Charadrius vociferus",    mnemonic: "KILL-deer KILL-deer" },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",       mnemonic: "Madge-madge-madge put-on-your-tea-kettle" },
];

export const LESSONS = [
  { id: "mw-1",      title: "Voices in the Cattails", speciesIds: ["marsh-wren", "red-winged-blackbird", "common-yellowthroat", "song-sparrow"], length: 8 },
  { id: "mw-2",      title: "Hidden in the Reeds",    speciesIds: ["sora", "virginia-rail", "american-bittern", "pied-billed-grebe"], length: 8 },
  { id: "mw-3",      title: "Pond & Edge",            speciesIds: ["mallard", "great-blue-heron", "black-crowned-night-heron", "killdeer"], length: 8 },
  { id: "mw-4",      title: "Skies Over Water",       speciesIds: ["tree-swallow", "killdeer", "red-winged-blackbird"], length: 8 },
  { id: "mw-review", title: "Review: All 13",         speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
