// Coastal Conifer — Bishop pine and Douglas-fir on Inverness Ridge.

export const UNIT = {
  id: "coastal-conifer",
  title: "Coastal Conifer",
  habitat: "Bishop Pine Forest",
  description: "Inverness Ridge's foggy Bishop pine and Douglas-fir — high voices and bark-creepers.",
  accent: "sand",
};

export const SPECIES = [
  { id: "pygmy-nuthatch",          commonName: "Pygmy Nuthatch",         scientificName: "Sitta pygmaea",           mnemonic: "High squeaky 'pi-pi-pi'" },
  { id: "chestnut-backed-chickadee",commonName:"Chestnut-backed Chickadee",scientificName:"Poecile rufescens",      mnemonic: "Hurried 'chick-a-dee-dee'" },
  { id: "brown-creeper",           commonName: "Brown Creeper",          scientificName: "Certhia americana",       mnemonic: "Thin tinkling 'tsee-tsee-tsee-titi-tsee'" },
  { id: "varied-thrush",           commonName: "Varied Thrush",          scientificName: "Ixoreus naevius",         mnemonic: "Single haunting whistle, varying pitch", field: "October–April in dense Bishop pine; haunting whistle at dawn." },
  { id: "townsends-warbler",       commonName: "Townsend's Warbler",     scientificName: "Setophaga townsendi",     mnemonic: "Buzzy 'wheezy wheezy WHEE-zee'" },
  { id: "pacific-slope-flycatcher",commonName: "Pacific-slope Flycatcher",scientificName: "Empidonax difficilis",   mnemonic: "Rising 'pee-WEET'" },
  { id: "hairy-woodpecker",        commonName: "Hairy Woodpecker",       scientificName: "Dryobates villosus",      mnemonic: "Sharp 'peek!' calls + drumming" },
  { id: "huttons-vireo",           commonName: "Hutton's Vireo",         scientificName: "Vireo huttoni",           mnemonic: "Endlessly repeated 'zu-wee'" },
  { id: "red-breasted-nuthatch",   commonName: "Red-breasted Nuthatch",  scientificName: "Sitta canadensis",        mnemonic: "Tin-horn 'yank yank yank'" },
  { id: "golden-crowned-kinglet",  commonName: "Golden-crowned Kinglet", scientificName: "Regulus satrapa",         mnemonic: "Very high 'tsee tsee tsee'" },
  { id: "stellers-jay",            commonName: "Steller's Jay",          scientificName: "Cyanocitta stelleri",     mnemonic: "Harsh 'shaak-shaak-shaak'" },
  { id: "wilsons-warbler",         commonName: "Wilson's Warbler",       scientificName: "Cardellina pusilla",      mnemonic: "Staccato 'chi-chi-chi-chi-chi'" },
  { id: "olive-sided-flycatcher",  commonName: "Olive-sided Flycatcher", scientificName: "Contopus cooperi",        mnemonic: "Whistled 'quick three beers!'" },
];

export const LESSONS = [
  { id: "cc-1",      title: "Bark & Branches",       speciesIds: ["pygmy-nuthatch", "red-breasted-nuthatch", "brown-creeper", "chestnut-backed-chickadee"], length: 8 },
  { id: "cc-2",      title: "High Treetop Voices",   speciesIds: ["townsends-warbler", "golden-crowned-kinglet", "wilsons-warbler", "huttons-vireo"], length: 8 },
  { id: "cc-3",      title: "Whistles & Flutes",     speciesIds: ["varied-thrush", "pacific-slope-flycatcher", "olive-sided-flycatcher"], length: 8 },
  { id: "cc-4",      title: "Loud in the Canopy",    speciesIds: ["stellers-jay", "hairy-woodpecker", "varied-thrush"], length: 8 },
  { id: "cc-review", title: "Review: All 13",        speciesIds: [], length: 12 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
