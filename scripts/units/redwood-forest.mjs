// Redwood & Mixed Forest — the inland old-growth and second-growth coniferous
// forest of Bolinas Ridge, Mt. Tamalpais, Samuel P. Taylor, and Muir Woods.
// Distinct from "Coastal Conifer" (the Bishop pine forest of the Pt. Reyes
// peninsula) — the inland redwood community has its own specialists:
// Pileated Woodpecker, Vaux's Swift, Band-tailed Pigeon, plus the warblers
// and thrushes that move through the canopy.

export const UNIT = {
  id: "redwood-forest",
  title: "Redwood & Mixed Forest",
  habitat: "Inland Forest",
  description: "Bolinas Ridge, Mt. Tam, Muir Woods — old-growth redwoods and the canyons below them.",
  tagline: "Drumming in the still cathedral; warblers in the canopy.",
  accent: "orange",
};

export const SPECIES = [
  { id: "pileated-woodpecker",   commonName: "Pileated Woodpecker",  scientificName: "Dryocopus pileatus",     mnemonic: "Loud ringing 'kuk-kuk-kuk-kuk' that fades", field: "Year-round in mature redwood and Douglas-fir forest of Mt. Tam and Bolinas Ridge. Crow-sized with a flaming red crest. Drilling produces large rectangular holes." },
  { id: "vauxs-swift",           commonName: "Vaux's Swift",         scientificName: "Chaetura vauxi",         mnemonic: "High insect-like chittering twitter", field: "April through September; tens of thousands roost in old-growth tree hollows during migration. Smallest swift in North America — looks like a flying cigar." },
  { id: "band-tailed-pigeon",    commonName: "Band-tailed Pigeon",   scientificName: "Patagioenas fasciata",   mnemonic: "Deep low 'whoo-whoo' from the canopy", field: "Year-round in oak-redwood ecotone, especially when madrone and oak fruit. Larger than a feral pigeon, with a yellow-tipped bill and a pale gray band across the tail." },
  { id: "red-breasted-sapsucker", commonName: "Red-breasted Sapsucker", scientificName: "Sphyrapicus ruber",   mnemonic: "Mewing 'chee-aar' and irregular drumming", field: "Year-round in mixed conifer forest. Brilliant red head and breast. Drills neat horizontal rows of sap wells; other birds and insects feed at them." },
  { id: "pacific-wren",          commonName: "Pacific Wren",         scientificName: "Troglodytes pacificus",  mnemonic: "Astonishingly long, intricate tinkling cascade", field: "Year-round in damp redwood understory. A tiny dark bird with an outsized song — among the most complex of any North American songbird, packed with up to 100 notes in 6 seconds." },
  { id: "hermit-thrush",         commonName: "Hermit Thrush",        scientificName: "Catharus guttatus",      mnemonic: "Pure ringing flute phrase, then silence, then another at a different pitch", field: "October through April on the forest floor. Reddish tail contrasts with browner back. The 'national songbird of the Pacific Northwest' for its ethereal evening song." },
  { id: "hermit-warbler",        commonName: "Hermit Warbler",       scientificName: "Setophaga occidentalis", mnemonic: "Buzzy 'see-see-see-see-zee'", field: "April through August in tall conifer canopy. Yellow head, gray back, white belly. Easier to hear than to see — stays high in the redwood crowns." },
  { id: "macgillivrays-warbler", commonName: "MacGillivray's Warbler", scientificName: "Geothlypis tolmiei",   mnemonic: "Rolling 'churry-churry-churry, sweet-sweet'", field: "April through September in dense brushy undergrowth at forest edges. Gray hood with broken white eye-arcs and a dark eye-line. Skulks; voice is the giveaway." },
  { id: "black-throated-gray-warbler", commonName: "Black-throated Gray Warbler", scientificName: "Setophaga nigrescens", mnemonic: "Buzzy 'weezy-weezy-weezy-weezy-WEET'", field: "April through September in mixed oak-conifer canopy. Boldly patterned in black, white, and gray with a tiny yellow lore spot. Often forages mid-story." },
  // The improbable seabird that nests in redwood crowns. Federally Threatened.
  { id: "marbled-murrelet",      commonName: "Marbled Murrelet",       scientificName: "Brachyramphus marmoratus", mnemonic: "Ringing 'keer' calls in pre-dawn flights through the canopy", field: "Year-round; forages at sea but nests on mossy old-growth limbs in Muir Woods, Mt. Tam, and Bolinas Ridge — sometimes 25+ km inland. Federally Threatened. **Listen here for ID — never play recordings in the field. Disturbance from playback is documented to disrupt nesting.**" },
];

export const LESSONS = [
  { id: "rf-1",      title: "Big Forest Birds",       speciesIds: ["pileated-woodpecker", "vauxs-swift", "band-tailed-pigeon"], length: 8 },
  { id: "rf-2",      title: "Forest Floor & Bark",    speciesIds: ["red-breasted-sapsucker", "pacific-wren", "hermit-thrush"], length: 8 },
  { id: "rf-3",      title: "Forest Warblers",        speciesIds: ["hermit-warbler", "macgillivrays-warbler", "black-throated-gray-warbler"], length: 8 },
  { id: "rf-4",      title: "Old-Growth Specialists", speciesIds: ["marbled-murrelet", "pileated-woodpecker", "vauxs-swift"], length: 8 },
  { id: "rf-review", title: "Review: All 10",         speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
