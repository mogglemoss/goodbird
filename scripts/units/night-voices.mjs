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
  { id: "great-horned-owl",        commonName: "Great Horned Owl",       scientificName: "Bubo virginianus",        mnemonic: "Deep stuttered 'whoo-whoo, whoo-whoo'", field: "Year-round in nearly every habitat. Pairs duet in midwinter; the male's hoot is deeper than the female's despite his smaller body."  },
  { id: "western-screech-owl",     commonName: "Western Screech-Owl",    scientificName: "Megascops kennicottii",   mnemonic: "Bouncing-ball, accelerating 'whowhowhowhow'", field: "Year-round in oak woodland. The bouncing-ball trill begins slowly and accelerates; commonly delivered as a duet from inside the cavity tree."  },
  { id: "northern-saw-whet-owl",   commonName: "Northern Saw-whet Owl",  scientificName: "Aegolius acadicus",       mnemonic: "Steady single-note 'too-too-too'", field: "Year-round in dense coastal forest; difficult to detect outside late winter. Calling peaks January through March from inside conifer cover." },
  { id: "northern-pygmy-owl",      commonName: "Northern Pygmy-Owl",     scientificName: "Glaucidium gnoma",        mnemonic: "Single high 'too' every 1-2 seconds", field: "Year-round in mixed conifer-oak. Diurnal; hunts small birds at midday and may be located by the angry mob of songbirds harassing it." },
  { id: "common-poorwill",         commonName: "Common Poorwill",        scientificName: "Phalaenoptilus nuttallii",mnemonic: "Whistled 'poor-will' all night", field: "April through September on rocky brushy hillsides. The only North American bird known to enter true torpor, lowering its body temperature for days at a time during cold spells." },
  { id: "barn-owl",                commonName: "Barn Owl",               scientificName: "Tyto alba",               mnemonic: "Eerie raspy scream", wikipediaTitle: "Western barn owl", field: "Year-round in open country with old buildings. Nests in barns, hollow trees, and tower cavities; relies on hearing alone to capture prey in total darkness." },
  { id: "long-eared-owl", commonName: "Long-eared Owl",         scientificName: "Asio otus",               mnemonic: "Soft, even 'hoo' every few seconds", field: "Year-round but uncommon; numbers higher in winter. The 'ear' tufts are skin and feather, not actual ears." },
  { id: "common-nighthawk",        commonName: "Common Nighthawk",       scientificName: "Chordeiles minor",        mnemonic: "Nasal 'peent' overhead at dusk", field: "May through September; declining in California. Forages on the wing at dusk, with the male's booming display dive audible across pastures." },
];

export const LESSONS = [
  { id: "nv-1",      title: "The Big Owls",       speciesIds: ["great-horned-owl", "barn-owl", "western-screech-owl"], length: 8 },
  { id: "nv-2",      title: "Small Owls",         speciesIds: ["northern-saw-whet-owl", "northern-pygmy-owl", "long-eared-owl"], length: 8 },
  { id: "nv-3",      title: "After the Owls",     speciesIds: ["common-poorwill", "common-nighthawk", "barn-owl"], length: 8 },
  { id: "nv-review", title: "Review: All 8",      speciesIds: [], length: 10 },
];
LESSONS[LESSONS.length - 1].speciesIds = SPECIES.map((s) => s.id);
