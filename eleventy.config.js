const dayjs = require('dayjs');

module.exports = async function(eleventyConfig) {

  const {EleventyRenderPlugin} = await import("@11ty/eleventy");

  eleventyConfig.addPassthroughCopy({"src/images": "images"});
  eleventyConfig.addPassthroughCopy({"src/fonts": "fonts"});
  eleventyConfig.addPassthroughCopy({"src/scripts": "js"});
  eleventyConfig.addPassthroughCopy({"src/vendor": "js"});
  eleventyConfig.addPassthroughCopy({"src/wp": "css"});

  //Get package version
  eleventyConfig.addShortcode('pkgVersion', () => `${require('./package.json').version}`);

  //Get current Unix timestamp
  eleventyConfig.addShortcode('timestamp', () => `${Date.now()}`);

  // Add date filter
  eleventyConfig.addFilter('date', (date, dateFormat) => {
    return dayjs(date).format(dateFormat);
  });

  //Get the current year
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  //Add bundler bundles
  eleventyConfig.addBundle("css");

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);

  return {

    // Control which files Eleventy will process
    // e.g.: *.md, *.njk
    templateFormats: [
      "md",
      "njk"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk"

  };

};

module.exports.config = {
  dir: {
    input: 'src/11ty',
      output: 'dist'
  }
}