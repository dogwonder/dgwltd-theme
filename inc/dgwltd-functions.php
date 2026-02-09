<?php
/**
 * Custom functions for this theme
 *
 * @package dgwltd
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
if ( ! function_exists( 'dgwltd_body_classes' ) ) :
	function dgwltd_body_classes( $classes ) {
		// Adds a class of hfeed to non-singular pages.

		global $post;

		//Add root namespace class to all pages
		$classes[] = 'dgwltd';

		if ( ! is_singular() ) {
			$classes[] = 'hfeed';
		}

		// Adds a class of no-sidebar when there is no sidebar present.
		if ( ! is_active_sidebar( 'sidebar-1' ) ) {
			$classes[] = 'no-sidebar';
		}



		return $classes;
	}
	add_filter( 'body_class', 'dgwltd_body_classes' );
endif;

/*
 * Add role="list" to all registered menus
 *
 * @access public
 */
if ( ! function_exists( 'wcag_nav_menu_add_role_list' ) ) :
    function wcag_nav_menu_add_role_list( $nav_menu, $args ) {
        // Get all registered menu locations dynamically
        $registered_menus = array_keys( get_registered_nav_menus() );
        
        // Target only registered menu locations
        if ( ! isset( $args->theme_location ) || ! in_array( $args->theme_location, $registered_menus ) ) {
            return $nav_menu;
        }

        // Bail early if the class doesn't exist (WP < 6.2)
        if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
            return $nav_menu;
        }

        $processor = new WP_HTML_Tag_Processor( $nav_menu );

        // Add 'role="list"' to the first <ul> element
        if ( $processor->next_tag( 'ul' ) ) {
            $processor->set_attribute( 'role', 'list' );
        }

        return (string) $processor;
    }
    add_filter( 'wp_nav_menu', 'wcag_nav_menu_add_role_list', 10, 2 );
endif;

/**
 * WCAG 2.0 Attributes for Dropdown Menus
 *
 * Adjustments to menu attributes tot support WCAG 2.0 recommendations
 * for flyout and dropdown menus.
 *
 * @ref https://www.w3.org/WAI/tutorials/menus/flyout/
 */
if ( ! function_exists( 'wcag_nav_menu_link_attributes' ) ) :
	function wcag_nav_menu_link_attributes( $atts, $item, $args, $depth ) {

		// Add [aria-haspopup] and [aria-expanded] to menu items that have children
		$item_has_children = in_array( 'menu-item-has-children', $item->classes );
		if ( $item_has_children ) {
			$atts['aria-haspopup'] = 'true';
			$atts['aria-expanded'] = 'false';
		}

		return $atts;
	}
	add_filter( 'nav_menu_link_attributes', 'wcag_nav_menu_link_attributes', 10, 4 );
endif;

/*
 * Add hidden attribute to submenus
 *
 * @access public
 */
if ( ! function_exists( 'wcag_nav_menu_add_hidden_to_submenus' ) ) :
	function wcag_nav_menu_add_hidden_to_submenus( $nav_menu, $args ) {
		// Target only specific menu locations (optional)
		if ( ! isset( $args->theme_location ) || $args->theme_location !== 'primary' ) {
			return $nav_menu;
		}

		// Bail early if the class doesn't exist (WP < 6.2)
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $nav_menu;
		}

		$processor = new WP_HTML_Tag_Processor( $nav_menu );

		// Add 'hidden' to all <ul> elements with the sub-menu class
		while ( $processor->next_tag( 'ul' ) ) {
			$class = $processor->get_attribute( 'class' );
			if ( strpos( $class, 'sub-menu' ) !== false ) {
				$processor->set_attribute( 'hidden', true );
			}
		}

		return (string) $processor;
	}
	add_filter( 'wp_nav_menu', 'wcag_nav_menu_add_hidden_to_submenus', 10, 2 );
endif;


