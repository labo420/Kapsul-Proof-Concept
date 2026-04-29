import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const SIZE = 1024;
const SCALE = SIZE / 320;

const R = Math.round(72 * SCALE);
const TEXT_Y = Math.round(156 * SCALE);
const FONT_SIZE = Math.round(148 * SCALE);

// Bracket path scaled from 320px design
const s = SCALE;
const brackets = [
  `M ${65*s} ${103*s} L ${65*s} ${65*s} L ${103*s} ${65*s}`,
  `M ${217*s} ${65*s} L ${255*s} ${65*s} L ${255*s} ${103*s}`,
  `M ${255*s} ${217*s} L ${255*s} ${255*s} L ${217*s} ${255*s}`,
  `M ${103*s} ${255*s} L ${65*s} ${255*s} L ${65*s} ${217*s}`,
].join(' ');

const strokeWidth = Math.round(6 * SCALE);
const cx = SIZE / 2;

const fontData = readFileSync('/tmp/LilitaOne.ttf');
const fontBase64 = fontData.toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <style>
      @font-face {
        font-family: 'Lilita One';
        src: url('data:font/truetype;base64,${fontBase64}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    </style>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <clipPath id="clip">
      <rect width="${SIZE}" height="${SIZE}" rx="${R}" ry="${R}"/>
    </clipPath>
  </defs>

  <rect width="${SIZE}" height="${SIZE}" rx="${R}" ry="${R}" fill="#08060F"/>

  <g clip-path="url(#clip)">
    <text
      x="${cx}"
      y="${TEXT_Y}"
      text-anchor="middle"
      dominant-baseline="central"
      font-family="'Lilita One', cursive"
      font-size="${FONT_SIZE}"
      fill="white"
    >p</text>

    <path
      d="${brackets}"
      stroke="url(#g)"
      stroke-width="${strokeWidth}"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>
</svg>`;

function renderAndSave(svgStr, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  const resvg = new Resvg(svgStr, {
    font: {
      loadSystemFonts: false,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  writeFileSync(outPath, pngBuffer);
  console.log(`Saved ${outPath} (${pngBuffer.length} bytes)`);
}

renderAndSave(svg, 'artifacts/kapsul/assets/images/icon.png');
renderAndSave(svg, 'artifacts/kapsul/assets/images/adaptive-icon.png');
renderAndSave(svg, 'artifacts/kapsul/assets/images/splash-icon.png');

console.log('Done!');
