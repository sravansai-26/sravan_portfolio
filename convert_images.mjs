import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

async function convert(relPath) {
  const filePath = path.join(root, relPath);
  const outPath = filePath.replace(/\.(png|jpg|jpeg)$/, '.webp');
  try {
    await sharp(filePath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outPath);
    console.log(`Converted ${relPath} to ${outPath}`);
  } catch (err) {
    console.error(`Error converting ${relPath}: ${err.message}`);
  }
}

async function run() {
  await convert('src/assets/sravan-cutout.png');
  await convert('src/assets/footer-cat.jpeg');
  await convert('src/assets/ssv-mark.png');
  await convert('src/assets/ssv-name.png');
}

run().catch(console.error);
