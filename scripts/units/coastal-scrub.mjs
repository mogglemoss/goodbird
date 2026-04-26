// Coastal Scrub — chaparral & brushy edges of Pt. Reyes / Bolinas / Tomales.

export const UNIT = {
  id: "coastal-scrub",
  title: "Coastal Scrub",
  habitat: "Chaparral & Brush",
  description: "The chaparral, scrub, and brushy edges along the Point Reyes, Bolinas, and Tomales coastline.",
  accent: "moss", // tints lesson nodes; see src/lib/theme.ts
};

export const SPECIES = [
  { id: "wrentit",                 commonName: "Wrentit",                scientificName: "Chamaea fasciata",       mnemonic: "Bouncing ping-pong ball" },
  { id: "spotted-towhee",          commonName: "Spotted Towhee",         scientificName: "Pipilo maculatus",       mnemonic: "Drink your teeeea" },
  { id: "california-towhee",       commonName: "California Towhee",      scientificName: "Melozone crissalis",     mnemonic: "Sharp 'chink!' from the brushpile, like dropping a coin" },
  { id: "white-crowned-sparrow",   commonName: "White-crowned Sparrow",  scientificName: "Zonotrichia leucophrys", mnemonic: "Oh-sweet-pretty-little-Canada" },
  { id: "song-sparrow",            commonName: "Song Sparrow",           scientificName: "Melospiza melodia",      mnemonic: "Madge-madge-madge put-on-your-tea-kettle" },
  { id: "bewicks-wren",            commonName: "Bewick's Wren",          scientificName: "Thryomanes bewickii",    mnemonic: "Bubbly song ending in a buzzy 'see-saw' trill" },
  { id: "house-wren",              commonName: "House Wren",             scientificName: "Troglodytes aedon",      mnemonic: "Manic bubbling explosion of trills", wikipediaTitle: "Northern house wren" },
  { id: "california-quail",        commonName: "California Quail",       scientificName: "Callipepla californica", mnemonic: "Chi-CA-go!" },
  { id: "california-scrub-jay",    commonName: "California Scrub-Jay",   scientificName: "Aphelocoma californica", mnemonic: "Loud rising 'shreeenk!' — clearly annoyed" },
  { id: "annas-hummingbird",       commonName: "Anna's Hummingbird",     scientificName: "Calypte anna",           mnemonic: "Scratchy squeaky-gate song" },
  { id: "northern-mockingbird",    commonName: "Northern Mockingbird",   scientificName: "Mimus polyglottos",      mnemonic: "Anything, repeated three times" },
  { id: "california-thrasher",     commonName: "California Thrasher",    scientificName: "Toxostoma redivivum",    mnemonic: "Endlessly varied phrases — each one repeated exactly twice" },
  { id: "bushtit",                 commonName: "Bushtit",                scientificName: "Psaltriparus minimus",   mnemonic: "Tiny tinkling 'pit pit' as the flock moves through" },
  { id: "common-yellowthroat",     commonName: "Common Yellowthroat",    scientificName: "Geothlypis trichas",     mnemonic: "Wichity-wichity-wichity" },
  { id: "bullocks-oriole",         commonName: "Bullock's Oriole",       scientificName: "Icterus bullockii",      mnemonic: "Conversational whistled phrases, like distant flute music" },
];

export const LESSONS = [
  { id: "cs-1",      title: "Backyard Regulars",     speciesIds: ["california-towhee", "annas-hummingbird", "california-scrub-jay", "white-crowned-sparrow"], length: 8 },
  { id: "cs-2",      title: "Brushy Edges",          speciesIds: ["wrentit", "spotted-towhee", "bewicks-wren", "song-sparrow"], length: 8 },
  { id: "cs-3",      title: "Voices in the Thicket", speciesIds: ["california-thrasher", "house-wren", "common-yellowthroat", "northern-mockingbird"], length: 8 },
  { id: "cs-4",      title: "Flock & Field",         speciesIds: ["california-quail", "bushtit", "bullocks-oriole"], length: 8 },
  { id: "cs-review", title: "Review: All 15",        speciesIds: SPECIES.map((s) => s.id), length: 12 },
];
