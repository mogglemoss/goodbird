# Pack architecture — design doc

> Status: deferred. Captured here so the plan is in hand if/when goodbird
> grows beyond a single regional dataset (currently West Marin only).

## Where we are now

- 12 unit JSONs in `src/data/`, each ~30 KB (one per habitat)
- Loaded via `import.meta.glob` in `src/lib/manifest.ts`
- ~150 species total
- Service worker caches media (audio + images) on demand, NOT eagerly
- Species + lesson IDs are stable strings, unique by hand

**Scaling math at 2000 species:**

| Asset | Now (~150 sp) | At 2000 sp |
|---|---|---|
| JSON data raw | ~360 KB | ~5 MB |
| JSON data gzipped | ~30 KB | ~400 KB |
| First-paint impact (slow 4G) | ~150 ms | ~1.5 s+ |

Manifest helpers (`pickReviewSpeciesIds`, etc.) stay O(n) but n is bigger.
SW is fine — it caches what's actually played.

## The architectural change

**One-line summary:** lazy-load unit JSONs by region/pack instead of
loading everything for every user.

### New types

```ts
// src/lib/types.ts
export type PackId = "west-marin" | "western-us" | "eastern-us" | "national";

export interface Pack {
  id: PackId;
  title: string;        // "West Marin", "Western US"
  region: string;       // "Northern California coast" — display only
  unitIds: string[];    // foreign keys to Unit
}

export interface Unit {
  // existing fields...
  packId: PackId;       // NEW: which pack owns this unit
}
```

### New persisted state

```ts
// src/game/store.ts (additions)
interface GameState {
  // ...existing...
  activePacks: Set<PackId>;        // user-selected packs
}
```

When this lands → bump `version: 1 → 2` and add a migrate that initializes
`activePacks: ["west-marin"]` for existing users (preserves their current
experience by default).

### Manifest restructure

```
src/data/
  packs/
    west-marin/
      coastal-scrub.json
      oak-woodland.json
      ... (12 files)
    western-us/
      sierra-foothills.json
      mojave.json
      ... (?)
```

`src/lib/manifest.ts` becomes:

```ts
// Eager: pack INDEX (small, names + counts only) — always in bundle
import packIndex from "@/data/pack-index.json";

// Lazy: full unit JSONs, dynamic-imported per pack
const unitLoaders = import.meta.glob("@/data/packs/*/*.json");

export async function loadUnit(unitId: string): Promise<UnitJson> { ... }
export async function loadPack(packId: PackId): Promise<UnitJson[]> { ... }
```

### Search across all packs

Loaded packs are searchable. Unloaded packs need a **names-only index**
loaded eagerly:

```ts
// src/data/search-index.json — built at compile time
[
  { id: "wrentit", commonName: "Wrentit", scientificName: "Chamaea fasciata", packId: "west-marin" },
  { id: "snow-bunting", commonName: "Snow Bunting", scientificName: "Plectrophenax nivalis", packId: "northern-us" },
  ...
]
```

~50 KB gzipped for 2000 species names. Search hits this index, lazy-loads
the species' pack on tap.

### Bird-of-the-day

Two flavors: scoped to active pack(s) (default), or "show me anything"
(toggle in Settings). Same FNV-1a daily seed, different pool.

### Daily Review SRS

Already keys by species ID — works cross-pack as-is. As long as IDs stay
stable, no changes needed.

### Service worker

Already on-demand. No changes for media. Could add a "download active pack
for offline" affordance per-pack instead of the current "download
everything" pattern.

## Phased rollout

### Phase 1: pack abstraction (no behavior change)

- Add `PackId` type, `packId` field on `Unit`, default everyone to `"west-marin"`
- Add `Pack` config (just one pack: West Marin) with `unitIds`
- All existing behavior preserved
- ~2 hours of work; no user-visible change

### Phase 2: lazy loading

- Switch `import.meta.glob` to non-eager
- Manifest helpers become async OR cache loaded units in memory
- Routes that touch the manifest add suspense / loading states
- ~1 day of work; user-visible: faster first paint at scale

### Phase 3: multi-pack content

- Author pack #2 (e.g., "Western US"): another batch of unit JSONs in
  `src/data/packs/western-us/`
- Each unit has its own `packId`
- Re-run `scripts/fetch-recordings.mjs` for the new species
- ~weeks of CONTENT work; no architecture work

### Phase 4: pack picker UX

- Settings → Region: multi-select packs
- Home page filters units to active packs
- "Get more" affordance on home for inactive packs
- ~half-day of UI work

### Phase 5: search index

- Build-time script that walks all pack JSONs, emits `search-index.json`
- SpeciesSearch reads the index, falls back to lazy-loading the matching
  pack on tap
- ~3 hours

## Risks

| Risk | Mitigation |
|---|---|
| User progress orphaned by ID changes | Never rename IDs in place. Add `legacyIds` on species if reorg needed. Migration `v1 → v2` is a no-op for IDs we don't change. |
| Search latency (loading pack on tap) | Pre-fetch hint on hover; spinner is fine for first tap |
| Multi-pack license / data correctness | Each pack curated separately; xeno-canto licensing is global |
| Storage bloat from many packs cached | SW already on-demand; show storage estimate in Settings |

## Estimated total effort to scale to 2000 birds

- **Architecture work**: ~2-3 days (phases 1, 2, 4, 5)
- **Content work**: weeks (sourcing, vetting, mnemonic-writing 2000 species manually)
- **Audio normalization** (`scripts/normalize-audio.mjs`): runs unattended — slow but free

## When to start

Don't do phase 1 or 2 prophylactically — at the current 150-species scale,
the abstraction is dead weight. Wait until there's actual content driving
the change. Do **phase 3** first (write the new content), and **phases 1-2
then justify themselves naturally**.

The ONE optimization that paid off without packs (already shipped):
lazy-loading the unit JSONs so they ship as separate chunks instead of
inlined in the JS bundle.

- Main JS chunk: 221 KB → 167 KB gzipped (~24% smaller critical path)
- 12 unit chunks load in parallel via HTTP/2 multiplexing (~64 KB total
  gzipped across all units)
- Top-level await in `manifest.ts` resolves them at module init so
  consumers (every component) keep their synchronous API
- main.tsx imports manifest before `createRoot`, so by the time React
  renders the first frame all data is in memory

If/when packs land, `manifest.ts` can swap from "load every JSON eagerly
in parallel" to "load only the active pack's JSONs" with no consumer
changes.
