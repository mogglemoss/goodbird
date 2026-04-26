# goodbird

Duolingo-style ear training for the birds of West Marin, California.

A small, polished web prototype for learning to identify common bird sounds
of the **Coastal Scrub** habitat — Wrentit, Spotted Towhee, California Quail,
California Thrasher, and a dozen others heard along the Point Reyes,
Bolinas, and Tomales coastline.

Built as a no-account, no-backend single-page app: pure static, deploys to
Netlify in one command.

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

This repo includes a `netlify.toml` with the right build command and SPA
rewrite. Connect it on Netlify and the rest is automatic. Or:

```sh
npm run build
npx netlify deploy --prod --dir dist
```

## Attribution

Bird recordings and photographs are not bundled — they are referenced by
URL from xeno-canto, iNaturalist, and Wikimedia Commons under their
respective Creative Commons licenses. Recordist credit is stored in the
manifest alongside each clip.

## License

[MIT](./LICENSE)
