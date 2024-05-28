<?php
/**
 * Template part for displaying results in search pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package dgwltd
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'dgwltd-list__item' ); ?> itemscope itemtype="http://schema.org/BlogPosting">

	<div class="entry-header">
			<?php the_title( '<h2 class="wp-block-post-title dgwltd-list__title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
			<div class="entry-meta dgwltd-list__meta">
				<?php dgwltd_posted_on(); ?>
			</div><!-- .entry-meta -->
	</div><!-- .entry-header -->
	
	<div class="entry-content stack dgwltd-list__wrapper">        

		<div class="dgwltd-list__content">
				<?php
				// Display the excerpt is exists
				if ( has_excerpt( $post->ID ) ) {
					echo esc_html( get_the_excerpt( $post->ID ) );
				} else {
					echo esc_html( dgwltd_standfirst( 80, $post->ID ) );
				}
				?>
		</div><!-- /content-->   

	 </div><!-- /wrapper-->   

</article><!-- #post-<?php the_ID(); ?> -->
