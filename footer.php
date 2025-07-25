<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package dgwltd
 */
$pkgVersion = dgwltd_version();
$theme = wp_get_theme();
$theme_slug = $theme->get_template();
?>
	</main><!-- #content -->
	<?php include(locate_template( 'template-parts/_layout/colophon.php')); ?><!-- #colophon -->
</div><!-- #page -->
<?php include(locate_template( 'template-parts/_molecules/sprite.php' )); ?>
<?php wp_footer(); ?>
<script type="module" src="<?php echo get_template_directory_uri(); ?>/dist/js/app.min.js"></script>
<script type="module">
  if (!window._govukFrontendInitialized) {
    import('<?php echo get_template_directory_uri(); ?>/dist/js/govuk-frontend-5.11.0.min.js')
      .then(({ initAll }) => {
        initAll();
        window._govukFrontendInitialized = true;
      })
      .catch(error => {
        console.error('Error loading govuk-frontend:', error);
      });
  }
</script>
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js?<?php echo $pkgVersion ?>').then(function(registration) {
        // Successfully registered the Service Worker
        //console.log('Service Worker registration successful with scope: ', registration.scope);
      }).catch(function(err) {
        // Failed to register the Service Worker
        //console.log('Service Worker registration failed: ', err);
      });
    });
  }
</script>
<script type="speculationrules">
  {
    "prefetch": [
      {
        "where": {
          "selector_matches": "[data-prefetch]"
        },
        "eagerness": "immediate"
      },
      {
        "where": {
          "and": [
            { "href_matches": "^/.*" },
            { "not": {
                "href_matches": [
                  "\/wp-*.php",
                  "\/wp-admin\/*",
                  "\/wp-content\/uploads\/*",
                  "\/wp-content\/*",
                  "\/wp-content\/plugins\/*",
                  "\/wp-content\/themes\/<?php echo sanitize_title($theme_slug); ?>\/*",
                  "\/*\\?(.+)"
                ]
              }
            },
            {
            "not": {
                "selector_matches": "a[rel~=\"nofollow\"]"
              }
            },
            {
            "not": {
                "selector_matches": ".no-prefetch, .no-prefetch a"
              }
            }
          ]
        },
        "eagerness": "moderate"
      }
    ],
    "prerender": [
      {
        "where": {
          "selector_matches": "[data-prefetch=prerender]"
        },
        "eagerness": "immediate"
      },
      {
        "where": {
          "selector_matches": "[data-prefetch]"
        },
        "eagerness": "moderate"
      }
    ]
  }
</script>
</body>
</html>