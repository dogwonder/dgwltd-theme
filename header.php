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
$package = json_decode(file_get_contents(get_template_directory() . '/dist/version.json'), true);
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
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/dist/css/main.css<?php echo wp_get_environment_type() !== "development"
    ? '?v=' . $pkgVersion
    : ""; ?>">
<?php wp_head(); ?>
<link rel="shortcut icon" sizes="16x16 32x32 48x48" href="<?php echo get_template_directory_uri(); ?>/dist/images/fav/favicon-128x128.png" type="image/x-icon">
<link rel="apple-touch-icon" href="<?php echo get_template_directory_uri(); ?>/dist/images/fav/favicon-128x128.png">
<meta name="apple-mobile-web-app-title" content="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#000000">
<meta name="view-transition" content="same-origin" />
<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/dist/images/fav/manifest.json">
<?php include(locate_template( 'template-parts/_organisms/meta-tags.php' )) ; ?>
<script defer data-domain="wp.dgw.ltd" src="https://plausible.io/js/script.js"></script>
</head>
<body <?php body_class( 'no-js govuk-frontend-supported' ); ?>>
<script>document.body.className = document.body.className.replace('no-js', 'js-enabled');</script>
<div id="page" class="dgwltd-wrapper">
	<?php include(locate_template( 'template-parts/_layout/masthead.php' )) ; ?>
	<main id="content" class="dgwltd-body">