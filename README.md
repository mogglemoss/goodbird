# goodbird

**An audio-first PWA for learning the 150 bird sounds you'd actually hear in
West Marin, California.** Twelve habitats. Four exercise types. A
lightweight spaced-repetition engine. Zero accounts, zero backend, zero
client-side tracking.

🎧 **Live at [goodbird.app](https://goodbird.app/)** · [Source](https://github.com/mogglemoss/goodbird) · MIT

> *Built solo, end-to-end. Started for my wife and a friend who wanted to
> learn the birds in their backyard. Released publicly as a community
> gift to West Marin and as a portfolio piece.*

---

## What it demonstrates

| Engineering area | Where to look |
|---|---|
| **React 19 / TypeScript strict** | `src/` — strict mode, no `any`, React Compiler-strict lint rules (`react-hooks/refs`, `react-hooks/set-state-in-effect`) all clean |
| **State design** | `src/game/store.ts` — Zustand with `persist`, schema-validated rehydration, lightweight SRS (`speciesWeight` in `lesson-generator.ts`) |
| **Build-time data pipeline** | `scripts/fetch-recordings.mjs` — xeno-canto API + iNaturalist fallback + Wikipedia disambiguation handling, with a 4-step relaxation ladder for hard-to-source species |
| **Audio engineering** | `scripts/normalize-audio.mjs` — ffmpeg `loudnorm` pass measures integrated LUFS for every recording and stores per-clip gain so wildly varying field recordings hit the user's ears at comparable loudness |
| **PWA / offline** | `public/sw.js` — versioned cache-first SW, install/activate dance, offline fallback, media cache intentionally unversioned to persist user downloads across deploys |
| **Accessibility** | `aria-live` feedback bar, `role="dialog"`, `aria-pressed` on toggles, keyboard escape handling, focus-visible rings throughout |
| **Security posture** | Tight CSP in `netlify.toml` (script-src self only — Vite emits zero inline scripts), HSTS, X-Frame-Options DENY, Permissions-Policy disabling unused features. Schema-validated `localStorage` rehydration so corrupt state can't crash the app |
| **Testing** | Vitest covering scoring math, persisted-state validator, and the lesson-generator's anti-streak guarantees (50-trial randomized check) |

---

## Stack

- **Vite 8** + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** with custom OKLCH design tokens
- **Framer Motion** for transitions
- **Zustand** with `persist` middleware
- **Howler.js** + Web Audio API for playback
- **Vitest** for unit tests
- **Vanilla service worker** (no Workbox)
- **Netlify** for static hosting + Analytics

External data: bird recordings from [xeno-canto](https://xeno-canto.org)
(CC-licensed), photos from
[Wikimedia Commons](https://commons.wikimedia.org), observation fallback
via [iNaturalist](https://inaturalist.org).

---

## Notable design decisions

**No accounts, no backend.** Progress lives in `localStorage`. Migration
risk is real but the trade — zero-friction first launch, no auth UI, no
hosting cost — was worth it for a community gift project. Schema
validation on rehydration covers the corruption case.

**No bundled audio.** All recordings are streamed from xeno-canto by URL.
This keeps the app under 220 KB gzipped (entire app shell + all manifests
inline) and respects xeno-canto's CC-NC licensing. The PWA service worker
caches recordings once played for offline replay.

**Build-time per-clip loudness normalization.** Field recordings vary by
40+ dB. Without normalization, lessons swing from inaudible to ear-piercing
between exercises. `scripts/normalize-audio.mjs` runs ffmpeg's `loudnorm`
filter, measures integrated LUFS, computes a per-clip gain (0..1), and
stores it on every `Recording`. Howler applies it at playback time. Net
result: a wrentit and a great horned owl land at the same perceived
volume.

**Lightweight SRS instead of a full Anki-style scheduler.** Each species
has an `interval` (days) that doubles on correct, resets to 1 on wrong.
The lesson generator weights species by accuracy + recency + due-state, so
the next lesson always emphasizes what you're getting wrong. The whole
algorithm is ~30 lines in `src/game/lesson-generator.ts`.

**AOS taxonomy compliance.** Bird names follow the American
Ornithological Society's most recent supplements (64th: Western
Flycatcher lump, 66th: Western Warbling-Vireo split) so a working
birder won't roll their eyes. xeno-canto hasn't adopted some splits, so
species can carry an `xcAlias` for query-time lookup while keeping the
display name AOS-current.

**Field ethics, hard-coded.** Two species (Northern Spotted Owl,
Marbled Murrelet) are federally Threatened and disturbance from playback
is documented to disrupt nesting. Their detail pages carry a non-
dismissible "listen here for ID — never play recordings in the field"
notice. Small detail, signals the project takes its domain seriously.

---

## Run locally

```sh
npm install
npm run dev          # http://localhost:5173
npm run lint         # eslint
npm test             # vitest
npm run build        # production bundle to dist/
```

## Regenerate the species manifest

```sh
cp .env.example .env             # paste your xeno-canto key into XC_API_KEY
export $(cat .env | xargs)
node scripts/fetch-recordings.mjs
node scripts/normalize-audio.mjs # measures LUFS + computes per-clip gain
```

If `XC_API_KEY` is unset the recordings script falls back to iNaturalist
(no key required, lower quality).

## Adding a new habitat

1. Drop a new file in `scripts/units/<slug>.mjs` exporting `UNIT`,
   `SPECIES`, and `LESSONS` (see `coastal-scrub.mjs` for the contract).
2. Run `node scripts/fetch-recordings.mjs` to generate
   `src/data/<slug>.json`.
3. The home page picks it up automatically — `src/lib/manifest.ts` uses
   `import.meta.glob` over `src/data/`. Add the slug to `sortOrder` to
   place it among the existing units.

## Project structure

```
src/
  components/        UI primitives + exercise views
  game/              Zustand store, lesson generator, SRS, persist schema
  lib/               manifest, audio cache, theme, types, hooks
  routes/            Home, Unit, Lesson, Results, Species, About
  data/              committed unit JSONs (one per habitat)
scripts/
  units/             unit definitions (mjs, hand-edited)
  fetch-recordings.mjs    build-time xeno-canto + iNaturalist fetch
  normalize-audio.mjs     LUFS measurement + per-clip gain
  process-brand-assets.mjs    PNG → favicon/PWA-icon/OG pipeline
  build-og.mjs            renders public/og.png
public/
  sw.js              vanilla service worker, versioned by APP_VERSION
  manifest.webmanifest    PWA manifest
```

## Deploy

Netlify, two ways:

**Continuous (recommended).** Add the repo in the Netlify dashboard;
`netlify.toml` configures the build command, publish directory, SPA
rewrite, and security headers. Every push to `main` ships.

**Manual one-shot:**

```sh
npm run deploy           # production
npm run deploy:preview   # draft URL
```

A GitHub Actions workflow at `.github/workflows/build.yml` runs `tsc -b`
and `vite build` on every push — surfaces breakage before Netlify does.

## Attribution

Recordings and photographs are referenced by URL, not bundled. Each clip
carries its xeno-canto recordist credit and CC license in the manifest;
the species detail page shows attribution alongside playback.

## License

[MIT](./LICENSE) for the code. Audio and image rights belong to their
respective contributors per their CC licenses.
