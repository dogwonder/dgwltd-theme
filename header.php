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
$pkgVersion = dgwltd_version();
?>
<!doctype html>
<html <?php language_attributes(); ?> >
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="preconnect" href="<?php echo esc_url( site_url() ); ?>" crossorigin>
<link rel="preconnect" href="//plausible.io" crossorigin>
<link rel="preload" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/fonts/soehne/soehne-dreiviertelfett.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/fonts/soehne/soehne-halbfett.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/fonts/soehne/soehne-kraftig.woff2" as="font" type="font/woff2" crossorigin>
<link rel="profile" href="https://gmpg.org/xfn/11">
<?php include(locate_template( 'template-parts/_organisms/obs.php' )) ; ?>
<link rel="stylesheet" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/css/main.css<?php echo wp_get_environment_type() !== "development"
    ? '?v=' . $pkgVersion
    : ""; ?>">
<?php wp_head(); ?>
<link rel="icon" type="image/svg+xml" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/icons/fav/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/icons/fav/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/icons/fav/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/icons/fav/favicon-180x180.png">
<link rel="manifest" href="<?php echo esc_url( get_template_directory_uri() ); ?>/dist/icons/fav/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
<meta name="theme-color" content="#000000">
<meta name="view-transition" content="same-origin" />
<?php include(locate_template( 'template-parts/_organisms/meta.php' )) ; ?>
<?php include(locate_template( 'template-parts/_organisms/schema.php' )) ; ?>
<script defer data-domain="dgw.ltd" src="https://plausible.io/js/script.js"></script>
</head>
<body <?php body_class( 'no-js' ); ?>>
<script>document.body.className = document.body.className.replace('no-js', 'js-enabled govuk-frontend-supported');</script>
<div id="page" class="dgwltd-wrapper">
	<?php include(locate_template( 'template-parts/_layout/masthead.php' )) ; ?>
	<main id="content" class="dgwltd-body">
        <div id="sentinel" aria-hidden="true"></div>
        