/**
 * Add Speculation Rules to the menu - https://csswizardry.com/2024/12/a-layered-approach-to-speculation-rules/
*/
if ( ! function_exists( 'dgwltd_speculation_rules' ) ) :
    function dgwltd_speculation_rules( $item_output, $item, $depth, $args ) {

		if ( 'primary' === $args->theme_location ) {

			$tags = new WP_HTML_Tag_Processor( $item_output );

			// Top-level links: data-prefetch="prerender" → immediate prefetch + immediate prerender
			// Sub-menu links: data-prefetch="" → immediate prefetch + moderate prerender (hover ~200ms)
			// Speculation rules JSON lives in footer.php
			if ( $item->menu_item_parent == 0 ) {
				$tags->next_tag( 'a' );
				$tags->set_attribute( 'data-prefetch', 'prerender' );
			} else {
				$tags->next_tag( 'a' );
				$tags->set_attribute( 'data-prefetch', '' ); // Add the attribute without a value
			}

			return $tags->get_updated_html();
		}

		return $item_output;

    }
    add_filter( 'walker_nav_menu_start_el', 'dgwltd_speculation_rules', 10, 4 );
endif;

//Disable core speculation rules
add_filter(
    'wp_speculation_rules_configuration',
    function ( $config ) {
        // Returning null disables all speculative loading rules.
        return null;
    }
);

/*
 * Exclude Uncategorized from get_the_category_list function.
 *
 * @access public
 */
function dgwltd_the_category_filter( $thelist, $separator = ' ' ) {
	if ( ! defined( 'WP_ADMIN' ) ) {
		$exclude = array( 1 );

		$exclude2 = array();
		foreach ( $exclude as $c ) {
			$exclude2[] = get_cat_name( $c );
		}

		$cats    = explode( $separator, $thelist );
		$newlist = array();
		foreach ( $cats as $cat ) {
			$catname = trim( wp_strip_all_tags( $cat ) );
			if ( ! in_array( $catname, $exclude2 ) ) {
				$newlist[] = $cat;
			}
		}
		return implode( $separator, $newlist );
	} else {
		return $thelist;
	}
}
add_filter( 'the_category', 'dgwltd_the_category_filter', 10, 2 );

// Callable for usort. Sorts the array based on the 'date' array value - using spaceship operator <=> PHP 7+
if ( ! function_exists( 'dgwltd_sort_dates' ) ) :
	function dgwltd_sort_dates( $a, $b ) {

		// order by date (closest first) - php 7
		return new DateTime( $a['start'] ) <=> new DateTime( $b['start'] );

	}
endif;

if ( ! function_exists( 'dgwltd_generate_color_palette_tints' ) ) :
	function dgwltd_generate_color_palette_tints( $block = null ) {

		//CSS Relative Colors - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors

		$color_palette_array = [];

		$settings = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();

		// Process color palette
		if (isset($settings["color"]["palette"]["theme"])) {
			foreach ($settings["color"]["palette"]["theme"] as $color) {
				$color_palette_array[] = [
					"slug" => $color["slug"],
					"color" => $color["color"],
				];
			}
		}
		
		// Generate CSS variables
		$css_vars = '';

		//10% increments
		// foreach ($color_palette_array as $color) {
		// 	$slug = $color['slug'];
		// 	$hex = $color['color'];
		// 	for ($i = 1; $i <= 10; $i++) {
		// 		$tint = $i * 0.1;
		// 		$css_vars .= "--color-{$slug}-tint-{$i}0: rgb(from var(--wp--preset--color--{$slug}) r g b / {$tint});\n";
		// 	}
		// }

		//25% and 50%
		foreach ($color_palette_array as $color) {
			$slug = $color['slug'];
			$hex = $color['color'];
			$css_vars .= "--color-{$slug}-tint-25: rgb(from var(--wp--preset--color--{$slug}) r g b / 0.75);\n";
			$css_vars .= "--color-{$slug}-tint-50: rgb(from var(--wp--preset--color--{$slug}) r g b / 0.5);\n";
		}

		//Enqueue the CSS variables
		wp_add_inline_style('dgwltd-style', ":root {\n{$css_vars}}");

}
// add_action('wp_enqueue_scripts', 'dgwltd_generate_color_palette_tints');
endif;

if ( ! function_exists( 'dgwltd_version' ) ) :
	function dgwltd_version() {
		//Get version value from package.json
		$versionData = wp_remote_get(get_template_directory_uri() . '/dist/version.json');
		if (is_wp_error($versionData)) {
			$pkgVersion = '0.0.1';
		} else {
			$versionContents = wp_remote_retrieve_body($versionData);
			$package = json_decode($versionContents, true);
			$pkgVersion = $package['version'] ?? '0.0.1';
		}
		return $pkgVersion;
	}
endif;
