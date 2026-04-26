// Coastal Conifer — Bishop pine and Douglas-fir on Inverness Ridge.

export const UNIT = {
  id: "coastal-conifer",
  title: "Coastal Conifer",
  habitat: "Bishop Pine Forest",
  description: "Inverness Ridge's foggy Bishop pine and Douglas-fir — high voices and bark-creepers.",
  accent: "sand",
};

export const SPECIES = [
  { id: "pygmy-nuthatch",          commonName: "Pygmy Nuthatch",         scientificName: "Sitta pygmaea",           mnemonic: "High squeaky 'pi-pi-pi'", field: "Year-round in Bishop pine and Monterey pine. Roosts communally in cavities — up to a hundred birds in one trunk on cold nights." },
  { id: "chestnut-backed-chickadee",commonName:"Chestnut-backed Chickadee",scientificName:"Poecile rufescens",      mnemonic: "Hurried 'chick-a-dee-dee'", field: "Year-round in mixed evergreen forest. Often the lead species in mixed-flock foraging movements through the winter canopy." },
  { id: "brown-creeper",           commonName: "Brown Creeper",          scientificName: "Certhia americana",       mnemonic: "Thin tinkling 'tsee-tsee-tsee-titi-tsee'", field: "Year-round in coniferous forest. Forages by spiraling up a trunk, then dropping to the base of the next tree to start over." },
  { id: "varied-thrush",           commonName: "Varied Thrush",          scientificName: "Ixoreus naevius",         mnemonic: "Single haunting whistle, varying pitch", field: "October through April in dense conifer; breeds further north. Each whistled note is a single sustained pitch; consecutive notes shift by intervals familiar from minor scales."  },
  { id: "townsends-warbler",       commonName: "Townsend's Warbler",     scientificName: "Setophaga townsendi",     mnemonic: "Buzzy 'wheezy wheezy WHEE-zee'", field: "October through April on the coast; breeds further north. Often joins mixed-species flocks with kinglets and chickadees." },
  { id: "pacific-slope-flycatcher",commonName: "Pacific-slope Flycatcher",scientificName: "Empidonax difficilis",   mnemonic: "Rising 'pee-WEET'", field: "April through September in shaded oak and conifer canyons. Nests on rock ledges and within house eaves throughout coastal California." },
  { id: "hairy-woodpecker",        commonName: "Hairy Woodpecker",       scientificName: "Dryobates villosus",      mnemonic: "Sharp 'peek!' calls + drumming", field: "Year-round in mature conifer and oak. Drumming is a steady roll of about 25 beats per second, lasting just under a second." },
  { id: "huttons-vireo",           commonName: "Hutton's Vireo",         scientificName: "Vireo huttoni",           mnemonic: "Endlessly repeated 'zu-wee'", field: "Year-round in evergreen oak. Often confused with Ruby-crowned Kinglet by sight; the repetitive 'zu-wee' song is diagnostic." },
  { id: "red-breasted-nuthatch",   commonName: "Red-breasted Nuthatch",  scientificName: "Sitta canadensis",        mnemonic: "Tin-horn 'yank yank yank'", field: "Year-round in conifers; numbers irrupt south in winters of poor cone crops. Smears pitch around nest cavity entrances, perhaps to deter predators." },
  { id: "golden-crowned-kinglet",  commonName: "Golden-crowned Kinglet", scientificName: "Regulus satrapa",         mnemonic: "Very high 'tsee tsee tsee'", field: "October through April on the coast. Frequencies of the song approach the upper limit of human hearing; many adults can no longer hear them." },
  { id: "stellers-jay",            commonName: "Steller's Jay",          scientificName: "Cyanocitta stelleri",     mnemonic: "Harsh 'shaak-shaak-shaak'", field: "Year-round in coniferous and oak forest. Mimics Red-tailed Hawk calls — possibly to clear feeders of competitors." },
  { id: "wilsons-warbler",         commonName: "Wilson's Warbler",       scientificName: "Cardellina pusilla",      mnemonic: "Staccato 'chi-chi-chi-chi-chi'", field: "April through September in willow and alder thickets. The black cap is the male's only striking field mark; females and immatures lack it." },
  { id: "olive-sided-flycatcher",  commonName: "Olive-sided Flycatcher", scientificName: "Contopus cooperi",        mnemonic: "Whistled 'quick three beers!'", field: "May through September in conifer forest. Sings 'quick-three-beers' from a high snag; long-distance migrant to the Andes." },
];

export const LESSONS = [
  { id: "cc-1",      title: "Bark & Branches",       speciesIds: ["pygmy-nuthatch", "red-breasted-nuthatch", "brown-creeper", "chestnut-backed-chickadee"], length: 8 },
  { id: "cc-2",      title: "High Treetop Voices",   speciesIds: ["townsends-warbler", "golden-crowned-kinglet", "wilsons-warbler", "huttons-vireo"], length: 8 },
  { id: "cc-3",      title: "Whistles & Flutes",     speciesIds: ["varied-thrush", "pacific-slope-flycatcher", "olive-sided-flycatcher"], length: 8 },
  { id: "cc-4",      title: "Loud in the Canopy",    speciesIds: ["stellers-jay", "hairy-woodpecker", "varied-thrush"], length: 8 },
  { id: "cc-review", title: "Review: All 13",        speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
