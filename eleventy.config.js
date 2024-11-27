import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";

//Other plugins and utils
import dayjs from 'dayjs';
import { readFile } from 'fs/promises';
import pluginFilters from "./src/11ty/_config/filters.js";
import { calculateClamp } from './src/utils/utopia.js';

const isProduction = process.env.NODE_ENV === 'production';
const buildPath = isProduction ? '/wp-content/themes/dgwltd/dist/' : '/';

export default async function(eleventyConfig) {

  // Define the base URL for images
  const imageBaseUrl = isProduction
    ? "http://dev.wp.dgw.ltd/wp-content/themes/dgwltd/dist/"
    : "/";
  
  eleventyConfig.addGlobalData("imageBaseUrl", imageBaseUrl);

  // Passthrough options
  eleventyConfig.addPassthroughCopy({"src/assets/fonts": "fonts"});
  eleventyConfig.addPassthroughCopy({"src/assets/icons/": "icons"});
  eleventyConfig.addPassthroughCopy({"src/assets/images/": "images"});
  eleventyConfig.addPassthroughCopy({"src/assets/scripts/": "js"});
  eleventyConfig.addPassthroughCopy({"src/vendor/js/": "js"});
  eleventyConfig.addPassthroughCopy({"src/vendor/css/": "css"});

  //Get package version
  const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
  eleventyConfig.addShortcode('pkgVersion', () => `${packageJson.version}`);

  // Read and parse the WP theme.json file
  const themeJSON = JSON.parse(await readFile(new URL('./theme.json', import.meta.url)));

  // Add theme settings to Eleventy global data
  eleventyConfig.addGlobalData('theme', themeJSON);

  //Get current Unix timestamp
  eleventyConfig.addShortcode('timestamp', () => `${Date.now()}`);

  // Add date filter
  eleventyConfig.addFilter('date', (date, dateFormat) => {
    return dayjs(date).format(dateFormat);
  });

  // Add a custom filter to hyphenate values like xl, 2xl, 3xl, etc.
  eleventyConfig.addNunjucksFilter('hyphenate', (value) => {
    return value.replace(/(\d*)(xl|xs)/g, (match, p1, p2) => {
      return p1 ? `${p1}-${p2}` : `${p2}`;
    });
  });

  // Add a custom filter to remove 'rem' and multiply by 16
  eleventyConfig.addNunjucksFilter('remToPx', (value) => {
    const numericValue = parseFloat(value.replace('rem', ''));
    return numericValue * 16;
  });

  eleventyConfig.addNunjucksTag('clamp', function (nunjucksEngine) {
    class ClampTag {
      constructor() {
        this.tags = ['clamp'];
      }
  
      // Parsing function for custom tag
      parse(parser, nodes) {
        const tok = parser.nextToken(); // Get the current token
        const args = parser.parseSignature(null, true); // Parse arguments
        parser.advanceAfterBlockEnd(tok.value); // Move parser forward
        return new nodes.CallExtension(this, 'run', args); // Call the "run" method
      }
  
      // Execution function for the custom tag
      run(context, minWidth, maxWidth, minSize, maxSize, usePx = false, relativeTo = 'viewport') {
        try {
          // Validate arguments
          if (isNaN(minWidth) || isNaN(maxWidth) || isNaN(minSize) || isNaN(maxSize)) {
            throw new Error('Invalid numeric values passed to clamp tag.');
          }
          if (minWidth >= maxWidth) {
            throw new Error('minWidth must be less than maxWidth.');
          }
          if (minSize === maxSize) {
            throw new Error('minSize and maxSize cannot be equal.');
          }
  
          return calculateClamp({ minWidth, maxWidth, minSize, maxSize, usePx, relativeTo });
        } catch (error) {
          console.error('Error in clamp tag:', error.message);
          return ''; // Return empty string to avoid breaking the template
        }
      }
    }
  
    return new ClampTag();
  });

  //Get the current year
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  //Get build date
  eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

  //Add bundler bundles
  eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});

  eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});

  // Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Filters
	eleventyConfig.addPlugin(pluginFilters);
  

  eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

  // eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
	// 	// which file extensions to process
	// 	extensions: "html",

	// 	// optional, output image formats
	// 	formats: ["webp", "avif", "jpeg"],
	// 	// formats: ["auto"],

	// 	// optional, output image widths
	// 	// widths: ["auto"],

	// 	// optional, attributes assigned on <img> override these values.
	// 	defaultAttributes: {
	// 		loading: "lazy",
	// 		decoding: "async",
	// 	},
	// });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false)

};

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk
  templateFormats: [
    "md",
    "njk"
  ],

  // baseUrl: isDevelopment ? 'localhost:8080' : 'http://dev.wp.dgw.ltd/wp-content/themes/dgwltd/dist/', 

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: "njk",

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: "njk", 

  // These are all optional:
  dir: {
		input: "src/11ty",          // default: "."
		includes: "_includes",  // default: "_includes" (`input` relative)
		data: "_data",          // default: "_data" (`input` relative)
		output: "dist"       
	},

  // -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	pathPrefix: buildPath,

}