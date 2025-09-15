#!/usr/bin/env node

/**
 * Image Optimization Script
 * Generates WebP versions and responsive sizes for hero images
 * 
 * Usage: node scripts/optimize-images.js
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

const INPUT_DIR = 'src/assets';
const OUTPUT_DIR = 'src/assets';

async function optimizeImage(inputPath, filename) {
  const baseName = path.parse(filename).name;
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log(`📸 Processing ${filename} (${metadata.width}x${metadata.height})`);

  // Generate WebP version (original size)
  await image
    .webp({ quality: 85, effort: 6 })
    .toFile(path.join(OUTPUT_DIR, `${baseName}.webp`));
  console.log(`  ✅ Generated ${baseName}.webp`);

  // Generate AVIF version (original size) 
  await image
    .avif({ quality: 75, effort: 9 })
    .toFile(path.join(OUTPUT_DIR, `${baseName}.avif`));
  console.log(`  ✅ Generated ${baseName}.avif`);

  // Generate responsive sizes in both WebP and AVIF
  for (const [sizeName, width] of Object.entries(SIZES)) {
    console.log(`  🔄 Processing ${sizeName} size (${width}px)...`);
    
    // Generate WebP version
    await image
      .resize(width, null, { 
        withoutEnlargement: false, // Allow upscaling if needed
        fit: 'inside'
      })
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}w.webp`));
    console.log(`    ✅ Generated ${baseName}-${width}w.webp`);

    // Generate AVIF version
    await image
      .resize(width, null, { 
        withoutEnlargement: false, // Allow upscaling if needed
        fit: 'inside'
      })
      .avif({ quality: 75, effort: 9 })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}w.avif`));
    console.log(`    ✅ Generated ${baseName}-${width}w.avif`);
  }
}

async function main() {
  try {
    console.log('🎨 Starting image optimization...\n');
    
    // Create scripts directory if it doesn't exist
    await fs.mkdir('scripts', { recursive: true });
    
    // Process headshot image
    const headshotPath = path.join(INPUT_DIR);
    
    // Check if file exists
    try {
      await fs.access(headshotPath);
    } catch (error) {
      console.error(`❌ File not found: ${headshotPath}`);
      console.log('Available files in src/assets:');
      const files = await fs.readdir(INPUT_DIR);
      files.filter(f => f.match(/\.(png|jpg|jpeg)$/i)).forEach(f => console.log(`  - ${f}`));
      process.exit(1);
    }
    
    await optimizeImage(headshotPath);
    
    console.log('\n✨ Image optimization complete!');
    console.log('\n📝 Generated files:');
    console.log('  - headshot.webp (Original size WebP)');
    console.log('  - headshot.avif (Original size AVIF)');
    console.log('  - headshot-480w.webp (Mobile WebP)');
    console.log('  - headshot-768w.webp (Tablet WebP)');
    console.log('  - headshot-1024w.webp (Desktop WebP)');
    console.log('  - headshot-1440w.webp (Large WebP)');
    console.log('  - headshot-480w.avif (Mobile AVIF)');
    console.log('  - headshot-768w.avif (Tablet AVIF)');
    console.log('  - headshot-1024w.avif (Desktop AVIF)');
    console.log('  - headshot-1440w.avif (Large AVIF)');
    
    console.log('\n🎯 Next steps:');
    console.log('  1. Your responsive images are ready!');
    console.log('  2. Test your site to see the improvements');
    console.log('  3. Check different device sizes to see appropriate images loading');
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

main(); 