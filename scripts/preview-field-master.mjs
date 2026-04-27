import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";

// Approximate the FieldMasterBanner: pale moss-50 background card,
// the marginal-sketch vista bottom-right at ~35% moss-500.
// (oklch(68% 0.12 160) ≈ #6a9a78 in the light theme, adjust for ~35% alpha.)

const card = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="280" viewBox="0 0 800 280">
  <!-- Card background: moss-50 wash + 2px moss-300 border -->
  <rect x="2" y="2" width="796" height="276" rx="20" fill="#eef5ee" stroke="#bcd6c1" stroke-width="3"/>

  <!-- Mono caps eyebrow -->
  <text x="40" y="56" font-family="ui-monospace, monospace" font-size="13" letter-spacing="2.8"
        font-weight="500" fill="#3d6147">FIELD MASTER · WEST MARIN</text>

  <!-- Display headline (Fraunces-ish; serif fallback for renderer) -->
  <text x="40" y="110" font-family="Georgia, 'Times New Roman', serif" font-size="34"
        font-weight="500" fill="#1f2421">Every voice in the guide.</text>

  <!-- Italic subhead -->
  <text x="40" y="156" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="17" fill="#5a6660">From scrub wrentits to barred owls — you've learned them all.</text>
  <text x="40" y="180" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="17" fill="#5a6660">Keep listening; the bay rewards regulars.</text>

  <!-- Vista, drawn at ~35% moss-500 -->
  <g transform="translate(440 196) scale(1.5)" stroke="#6a9a78" stroke-opacity="0.35"
     fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
    <!-- Horizon -->
    <path d="M0 44h220" stroke-width="0.8"/>
    <!-- Far hills -->
    <path d="M0 38c20-6 32-6 52 0s38 4 60-2 50 0 70 4 28 2 38 0" stroke-width="0.9"/>
    <!-- Near hills -->
    <path d="M0 50c25-9 45-9 70-2s50 6 75-1 50 1 75 5"/>
    <!-- Lighthouse on the right headland -->
    <g transform="translate(185 22)">
      <path d="M0 0v18M6 0v18"/>
      <path d="M-2 0h10"/>
      <path d="M-3 -3h12l-1.5 3h-9z"/>
      <circle cx="3" cy="-7" r="2"/>
      <path d="M3 -10v-3"/>
    </g>
    <!-- Two gulls overhead -->
    <path d="M30 14c2-3 4-3 6 0M40 10c2-3 4-3 6 0" stroke-width="1"/>
  </g>
</svg>
`;

const png = new Resvg(card, { fitTo: { mode: "width", value: 1600 } }).render().asPng();
fs.writeFileSync("/tmp/field-master-preview.png", png);
console.log("wrote /tmp/field-master-preview.png");
