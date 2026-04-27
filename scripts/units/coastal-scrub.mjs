// Coastal Scrub — chaparral & brushy edges of Pt. Reyes / Bolinas / Tomales.

export const UNIT = {
  id: "coastal-scrub",
  title: "Coastal Scrub",
  habitat: "Chaparral & Brush",
  description: "The chaparral, scrub, and brushy edges along the Point Reyes, Bolinas, and Tomales coastline.",
  tagline: "Where wrentits whisper through coyote brush.",
  accent: "moss", // tints lesson nodes; see src/lib/theme.ts
};

export const SPECIES = [
  { id: "wrentit",                 commonName: "Wrentit",                scientificName: "Chamaea fasciata",       mnemonic: "Bouncing ping-pong ball", field: "Year-round resident of coastal chaparral. Pairs are monogamous for life and defend the same territory year after year."  },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",         scientificName: "Pipilo maculatus",       mnemonic: "Drink your teeeea", field: "Year-round in dense scrub. Forages by 'double-scratching' both feet backward in leaf litter — the rustle is often the first sign of the bird."  },
  { id: "california-towhee",       commonName: "California Towhee",      scientificName: "Melozone crissalis",     mnemonic: "Sharp 'chink!' from the brushpile, like dropping a coin", field: "Year-round in coastal scrub and chaparral edges. Mated pairs perform a stereotyped 'squeal duet' on reunion." },
  { id: "white-crowned-sparrow",   commonName: "White-crowned Sparrow",  scientificName: "Zonotrichia leucophrys", mnemonic: "Oh-sweet-pretty-little-Canada", field: "Year-round on the immediate coast; migrants from Alaska winter further inland. Local song dialects persist for decades along the Bay Area coast." },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",      mnemonic: "Madge-madge-madge put-on-your-tea-kettle", field: "Year-round in any low brush near water. Each male sings 8 to 10 distinct songs, learned from neighbors as a juvenile." },
  { id: "bewicks-wren",            commonName: "Bewick's Wren",          scientificName: "Thryomanes bewickii",    mnemonic: "Bubbly song ending in a buzzy 'see-saw' trill", field: "Year-round in coastal scrub and woodland edges. The song structure varies by individual but always opens with two or three sharp notes." },
  { id: "house-wren",              commonName: "House Wren",             scientificName: "Troglodytes aedon",      mnemonic: "Manic bubbling explosion of trills", wikipediaTitle: "Northern house wren", field: "April through September in brushy yards and suburban edges. Males build multiple stick nests in available cavities; the female selects one and discards the rest." },
  { id: "california-quail",        commonName: "California Quail",       scientificName: "Callipepla californica", mnemonic: "Chi-CA-go!", field: "Year-round in coastal scrub. The 'chi-CA-go' is the assembly call; covey members use it to relocate one another after a disturbance."  },
  { id: "california-scrub-jay",    commonName: "California Scrub-Jay",   scientificName: "Aphelocoma californica", mnemonic: "Loud rising 'shreeenk!' — clearly annoyed", field: "Year-round in oak scrub and suburban gardens. Caches thousands of acorns each fall and remembers the locations for months." },
  { id: "annas-hummingbird",       commonName: "Anna's Hummingbird",     scientificName: "Calypte anna",           mnemonic: "Scratchy squeaky-gate song", field: "Year-round on the coast; California's only resident hummingbird. The male's J-shaped courtship dive ends with a high mechanical squeak from the tail feathers." },
  { id: "northern-mockingbird",    commonName: "Northern Mockingbird",   scientificName: "Mimus polyglottos",      mnemonic: "Anything, repeated three times", field: "Year-round in suburban scrub. Male repertoires include 100 or more song types; unmated males may sing through the night under streetlamps." },
  { id: "california-thrasher",     commonName: "California Thrasher",    scientificName: "Toxostoma redivivum",    mnemonic: "Endlessly varied phrases — each one repeated exactly twice", field: "Year-round in dense coastal scrub; endemic to California and northern Baja. The long decurved bill flips leaf litter for invertebrates." },
  { id: "bushtit",                 commonName: "Bushtit",                scientificName: "Psaltriparus minimus",   mnemonic: "Tiny tinkling 'pit pit' as the flock moves through", field: "Year-round in mixed flocks of 10 to 40. Builds a hanging woven nest up to 30 cm long; both parents and helpers tend the brood." },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",     mnemonic: "Wichity-wichity-wichity", field: "Year-round in damp brush, often along marsh edges. Males sing from cattail tops and willow thickets; the black mask is unmistakable." },
  { id: "bullocks-oriole",         commonName: "Bullock's Oriole",       scientificName: "Icterus bullockii",      mnemonic: "Conversational whistled phrases, like distant flute music", field: "April through August in tall riparian and scrub-oak. Builds a pendulous woven nest, often suspended from the tip of a sycamore branch." },
];

export const LESSONS = [
  { id: "cs-1",      title: "Backyard Regulars",     speciesIds: ["california-towhee", "annas-hummingbird", "california-scrub-jay", "white-crowned-sparrow"], length: 8 },
  { id: "cs-2",      title: "Brushy Edges",          speciesIds: ["wrentit", "spotted-towhee", "bewicks-wren", "song-sparrow"], length: 8 },
  { id: "cs-3",      title: "Voices in the Thicket", speciesIds: ["california-thrasher", "house-wren", "common-yellowthroat", "northern-mockingbird"], length: 8 },
  { id: "cs-4",      title: "Flock & Field",         speciesIds: ["california-quail", "bushtit", "bullocks-oriole"], length: 8 },
  { id: "cs-review", title: "Review: All 15",        speciesIds: SPECIES.map((s) => s.id), length: 12 },
];
