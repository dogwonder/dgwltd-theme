<?php
/**
 * Template Name: WordPress Abilities API
 *
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package dgwltd
 */

get_header();


?>
<div id="primary" class="dgwltd-content-wrapper">


	<?php
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/_templates/content-page' );
	endwhile; // End of the loop.
	?>
	
	<div class="entry-wrapper">

		<?php 
		function dgwltd_search_posts( $keyword ) {
			$ability = wp_get_ability( 'dgwltd/filter-posts' );

			if ( ! $ability ) {
				return new WP_Error( 'ability_not_found', 'Filter posts ability not available' );
			}

			$result = $ability->execute( array(
				'keyword'  => $keyword,
				'per_page' => 20,
			) );

			if ( is_wp_error( $result ) ) {
				return $result;
			}

			return $result['posts'];
		}
		$posts = dgwltd_search_posts( 'wordpress' );
		
		foreach ( $posts as $post ) {
			echo sprintf(
				'<h2><a href="%s">%s</a></h2>',
				esc_url( $post['permalink'] ),
				esc_html( $post['title'] )
			);
		}
		?>
		
	</div>

</div><!-- #primary -->
<?php
get_footer();
