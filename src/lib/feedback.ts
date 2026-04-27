// Simple Web-Audio-synthesized feedback chimes — no asset files needed.
// Inspired by Duolingo's brief, percussive cues.

let ctx: AudioContext | null = null;
function ac(): AudioContext {
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, when = 0, type: OscillatorType = "sine", vol = 0.18) {
  const a = ac();
  const t0 = a.currentTime + when;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export function correctChime() {
  // Major third + perfect fifth, sparkly.
  tone(880, 0.18, 0, "triangle", 0.16);
  tone(1318.5, 0.22, 0.05, "triangle", 0.12);
  tone(1760, 0.28, 0.1, "sine", 0.08);
}

export function wrongBuzz() {
  // Soft, descending — gentle, not punishing.
  tone(280, 0.16, 0, "sawtooth", 0.08);
  tone(220, 0.18, 0.05, "sawtooth", 0.06);
}

export function lessonComplete() {
  // Short fanfare.
  const notes = [523, 659, 784, 1046];
  notes.forEach((f, i) => tone(f, 0.22, i * 0.08, "triangle", 0.15));
  tone(1568, 0.5, 0.4, "sine", 0.1);
}
