<?php
/**
 * Template Name: Calendar
 *
 * The template for displaying all blocks
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package dgwltd
 */

get_header();
?>

<div id="primary" class="dgwltd-content-wrapper">

			<div class="entry-header">
				<div class="stack">
						<?php while (have_posts()):
						the_post();
						echo do_blocks(
							'<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->'
						);
					endwhile;
					// End of the loop.
					?>

					</div>
			</div>

			<div class="entry-content is-layout-flow">
					<?php the_content(); ?>
			</div>

			<div class="entry-wrapper">
				<?php get_template_part( 'template-parts/_organisms/calendar' ); ?>
				<script type="module" src="<?php echo get_template_directory_uri(); ?>/dist/js/calendar.min.js"></script>
			</div>


</div><!-- #primary -->
<?php get_footer();
