import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Output dimensions
const W = 1200;
const H = 480;

// Gradient colours (from colors.ts)
const GRAD_START = '#6366F1';
const GRAD_MID   = '#8B5CF6';
const GRAD_END   = '#EC4899';

// Logo padding (as fraction of W)
const LOGO_MAX_W = 720;   // max logo width inside canvas
const LOGO_MAX_H = 280;   // max logo height inside canvas

const ASSETS = resolve('artifacts/piclo/assets/images');
const CANVAS_ASSETS = resolve('.canvas/assets');

mkdirSync(CANVAS_ASSETS, { recursive: true });

// Read PNG dimensions from IHDR chunk (bytes 16-24)
function pngDimensions(buf) {
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  return { w, h };
}

// Scale logo to fit within LOGO_MAX_W × LOGO_MAX_H, preserving aspect ratio
function fitLogo(srcW, srcH) {
  const scaleW = LOGO_MAX_W / srcW;
  const scaleH = LOGO_MAX_H / srcH;
  const scale  = Math.min(scaleW, scaleH, 1);
  return { w: Math.round(srcW * scale), h: Math.round(srcH * scale) };
}

function buildSvg(logoB64, logoW, logoH, logoMime = 'image/png') {
  const lx = Math.round((W - logoW) / 2);
  const ly = Math.round((H - logoH) / 2);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${GRAD_START}"/>
      <stop offset="50%"  stop-color="${GRAD_MID}"/>
      <stop offset="100%" stop-color="${GRAD_END}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg-grad)" rx="0"/>
  <image
    x="${lx}" y="${ly}"
    width="${logoW}" height="${logoH}"
    preserveAspectRatio="xMidYMid meet"
    href="data:${logoMime};base64,${logoB64}"
  />
</svg>`;
}

const variants = [
  { name: 'white', png: 'piclo-logo-white.png' },
  { name: 'dark',  png: 'piclo-logo-dark.png'  },
];

for (const { name, png } of variants) {
  const logoBuf = readFileSync(resolve(ASSETS, png));
  const { w: srcW, h: srcH } = pngDimensions(logoBuf);
  console.log(`${png}: ${srcW}×${srcH}`);

  const { w: logoW, h: logoH } = fitLogo(srcW, srcH);
  console.log(`  → rendered: ${logoW}×${logoH}`);

  const b64 = logoBuf.toString('base64');
  const svg = buildSvg(b64, logoW, logoH);

  // --- SVG file ---
  const svgPath = resolve(ASSETS, `piclo-logo-gradient-${name}.svg`);
  writeFileSync(svgPath, svg, 'utf8');
  console.log(`  ✓ SVG saved: ${svgPath}`);

  // --- PNG file via resvg ---
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
  });
  const pngData = resvg.render();
  const pngBuf  = pngData.asPng();

  const pngOutPath = resolve(ASSETS, `piclo-logo-gradient-${name}.png`);
  writeFileSync(pngOutPath, pngBuf);
  console.log(`  ✓ PNG saved: ${pngOutPath}`);

  // --- Copy PNG to .canvas/assets for canvas display ---
  const canvasCopyPath = resolve(CANVAS_ASSETS, `piclo-logo-gradient-${name}.png`);
  writeFileSync(canvasCopyPath, pngBuf);
  console.log(`  ✓ Canvas copy: ${canvasCopyPath}`);
}

console.log('\nDone!');
