<?php
/**
 * Template Name: Search page
 *
 * The template for displaying the search results
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package dgwltd
 */

get_header();
?>
<div id="primary" class="dgwltd-content-wrapper">
	<article class="entry-content is-layout-flow">
		<?php //the_title( '<h1 class="wp-block-post-title" itemprop="headline">', '</h1>' ); ?>
		<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
		<div id="search-form" class="site-search">
			<?php echo do_blocks( '<!-- wp:search {"label":"Search","showLabel":false,"width":100,"widthUnit":"%","buttonText":"Search","buttonUseIcon":true} /-->' ); ?>
		</div>
	</article>
</div><!-- #primary -->
<?php
get_footer();
