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
		<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
	</div><!-- .entry-header -->
	<?php else : ?>
	<div class="entry-header visually-hidden">
		<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
	</div><!-- .entry-header -->
	<?php endif; ?>
	
	<?php echo do_blocks( '<!-- wp:post-content /-->' ); ?>

</article><!-- #post-<?php the_ID(); ?> -->