# goodbird

Bite-sized ear training for the birds of West Marin, California.

**Live at [goodbird.app](https://goodbird.app/).**

A small, polished web app for learning to identify the bird sounds you'd
actually hear along the Point Reyes, Bolinas, and Tomales coastline —
twelve habitats from Coastal Scrub to Open Coast to Night Voices, each one
a short course built around the calls and songs of that place.

No accounts, no client-side tracking. Pure static SPA, deploys to Netlify
in one command.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Framer Motion** for transitions and feedback animations
- **Zustand** (with `persist`) for game state in `localStorage`
- **Howler.js** for audio playback
- **React Router** for client routing
- Recordings sourced from **xeno-canto** (with iNaturalist as a no-key
  fallback). Bird images from **Wikimedia Commons**.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Refresh the species manifest

The committed manifest at `src/data/coastal-scrub.json` was generated with
the script in `scripts/`. To regenerate (preferred — higher quality):

```sh
cp .env.example .env       # then paste your xeno-canto key into XC_API_KEY
export $(cat .env | xargs)
node scripts/fetch-recordings.mjs
```

If `XC_API_KEY` is unset the script falls back to iNaturalist (no key
required, but recording quality is variable).

## Deploy

The repo is wired for Netlify two ways:

**1. Continuous deploy (recommended).** In the Netlify dashboard, "Add new
site → Import from Git → pick this repo." Netlify reads `netlify.toml` for
the build command, publish directory (`dist/`), and SPA rewrite. Every
push to `main` deploys automatically; every PR gets a deploy preview. No
secrets to configure.

**2. Manual one-shot deploy.**

```sh
npm run deploy           # production
npm run deploy:preview   # draft URL
```

Both run `npm run build` then call `npx netlify-cli@latest`. The first run
will prompt you to log in and link the local directory to a Netlify site.

A GitHub Actions workflow at `.github/workflows/build.yml` runs `tsc` and
`vite build` on every push and PR — useful for catching breakage before it
hits Netlify.

## Adding a new unit

1. Drop a new file in `scripts/units/<slug>.mjs` exporting `UNIT`,
   `SPECIES`, and `LESSONS` (see `coastal-scrub.mjs` as a template).
2. Run `npm run fetch:recordings` to generate `src/data/<slug>.json`.
3. The home page picks it up automatically (`src/lib/manifest.ts` uses
   `import.meta.glob` over the `src/data/` directory).

## Attribution

Bird recordings and photographs are not bundled — they are referenced by
URL from xeno-canto, iNaturalist, and Wikimedia Commons under their
respective Creative Commons licenses. Recordist credit is stored in the
manifest alongside each clip.

## License

[MIT](./LICENSE)
