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

?>
	</main><!-- #content -->
	<?php include(locate_template( 'template-parts/_layout/colophon.php')); ?><!-- #colophon -->
</div><!-- #page -->
<?php include(locate_template( 'template-parts/_molecules/sprite.php' )); ?>
<?php wp_footer(); ?>
<script type="module" src="<?php echo get_template_directory_uri(); ?>/dist/js/app.min.js"></script>
<script type="module">
  if (!window._govukFrontendInitialized) {
    import('<?php echo get_template_directory_uri(); ?>/dist/js/govuk-frontend-5.7.1.min.js')
      .then(({ initAll }) => {
        initAll();
        window._govukFrontendInitialized = true;
      })
      .catch(error => {
        console.error('Error loading govuk-frontend:', error);
      });
  }
</script>
<script type=speculationrules>
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
            { "href_matches": "/*" },
            { "not": {"href_matches": "/wp-admin"}},
            { "not": {"selector_matches": "[rel~=nofollow]"}}
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