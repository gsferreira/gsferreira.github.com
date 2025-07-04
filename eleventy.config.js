import { DateTime } from "luxon";

// Plugins
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import embedEverything from "eleventy-plugin-embed-everything";
import pluginRss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {

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
  eleventyConfig.addCollection("courses", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/courses/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Add workshops collection
  eleventyConfig.addCollection("workshops", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/workshops/*.md");
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
