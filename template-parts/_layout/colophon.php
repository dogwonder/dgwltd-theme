<footer class="dgwltd-footer">

	<div class="dgwltd-container">   

		<div class="dgwltd-footer__section repel">
			
				<div class="dgwltd-footer__links">
				<?php
				if ( has_nav_menu( 'footer-links' ) ) {
					wp_nav_menu(
						array(
							'theme_location' => 'footer-links',
							'menu_id'        => 'footer-nav',
							'menu_class'     => 'dgwltd-footer__list',
							'container'      => false,
						)
					);	
				}
				?>
				</div>
			
				<div class="dgwltd-footer__social">
					<p class="visually-hidden"><?php esc_html_e( 'Connect', 'dgwltd' ); ?></p>
					<?php get_template_part( 'template-parts/_molecules/social-links' ); ?>
				</div>

		</div>

		<div class="dgwltd-footer__section repel">

			<div class="dgwltd-footer__legal">
				<span class="dgwltd-footer__copyright">© Dogwonder Ltd, <?php echo date( 'Y' ); ?></span>
				<?php
				if ( has_nav_menu( 'legal' ) ) {
					wp_nav_menu(
						array(
							'theme_location' => 'legal',
							'menu_id'        => 'legal-nav',
							'menu_class'     => 'dgwltd-footer__list dgwltd-footer__inline-list',
							'container'      => false,
						)
					);
				}
				?>
		</div>

		<div class="dgwltd-footer__switcher">
			<fieldset class="dgwltd-theme-switcher" id="theme-switcher">
				<legend class="visually-hidden">Theme</legend>
				
				<?php /* ?>
				<label for="theme-system">
				<input type="radio" name="color-theme" value="system" checked id="theme-system">
				<svg id="icon-system" width="1em" height="1em"  viewBox="0 0 512 512" fill="currentColor" role="img"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
					<title>System default theme</title>
					<path d="M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
				</svg>
				</label>
				<?php */ ?>

				<label>
				<input type="radio" name="color-theme" value="dark" id="theme-dark">
				<svg id="icon-moon" width="1em" height="1em" viewBox="0 0 384 512" fill="currentColor" role="img"><!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.-->
					<title>Dark theme</title>
					<path d="M144.7 98.7c-21 34.1-33.1 74.3-33.1 117.3c0 98 62.8 181.4 150.4 211.7c-12.4 2.8-25.3 4.3-38.6 4.3C126.6 432 48 353.3 48 256c0-68.9 39.4-128.4 96.8-157.3zm62.1-66C91.1 41.2 0 137.9 0 256C0 379.7 100 480 223.5 480c47.8 0 92-15 128.4-40.6c1.9-1.3 3.7-2.7 5.5-4c4.8-3.6 9.4-7.4 13.9-11.4c2.7-2.4 5.3-4.8 7.9-7.3c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-3.7 .6-7.4 1.2-11.1 1.6c-5 .5-10.1 .9-15.3 1c-1.2 0-2.5 0-3.7 0l-.3 0c-96.8-.2-175.2-78.9-175.2-176c0-54.8 24.9-103.7 64.1-136c1-.9 2.1-1.7 3.2-2.6c4-3.2 8.2-6.2 12.5-9c3.1-2 6.3-4 9.6-5.8c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-3.6-.3-7.1-.5-10.7-.6c-2.7-.1-5.5-.1-8.2-.1c-3.3 0-6.5 .1-9.8 .2c-2.3 .1-4.6 .2-6.9 .4z"/>
				</svg>
				</label>

				<label for="theme-light">
				<input type="radio" name="color-theme" value="light" id="theme-light">
				<svg id="icon-sun" width="1em" height="1em" viewBox="0 0 512 512" fill="currentColor" role="img"><!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.-->
					<title>Light theme</title>
					<path d="M193.1 23.2L256 57.1l62.9-33.9L362 0l14.1 46.9 20.5 68.4 68.4 20.5L512 150l-23.2 43.1L454.9 256l33.9 62.9L512 362l-46.9 14.1-68.4 20.5-20.5 68.4L362 512l-43.1-23.2L256 454.9l-62.9 33.9L150 512l-14.1-46.9-20.5-68.4L46.9 376.1 0 362l23.2-43.1L57.1 256 23.2 193.1 0 150l46.9-14.1 68.4-20.5 20.5-68.4L150 0l43.1 23.2zm85.7 76.1L256 111.6 233.2 99.4 179 70.2l-17.7 59-7.4 24.8-24.8 7.4L70.2 179l29.2 54.2L111.6 256 99.4 278.8 70.2 333l59 17.7 24.8 7.4 7.4 24.8 17.7 59 54.2-29.2L256 400.4l22.8 12.3L333 441.8l17.7-59 7.4-24.8 24.8-7.4 59-17.7-29.2-54.2L400.4 256l12.3-22.8L441.8 179l-59-17.7-24.8-7.4-7.4-24.8L333 70.2 278.8 99.4zM256 144a112 112 0 1 1 0 224 112 112 0 1 1 0-224zm64 112a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
				</svg>
				</label>
			</fieldset>
		</div>

		</div>
		<div class="dgwltd-footer__section repel dgwltd-mbs-sm">
			<div class="dgwltd-status-bar">
        		<?php include(locate_template( 'dist/power-mix.php' )) ; ?>
        		<?php include(locate_template( 'dist/carbon-intensity.php' )) ; ?>
    		</div>
		</div>

	</div>

</footer>