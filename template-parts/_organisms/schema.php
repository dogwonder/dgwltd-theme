<?php
$schema = [
	'@context' => 'https://schema.org',
	'@graph'   => [],
];

// Website
$schema['@graph'][] = [
	'@type' => 'WebSite',
	'@id'   => site_url( '#website' ),
	'url'   => site_url(),
	'name'  => get_bloginfo( 'name' ),
];

// Organisation
$schema['@graph'][] = [
	'@type' => 'Organization',
	'@id'   => site_url( '#organization' ),
	'name'  => get_bloginfo( 'name' ),
	'url'   => site_url(),
	'logo'  => [
		'@type' => 'ImageObject',
		'url'   => get_template_directory_uri() . '/dist/assets/icons/og/og-image.png',
	],
];

// Page / Article
if ( is_single() ) {
	$schema['@graph'][] = [
		'@type'        => 'Article',
		'@id'          => get_permalink( $post->ID ) . '#article',
		'headline'     => $dgwltd_meta['title'],
		'description'  => $dgwltd_meta['description'],
		'image'        => $dgwltd_meta['image'],
		'datePublished'=> get_the_date( 'c', $post ),
		'dateModified' => get_the_modified_date( 'c', $post ),
		'author'       => [
			'@type' => 'Person',
			'name'  => get_the_author(),
		],
		'publisher'    => [
			'@id' => site_url( '#organization' ),
		],
		'mainEntityOfPage' => [
			'@type' => 'WebPage',
			'@id'   => get_permalink( $post->ID ),
		],
	];
} else {
	$schema['@graph'][] = [
		'@type' => 'WebPage',
		'@id'   => $dgwltd_meta['url'],
		'name'  => $dgwltd_meta['title'],
		'description' => $dgwltd_meta['description'],
	];
}
?>

<script type="application/ld+json">
<?php echo wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?>
</script>