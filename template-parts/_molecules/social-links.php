<?php
$social = get_field('social_links', 'options');
$bluesky = $social['bluesky_link'] ?? '';
$facebook = $social['facebook_link'] ?? '';
$github = $social['github_link'] ?? '';
$instagram = $social['instagram_link'] ?? '';
$linkedin = $social['linkedin_link'] ?? '';
$tiktok = $social['tiktok_link'] ?? '';
$youtube = $social['youtube_link'] ?? '';
?>
<ul class="dgwltd-footer__social-links dgwltd-footer__inline-list">

    <?php if($bluesky) : ?>
    <li>
        <a href="<?php echo esc_url( $bluesky ); ?>" rel="external" aria-label="Visit our Bluesky page">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__bluesky">
            <use xlink:href="#social-bluesky" />
            </svg>
        </a>
    </li>
        <?php endif; ?>

    <?php if($facebook) : ?>
    <li>
        <a href="<?php echo esc_url( $facebook ); ?>" rel="external" aria-label="Visit our Facebook page">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__facebook">
            <use xlink:href="#social-facebook" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($github) : ?>
    <li>
        <a href="<?php echo esc_url( $github ); ?>" rel="external" aria-label="Visit our Linkedin profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__github">
            <use xlink:href="#social-github" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($instagram) : ?>
    <li>
        <a href="<?php echo esc_url( $instagram ); ?>" rel="external" aria-label="Follow us on Instagram">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__instagram">
            <use xlink:href="#social-instagram" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($linkedin) : ?>
    <li>
        <a href="<?php echo esc_url( $linkedin ); ?>" rel="external" aria-label="Visit our Linkedin profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__linkedin">
            <use xlink:href="#social-linkedin" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($tiktok) : ?>
    <li>
        <a href="<?php echo esc_url( $tiktok ); ?>" rel="external" aria-label="Visit our TikTok profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__tiktok">
            <use xlink:href="#social-tiktok" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($youtube) : ?>
    <li>
        <a href="<?php echo esc_url( $youtube ); ?>" rel="external" aria-label="Visit our YouTube channel">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__youtube">
            <use xlink:href="#social-youtube" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

</ul>