<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package dgwltd
 */

?>
<?php
// Hide title via custom field
if ( class_exists( 'acf' ) ) {
	$hidden_title = get_field( 'hide_title' );
}
?>
<article id="post-<?php the_ID(); ?>" <?php post_class('dgwltd-page'); ?>>

	<?php if ( ! $hidden_title ) : ?>
	<div class="entry-header">
		<?php //the_title( '<h1 class="wp-block-post-title">', '</h1>' ); ?>
		<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
	</div><!-- .entry-header -->
	<?php else : ?>
	<div class="entry-header visually-hidden">
		<?php //the_title( '<h1 class="wp-block-post-title">', '</h1>' ); ?>
		<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
	</div><!-- .entry-header -->
	<?php endif; ?>
	
	<div class="entry-content is-layout-flow">
		<?php the_content(); ?>
	</div>

</article><!-- #post-<?php the_ID(); ?> -->