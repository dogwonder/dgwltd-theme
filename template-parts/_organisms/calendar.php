<?php
/*
Quote
If your calendar was a bunch of progressively enhanced checkboxes and a submit button, you could be riding off into the sunset and counting money instead of taking support calls from frustrated octogenarians. And it’s hard for me to shut up about that.
*/

// Helper functions
function dgwltd_get_selected_dates() {
    if (isset($_GET['cal_dates']) && is_array($_GET['cal_dates'])) {
        return array_map('sanitize_text_field', $_GET['cal_dates']);
    }
    if (isset($_POST['selected_dates']) && is_array($_POST['selected_dates'])) {
        return array_map('sanitize_text_field', $_POST['selected_dates']);
    }
    return array();
}

function dgwltd_get_dates_from_other_months($existing_dates, $year, $month) {
    $month_prefix = sprintf('%04d-%02d-', $year, $month);
    return array_filter($existing_dates, function($date) use ($month_prefix) {
        return !str_starts_with($date, $month_prefix);
    });
}

function dgwltd_format_dates_for_display($dates) {
    $formatted = array();
    foreach ($dates as $date) {
        $timestamp = strtotime($date);
        if ($timestamp) {
            $formatted[] = date('jS F', $timestamp);
        }
    }
    return $formatted;
}

function dgwltd_format_dates_with_time_for_display($dates, $time = '') {
    $formatted = array();
    $time_prefix = !empty($time) ? $time . ' on ' : '';
    
    foreach ($dates as $date) {
        $timestamp = strtotime($date);
        if ($timestamp) {
            $formatted[] = $time_prefix . date('j F Y', $timestamp);
        }
    }
    return $formatted;
}

function dgwltd_calculate_nav_month($current_month, $current_year, $direction) {
    if ($direction === 'prev') {
        return $current_month === 1 ? [12, $current_year - 1] : [$current_month - 1, $current_year];
    }
    return $current_month === 12 ? [1, $current_year + 1] : [$current_month + 1, $current_year];
}

// Get current month and year
$current_month = isset($_GET['cal_month']) ? intval($_GET['cal_month']) : date('n');
$current_year = isset($_GET['cal_year']) ? intval($_GET['cal_year']) : date('Y');
$selected_dates = dgwltd_get_selected_dates();

// Process single date input - convert to cal_dates format
if (isset($_POST['cal_day_single'], $_POST['cal_month_single'], $_POST['cal_year_single'])) {
    $day = intval($_POST['cal_day_single']);
    $month = intval($_POST['cal_month_single']);
    $year = intval($_POST['cal_year_single']);
    
    if ($day > 0 && $month > 0 && $year > 0 && checkdate($month, $day, $year)) {
        $single_date = sprintf('%04d-%02d-%02d', $year, $month, $day);
        $_GET['cal_dates'] = [$single_date];
        $selected_dates = [$single_date];
    }
}

// Calendar generation
$first_day = mktime(0, 0, 0, $current_month, 1, $current_year);
$days_in_month = date('t', $first_day);
$month_name = date('F Y', $first_day);
$start_day = date('w', $first_day); // 0 = Sunday, 6 = Saturday

// Navigation logic
[$prev_month, $prev_year] = dgwltd_calculate_nav_month($current_month, $current_year, 'prev');
[$next_month, $next_year] = dgwltd_calculate_nav_month($current_month, $current_year, 'next');

// Base URL for navigation (preserve selected dates and time)
$base_url = remove_query_arg(['cal_month', 'cal_year'], $_SERVER['REQUEST_URI']);

// Previous/next month URLs (preserve selected dates and time)
$prev_url = add_query_arg(['cal_month' => $prev_month, 'cal_year' => $prev_year], $base_url);
$next_url = add_query_arg(['cal_month' => $next_month, 'cal_year' => $next_year], $base_url);

// Year navigation
$today_year = date('Y');
$year_range = range($today_year - 1, $today_year + 1);

// Time 
$time_required = true;
?>

