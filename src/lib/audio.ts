import { Howl } from "howler";

const cache = new Map<string, Howl>();

export function getHowl(url: string): Howl {
  let h = cache.get(url);
  if (h) return h;
  h = new Howl({ src: [url], html5: true, preload: true });
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
  cache.set(url, h);
  return h;
}

export function preload(urls: string[]) {
  for (const u of urls) getHowl(u);
}

export function stopAll() {
  for (const h of cache.values()) h.stop();
}
