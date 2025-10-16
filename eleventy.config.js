import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import fontAwesomePlugin from "@11ty/font-awesome";
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import pluginWebc from "@11ty/eleventy-plugin-webc";

//Other plugins and utils
import { readFile } from 'fs/promises';
import pluginFilters from "./src/11ty/_config/filters.js";
import pluginShortcodes from "./src/11ty/_config/shortcodes.js";
import pluginTransform from "./src/11ty/_config/transform.js";

const isProduction = process.env.NODE_ENV === 'production';
const buildPath = isProduction ? '/wp-content/themes/dgwltd-theme/dist/' : '/';

export default async function(eleventyConfig) {

  // Define the base URL for images
  // Use environment variable for production URL or fallback to default
  const siteUrl = process.env.WP_SITE_URL || 'http://wp.dgw.ltd';
  const imageBaseUrl = isProduction
    ? `${siteUrl}/wp-content/themes/dgwltd-theme/dist/`
    : "/";

  eleventyConfig.addGlobalData("imageBaseUrl", imageBaseUrl);

  // Passthrough options
  eleventyConfig.addPassthroughCopy({"src/assets/fonts": "fonts"});
  eleventyConfig.addPassthroughCopy({"src/assets/icons/": "icons"});
  eleventyConfig.addPassthroughCopy({"src/assets/images/": "images"});
  eleventyConfig.addPassthroughCopy({"src/vendor/js/": "js"});
  eleventyConfig.addPassthroughCopy({"src/vendor/css/": "css"});

  //Get package version
  const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
  eleventyConfig.addShortcode('pkgVersion', () => `${packageJson.version}`);

  // Read and parse the WP theme.json file
  const themeJSON = JSON.parse(await readFile(new URL('./theme.json', import.meta.url)));

  // Add theme settings to Eleventy global data
  eleventyConfig.addGlobalData('theme', themeJSON);
  
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
  eleventyConfig.addPlugin(fontAwesomePlugin);
  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/11ty/_components/**/*.webc",
    useTransform: true,
    globalData: true
  });
  
  // The Id Attribute plugin adds id attributes to headings on your page
  eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy's built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: 'md',
    // optional, output image formats
    formats: ['jpg', 'webp', "avif"],
    // optional, output image widths
    widths: ['auto', 400, 800],
    urlPath: "/images/", 
    outputDir: "./dist/images/",
    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
        loading: 'lazy',
        sizes: '100vw',
        decoding: 'async',
    },
  });

  //My plugins
  eleventyConfig.addPlugin(pluginFilters);
  eleventyConfig.addPlugin(pluginShortcodes);
  eleventyConfig.addPlugin(pluginTransform);

  // Use .eleventyignore exclusively for build control (not .gitignore)
  // This allows more precise control over what 11ty processes vs what git tracks
  eleventyConfig.setUseGitIgnore(false);

};

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk
  templateFormats: [
    "md",
    "html",
    "njk"
  ],

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