<div class="dgwltd-calendar">

    <form method="post" action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" class="dgwltd-calendar__form" 
          data-range-selection="false" 
          data-navigation="true"
          data-api-enabled="false"
          >

        <?php wp_nonce_field('calendar_selection', 'calendar_nonce'); ?>

        <?php if (!empty($selected_dates)) : 
            $selected_time = isset($_GET['cal_time']) ? sanitize_text_field($_GET['cal_time']) : '';
            $formatted_dates = dgwltd_format_dates_with_time_for_display($selected_dates, $selected_time);
        ?>
            <div class="govuk-notification-banner" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
                <div class="govuk-notification-banner__header">
                    <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
                        Selected dates
                    </h2>
                </div>
                <div class="govuk-notification-banner__content">
                    <h3 class="govuk-notification-banner__heading">
                        <?php echo esc_html(implode(', ', $formatted_dates)); ?>
                    </h3>
                </div>
            </div>
        <?php endif; ?>

        <?php include locate_template( 'template-parts/_calendar/calendar-error.php' ); ?>      

        <?php //include locate_template( 'template-parts/_calendar/calendar-day.php' ); ?>      

        <?php if (!empty($selected_dates) && $time_required) : ?>
            <?php include locate_template( 'template-parts/_calendar/calendar-time.php' ); ?>
        <?php else : ?>
            <?php include locate_template( 'template-parts/_calendar/calendar-grid.php' ); ?>
            <?php include locate_template( 'template-parts/_calendar/calendar-pagination.php' ); ?>
        <?php endif; ?>    

        <div class="dgwltd-calendar__actions govuk-button-group">
            <button type="submit" class="govuk-button" data-module="govuk-button">
                <?php 
                if (!empty($selected_dates) && $time_required) {
                    echo 'Select time';
                } elseif (!empty($selected_dates) && !$time_required) {
                    echo 'Continue';
                } else {
                    echo 'Select dates';
                }
                ?>
            </button>
            
            <?php if (!empty($selected_dates)) : ?>
                <button type="submit" name="clear_selection" value="1" class="govuk-button govuk-button--secondary" data-module="govuk-button">
                    Clear Selection
                </button>
            <?php endif; ?>
        </div>

    </form>

</div>
<?php
// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && wp_verify_nonce($_POST['calendar_nonce'], 'calendar_selection')) {
    $base_redirect_url = remove_query_arg(['cal_dates'], $_SERVER['REQUEST_URI']);
    
    if (isset($_POST['clear_selection'])) {
        $clear_url = remove_query_arg(['cal_dates', 'cal_time'], $_SERVER['REQUEST_URI']);
        wp_redirect($clear_url);
        exit;
    }
    
    // Get current form dates and existing URL dates
    $form_dates = isset($_POST['selected_dates']) && is_array($_POST['selected_dates']) 
        ? array_map('sanitize_text_field', $_POST['selected_dates']) 
        : [];
    $existing_url_dates = isset($_GET['cal_dates']) && is_array($_GET['cal_dates']) 
        ? array_map('sanitize_text_field', $_GET['cal_dates']) 
        : [];
    
    // If we're in time selection mode (dates already selected but no form dates), preserve existing dates
    if (empty($form_dates) && !empty($existing_url_dates)) {
        $final_dates = $existing_url_dates;
    } else {
        // Normal date selection flow - preserve dates from other months and combine with form dates
        $dates_from_other_months = dgwltd_get_dates_from_other_months($existing_url_dates, $current_year, $current_month);
        $final_dates = array_merge($dates_from_other_months, $form_dates);
    }

    // Build redirect URL with dates
    $redirect_url = !empty($final_dates) 
        ? add_query_arg('cal_dates', $final_dates, $base_redirect_url)
        : $base_redirect_url;
        
    // Add time selection if provided
    if (isset($_POST['cal_time']) && !empty($_POST['cal_time'])) {
        $selected_time = sanitize_text_field($_POST['cal_time']);
        $redirect_url = add_query_arg('cal_time', $selected_time, $redirect_url);
    }

    /*
    $proceed_to_booking = !empty($final_dates);
    
    if ($proceed_to_booking) {
        // Redirect to booking form with selected dates
        $booking_form_url = esc_url( home_url( '/' ) );
        $redirect_url = add_query_arg([
            'selected_dates' => implode(',', $final_dates),
            'date_count' => count($final_dates)
        ], $booking_form_url);
    } else {
        // No dates selected - stay on calendar
        $redirect_url = $base_redirect_url;
    }
    */
        
    wp_redirect($redirect_url);
    exit;
}
?>