<?php
/**
 * Example usage of Carbon Components in WordPress templates
 */

// In header.php or any template file:
?>

<!-- Option 1: Individual components -->
<div class="site-header-energy">
    <?php echo do_shortcode('[carbon_intensity]'); ?>
    <?php echo do_shortcode('[power_mix]'); ?>
</div>

<!-- Option 2: Complete dashboard -->
<div class="site-header-energy">
    <?php echo do_shortcode('[energy_dashboard]'); ?>
</div>

<!-- Option 3: Direct function calls (more efficient) -->
<div class="site-header-energy">
    <?php echo carbon_intensity_shortcode(); ?>
    <?php echo power_mix_shortcode(); ?>
</div>

<?php
/**
 * Or create a dedicated function for headers
 */
function display_header_energy_status() {
    echo '<div class="header-energy-status">';
    echo carbon_intensity_shortcode();
    echo power_mix_shortcode(); 
    echo '</div>';
}

// Then in header.php:
// display_header_energy_status();
?>