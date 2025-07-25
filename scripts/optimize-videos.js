import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import sharp from 'sharp';

/**
 * Video optimization script for course hero videos
 * Requires FFmpeg to be installed: https://ffmpeg.org/download.html
 * Requires Sharp for image optimization: npm install sharp
 */

const CONFIG = {
  inputDir: 'src/assets/raw-videos',
  outputDir: 'src/assets/courses/videos',
  posterDir: 'src/assets/courses/videos',
  
  // Video optimization settings
  video: {
    // MP4 settings for broad compatibility
    mp4: {
      codec: 'libx264',
      crf: 23, // Quality: 18-28 (lower = better quality, higher size)
      preset: 'medium', // Speed vs compression: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
      maxWidth: 1920,
      maxHeight: 1080
    },
    
    // WebM settings for modern browsers (better compression)
    webm: {
      codec: 'libvpx-vp9',
      crf: 30,
      preset: 'medium',
      maxWidth: 1920,
      maxHeight: 1080
    }
  },
  
  // Poster frame settings
  poster: {
    timeOffset: '00:00:03', // Extract poster at 3 seconds
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
    '-movflags', '+faststart', // Optimize for web streaming
    '-y', // Overwrite output files
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
    '-b:v', '0', // Use CRF mode
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
    '-q:v', '2', // High quality for temporary image
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
  
  try {
    const image = sharp(tempPosterPath);
    
    // Generate WebP version (best compression/quality balance)
    await image
      .webp({ quality: 85, effort: 6 })
      .toFile(webpOutput);
    console.log(`Generated WebP poster: ${path.basename(webpOutput)}`);
    
    // Generate AVIF version (best compression)
    await image
      .avif({ quality: 75, effort: 9 })
      .toFile(avifOutput);
    console.log(`Generated AVIF poster: ${path.basename(avifOutput)}`);
    
    // Generate PNG fallback (for older browsers)
    await image
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(pngOutput);
    console.log(`Generated PNG fallback: ${path.basename(pngOutput)}`);
    
    // Clean up temporary file
    fs.unlinkSync(tempPosterPath);
    
    return {
      webp: webpOutput,
      avif: avifOutput,
      png: pngOutput
    };
    
  } catch (error) {
    console.error('Error generating optimized posters:', error);
    throw error;
  }
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
  
  try {
    console.log(`\nProcessing: ${inputPath}`);
    
    // Get video duration for schema markup
    const duration = await getVideoDuration(inputPath);
    console.log(`Duration: ${duration}`);
    
    // Generate optimized videos
    await optimizeVideoToMP4(inputPath, mp4Output);
    await optimizeVideoToWebM(inputPath, webmOutput);
    
    // Generate temporary poster frame
    await generatePoster(inputPath, tempPosterOutput);
    
    // Generate optimized poster formats
    const posterPaths = await generateOptimizedPosters(tempPosterOutput, baseName);
    
    // Output configuration for frontmatter
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
    console.log('  caption: "Preview of course content" # Optional');
    console.log('  transcript: "Add transcript here for SEO" # Optional but recommended');
    console.log('```\n');
    
    console.log('✅ Video optimization complete!');
    console.log(`📊 Poster sizes:`);
    const stats = {
      avif: fs.statSync(posterPaths.avif).size,
      webp: fs.statSync(posterPaths.webp).size, 
      png: fs.statSync(posterPaths.png).size
    };
    console.log(`  AVIF: ${Math.round(stats.avif / 1024)}KB`);
    console.log(`  WebP: ${Math.round(stats.webp / 1024)}KB`);
    console.log(`  PNG:  ${Math.round(stats.png / 1024)}KB`);
    console.log(`  Savings: ${Math.round((stats.png - stats.avif) / 1024)}KB (${Math.round((1 - stats.avif / stats.png) * 100)}% with AVIF)`);
    
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function main() {
  // Check if FFmpeg is available
  try {
    await runFFmpeg(['-version']);
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install FFmpeg: https://ffmpeg.org/download.html');
    process.exit(1);
  }
  
  ensureDirectories();
  
  const inputFiles = process.argv.slice(2);
  
  if (inputFiles.length === 0) {
    console.log('Usage: node scripts/optimize-videos.js <input-video-files...>');
    console.log('Example: node scripts/optimize-videos.js raw-videos/course-preview.mov');
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { processVideo, CONFIG }; 