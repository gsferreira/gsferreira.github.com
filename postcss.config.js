const purgecss = require("@fullhuman/postcss-purgecss")({
  content: [
    "./src/**/*.js",
    "./src/**/*.njk",
    "./src/**/*.md",
    "./src/**/*.html",
  ],
  whitelist: ["dark-mode"],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
