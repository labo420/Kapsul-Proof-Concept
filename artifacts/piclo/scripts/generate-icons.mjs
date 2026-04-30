import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "../assets/images");

const BG = { r: 15, g: 15, b: 26 };

async function generate() {
  const iconWhiteSvg = readFileSync(join(assetsDir, "icon white.svg"));

  await sharp(iconWhiteSvg)
    .resize(1024, 1024)
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "icon.png"));
  console.log("✓ icon.png generato");

  await sharp(iconWhiteSvg)
    .resize(1024, 1024)
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "adaptive-icon.png"));
  console.log("✓ adaptive-icon.png generato");

  await sharp(iconWhiteSvg)
    .resize(1024, 1024)
    .flatten({ background: BG })
    .png()
    .toFile(join(assetsDir, "splash-icon.png"));
  console.log("✓ splash-icon.png generato");

  console.log("Tutti i PNG generati con successo.");
}

generate().catch((err) => {
  console.error("Errore:", err);
  process.exit(1);
});
