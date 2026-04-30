import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, "../assets/images");

async function generate() {
  const iconBlackSvg = readFileSync(join(assetsDir, "icon black.svg"));
  const iconWhiteSvg = readFileSync(join(assetsDir, "icon white.svg"));

  await sharp(iconBlackSvg)
    .resize(1024, 1024)
    .png()
    .toFile(join(assetsDir, "icon.png"));
  console.log("✓ icon.png generated");

  await sharp(iconBlackSvg)
    .resize(1024, 1024)
    .png()
    .toFile(join(assetsDir, "adaptive-icon.png"));
  console.log("✓ adaptive-icon.png generated");

  await sharp(iconWhiteSvg)
    .resize(1024, 1024)
    .png()
    .toFile(join(assetsDir, "splash-icon.png"));
  console.log("✓ splash-icon.png generated");

  console.log("All icons generated successfully.");
}

generate().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
