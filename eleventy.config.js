import { DateTime } from "luxon";
import Image from "@11ty/eleventy-img";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugins
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import embedEverything from "eleventy-plugin-embed-everything";
import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import fs from "node:fs";
import { renderOgImage, ogImagePath } from "./lib/og-image.js";

export default function (eleventyConfig) {

  // Markdown configuration
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  };
  eleventyConfig.setLibrary("md", markdownIt(markdownItOptions));

  // Image processing configuration
  async function imageShortcode(src, alt, sizes = "100vw") {
    const fullSrc = src.startsWith('/') ? path.join(__dirname, 'src', src.replace(/^\//, '')) : src;

    let metadata = await Image(fullSrc, {
      widths: [400, 800, 1200],
      formats: ["avif", "webp", "auto"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  }

  // Add the shortcode
  eleventyConfig.addShortcode("image", imageShortcode);

  // Transform to add width/height to existing img tags
  eleventyConfig.addTransform("addImageDimensions", async function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      // Match img tags that don't already have width and height
      const imgRegex = /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi;

      let match;
      let modifiedContent = content;

      while ((match = imgRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const beforeSrc = match[1];
        const src = match[2];
        const afterSrc = match[3];

        // Skip if already has width and height
        if (fullMatch.includes('width=') && fullMatch.includes('height=')) {
          continue;
        }

        try {
          // Convert relative URLs to absolute file paths
          let imagePath;
          if (src.startsWith('/images/')) {
            imagePath = path.join(__dirname, 'src', src);
          } else if (src.startsWith('/')) {
            imagePath = path.join(__dirname, 'src', src);
          } else if (src.startsWith('http')) {
            continue; // Skip external images
          } else {
            continue;
          }

          // Get image dimensions
          const metadata = await Image(imagePath, {
            widths: [null], // Keep original width
            formats: [null], // Keep original format
            outputDir: "./_site/img/",
            urlPath: "/img/",
            dryRun: true // Don't actually generate files, just get metadata
          });

          const originalFormat = Object.keys(metadata)[0];
          const imageData = metadata[originalFormat][0];

          // Create new img tag with dimensions
          const newImgTag = `<img${beforeSrc}src="${src}"${afterSrc} width="${imageData.width}" height="${imageData.height}">`;

          modifiedContent = modifiedContent.replace(fullMatch, newImgTag);
        } catch (error) {
          console.warn(`Could not get dimensions for image: ${src}`, error.message);
        }
      }

      return modifiedContent;
    }

    return content;
  });

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/llms.txt");
  eleventyConfig.addPassthroughCopy("src/netlify.toml");

  eleventyConfig.setServerOptions({
    watch: ['_site/**/*.css'],
  });

  // Add support for blog posts
  eleventyConfig.addCollection("post", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/archive/**/*.md");
  });

  // Add courses collection
  eleventyConfig.addCollection("courses", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/courses/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Add workshops collection (most recent first)
  eleventyConfig.addCollection("workshops", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/workshops/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Date helpers
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("dd LLLL yyyy");
  });
  eleventyConfig.addFilter("htmlDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toFormat("y-MM-dd");
  });
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: "utc",
    }).toISO();
  });

  // String helpers
  eleventyConfig.addFilter("lower", (str) => {
    return str ? str.toLowerCase() : "";
  });


  // Open Graph cards, one per page, rendered at build time.
  // Fonts are vendored under lib/fonts so this works on CI, where Inter is
  // not installed. Title and section are read back out of the built HTML.
  eleventyConfig.addFilter("ogImagePath", ogImagePath);

  const SECTION_LABELS = {
    blog: "Blog", archive: "Blog", courses: "Course", workshops: "Workshop",
    talks: "Talks", about: "About", newsletter: "Newsletter", resources: "Resource",
  };

  eleventyConfig.on("eleventy.after", async ({ dir, results, runMode }) => {
    // Rendering 150 cards costs about 25s, which is fine for a deploy but not
    // for a dev loop. The tags still point at the right URLs either way.
    if (runMode !== "build") {
      console.log("[og] skipped in " + runMode + " mode (run `npm run build` to render cards)");
      return;
    }
    const pages = results.filter((r) => r.outputPath && r.outputPath.endsWith(".html"));
    if (!pages.length) return;
    const outDir = path.join(dir.output, "og");
    fs.mkdirSync(outDir, { recursive: true });

    let written = 0;
    for (const page of pages) {
      const titleMatch = page.content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (!titleMatch) continue;
      const title = titleMatch[1]
        .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
        .replace(/&[a-z]+;/gi, " ")
        .replace(/\s+/g, " ").trim();
      const segment = String(page.url).split("/").filter(Boolean)[0];
      const eyebrow = SECTION_LABELS[segment] || "Gui Ferreira";
      try {
        const png = await renderOgImage({ title, eyebrow });
        fs.writeFileSync(path.join(dir.output, ogImagePath(page.url).replace(/^\//, "")), png);
        written++;
      } catch (error) {
        console.warn(`[og] could not render card for ${page.url}: ${error.message}`);
      }
    }
    console.log(`[og] wrote ${written} social cards`);
  });

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(embedEverything, {
    add: ["youtube"],
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_includes/layouts',
      output: '_site'
    },
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html', 'liquid']
  };
};
