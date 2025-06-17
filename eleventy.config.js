export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setServerOptions({
    watch: ['_site/**/*.css'],
  });

  return {
    dir: {
      input: 'src',
    },
  };
};
