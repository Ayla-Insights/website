// Generates the Open Graph / Twitter social-share card at public/opengraph.png
// (1200x630), using the official Mandi mark + "mandi" wordmark in Hanken Grotesk.
// Run with `pnpm --filter @workspace/ayla-marketing run gen:og` after changing
// the card. Not part of the build — the PNG is committed.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/opengraph.png");
const fontPath = resolve(__dirname, "fonts/HankenGrotesk.ttf");

// The official Mandi mark (concentric rings), viewBox 0 0 1500 1500.
const MARK = `
  <g fill="#61c2a2"><circle cx="749.2" cy="39.9" r="37.2"/><circle cx="479" cy="94" r="37.2"/><circle cx="1018.8" cy="94" r="37.2"/><circle cx="249.4" cy="249.4" r="37.2"/><circle cx="1249.1" cy="249.4" r="37.2"/><circle cx="94" cy="479" r="37.2"/><circle cx="1403.8" cy="479" r="37.2"/><circle cx="39.9" cy="749.3" r="37.2"/><circle cx="1458.6" cy="749.2" r="37.2"/><circle cx="93.9" cy="1018.8" r="37.2"/><circle cx="1403.8" cy="1018.8" r="37.2"/><circle cx="249.4" cy="1249.1" r="37.2"/><circle cx="1249.1" cy="1249.1" r="37.2"/><circle cx="479" cy="1403.8" r="37.2"/><circle cx="1018.8" cy="1403.8" r="37.2"/><circle cx="749.3" cy="1458.6" r="37.2"/></g>
  <g fill="#66c8ba"><circle cx="749.3" cy="268.6" r="48.8"/><circle cx="508.9" cy="333.5" r="48.8"/><circle cx="987.3" cy="333.5" r="48.8"/><circle cx="1164.2" cy="508.9" r="48.8"/><circle cx="333.5" cy="510.4" r="48.8"/><circle cx="268.6" cy="749.3" r="48.8"/><circle cx="1229.2" cy="749.3" r="48.8"/><circle cx="1164.2" cy="987.3" r="48.8"/><circle cx="333.5" cy="988.8" r="48.8"/><circle cx="510.4" cy="1164.2" r="48.8"/><circle cx="988.8" cy="1164.2" r="48.8"/><circle cx="749.3" cy="1229.2" r="48.8"/></g>
  <g fill="#9be8d6"><circle cx="749.3" cy="509.1" r="69"/><circle cx="581.1" cy="581.1" r="69"/><circle cx="917.4" cy="581.1" r="69"/><circle cx="509.1" cy="749.3" r="69"/><circle cx="989.4" cy="749.3" r="69"/><circle cx="581.1" cy="917.4" r="69"/><circle cx="917.4" cy="917.4" r="69"/><circle cx="749.3" cy="989.4" r="69"/></g>
  <circle cx="750" cy="750" r="103.4" fill="#ffffff"/>`;

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0c5b52"/>
      <stop offset="1" stop-color="#062b27"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- official mark + wordmark lockup -->
  <g transform="translate(80,66) scale(0.12)">${MARK}</g>
  <text x="290" y="205" font-family="Hanken Grotesk" font-weight="700" font-size="132" letter-spacing="-5" fill="#ffffff">mandi</text>

  <text x="84" y="360" font-family="Hanken Grotesk" font-weight="700" font-size="46" fill="#ffffff">The AI copilot for the dental office</text>
  <text x="86" y="418" font-family="Hanken Grotesk" font-weight="500" font-size="31" fill="#ccfbf1">Find the revenue hiding in your practice data.</text>

  <rect x="86" y="476" width="290" height="58" rx="29" fill="#ffffff" fill-opacity="0.14"/>
  <text x="114" y="514" font-family="Hanken Grotesk" font-weight="600" font-size="26" fill="#ffffff">Built security-first</text>

  <text x="86" y="590" font-family="Hanken Grotesk" font-weight="500" font-size="28" fill="#99f6e4">heymandi.ai</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { fontFiles: [fontPath], loadSystemFonts: false, defaultFontFamily: "Hanken Grotesk" },
});
const png = resvg.render().asPng();
writeFileSync(out, png);
console.log(`Wrote ${out} (${(png.length / 1024).toFixed(1)} KB)`);
