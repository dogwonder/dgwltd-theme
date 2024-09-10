# DGW.ltd Wordpress theme

## Requirements

| Prerequisite    | How to check | How to install                                  |
| --------------- | ------------ | ----------------------------------------------- |
| PHP >= 8.0    | `php -v`     | [php.net](http://php.net/manual/en/install.php) |
| Node.js >= 12.0 | `node -v`    | [nodejs.org](http://nodejs.org/)                |
| acfpro >= 6.0 |              | [advancedcustomfields.com](https://www.advancedcustomfields.com/pro/)         |

## Build

- `npm run watch` — Compile assets when file changes are made
- `npm run build` — Compile assets for production into dist folder

## Config

- dgwltd_env() - URL of current site
- Math div warning: `$ npm install -g sass-migrator` `$ sass-migrator division **/*.scss`

## Overrides for Framework

This site uses the [GOV.UK design system](https://design-system.service.gov.uk) as the underlying framework. It's used pretty sparingly but userful for [components](https://design-system.service.gov.uk/components/) such as forms and other [layouts](https://design-system.service.gov.uk/styles/layout/)

This is installed via npm `npm install govuk-frontend --save` [see here for more instructions](https://frontend.design-system.service.gov.uk/installing-with-npm/#install-with-node-js-package-manager-npm). [Gov.uk github repo](https://github.com/alphagov/govuk-design-system)

In `vendor.scss` we need to overide the default font family. 

```
$govuk-include-default-font-face: false;
$govuk-focus-colour: #00FFD9;
$govuk-font-family: -apple-system, BlinkMacSystemFont,"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell","Fira Sans", "Droid Sans","Helvetica Neue",sans-serif;
@import "../../node_modules/govuk-frontend/govuk/all.scss";
```

For the Javascript we need to [manually download](https://frontend.design-system.service.gov.uk/install-using-precompiled-files/#install-using-precompiled-files) and update the version as we use a precompiled version of the JS. Place it in the `src/vendor/` folder and update `footer.php`, `move.js` and `sw.njk.js` files to new version name

## Other notable 3rd party integrations
- [Youtube](https://github.com/paulirish/lite-youtube-embed) and [Vimeo](https://github.com/slightlyoff/lite-vimeo) lite plugins (render the video as a screenshot until a user interacts with the video to save bandwidth) -- note we changed the defulat thumbnail size to 1280px `https://i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg`;
- [Fontawesome](https://fontawesome.com)

## Custom typeface (optional)

This theme uses the [Söhne typeface](https://klim.co.nz/collections/soehne/) by Klim Type Foundry, this is a licensed font for use on my own url (dgw.ltd). If you wish to use this on your own website then you will need to [purchase a license](https://klim.co.nz/buy/soehne/). You can remove these form fontFamilies[] in theme.json, functions.php and typography.scss. These fonts are not included in the repo. 

***NOTE*** I've added the `dist/fonts` folder to gitignore so the commerical fonts don't accidentally get committed to this public repo.

## Custom blocks (optional)

These are actived via a custom plugin [dgwltd: Blocks](https://github.com/dogwonder/dgwltd-plugin)

This requires [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/pro/). $$ - but it really is the greatest plugin ever made. 

These are saved in `wp-plugins\dgwltd-blocks\src\acf-json`

- DGW.ltd Accordion - based on GOV.UK's [accordion pattern](https://design-system.service.gov.uk/components/accordion/)
- DGW.ltd Breadcrumbs - based on GOV.UK's [breadcrumbs pattern](https://design-system.service.gov.uk/components/breadcrumbs/) 
- DGW.ltd Call-to-Action - text and image with button (reversible)
- DGW.ltd Cards - grid of cards linking to other pages, title, excerpt and featured image
- DGW.ltd Embed - lite embed custom element for [Youtube](https://github.com/paulirish/lite-youtube-embed) and [Vimeo](https://github.com/slightlyoff/lite-vimeo)
- DGW.ltd Feature - text and background image similar to hero but less showy
- DGW.ltd Hero Section - hero with big image / video as background
- DGW.ltd Related pages - list of related links
- DGW.ltd Summary list - based on GOV.UK's [summary list pattern](https://design-system.service.gov.uk/components/summary-list/) 

## Custom block patterns (experimental / in progress)

Included in the plugin *dgwltd: Blocks* alongside the custom blocks this allows for pre-made collections of blocks, accessible under the 'DGW.ltd' in patterns dropdown

- Layout page
- Lockable content
- FAQs
- Columns - dark
- Columns - light

## Templates

### Blocks template

`template-layout.php` 

For home and gateway pages, allows for full width blocks (e.g. DGW.ltd Hero / DGW.ltd Feature) these can be used in any post or page but would be restricted to a fixed width and look weird. This also removes the page title (can be re-added via a heading block)

### Guide template

`template-guide.php`

Similar to NHS [contents guide](https://www.nhs.uk/conditions/type-2-diabetes/) this allows for a parent / child relationship to be created with all child pages listed with the parent as the first item on a contents list. Allows the user to navigate forwards and backwards through the contents list. 

### Blog template

`template-blog.php`

Blog / posts list template

## Template parts

[Block-Based Template Parts](https://learn.wordpress.org/tutorial/using-block-template-parts-in-classic-themes/) are enabled on this theme, and an example can be founnd in `parts/header.html`

And this can then be included via PHP like so

`<?php block_template_part( 'header' ); ?>`

Additionally the following should be added to theme.json if this feature is going to be used:

```
"templateParts": [
    {
        "name": "my-template-part",
        "title": "Header",
        "area": "header"
    }
]
```

## Tests

To run tests (e.g. AXE)

`npm run tests`
`node_modules/.bin/cypress open`


## Versioning

To increment the version number (used for asset caching)

`npm version patch`