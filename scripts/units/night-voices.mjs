// Night Voices — owls and nocturnal callers across West Marin habitats.
// Note: deliberately omits Northern Spotted Owl — endangered & sensitive
// to playback; not appropriate for an ear-training app at this scale.

export const UNIT = {
  id: "night-voices",
  title: "Night Voices",
  habitat: "After Dark",
  description: "The owls and nightjars heard from your driveway after dark — Inverness, Olema, anywhere the streetlights end.",
  accent: "violet",
};

export const SPECIES = [
  { id: "great-horned-owl",        commonName: "Great Horned Owl",       scientificName: "Bubo virginianus",        mnemonic: "Deep stuttered 'whoo-whoo, whoo-whoo'" },
  { id: "western-screech-owl",     commonName: "Western Screech-Owl",    scientificName: "Megascops kennicottii",   mnemonic: "Bouncing-ball, accelerating 'whowhowhowhow'" },
  { id: "northern-saw-whet-owl",   commonName: "Northern Saw-whet Owl",  scientificName: "Aegolius acadicus",       mnemonic: "Steady single-note 'too-too-too'" },
  { id: "northern-pygmy-owl",      commonName: "Northern Pygmy-Owl",     scientificName: "Glaucidium gnoma",        mnemonic: "Single high 'too' every 1-2 seconds" },
  { id: "common-poorwill",         commonName: "Common Poorwill",        scientificName: "Phalaenoptilus nuttallii",mnemonic: "Whistled 'poor-will' all night" },
  { id: "barn-owl",                commonName: "Barn Owl",               scientificName: "Tyto alba",               mnemonic: "Eerie raspy scream" },
  { id: "long-eared-owl", commonName: "Long-eared Owl",         scientificName: "Asio otus",               mnemonic: "Soft, even 'hoo' every few seconds" },
  { id: "common-nighthawk",        commonName: "Common Nighthawk",       scientificName: "Chordeiles minor",        mnemonic: "Nasal 'peent' overhead at dusk" },
];

export const LESSONS = [
  { id: "nv-1",      title: "The Big Owls",       speciesIds: ["great-horned-owl", "barn-owl", "western-screech-owl"], length: 8 },
  { id: "nv-2",      title: "Small Owls",         speciesIds: ["northern-saw-whet-owl", "northern-pygmy-owl", "long-eared-owl"], length: 8 },
  { id: "nv-3",      title: "After the Owls",     speciesIds: ["common-poorwill", "common-nighthawk", "barn-owl"], length: 8 },
  { id: "nv-review", title: "Review: All 8",      speciesIds: [], length: 10 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
