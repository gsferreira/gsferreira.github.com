#!/usr/bin/env node

/**
 * Video Optimization Script
 * Generates MP4, WebM, and poster images for course hero videos
 *
 * Usage: node .claude/skills/optimize-videos/scripts/optimize-videos.js <video-path>
 *
 * Requires FFmpeg: https://ffmpeg.org/download.html
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import sharp from 'sharp';

const CONFIG = {
  outputDir: 'src/assets/courses/videos',
  posterDir: 'src/assets/courses/videos',

  video: {
    mp4: {
      codec: 'libx264',
      crf: 23,
      preset: 'medium',
      maxWidth: 1920,
      maxHeight: 1080
    },
    webm: {
      codec: 'libvpx-vp9',
      crf: 30,
      preset: 'medium',
      maxWidth: 1920,
      maxHeight: 1080
    }
  },

  poster: {
    timeOffset: '00:00:03',
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080
  }
};

function ensureDirectories() {
  [CONFIG.outputDir, CONFIG.posterDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.stderr.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

async function optimizeVideoToMP4(inputPath, outputPath) {
  const args = [
    '-i', inputPath,
    '-c:v', CONFIG.video.mp4.codec,
    '-crf', CONFIG.video.mp4.crf.toString(),
    '-preset', CONFIG.video.mp4.preset,
    '-vf', `scale='min(${CONFIG.video.mp4.maxWidth},iw)':min'(${CONFIG.video.mp4.maxHeight},ih)':force_original_aspect_ratio=decrease`,
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-y',
    outputPath
  ];

  console.log(`Converting to MP4: ${path.basename(inputPath)}`);
  await runFFmpeg(args);
}

async function optimizeVideoToWebM(inputPath, outputPath) {
  const args = [
    '-i', inputPath,
    '-c:v', CONFIG.video.webm.codec,
    '-crf', CONFIG.video.webm.crf.toString(),
    '-b:v', '0',
    '-vf', `scale='min(${CONFIG.video.webm.maxWidth},iw)':min'(${CONFIG.video.webm.maxHeight},ih)':force_original_aspect_ratio=decrease`,
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-y',
    outputPath
  ];

  console.log(`Converting to WebM: ${path.basename(inputPath)}`);
  await runFFmpeg(args);
}

async function generatePoster(inputPath, outputPath) {
  const args = [
    '-i', inputPath,
    '-ss', CONFIG.poster.timeOffset,
    '-vframes', '1',
    '-vf', `scale='min(${CONFIG.poster.maxWidth},iw)':min'(${CONFIG.poster.maxHeight},ih)':force_original_aspect_ratio=decrease`,
    '-q:v', '2',
    '-y',
    outputPath
  ];

  console.log(`Generating poster: ${path.basename(outputPath)}`);
  await runFFmpeg(args);
}

async function generateOptimizedPosters(tempPosterPath, baseName) {
  const webpOutput = path.join(CONFIG.posterDir, `${baseName}-poster.webp`);
  const avifOutput = path.join(CONFIG.posterDir, `${baseName}-poster.avif`);
  const pngOutput = path.join(CONFIG.posterDir, `${baseName}-poster.png`);

  const image = sharp(tempPosterPath);

  await image
    .webp({ quality: 85, effort: 6 })
    .toFile(webpOutput);
  console.log(`Generated WebP poster: ${path.basename(webpOutput)}`);

  await image
    .avif({ quality: 75, effort: 9 })
    .toFile(avifOutput);
  console.log(`Generated AVIF poster: ${path.basename(avifOutput)}`);

  await image
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(pngOutput);
  console.log(`Generated PNG fallback: ${path.basename(pngOutput)}`);

  fs.unlinkSync(tempPosterPath);

  return { webp: webpOutput, avif: avifOutput, png: pngOutput };
}

async function getVideoDuration(inputPath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      inputPath
    ]);

    let output = '';
    ffprobe.stdout.on('data', (data) => {
      output += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0) {
        const duration = parseFloat(output.trim());
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`PT${minutes}M${seconds}S`);
      } else {
        reject(new Error(`FFprobe exited with code ${code}`));
      }
    });
  });
}

async function processVideo(inputPath) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const mp4Output = path.join(CONFIG.outputDir, `${baseName}.mp4`);
  const webmOutput = path.join(CONFIG.outputDir, `${baseName}.webm`);
  const tempPosterOutput = path.join(CONFIG.posterDir, `${baseName}-poster-temp.jpg`);

  console.log(`\nProcessing: ${inputPath}`);

  const duration = await getVideoDuration(inputPath);
  console.log(`Duration: ${duration}`);

  await optimizeVideoToMP4(inputPath, mp4Output);
  await optimizeVideoToWebM(inputPath, webmOutput);
  await generatePoster(inputPath, tempPosterOutput);

  const posterPaths = await generateOptimizedPosters(tempPosterOutput, baseName);

  console.log('\n📋 Add this to your course frontmatter:');
  console.log('```yaml');
  console.log('heroVideo:');
  console.log(`  mp4: "/assets/courses/videos/${baseName}.mp4"`);
  console.log(`  webm: "/assets/courses/videos/${baseName}.webm"`);
  console.log(`  poster:`);
  console.log(`    avif: "/assets/courses/videos/${baseName}-poster.avif"`);
  console.log(`    webp: "/assets/courses/videos/${baseName}-poster.webp"`);
  console.log(`    png: "/assets/courses/videos/${baseName}-poster.png"`);
  console.log(`  duration: "${duration}"`);
  console.log('  title: "Course Preview" # Customize this');
  console.log('  description: "See what you\'ll learn" # Customize this');
  console.log('  autoplay: false');
  console.log('```\n');

  console.log('✅ Video optimization complete!');

  const stats = {
    avif: fs.statSync(posterPaths.avif).size,
    webp: fs.statSync(posterPaths.webp).size,
    png: fs.statSync(posterPaths.png).size
  };
  console.log(`📊 Poster sizes:`);
  console.log(`  AVIF: ${Math.round(stats.avif / 1024)}KB`);
  console.log(`  WebP: ${Math.round(stats.webp / 1024)}KB`);
  console.log(`  PNG:  ${Math.round(stats.png / 1024)}KB`);
}

async function main() {
  // Check if FFmpeg is available
  try {
    await runFFmpeg(['-version']);
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install FFmpeg:');
    console.error('   macOS: brew install ffmpeg');
    console.error('   Ubuntu: apt install ffmpeg');
    console.error('   Windows: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  ensureDirectories();

  const inputFiles = process.argv.slice(2);

  if (inputFiles.length === 0) {
    console.log('Usage: node optimize-videos.js <video-path> [video-path...]');
    console.log('Example: node optimize-videos.js src/assets/raw-videos/course-preview.mov');
    process.exit(1);
  }

  for (const inputFile of inputFiles) {
    if (!fs.existsSync(inputFile)) {
      console.error(`❌ File not found: ${inputFile}`);
      continue;
    }

    await processVideo(inputFile);
  }
}

main().catch(console.error);
