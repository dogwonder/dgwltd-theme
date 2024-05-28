<?php
$site_description           = esc_attr( get_bloginfo( 'description', 'display' ) );
$dgwltd_meta['title']       = 'DGW.ltd - ' . $post->post_title ?? '';
$dgwltd_meta['description'] = strip_shortcodes( wp_trim_words( get_post_field( 'post_content', $post ), 20 ) );
$dgwltd_meta['description'] = rtrim( str_replace( '&hellip;', '', $dgwltd_meta['description'] ), '' );
if ( has_post_thumbnail() ) {
	$image                = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'dgwltd-social-image' );
    if ( $image && ! is_wp_error( $image ) ) {
	    $dgwltd_meta['image'] = $image[0];
    }
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