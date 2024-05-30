//Plugins 
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
const dayjs = require('dayjs');

module.exports = eleventyConfig => { 

  eleventyConfig.addPassthroughCopy({"src/images": "images"});
  eleventyConfig.addPassthroughCopy({"src/scripts": "js"});
  eleventyConfig.addPassthroughCopy({"src/vendor": "js"});
  eleventyConfig.addPassthroughCopy({"src/fonts": "fonts"});

  //Plugins 
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(bundlerPlugin);

  //Get the current year
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  //Get package version
  eleventyConfig.addShortcode('pkgVersion', () => `${require('./package.json').version}`);

  //Get current Unix timestamp
  eleventyConfig.addShortcode('timestamp', () => `${Date.now()}`);

  //Get random ID
  eleventyConfig.addShortcode('randomId', () => `${Math.random().toString(36).substr(2, 9)}`);

  // Add date filter
  eleventyConfig.addFilter('date', (date, dateFormat) => {
    return dayjs(date).format(dateFormat);
  });

  //Add nunjucks filters
  // {%- if size.slug | contains('xs') or size.slug | contains('xl') %}
  eleventyConfig.addNunjucksFilter("contains", function(str, substr) {
    if (typeof str === 'string') {
        return str.includes(substr);
    }
    return false;
  });

  // {{ size.slug | formatSlug }}:
  eleventyConfig.addNunjucksFilter("formatSlug", function(slug) {
    if (typeof slug === 'string') {
        return slug.replace(/(\d)(xs|xl)/g, '$1-$2');
    }
    return slug;
  });

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
    htmlTemplateEngine: "njk",

    dir: {
      input: 'src/11ty',
      output: 'dist'
    }
  };

};