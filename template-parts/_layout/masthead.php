
<header id="masthead" class="dgwltd-masthead" data-enabled="false" x-data="sentinelWatcher">

    <div id="skiplink-container">
        <a href="#content" class="govuk-skip-link" data-module="govuk-skip-link"><?php esc_html_e( 'Skip to main content', 'dgwltd' ); ?></a>
    </div>

    <div class="dgwltd-masthead-container">

            <div class="dgwltd-masthead__logo">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" title="Go to the homepage for <?php bloginfo( 'name' ); ?>">
                <?php get_template_part( 'template-parts/_atoms/logo' ); ?>
                <span class="visually-hidden"><?php esc_html_e( 'DGW.ltd', 'dgwltd' ); ?></span>
                </a>
            </div><!-- .masthead__logo -->

            <nav id="site-navigation" class="main-navigation dgwltd-nav" aria-label="Primary">

                <button class="nav-toggle" id="nav-toggle" aria-label="Show or hide Top Level Navigation" aria-controls="nav-primary" aria-expanded="false">
                    <svg class="open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 64H448v64H0V64zM0 224H320v64H0V224zM192 384v64H0V384H192z"/></svg>
                    <svg class="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M294.6 166.6L317.3 144 272 98.7l-22.6 22.6L160 210.7 70.6 121.4 48 98.7 2.7 144l22.6 22.6L114.7 256 25.4 345.4 2.7 368 48 413.3l22.6-22.6L160 301.3l89.4 89.4L272 413.3 317.3 368l-22.6-22.6L205.3 256l89.4-89.4z"/></svg>
                    <span class="visually-hidden"><?php esc_html_e( 'Menu', 'dgwltd' ); ?></span>
                </button>


                <div class="dgwltd-nav__wrapper">

                <?php
                if ( has_nav_menu( 'primary' ) ) {
                    wp_nav_menu(
                        array(
                            'theme_location' => 'primary',
                            'menu_id'        => 'nav-primary',
                            'menu_class'     => 'dgwltd-menu',
                            'container'      => false,
                        )
                    );
                }
                ?>
                
                </div>
                
            </nav>

            
    </div><!--/container-->

</header>