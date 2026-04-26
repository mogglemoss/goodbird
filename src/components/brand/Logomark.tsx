// App-icon mark: same bird as BirdSilhouette, with three sound-wave arcs leaving the beak.
// Designed for square placement (favicon, apple-touch-icon, home-screen shortcut).
//
// Keep this in sync with public/favicon.svg — that file is the static export for
// browser tab + home-screen use.

interface Props {
  className?: string;
  withDisc?: boolean; // wrap the mark in a colored rounded-square disc
}

export function Logomark({ className, withDisc = false }: Props) {
  // Bird is positioned in the center-left of a 96x96 viewBox so sound-wave arcs
  // have room to the right.
  const inner = (
    <g transform="translate(8 26) scale(2.0)">
      <g fill="currentColor">
        {/* Cocked tail */}
        <path d="
          M 8 16
          C 6 13, 4 10, 3 5
          C 4 5, 5 6, 6 8
          C 7 11, 8 13, 9 15
          Z
        " />
        {/* Body */}
        <path d="
          M 7 14
          C 7 18, 11 19, 15 19
          C 19 19, 22 18, 23 15
          C 24 12, 23 10, 21 9
          C 18 7, 13 7, 10 9
          C 7 11, 7 13, 7 14
          Z
        " />
        {/* Head */}
        <circle cx="20.5" cy="10" r="3.6" />
        {/* Beak */}
        <path d="M 23.6 10 L 27.4 9.6 L 23.6 11.2 Z" />
      </g>
      {/* Eye */}
      <circle cx="21.6" cy="9.6" r="0.65" fill="var(--logomark-eye, #f4f8f2)" />
    </g>
  );

  // Sound waves: three concentric arcs near the beak (right side of canvas).
  const waves = (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      transform="translate(64 48)"
    >
      <path d="M 0 -8 Q 8 0, 0 8" strokeWidth="3.5" opacity="0.95" />
      <path d="M 8 -14 Q 20 0, 8 14" strokeWidth="3.5" opacity="0.55" />
      <path d="M 16 -20 Q 32 0, 16 20" strokeWidth="3.5" opacity="0.25" />
    </g>
  );

  if (withDisc) {
    return (
      <svg
        viewBox="0 0 96 96"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="goodbird"
      >
        <rect width="96" height="96" rx="22" fill="var(--logomark-bg, #f4f8f2)" />
        <g style={{ color: "var(--logomark-fg, oklch(0.38 0.1 160))" }}>
          {inner}
          {waves}
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="goodbird"
      fill="currentColor"
    >
      {inner}
      {waves}
    </svg>
  );
}
