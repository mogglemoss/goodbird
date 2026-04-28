import { Howl } from "howler";

const cache = new Map<string, Howl>();

/**
 * Get (or create) a cached Howl for a recording URL.
 * `gain` (0..1) sets the playback volume so xeno-canto clips that vary wildly
 * in level land at a comparable loudness. The value is computed once at build
 * time by scripts/normalize-audio.mjs and stored on each Recording.
 *
 * Error handling: a Howl that emits `loaderror` or `playerror` is dead — it
 * won't recover internally. We auto-evict it from the cache on either event
 * so the next `getHowl(url)` call produces a fresh instance and a fresh
 * network attempt. Consumers should also listen for those events and
 * re-resolve the Howl via `getHowl()` to actually pick up the new instance.
 */
export function getHowl(url: string, gain = 1): Howl {
  let h = cache.get(url);
  if (h) {
    // Keep the cached instance, but make sure the volume reflects whatever
    // gain the caller is passing this time around (in case the user navigates
    // to a different recording with the same URL — unlikely but cheap).
    if (h.volume() !== gain) h.volume(gain);
    return h;
  }
  h = new Howl({ src: [url], html5: true, preload: true, volume: gain });
  // Tell the underlying <audio> element to preserve pitch when playbackRate
  // changes. Without this, our ½× slow-down toggle drops the pitch a full
  // octave — the opposite of what an ear-training app wants. Howler uses one
  // HTMLAudioElement per Howl in html5 mode; reach into _sounds to set it.
  h.once("load", () => {
    // Howler doesn't expose preservesPitch on its public API; reach into the
    // private _sounds array (one Howl ↔ many sounds in pool). The type
    // assertion keeps lint quiet around the documented internal.
    type HowlInternal = Howl & { _sounds?: Array<{ _node?: HTMLMediaElement }> };
    for (const s of (h as HowlInternal)._sounds ?? []) {
      if (s?._node) s._node.preservesPitch = true;
    }
  });
  // Self-healing: a Howl with a broken src or one that hits a network error
  // won't recover; evict so the next caller gets a fresh instance.
  const evictSelf = () => evictHowl(url);
  h.on("loaderror", evictSelf);
  h.on("playerror", evictSelf);
  cache.set(url, h);
  return h;
}

/** Force-evict a URL from the cache. Safe to call on already-missing URLs. */
export function evictHowl(url: string) {
  const h = cache.get(url);
  if (!h) return;
  cache.delete(url);
  // Howler's unload tears down the underlying <audio> element + listeners.
  // Wrapped in try/catch because a broken Howl can throw during teardown.
  try { h.unload(); } catch { /* ignore */ }
}

export function preload(urls: string[]) {
  for (const u of urls) getHowl(u);
}

export function stopAll() {
  for (const h of cache.values()) h.stop();
}
