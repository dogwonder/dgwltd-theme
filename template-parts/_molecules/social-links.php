<?php 
$social = get_field('social_links', 'options');
//Check to see if the repeater field has rows of data
if( have_rows('social_links', 'options') ):
    // loop through the rows of data
    while ( have_rows('social_links', 'options') ) : the_row();
        // display a sub field value
        $bluesky = $social['bluesky'];
        $facebook = $social['facebook'];
        $github = $social['github'];
        $instagram = $social['instagram'];
        $linkedin = $social['linkedin'];
        $mastodon = $social['mastodon'];
        $tiktok = $social['tiktok'];
        $youtube = $social['youtube'];        
    endwhile;
else :
    $bluesky = '';
    $facebook = '';
    $github = '';
    $instagram = '';
    $linkedin = '';
    $mastodon = '';
    $tiktok = '';
    $youtube = '';
    // no rows found
endif;
?>
<ul class="dgwltd-footer__social-links dgwltd-footer__inline-list">

    <?php if($bluesky) : ?>    
    <li>
        <a href="<?php echo $bluesky; ?>" rel="external" aria-label="Visit our Bluesky page">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__bluesky">
            <use xlink:href="#social-bluesky" />
            </svg>
        </a>
    </li>
        <?php endif; ?>

    <?php if($facebook) : ?>
    <li>
        <a href="<?php echo ($facebook ? $facebook : 'https://www.facebook.com/'); ?>" rel="external" aria-label="Visit our Facebook page">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__facebook">
            <use xlink:href="#social-facebook" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($github) : ?>
    <li>
        <a href="<?php echo ($github ? $github : 'http://github.com/dogwonder/'); ?>" rel="external" aria-label="Visit our Linkedin profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__github">
            <use xlink:href="#social-github" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($instagram) : ?>    
    <li>
        <a href="<?php echo ($instagram ? $instagram : 'https://instagram.com/'); ?>" rel="external" aria-label="Follow us on Instagram">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__instagram">
            <use xlink:href="#social-instagram" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($linkedin) : ?>
    <li>
        <a href="<?php echo ($linkedin ? $linkedin : 'https://www.linkedin.com/'); ?>" rel="external" aria-label="Visit our Linkedin profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__linkedin">
            <use xlink:href="#social-linkedin" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($mastodon) : ?>
    <li>
        <a href="<?php echo $mastodon; ?>" rel="external" aria-label="Visit our Mastodon profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__mastodon">
            <use xlink:href="#social-mastodon" />
            </svg>
        </a>
    </li>
    <?php endif; ?>
    
    <?php if($tiktok) : ?>
    <li>
        <a href="<?php echo ($tiktok ? $tiktok : 'https://www.tiktok.com/'); ?>" rel="external" aria-label="Visit our TikTok profile">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__tiktok">
            <use xlink:href="#social-tiktok" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

    <?php if($youtube) : ?>
    <li>
        <a href="<?php echo ($youtube ? $youtube : 'https://www.youtube.com/'); ?>" rel="external" aria-label="Visit our YouTube channel">
            <svg aria-hidden="true" focusable="false" class="icon icon-social icon-social__youtube">
            <use xlink:href="#social-youtube" />
            </svg>
        </a>
    </li>
    <?php endif; ?>

</ul>