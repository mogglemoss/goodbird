# Pitch-preserving slow playback + ARIA live regions for feedback

## Context

Two small accessibility / quality items from the deferred backlog. Both
are tightly scoped to a few files and well-understood; planning them
together because each lands in roughly the same place (the audio +
feedback layer) and either alone is too small to be its own commit.

### Item A — pitch-preserving slow playback

The `½×` toggle in `AudioPlayer` calls `Howl.rate(0.5)`, which delegates
to the underlying `<audio>` element's `playbackRate` property. By
default an `HTMLAudioElement` does **not** preserve pitch when the
playback rate changes — so 0.5× sounds like a tape slowed down, with
the pitch dropping a full octave. For ear training that's the opposite
of what we want: the user can no longer hear the bird's actual pitch.

Modern browsers expose a standard `preservesPitch` boolean on
`HTMLMediaElement`. Setting it to `true` switches the browser to a
time-stretching algorithm that maintains the original pitch while
slowing the playback. Supported in Chrome/Edge ≥ 74, Firefox ≥ 70,
Safari ≥ 15. Good enough coverage for our audience.

### Item B — ARIA live regions for feedback

User asked: *what is "A11y live regions for correct/wrong feedback
announcements"?*

A blind user playing the app today gets the audio chime but **none of
the visual feedback** — no "Nice ear", no "It was the Wrentit", no
hearts countdown — because their screen reader (VoiceOver, NVDA,
TalkBack) only reads what's in the DOM. Our feedback bar slides in,
but the change isn't announced.

**ARIA live regions** are HTML elements marked with `aria-live` (or
`role="status"` / `role="alert"`) that screen readers monitor for text
changes. When the text inside such a region changes, the screen reader
speaks the new text without moving keyboard focus. The user keeps
playing; they just hear "Correct. Wrentit." after each answer.

Two politeness levels:
- `aria-live="polite"` (`role="status"`) — waits for the screen
  reader to finish its current speech. Right for in-game feedback.
- `aria-live="assertive"` (`role="alert"`) — interrupts. Reserve for
  errors and emergencies; not appropriate here.

The element is typically hidden visually with a `sr-only` utility
(absolute, 1×1px, clipped) — present in the DOM and announced by
screen readers, invisible to sighted users.

## Approach

### Item A — `preservesPitch` on every Howl

One change, one file: `src/lib/audio.ts`.

When we create a `Howl` in `getHowl()`, attach a one-shot `load`
handler that walks the Howl's underlying sound nodes and sets
`preservesPitch = true` on each `<audio>` element. Since we use
`html5: true`, each Howl wraps exactly one `HTMLAudioElement`.

```ts
h.once("load", () => {
  for (const s of (h as any)._sounds ?? []) {
    if (s._node) s._node.preservesPitch = true;
  }
});
```

Reaches into `_sounds` (private API) but it's stable in Howler 2.x and
the alternative — exposing the audio element via Howler's public API —
doesn't exist. Wrapped in a try/catch is overkill; if the property
doesn't exist (very old browser), the assignment is a silent no-op.

No change needed in `AudioPlayer.tsx`; the `½×` toggle keeps calling
`h.rate(0.5)` and the underlying element now preserves pitch
automatically.

**Critical files**: `src/lib/audio.ts`.

### Item B — live region in the FeedbackBar

One file primarily: `src/components/ExerciseRunner.tsx` (the
FeedbackBar JSX). Optional second additions in `Lesson.tsx` and
`Results.tsx`.

Add a visually-hidden `role="status" aria-live="polite"` element inside
the FeedbackBar that mirrors the feedback as a single string. Its text
changes whenever a fresh `locked` value arrives — screen readers
announce the new string.

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {locked
    ? (locked.correct
        ? `Correct. ${correctName}.`
        : `Wrong. It was the ${correctName}.`)
    : ""}
</div>
```

Need a `sr-only` utility — Tailwind v4 ships one by default:
```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
}
```

Confirm it's available; if not, add a small block in `src/index.css`.

While we're there, two cheap additions in the same file:
- The Hint button's text reveal: also needs to be in (or adjacent to) a
  live region so screen-reader users hear the mnemonic when they tap
  Hint. Easiest: render the mnemonic with `aria-live="polite"` already
  applied to the wrapper.
- Set `aria-live="polite"` on the `HeartsBar`'s heart container so a
  lost heart is announced as "Two hearts left" via `aria-label` on the
  container that updates on `hearts` change.

Skip for this round (separate work):
- Results screen live regions ("Lesson complete, 80% accuracy"). Could
  add later; the screen has natural focus on its own text so screen
  readers will read it on navigation anyway.
- Discriminate-exercise specific announcements ("Same species" /
  "Different"). Falls out of the same FeedbackBar live region.

**Critical files**:
- `src/components/ExerciseRunner.tsx` — FeedbackBar live region + Hint reveal aria-live
- `src/components/HeartsBar.tsx` — aria-label on hearts container
- `src/index.css` — verify or add `.sr-only`

## Verification

1. **Pitch preservation (manual, with ears)**:
   - `npm run dev`, open `/lesson/cs-1`, play the bird's song
   - Tap `½×`. The clip should slow to half speed but stay roughly the
     same pitch (no octave drop). Try in Safari + Chrome on desktop.
   - Inspect the `<audio>` element in DevTools and confirm
     `preservesPitch === true` after playback starts.

2. **Live region (programmatic)**:
   - Inspect the FeedbackBar after answering; verify a `role="status"`
     element exists with the expected text.
   - On macOS: turn on VoiceOver (⌘ F5), play a lesson, answer one
     correctly and one incorrectly. VoiceOver should speak
     "Correct. [species]." then "Wrong. It was the [species]." without
     focus moving. Hearts changes should also be announced.

3. **Regression check**:
   - The `½×` toggle still functions as a toggle (tap to slow, tap to
     restore normal speed).
   - Loop continues to work (Howl's loop() is independent of preservesPitch).
   - The visual FeedbackBar still appears as before; sr-only changes
     are invisible to sighted users.

4. **Production build**:
   - `npm run build` clean.
   - Quick offline retest — service worker should not be affected.
