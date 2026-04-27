// Tomales Bay & Estuary — shorebirds, herons, and tidal-flat foragers.
// The salt marsh and mudflat edges from Hog Island down through Walker Creek
// and the inner-bay shallows around Inverness.

export const UNIT = {
  id: "tomales-bay",
  title: "Tomales Bay",
  habitat: "Estuary & Tideflats",
  description: "Mudflats, salt marsh, and shallow bays — Hog Island, Walker Creek, the eel-grass beds off Inverness.",
  tagline: "Long bills probing the mudflats at low tide.",
  accent: "indigo",
};

export const SPECIES = [
  { id: "marbled-godwit",          commonName: "Marbled Godwit",         scientificName: "Limosa fedoa",            mnemonic: "Loud nasal 'godWIT godWIT' from the flats", field: "Year-round on Tomales Bay; numbers peak August through April. Long upturned bill probes deep into mudflat invertebrates." },
  { id: "willet",                  commonName: "Willet",                 scientificName: "Tringa semipalmata",      mnemonic: "Clear ringing 'pill-will-WILLET'", field: "Year-round on tidal flats and rocky edges. Drab brown until it flies and flashes a bold black-and-white wing pattern." },
  { id: "long-billed-curlew",      commonName: "Long-billed Curlew",     scientificName: "Numenius americanus",     mnemonic: "Curling 'curlee, curlee' that gives the bird its name", field: "August through April on Tomales Bay flats. Largest North American shorebird; the comically long down-curved bill probes deep burrows." },
  { id: "whimbrel",                commonName: "Whimbrel",               scientificName: "Numenius phaeopus",       mnemonic: "Rolling 'whi-whi-whi-whi-whi' — seven even notes", field: "Migration in spring and fall; some winter on Tomales Bay. Smaller curlew with a kinked rather than smoothly curved bill." },
  { id: "black-bellied-plover",    commonName: "Black-bellied Plover",   scientificName: "Pluvialis squatarola",    mnemonic: "Plaintive whistled 'plee-oo-eee'", field: "August through April on tidal flats. The black belly only shows on breeding adults; in winter, an unassuming gray." },
  { id: "killdeer",                commonName: "Killdeer",               scientificName: "Charadrius vociferus",    mnemonic: "KILL-deer KILL-deer", field: "Year-round in open ground near water — pastures, gravel parking lots, golf-course edges. Feigns a broken wing to lure intruders from the nest." },
  { id: "great-blue-heron",        commonName: "Great Blue Heron",       scientificName: "Ardea herodias",          mnemonic: "Harsh prehistoric croak", field: "Year-round at all wetland edges. Wing strokes are slow, about two per second; rookery nests are stick platforms in tall trees, often near water." },
  { id: "great-egret",             commonName: "Great Egret",            scientificName: "Ardea alba",              mnemonic: "Hoarse rattling croak", field: "Year-round in shallow tidal water. Stalks slowly with the long S-curved neck poised to strike fish." },
  { id: "snowy-egret",             commonName: "Snowy Egret",            scientificName: "Egretta thula",           mnemonic: "Sharp nasal 'aaak'", field: "Year-round at salt-marsh edges. Stirs the bottom with its bright yellow feet to flush prey — 'golden slippers' are diagnostic." },
  { id: "caspian-tern",            commonName: "Caspian Tern",           scientificName: "Hydroprogne caspia",      mnemonic: "Loud rasping 'kaaaaarrr' from overhead", field: "April through October at Tomales Bay. Largest tern; thick coral-red bill, plunges from height for fish." },
  { id: "forsters-tern",           commonName: "Forster's Tern",         scientificName: "Sterna forsteri",         mnemonic: "Sharp rising 'kyaarr' calls in flight", field: "April through October on the bay. Slimmer than Caspian; the pale-tipped orange bill and longer tail streamers separate them." },
  { id: "black-oystercatcher",     commonName: "Black Oystercatcher",    scientificName: "Haematopus bachmani",     mnemonic: "Loud whistled 'wheep wheep wheep' from rocks", field: "Year-round on rocky shorelines around the bay mouth and Pt. Reyes. Pries mussels and limpets with its red chisel-bill." },
  { id: "western-grebe",           commonName: "Western Grebe",          scientificName: "Aechmophorus occidentalis", mnemonic: "Loud creaking 'crick-creek' duet", field: "October through April on Tomales Bay. Famous courtship display: pairs run together upright across the water." },
  { id: "double-crested-cormorant",commonName: "Double-crested Cormorant",scientificName: "Nannopterum auritum",    mnemonic: "Mostly silent; deep guttural grunts at colonies", field: "Year-round on the bay. Holds wings outstretched to dry after diving — feathers are deliberately wettable, unlike most waterbirds." },
];

// Merged "Plovers & Killdeer" + "Rocky Edges" into one shore-edge lesson —
// Killdeer is technically a plover and Black Oystercatcher shares the same
// rocky/sandy-edge habitat, so they sit naturally together. Avoids one-bird
// quizzes where the same species would repeat 8× in a row.
export const LESSONS = [
  { id: "tb-1",      title: "Big Long Bills",            speciesIds: ["marbled-godwit", "long-billed-curlew", "whimbrel", "willet"], length: 8 },
  { id: "tb-2",      title: "Plovers & Oystercatcher",   speciesIds: ["black-bellied-plover", "killdeer", "black-oystercatcher"], length: 8 },
  { id: "tb-3",      title: "Herons & Egrets",           speciesIds: ["great-blue-heron", "great-egret", "snowy-egret"], length: 8 },
  { id: "tb-4",      title: "Terns, Cormorants & Grebes", speciesIds: ["caspian-tern", "forsters-tern", "double-crested-cormorant", "western-grebe"], length: 8 },
  { id: "tb-review", title: "Review: All 14",            speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
