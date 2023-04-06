<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package dgwltd
 */
//Create object to avoid errors
$post = new stdClass();
//Set post ID to 0 to avoid errors
$post->ID = 0;
//Set post title to 404 to avoid errors
$post->post_title = '404';
get_header();
?>
<div id="primary" class="dgwltd-content-wrapper">

	<div class="entry-header">
		<h1 class="wp-block-post-title"><?php esc_html_e( '404, page not found', 'dgwltd' ); ?></h1>
	</div>

	<div class="entry-content error-404 not-found">
		<p><?php esc_html_e( 'There may be an error in the link you followed to get here. ', 'dgwltd' ); ?></p>
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'menu_id'        => 'primary-nav',
				'menu_class'     => 'dgwltd-menu-404',
				'container'      => false,
			)
		);
		?>
	</div><!-- .error-404 -->

</div><!-- #primary -->
<?php
get_footer();
