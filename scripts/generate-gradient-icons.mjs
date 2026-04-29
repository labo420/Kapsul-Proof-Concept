import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Gradient colours
const G1 = '#6366F1';
const G2 = '#8B5CF6';
const G3 = '#EC4899';

const ASSETS = resolve('artifacts/piclo/assets/images');
const logoBuf = readFileSync(resolve(ASSETS, 'piclo-logo-white.png'));
const logoB64 = logoBuf.toString('base64');

// Logo source dimensions
const LOGO_SRC_W = 604;
const LOGO_SRC_H = 296;

function buildIconSvg(size, logoFraction) {
  const logoW = Math.round(size * logoFraction);
  const logoH = Math.round(logoW * (LOGO_SRC_H / LOGO_SRC_W));
  const lx = Math.round((size - logoW) / 2);
  const ly = Math.round((size - logoH) / 2);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${G1}"/>
      <stop offset="50%"  stop-color="${G2}"/>
      <stop offset="100%" stop-color="${G3}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <image
    x="${lx}" y="${ly}"
    width="${logoW}" height="${logoH}"
    preserveAspectRatio="xMidYMid meet"
    href="data:image/png;base64,${logoB64}"
  />
</svg>`;
}

const icons = [
  // iOS / web icon  — logo at 57% width (≥20% side padding)
  { file: 'icon.png',          fraction: 0.57 },
  // Android adaptive foreground — logo at 53% (safe zone)
  { file: 'adaptive-icon.png', fraction: 0.53 },
  // Splash — logo at 50% width (25% side padding for contain mode)
  { file: 'splash-icon.png',   fraction: 0.50 },
];

for (const { file, fraction } of icons) {
  const svg = buildIconSvg(1024, fraction);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1024 } });
  const pngBuf = resvg.render().asPng();
  const out = resolve(ASSETS, file);
  writeFileSync(out, pngBuf);
  const logoW = Math.round(1024 * fraction);
  console.log(`✓ ${file}  (logo ${logoW}px / ${Math.round(fraction * 100)}%)`);
}

console.log('\nDone! Restart Expo to see the updated icons.');
