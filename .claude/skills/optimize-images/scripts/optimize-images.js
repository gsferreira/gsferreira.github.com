#!/usr/bin/env node

/**
 * Image Optimization Script
 * Generates WebP and AVIF versions with responsive sizes
 *
 * Usage: node .claude/skills/optimize-images/scripts/optimize-images.js <image-path>
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SIZES = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440
};

async function optimizeImage(inputPath) {
  const dir = path.dirname(inputPath);
  const baseName = path.parse(inputPath).name;
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  console.log(`📸 Processing ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);

  // Generate WebP version (original size)
  await image
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(dir, `${baseName}.webp`));
  console.log(`  ✅ Generated ${baseName}.webp`);

  // Generate AVIF version (original size)
  await image
    .avif({ quality: 75, effort: 9 })
    .toFile(path.join(dir, `${baseName}.avif`));
  console.log(`  ✅ Generated ${baseName}.avif`);

  // Generate responsive sizes in both WebP and AVIF
  for (const [sizeName, width] of Object.entries(SIZES)) {
    // Skip sizes larger than original
    if (width > metadata.width) {
      console.log(`  ⏭️  Skipping ${sizeName} (${width}px) - larger than original`);
      continue;
    }

    console.log(`  🔄 Processing ${sizeName} size (${width}px)...`);

    // Generate WebP version
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(dir, `${baseName}-${width}w.webp`));
    console.log(`    ✅ Generated ${baseName}-${width}w.webp`);

    // Generate AVIF version
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .avif({ quality: 75, effort: 9 })
      .toFile(path.join(dir, `${baseName}-${width}w.avif`));
    console.log(`    ✅ Generated ${baseName}-${width}w.avif`);
  }

  return baseName;
}

async function main() {
  const inputFiles = process.argv.slice(2);

  if (inputFiles.length === 0) {
    console.log('Usage: node optimize-images.js <image-path> [image-path...]');
    console.log('Example: node optimize-images.js src/assets/headshot.png');
    process.exit(1);
  }

  console.log('🎨 Starting image optimization...\n');

  for (const inputPath of inputFiles) {
    try {
      await fs.access(inputPath);
      await optimizeImage(inputPath);
      console.log('');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`❌ File not found: ${inputPath}`);
      } else {
        console.error(`❌ Error processing ${inputPath}:`, error.message);
      }
    }
  }

  console.log('✨ Image optimization complete!');
}

main();
