//Plugins 
const { EleventyRenderPlugin } = require("@11ty/eleventy");

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

module.exports = config => { 

  config.addPassthroughCopy({"src/images": "images"});
  config.addPassthroughCopy({"src/scripts": "js"});
  config.addPassthroughCopy({"src/vendor": "js"});
  config.addPassthroughCopy({"src/fonts": "fonts"});

  //Plugins 
  config.addPlugin(EleventyRenderPlugin);

  //Get the current year
  config.addShortcode('year', () => `${new Date().getFullYear()}`);

  //Get package version
  config.addShortcode('pkgVersion', () => `${require('./package.json').version}`);

  //Get current Unix timestamp
  config.addShortcode('timestamp', () => `${Date.now()}`);

  // Open the browser on launch
  config.setBrowserSyncConfig({
    open: true
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

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
      input: 'src',
      output: 'dist'
    }
  };

};