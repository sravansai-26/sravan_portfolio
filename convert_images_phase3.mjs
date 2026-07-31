import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

async function processImage(inputPath, outputPath, maxWidth, quality = 80) {
  try {
    const inputBuffer = await fs.readFile(inputPath);
    await sharp(inputBuffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    console.log(`Processed: ${inputPath} -> ${outputPath}`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

async function main() {
  const publicDir = './public/credentials';
  const projectsDir = './public/projects';
  const rootPublicDir = './public';

  const targets = [
    { input: path.join(publicDir, 'thumbnail.png'), output: path.join(publicDir, 'thumbnail.webp'), width: 960, quality: 75 },
    { input: path.join(publicDir, 'dl-logo.png'), output: path.join(publicDir, 'dl-logo.webp'), width: 150, quality: 80 },
    { input: path.join(projectsDir, 'sri-wedding.png'), output: path.join(projectsDir, 'sri-wedding.webp'), width: 150, quality: 80 },
    { input: path.join(publicDir, 'lyfspot-logo.png'), output: path.join(publicDir, 'lyfspot-logo.webp'), width: 150, quality: 80 },
    { input: path.join(rootPublicDir, 'lyfspot-logo.png'), output: path.join(rootPublicDir, 'lyfspot-logo.webp'), width: 150, quality: 80 },
    { input: path.join(publicDir, 'lyfspot-logo.jpg'), output: path.join(publicDir, 'lyfspot-logo.webp'), width: 150, quality: 80 },
    { input: path.join(rootPublicDir, 'naxrita.png'), output: path.join(rootPublicDir, 'naxrita.webp'), width: 150, quality: 80 },
    { input: path.join(publicDir, 'naxrita.png'), output: path.join(publicDir, 'naxrita.webp'), width: 150, quality: 80 },
    { input: path.join(rootPublicDir, 'mlr.png'), output: path.join(rootPublicDir, 'mlr.webp'), width: 150, quality: 80 },
    { input: path.join(publicDir, 'mlr.png'), output: path.join(publicDir, 'mlr.webp'), width: 150, quality: 80 }
  ];

  for (const t of targets) {
    try {
      await fs.access(t.input);
      await processImage(t.input, t.output, t.width, t.quality);
    } catch {
      // console.log(`Could not find ${t.input}`);
    }
  }
}

main();
