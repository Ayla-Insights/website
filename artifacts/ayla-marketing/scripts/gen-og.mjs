// Generates the Open Graph / Twitter social-share card at public/opengraph.png
// (1200x630). Run with `pnpm --filter @workspace/ayla-marketing run gen:og`
// after changing the card copy. Not part of the build — the PNG is committed.
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/opengraph.png");

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d9488"/>
      <stop offset="1" stop-color="#0f3d3a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- concentric rings echoing the Mandi mark -->
  <g fill="none" stroke="#ffffff" stroke-opacity="0.10">
    <circle cx="1090" cy="120" r="70" stroke-width="2"/>
    <circle cx="1090" cy="120" r="130" stroke-width="2"/>
    <circle cx="1090" cy="120" r="190" stroke-width="2"/>
    <circle cx="1090" cy="120" r="250" stroke-width="2"/>
  </g>

  <text x="90" y="250" font-family="Helvetica, Arial, sans-serif" font-size="132" font-weight="700" fill="#ffffff" letter-spacing="-2">Mandi</text>
  <text x="95" y="332" font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="600" fill="#ffffff">The AI copilot for the dental office</text>
  <text x="95" y="392" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#ccfbf1">Find the revenue hiding in your practice data.</text>

  <rect x="95" y="466" width="286" height="58" rx="29" fill="#ffffff" fill-opacity="0.14"/>
  <text x="123" y="504" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#ffffff">Built security-first</text>

  <text x="95" y="588" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#99f6e4">heymandi.ai</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
});
const png = resvg.render().asPng();
writeFileSync(out, png);
console.log(`Wrote ${out} (${(png.length / 1024).toFixed(1)} KB)`);
