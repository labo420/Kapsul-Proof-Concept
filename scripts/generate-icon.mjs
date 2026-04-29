import { Resvg } from '@resvg/resvg-js';
import opentype from 'opentype.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const SIZE = 1024;
const R = Math.round(72 * (SIZE / 320));

// Load Lilita One and extract the "p" glyph path
const font = opentype.loadSync('/tmp/LilitaOne.ttf');

// Target rendered font size relative to the icon
const FONT_SIZE_PX = Math.round(148 * (SIZE / 320)); // 473px

// Get the "p" glyph and its bounding box
const glyph = font.charToGlyph('p');
const unitsPerEm = font.unitsPerEm;
const scale = FONT_SIZE_PX / unitsPerEm;

// Get bounding box of the glyph at the target scale
const bb = glyph.getBoundingBox();
const glyphW = (bb.x2 - bb.x1) * scale;
const glyphH = (bb.y2 - bb.y1) * scale;

// Center the glyph bowl visually in the 1024×1024 icon
// "p" has bowl (top) and descender (bottom). Visual center is at bowl center.
// x-height in font units (approximate) ~ yMax of "p"
const xHeight = bb.y2 * scale;       // top of bowl from baseline
const descender = -bb.y1 * scale;    // length of descender below baseline

// Place: bowl should be at icon center
// bowlCenter = baseline_y - xHeight/2
// We want bowlCenter = SIZE/2 => baseline_y = SIZE/2 + xHeight/2
const baselineY = SIZE / 2 + xHeight / 2;

// Horizontal center
const baselineX = SIZE / 2 - (bb.x1 + (bb.x2 - bb.x1) / 2) * scale;

// Build SVG path from glyph
const path = glyph.getPath(baselineX, baselineY, FONT_SIZE_PX);
const pathData = path.toSVG(2);

// Bracket coords scaled from 320px design to 1024px
const s = SIZE / 320;
const brackets = [
  `M ${65*s} ${103*s} L ${65*s} ${65*s} L ${103*s} ${65*s}`,
  `M ${217*s} ${65*s} L ${255*s} ${65*s} L ${255*s} ${103*s}`,
  `M ${255*s} ${217*s} L ${255*s} ${255*s} L ${217*s} ${255*s}`,
  `M ${103*s} ${255*s} L ${65*s} ${255*s} L ${65*s} ${217*s}`,
].join(' ');
const strokeWidth = Math.round(6 * s);

// Extract just the d= attribute from pathData
const dMatch = pathData.match(/d="([^"]+)"/);
const d = dMatch ? dMatch[1] : '';

console.log(`Glyph stats: xHeight=${xHeight.toFixed(1)}px descender=${descender.toFixed(1)}px baselineY=${baselineY.toFixed(1)}`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
  </defs>

  <rect width="${SIZE}" height="${SIZE}" rx="${R}" ry="${R}" fill="#08060F"/>

  <path d="${d}" fill="white"/>

  <path
    d="${brackets}"
    stroke="url(#g)"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
</svg>`;

function renderAndSave(svgStr, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  const resvg = new Resvg(svgStr, { font: { loadSystemFonts: false } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  writeFileSync(outPath, pngBuffer);
  console.log(`Saved ${outPath} (${pngBuffer.length} bytes)`);
}

renderAndSave(svg, 'artifacts/kapsul/assets/images/icon.png');
renderAndSave(svg, 'artifacts/kapsul/assets/images/adaptive-icon.png');
renderAndSave(svg, 'artifacts/kapsul/assets/images/splash-icon.png');

console.log('Done!');
