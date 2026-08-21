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

  // Reading time from the rendered post. Prose runs at 220 wpm. Code blocks are
  // pulled out of the word count first, because tokenising source as prose
  // wildly overcounts, and charged a flat 15 seconds each instead.
  eleventyConfig.addFilter("readingTime", (html) => {
    const source = String(html || "");
    const codeBlocks = (source.match(/<pre[\s\S]*?<\/pre>/g) || []).length;
    const prose = source
      .replace(/<pre[\s\S]*?<\/pre>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " ");
    const words = prose.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220 + codeBlocks * 0.25));
  });

  // Related posts.
  //
  // Scored from URL slugs rather than titles: slugs are already lowercased and
  // hyphenated, so ".NET" and "C#" arrive as "dotnet" and "csharp" instead of
  // punctuation that has to be special-cased. Shared tokens are weighted by
  // inverse document frequency, so "hexagonal" (3 posts) counts for far more
  // than "dotnet" (dozens). A matching category adds a bonus, and a small
  // recency term breaks ties toward posts that can still rank.
  //
  // A `related` front matter list of slugs overrides the scoring entirely.
  // Generic headline vocabulary. IDF cannot separate these from topic words in
  // a corpus this small: "know" appears in three slugs, so it scores as highly
  // as a genuinely rare technical term and pairs a TDD post with one about
  // React rendering. Topic words have to carry the match on their own.
  const RELATED_STOPWORDS = new Set([
    "the","and","for","with","your","you","that","this","how","why","what","who",
    "when","where","not","dont","from","are","was","were","its","has","have","had",
    "can","will","should","does","did","but","all","any","get","got","make","makes",
    "use","uses","using","new","one","two","three","into","out","about","more",
    "most","just","than","then","too","very","their","them","they","our","been",
    "because","which","know","knows","knowing","known","awesome","feature",
    "features","secret","secrets","powerful","small","perfect","best","better",
    "good","great","things","thing","need","needs","simple","simply","easy","hard",
    "quick","fast","slow","first","last","next","every","only","still","always",
    "never","really","actually","want","wants","like","love","think","thoughts",
    "tips","tip","guide","way","ways","look","looking","start","starting","stop",
    "keep","take","takes","put","give","gives","going","own","off","over","under",
    "again","once","here","there","now","today","everything","anything","something",
    "people","someone","yourself","myself","much","many","few","less","lot","lots",
    "why","let","lets","made","made","must","may","might","see","saw","seen",
  ]);

  // Crude suffix stemmer. Enough to collapse test / tests / testing and
  // refactoring / refactorings onto a shared stem, which is where most of the
  // missed matches were.
  function stem(token) {
    if (token.length > 5 && token.endsWith("ings")) return token.slice(0, -4);
    if (token.length > 4 && token.endsWith("ing")) return token.slice(0, -3);
    if (token.length > 4 && token.endsWith("ies")) return token.slice(0, -3) + "y";
    if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
    if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);
    return token;
  }

  function slugTokens(url) {
    const parts = String(url || "").split("/").filter(Boolean).pop().split("-");
    const kept = parts.filter((part, index) => {
      // A leading number is a listicle count ("3-tdd-techniques"). A number
      // anywhere else is usually a version ("csharp-11-required-members"),
      // which is one of the strongest signals in these slugs.
      if (/^\d+$/.test(part)) return index > 0;
      return part.length > 2 && !RELATED_STOPWORDS.has(part);
    });
    return new Set(kept.map(stem));
  }

  eleventyConfig.addFilter("relatedPosts", function (posts, currentUrl, currentCategory, explicit, limit) {
    const max = limit || 3;
    const pool = (posts || []).filter((p) => p.url !== currentUrl);

    // Explicit override wins. Match on the slug at the end of the URL.
    if (Array.isArray(explicit) && explicit.length) {
      const wanted = explicit.map((s) => String(s).replace(/^\/|\/$/g, "").split("/").pop());
      const picked = wanted
        .map((slug) => pool.find((p) => p.url.replace(/\/$/, "").split("/").pop() === slug))
        .filter(Boolean);
      if (picked.length) return picked.slice(0, max);
    }

    // Document frequency across the whole pool, for IDF weighting.
    const df = new Map();
    pool.forEach((p) => slugTokens(p.url).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));

    const mine = slugTokens(currentUrl);

    const scored = pool.map((p) => {
      let topical = 0;
      slugTokens(p.url).forEach((t) => {
        if (mine.has(t)) topical += 1 / Math.sqrt(df.get(t) || 1);
      });
      // Category is deliberately not scored. The existing values are
      // inconsistent and several are catch-alls: "Improvement" alone spans
      // refactoring, team management and behavioural science, and matching on
      // it pairs posts that have nothing to do with each other. Slug overlap
      // on its own produces tighter clusters.

      // Recency is a tie-breaker among genuinely related posts, never a score
      // of its own. Without this guard a post with no topical match just gets
      // "the three newest posts", which is not a relationship and funnels every
      // link on the site into a handful of URLs.
      if (topical < 0.3) return null;

      const year = p.date ? p.date.getUTCFullYear() : 2014;
      return { post: p, score: topical + Math.max(0, year - 2014) * 0.015 };
    }).filter(Boolean);

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map((x) => x.post);
  });

  // JSON.stringify for template use. Liquid has no autoescape and no json
  // filter, so any text interpolated into JSON-LD must go through this or a
  // stray quote breaks the block. Emits the surrounding quotes itself.
  eleventyConfig.addFilter("jsonify", (value) => {
    return JSON.stringify(value === undefined || value === null ? "" : value);
  });

  // "September 14-15, 2026" -> { start: "2026-09-14", end: "2026-09-15" }
  const MONTHS = ["january","february","march","april","may","june","july",
    "august","september","october","november","december"];
  function parseSessionDate(str) {
    const match = String(str || "").match(/^(\w+)\s+(\d{1,2})(?:\s*-\s*(\d{1,2}))?,\s*(\d{4})$/);
    if (!match) return null;
    const month = MONTHS.indexOf(match[1].toLowerCase());
    if (month < 0) return null;
    const pad = (n) => String(n).padStart(2, "0");
    const year = match[4];
    return {
      start: `${year}-${pad(month + 1)}-${pad(match[2])}`,
      end: `${year}-${pad(month + 1)}-${pad(match[3] || match[2])}`,
    };
  }
  eleventyConfig.addFilter("sessionStart", (str) => (parseSessionDate(str) || {}).start || "");
  eleventyConfig.addFilter("sessionEnd", (str) => (parseSessionDate(str) || {}).end || "");

  // "5h 59m" -> "PT5H59M" for schema.org durations
  eleventyConfig.addFilter("isoDuration", (str) => {
    if (!str) return "";
    const match = String(str).match(/(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?/i);
    if (!match) return "";
    const hours = parseInt(match[1] || 0, 10);
    const minutes = parseInt(match[2] || 0, 10);
    if (!hours && !minutes) return "";
    return `PT${hours ? hours + "H" : ""}${minutes ? minutes + "M" : ""}`;
  });

  // String helpers
  eleventyConfig.addFilter("lower", (str) => {
    return str ? str.toLowerCase() : "";
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
