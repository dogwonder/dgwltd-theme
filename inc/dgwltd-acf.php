<?php
/**
 * ACF functionality
 *
 * @package dgwltd
 */
if ( function_exists( 'acf_add_options_page' ) ) {
	acf_add_options_page(
		array(
			'page_title' => 'Site General Settings',
			'menu_title' => 'Site Settings',
			'menu_slug'  => 'site-general-settings',
			'capability' => 'edit_posts',
			'redirect'   => false,
		)
	);
}


if ( ! function_exists( 'rnid_acf_color_palette' ) ) :
function rnid_acf_color_palette() {
?>
	<script type="text/javascript">
	(function($) {
		acf.add_filter('color_picker_args', function( args, $field ){
			args.palettes = ['#0095a3', '#fe9f97', '#fbae17', '#0d0f05', '#f1f2f0', '#e0e5db']
			return args;
		});
	})(jQuery);
	</script>
<?php }
add_action('acf/input/admin_footer', 'rnid_acf_color_palette');
endif;