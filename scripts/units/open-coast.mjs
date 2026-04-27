// Open Coast & Headlands — the rocky-shore and surfline community.
// Drake's Beach, Limantour, Duxbury Reef, the Pt. Reyes lighthouse cliffs.
// Distinct from Tomales Bay (estuary/tideflats) — these are open-ocean
// edge species: gulls in the salt spray, cormorants drying on stacks,
// alcids riding the surf, shorebirds running the wave line.

export const UNIT = {
  id: "open-coast",
  title: "Open Coast & Headlands",
  habitat: "Rocky Shore & Surfline",
  description: "Sea cliffs and surfline — Drake's Beach, Duxbury Reef, the Pt. Reyes lighthouse stacks.",
  tagline: "Salt spray on the basalt; cormorants drying their wings.",
  accent: "teal",
};

export const SPECIES = [
  { id: "brown-pelican",         commonName: "Brown Pelican",        scientificName: "Pelecanus occidentalis",  mnemonic: "Mostly silent; soft grunts at the colony", field: "March through November along the open coast; population recovered post-DDT. Plunge-dives from 30+ ft. Lines of pelicans gliding inches above wave crests are diagnostic." },
  { id: "brandts-cormorant",     commonName: "Brandt's Cormorant",   scientificName: "Urile penicillatus",      mnemonic: "Deep guttural croaks at the colony", field: "Year-round on rocky offshore stacks and breakwaters. Breeding adults have a vivid blue throat patch. Largest of the three local cormorants." },
  { id: "pelagic-cormorant",     commonName: "Pelagic Cormorant",    scientificName: "Urile pelagicus",         mnemonic: "Soft grunting calls at cliff nest", field: "Year-round on sheer cliffs of the open coast. Smallest, most slender cormorant; breeding adults show white flank patches and an iridescent green sheen." },
  { id: "common-murre",          commonName: "Common Murre",         scientificName: "Uria aalge",              mnemonic: "Loud purring 'arrrr' at colony", field: "April through August on offshore rocks (Pt. Reyes, Bird Island). Penguin-like shape, dense colonies. Murre Island colonies were devastated mid-century but have largely recovered." },
  { id: "pigeon-guillemot",      commonName: "Pigeon Guillemot",     scientificName: "Cepphus columba",         mnemonic: "High thin whistled 'peeee' at cliff nest", field: "March through August on the rocky coast. Black with bold white wing patches and bright red feet. Often perched in sea caves and on cliff ledges." },
  { id: "western-gull",          commonName: "Western Gull",         scientificName: "Larus occidentalis",      mnemonic: "Loud yelping 'keow-keow-keow'", field: "Year-round throughout the coast — the local 'white-headed black-mantled big gull.' The default gull on Pt. Reyes beaches; nests on offshore rocks." },
  { id: "heermanns-gull",        commonName: "Heermann's Gull",      scientificName: "Larus heermanni",         mnemonic: "Nasal 'keeyaaah' calls", field: "August through April after dispersing north from Mexican breeding colonies. Slate-gray body, white head, and bright red bill — the most distinctive West Marin gull." },
  { id: "california-gull",       commonName: "California Gull",      scientificName: "Larus californicus",      mnemonic: "Higher-pitched 'kyow-kyow' than Western", field: "Year-round but most abundant October through May. Medium-sized; thinner black-tipped yellow bill with a red and black spot. Breeds on inland alkaline lakes." },
  { id: "black-turnstone",       commonName: "Black Turnstone",      scientificName: "Arenaria melanocephala",  mnemonic: "Sharp rattling 'tuk-tuk-tuk-tuk'", field: "August through May on rocky shores. Stocky black-and-white shorebird that flips kelp and pebbles to find prey. Often in mixed flocks with Surfbirds." },
  { id: "surfbird",              commonName: "Surfbird",             scientificName: "Calidris virgata",        mnemonic: "Soft 'tuk' contact calls amid the spray", field: "August through May on rocky shores, foraging in the wave wash. Dumpy gray shorebird with a yellow-based bill. Tame and often clambering through breaking surf." },
  { id: "sanderling",            commonName: "Sanderling",           scientificName: "Calidris alba",           mnemonic: "Sharp 'wick wick' calls in flight", field: "August through May on sandy beaches. The little pale shorebird that runs in and out with each wave. Can look almost white in winter plumage." },
  { id: "pacific-loon",          commonName: "Pacific Loon",         scientificName: "Gavia pacifica",          mnemonic: "Deep yodeling at the breeding lakes; mostly silent here", field: "October through May offshore. Slim, dark-capped loon often in loose flocks just past the surf. Holds neck straighter than Common Loon when swimming." },
];

export const LESSONS = [
  { id: "oc-1",      title: "Coastal Gulls",          speciesIds: ["western-gull", "heermanns-gull", "california-gull"], length: 8 },
  { id: "oc-2",      title: "Pelican & Cormorants",   speciesIds: ["brown-pelican", "brandts-cormorant", "pelagic-cormorant"], length: 8 },
  { id: "oc-3",      title: "Diving Seabirds",        speciesIds: ["common-murre", "pigeon-guillemot", "pacific-loon"], length: 8 },
  { id: "oc-4",      title: "Surf & Sand",            speciesIds: ["black-turnstone", "surfbird", "sanderling"], length: 8 },
  { id: "oc-review", title: "Review: All 12",         speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
