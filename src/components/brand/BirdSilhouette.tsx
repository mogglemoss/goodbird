// Small passerine in profile, beak forward (right), tail cocked up.
// Composed of clear anatomical primitives so it reads as a bird at small sizes.

interface Props {
  className?: string;
  title?: string;
}

export function BirdSilhouette({ className, title = "bird" }: Props) {
  return (
    <svg
      viewBox="0 0 28 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        {/* Cocked tail — curved feather rising back-and-up from rump */}
        <path d="
          M 8 16
          C 6 13, 4 10, 3 5
          C 4 5, 5 6, 6 8
          C 7 11, 8 13, 9 15
          Z
        " />
        {/* Body — almond/teardrop, wider toward chest */}
        <path d="
          M 7 14
          C 7 18, 11 19, 15 19
          C 19 19, 22 18, 23 15
          C 24 12, 23 10, 21 9
          C 18 7, 13 7, 10 9
          C 7 11, 7 13, 7 14
          Z
        " />
        {/* Head — slightly raised circle on the front of the body */}
        <circle cx="20.5" cy="10" r="3.6" />
        {/* Beak — small wedge pointing right */}
        <path d="M 23.6 10 L 27.4 9.6 L 23.6 11.2 Z" />
      </g>
      {/* Eye — tiny negative-space dot */}
      <circle cx="21.6" cy="9.6" r="0.65" fill="var(--color-bg, #f7faf6)" />
    </svg>
  );
}
