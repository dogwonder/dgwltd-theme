<footer class="dgwltd-footer">

	<div class="dgwltd-container">   

		<div class="dgwltd-footer__section">
			
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

				<div class="dgwltd-footer__switcher">
					<fieldset class="dgwltd-theme-switcher" id="theme-switcher">
						<legend>Theme</legend>
						<label for="theme-system">
						<input type="radio" name="color-theme" value="system" checked onchange="switchAuto()" id="theme-system">
						<svg id="icon-system" width="1em" height="1em"  viewBox="0 0 512 512" fill="currentColor" role="img"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
							<title>System default theme</title>
							<path d="M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
						</svg>
						</label>

						<label>
						<input type="radio" name="color-theme" value="dark" onchange="switchDark()" id="theme-dark">
						<svg id="icon-moon" width="1em" height="1em" viewBox="0 0 512 512" fill="currentColor" role="img"><!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.-->
							<title>Dark theme</title>
							<path d="M320 64L304 16 288 64 240 80l48 16 16 48 16-48 48-16L320 64zM440 200l-24-72-24 72-72 24 72 24 24 72 24-72 72-24-72-24zM128 288c0-72.5 48.2-133.7 114.2-153.4c-16-4.3-32.9-6.6-50.2-6.6C86 128 0 214 0 320S86 512 192 512c61.5 0 116.2-28.9 151.3-73.8c-17.2 6.4-35.9 9.8-55.3 9.8c-88.4 0-160-71.6-160-160z"/>
						</svg>
						</label>

						<label for="theme-light">
						<input type="radio" name="color-theme" value="light" onchange="switchLight()" id="theme-light">
						<svg id="icon-sun" width="1em" height="1em" viewBox="0 0 512 512" fill="currentColor" role="img"><!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.-->
							<title>Light theme</title>
							<path d="M193.1 23.2L256 57.1l62.9-33.9L362 0l14.1 46.9 20.5 68.4 68.4 20.5L512 150l-23.2 43.1L454.9 256l33.9 62.9L512 362l-46.9 14.1-68.4 20.5-20.5 68.4L362 512l-43.1-23.2L256 454.9l-62.9 33.9L150 512l-14.1-46.9-20.5-68.4L46.9 376.1 0 362l23.2-43.1L57.1 256 23.2 193.1 0 150l46.9-14.1 68.4-20.5 20.5-68.4L150 0l43.1 23.2zm85.7 76.1L256 111.6 233.2 99.4 179 70.2l-17.7 59-7.4 24.8-24.8 7.4L70.2 179l29.2 54.2L111.6 256 99.4 278.8 70.2 333l59 17.7 24.8 7.4 7.4 24.8 17.7 59 54.2-29.2L256 400.4l22.8 12.3L333 441.8l17.7-59 7.4-24.8 24.8-7.4 59-17.7-29.2-54.2L400.4 256l12.3-22.8L441.8 179l-59-17.7-24.8-7.4-7.4-24.8L333 70.2 278.8 99.4zM256 144a112 112 0 1 1 0 224 112 112 0 1 1 0-224zm64 112a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
						</svg>
						</label>
					</fieldset>
				</div>

		</div>

		<div class="dgwltd-footer__section dgwltd-footer__legal">
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

	</div>

</footer>