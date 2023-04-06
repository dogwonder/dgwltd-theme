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



if ( ! function_exists( 'dgwltd_acf_color_palette' ) ) :
	function dgwltd_acf_color_palette() {
	
		// create color palette array
		$color_palette = [];
		// check if theme.json is being used and if so, grab the settings
		if ( class_exists( 'WP_Theme_JSON_Resolver' ) ) {
			$settings = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();
	
			// full theme color palette
			if ( isset( $settings['color']['palette']['theme'] ) ) {
				$color_palette = $settings['color']['palette']['theme'];
			}
		}
		if( ! empty( $color_palette ) ) {
		?>
		<script type="text/javascript">
		(function($) {
			acf.add_filter('color_picker_args', function( args, $field ){
				args.palettes = [
					<?php
					foreach ( $color_palette as $color ) {
						echo '"' . $color['color'] . '",';
					}
					?>
				]
				return args;
			});
		})(jQuery);
		</script>
	<?php 
		}
	}
	add_action('acf/input/admin_footer', 'dgwltd_acf_color_palette');
	endif;