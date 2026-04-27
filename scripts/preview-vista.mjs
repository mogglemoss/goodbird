// Renders the FieldMasterBanner exactly as it presents on a phone — banner card
// at ~350×135px (mobile), vista in the bottom-right at 35% moss-500.
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";

// 350×135 banner sized to phone-width. Vista is ~176px wide × 56px tall in the
// real component (w-44 h-14 on mobile), positioned right-3 bottom-3.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="350" height="135" viewBox="0 0 350 135">
  <!-- Card: moss-50 wash, moss-300 2px border, 20px radius -->
  <rect x="1" y="1" width="348" height="133" rx="20" fill="#eef5ee" stroke="#bcd6c1" stroke-width="2"/>

  <!-- Mono caps eyebrow -->
  <text x="20" y="32" font-family="ui-monospace, monospace" font-size="9" letter-spacing="2"
        font-weight="500" fill="#3d6147">FIELD MASTER · WEST MARIN</text>

  <!-- Display headline -->
  <text x="20" y="60" font-family="Georgia, 'Times New Roman', serif" font-size="22"
        font-weight="500" fill="#1f2421">Every voice in the guide.</text>

  <!-- Italic subhead, two lines -->
  <text x="20" y="84" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="12" fill="#5a6660">From scrub wrentits to barred owls — you've</text>
  <text x="20" y="100" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="12" fill="#5a6660">learned them all. Keep listening; the bay rewards</text>
  <text x="20" y="116" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="12" fill="#5a6660">regulars.</text>

  <!-- Vista at 35% moss-500, w=176 h=48, positioned right-3 bottom-3 -->
  <g transform="translate(162 78) scale(0.8)" stroke="#3d6147" stroke-opacity="0.35"
     fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2">
    <path d="M0 44h220" stroke-width="0.8"/>
    <path d="M0 38c20-6 32-6 52 0s38 4 60-2 50 0 70 4 28 2 38 0" stroke-width="0.9"/>
    <path d="M0 50c25-9 45-9 70-2s50 6 75-1 50 1 75 5"/>
    <g transform="translate(185 22)">
      <path d="M0 0v18M6 0v18"/>
      <path d="M-2 0h10"/>
      <path d="M-3 -3h12l-1.5 3h-9z"/>
      <circle cx="3" cy="-7" r="2"/>
      <path d="M3 -10v-3"/>
    </g>
    <path d="M30 14c2-3 4-3 6 0M40 10c2-3 4-3 6 0" stroke-width="1"/>
  </g>
</svg>`;

// Render at 3× density so the user can actually see the 35% strokes
const png = new Resvg(svg, { fitTo: { mode: "width", value: 1050 } }).render().asPng();
fs.writeFileSync("/Users/scott/Documents/development/goodbird/.preview/field-master-actual-size.png", png);
console.log("wrote .preview/field-master-actual-size.png");
