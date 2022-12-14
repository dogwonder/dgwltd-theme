<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package dgwltd
 */

//Get version value from package.json
$package = json_decode(file_get_contents(get_template_directory() . '/package.json'), true);
$pkgVersion = $package['version'];
?>
<!doctype html>
<html <?php language_attributes(); ?> >
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title><?php bloginfo( 'name' ); ?> &ndash; <?php is_front_page() ? bloginfo( 'description' ) : wp_title( '' ); ?></title>
<link rel="preconnect" href="<?php echo esc_url( site_url() ); ?>" crossorigin>
<link rel="preconnect" href="//plausible.io" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri() ?>/dist/fonts/soehne/soehne-halbfett.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri() ?>/dist/fonts/soehne/soehne-kraftig.woff2" as="font" type="font/woff2" crossorigin>
<link rel="profile" href="https://gmpg.org/xfn/11">
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/dist/css/main.css?v=<?php echo (dgwltd_env('dev') ? $pkgVersion : ''); ?>">
<?php wp_head(); ?>
<link rel="shortcut icon" sizes="16x16 32x32 48x48" href="<?php echo get_template_directory_uri(); ?>/dist/images/fav/favicon-128x128.png" type="image/x-icon">
<link rel="apple-touch-icon" href="<?php echo get_template_directory_uri(); ?>/dist/images/fav/favicon-128x128.png">
<meta name="apple-mobile-web-app-title" content="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
<meta name="theme-color" content="#000000">
<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/dist/images/fav/manifest.json">
<script defer data-domain="dgw.ltd" src="https://plausible.io/js/plausible.js"></script>
<?php
$site_description           = esc_attr( get_bloginfo( 'description', 'display' ) );
$dgwltd_meta['title']       = 'DGW.ltd - ' . $post->post_title ?? '';
$dgwltd_meta['description'] = strip_shortcodes( wp_trim_words( get_post_field( 'post_content', $post ), 20 ) );
$dgwltd_meta['description'] = rtrim( str_replace( '&hellip;', '', $dgwltd_meta['description'] ), '' );
if ( has_post_thumbnail() ) {
	$image                = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'dgwltd-social-image' );
	$dgwltd_meta['image'] = $image[0];
}
if ( ! is_single() || empty( $dgwltd_meta['image'] ) ) {
	$dgwltd_meta['image'] = get_template_directory_uri() . '/dist/images/og/og-image.png';
}
if ( ! is_single() && ! is_page() || empty( $dgwltd_meta['title'] ) ) {
	$dgwltd_meta['title'] = strip_shortcodes( esc_attr( get_bloginfo( 'name' ) ) );
}
if ( ! is_single() && ! is_page() || empty( $dgwltd_meta['description'] ) ) {
	$dgwltd_meta['description'] = strip_shortcodes( esc_attr( get_bloginfo( 'description' ) ) );
}
if ( is_search() || is_404() ) {
	$dgwltd_meta['url'] = esc_url( site_url() );
} else {
	$dgwltd_meta['url'] = esc_url( get_the_permalink( $post->ID ) );
}
?>
<meta name="description" content="<?php echo esc_attr( $dgwltd_meta['description'] ); ?>">
<meta property="og:title" content="<?php echo esc_attr( $dgwltd_meta['title'] ); ?>">
<meta property="og:description" content="<?php echo esc_attr( $dgwltd_meta['description'] ); ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image" content="<?php echo $dgwltd_meta['image']; ?>">
<meta property="og:url" content="<?php echo $dgwltd_meta['url']; ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo esc_attr( $dgwltd_meta['title'] ); ?>">
<meta name="twitter:description" content="<?php echo esc_attr( $dgwltd_meta['description'] ); ?>">
<meta name="twitter:image" content="<?php echo $dgwltd_meta['image']; ?>">
</head>
<body <?php body_class( 'no-js' ); ?>>
<script>document.body.className = document.body.className.replace('no-js', 'js-enabled');</script>
<div id="page" class="dgwltd-wrapper">
	<?php include(locate_template( 'template-parts/_layout/masthead.php' )) ; ?>
	<main id="content" class="dgwltd-container">
