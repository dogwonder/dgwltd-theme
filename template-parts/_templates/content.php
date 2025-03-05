<?php
/**
 * Template part for displaying posts
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
<article id="post-<?php the_ID(); ?>" <?php post_class( 'dgwltd-post stack' ); ?> itemscope itemtype="http://schema.org/BlogPosting">
	
	<?php if ( ! $hidden_title ) : ?>
		<div class="entry-header">
			<hgroup>
				<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
				<?php if ( 'post' === get_post_type() ) : ?>
				<p class="entry-meta"><?php dgwltd_posted_on(); ?></p><!-- .entry-meta -->
				<?php endif; ?>
			<hgroup>
		</div><!-- .entry-header -->
		
	<?php else : ?>
		<div class="entry-header visually-hidden">
			<?php echo do_blocks( '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->' ); ?>
		</div><!-- .entry-header -->	
	<?php endif; ?>


	<?php echo do_blocks( '<!-- wp:post-content /-->' ); ?>

	<div class="entry-footer">
	<?php
	$categories_list = get_the_category_list( esc_html__( ', ', 'dgwltd' ) );
	if ( $categories_list ) {
		/* translators: 1: list of categories. */
		printf( '<span class="tag">' . esc_html__( '%1$s', 'dgwltd' ) . '</span>', $categories_list ); // WPCS: XSS OK.
	}
	?>
	</div><!-- .entry-content -->

	<?php if ( comments_open() || get_comments_number() ) : ?>
	<div class="entry-comments">
		<?php comments_template(); ?>
	</div>
	<?php endif; ?>
	
</article><!-- #post-<?php the_ID(); ?> -->
