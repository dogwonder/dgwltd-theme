<?php
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

// Calendar generation
$first_day = mktime(0, 0, 0, $current_month, 1, $current_year);
$days_in_month = date('t', $first_day);
$month_name = date('F Y', $first_day);
$start_day = date('w', $first_day); // 0 = Sunday, 6 = Saturday

// Navigation logic
[$prev_month, $prev_year] = dgwltd_calculate_nav_month($current_month, $current_year, 'prev');
[$next_month, $next_year] = dgwltd_calculate_nav_month($current_month, $current_year, 'next');

// Base URL for navigation (preserve selected dates)
$base_url = remove_query_arg(['cal_month', 'cal_year'], $_SERVER['REQUEST_URI']);

// Previous/next month URLs (preserve selected dates)
$prev_url = add_query_arg(['cal_month' => $prev_month, 'cal_year' => $prev_year], $base_url);
$next_url = add_query_arg(['cal_month' => $next_month, 'cal_year' => $next_year], $base_url);

// Year navigation
$today_year = date('Y');
$year_range = range($today_year - 1, $today_year + 1);
?>


<form method="post" action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" class="dgwltd-calendar-form">

    <?php wp_nonce_field('calendar_selection', 'calendar_nonce'); ?>
    
    <div class="govuk-form-group">
        <fieldset class="govuk-fieldset" aria-describedby="calendar-hint">

            <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
                <h2 class="govuk-fieldset__heading">
                    <?php echo esc_html($month_name); ?>
                </h2>
            </legend>
            <div id="calendar-hint" class="govuk-hint">
                Select the dates you want to book or mark as available.
            </div>

            <?php if (!empty($selected_dates)) : ?>
                <div class="govuk-notification-banner govuk-notification-banner--success" role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
                    <div class="govuk-notification-banner__header">
                        <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">
                            Success
                        </h2>
                    </div>
                    <div class="govuk-notification-banner__content">
                        <h3 class="govuk-notification-banner__heading">
                            Selected dates: <?php echo esc_html(implode(', ', dgwltd_format_dates_for_display($selected_dates))); ?>
                        </h3>
                    </div>
                </div>
            <?php endif; ?>

            <div class="dgwltd-calendar-grid">
                <!-- Day headers -->
                <div class="dgwltd-calendar-header">
                    <?php 
                    $day_headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    foreach ($day_headers as $day) {
                        echo '<span class="dgwltd-calendar-day-header has-lg-font-size">' . esc_html($day) . '</span>';
                    }
                    ?>
                </div>

                <!-- Calendar days -->
                <div class="dgwltd-calendar-body">
                    <?php
                    // Empty cells for days before month starts
                    for ($i = 0; $i < $start_day; $i++) {
                        echo '<div class="dgwltd-calendar-empty"></div>';
                    }

                    // Days of the month
                    for ($day = 1; $day <= $days_in_month; $day++) {
                        $date_value = sprintf('%04d-%02d-%02d', $current_year, $current_month, $day);
                        $is_checked = in_array($date_value, $selected_dates);
                        $checkbox_id = 'date-' . $date_value;
                        ?>
                        <div class="dgwltd-calendar-day">
                            <div class="govuk-checkboxes__item">
                                <input class="govuk-checkboxes__input" 
                                    id="<?php echo esc_attr($checkbox_id); ?>" 
                                    name="selected_dates[]" 
                                    type="checkbox" 
                                    value="<?php echo esc_attr($date_value); ?>"
                                    <?php checked($is_checked); ?>>
                                <label class="govuk-label govuk-checkboxes__label" 
                                    for="<?php echo esc_attr($checkbox_id); ?>">
                                    <?php echo esc_html($day); ?>
                                </label>
                            </div>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
    </fieldset>

    <!-- Month Navigation -->
    <nav class="govuk-pagination" role="navigation" aria-label="Calendar navigation">
        <div class="govuk-pagination__prev">
            <a class="govuk-link govuk-pagination__link" href="<?php echo esc_url($prev_url); ?>" rel="prev">
                <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                    <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                </svg>
                <span class="govuk-pagination__link-title"><?php echo esc_html(date('F Y', mktime(0, 0, 0, $prev_month, 1, $prev_year))); ?></span>
            </a>
        </div>
        
        <ul class="govuk-pagination__list">
            <?php foreach ($year_range as $year) : 
                $is_current = ($year == $current_year);
                $year_url = add_query_arg(['cal_year' => $year, 'cal_month' => ($is_current ? $current_month : 1)], $base_url);
            ?>
                <li class="govuk-pagination__item <?php echo $is_current ? 'govuk-pagination__item--current' : ''; ?>">
                    <?php if ($is_current) : ?>
                        <span class="govuk-pagination__link" aria-current="page"><?php echo esc_html($year); ?></span>
                    <?php else : ?>
                        <a class="govuk-link govuk-pagination__link" href="<?php echo esc_url($year_url); ?>"><?php echo esc_html($year); ?></a>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>

        <div class="govuk-pagination__next">
            <a class="govuk-link govuk-pagination__link" href="<?php echo esc_url($next_url); ?>" rel="next">
                <span class="govuk-pagination__link-title"><?php echo esc_html(date('F Y', mktime(0, 0, 0, $next_month, 1, $next_year))); ?></span>
                <svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                    <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                </svg>
            </a>
        </div>
    </nav>

    <div class="dgwltd-calendar-actions">
        <button type="submit" class="govuk-button" data-module="govuk-button">
            Update Selection
        </button>
        
        <?php if (!empty($selected_dates)) : ?>
            <button type="submit" name="clear_selection" value="1" class="govuk-button govuk-button--secondary">
                Clear Selection
            </button>
        <?php endif; ?>
    </div>

</form>

<style>
.govuk-pagination {
    width: 100%;
    margin-block: 2rem;
    justify-content: space-between;
}
.govuk-notification-banner {
    margin-block-start: 2rem;
}
.dgwltd-calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}
.dgwltd-calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
}
</style>

<?php
// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && wp_verify_nonce($_POST['calendar_nonce'], 'calendar_selection')) {
    $base_redirect_url = remove_query_arg(['cal_dates'], $_SERVER['REQUEST_URI']);
    
    if (isset($_POST['clear_selection'])) {
        wp_redirect($base_redirect_url);
        exit;
    }
    
    // Get current form dates and existing URL dates
    $form_dates = isset($_POST['selected_dates']) && is_array($_POST['selected_dates']) 
        ? array_map('sanitize_text_field', $_POST['selected_dates']) 
        : [];
    $existing_url_dates = isset($_GET['cal_dates']) && is_array($_GET['cal_dates']) 
        ? array_map('sanitize_text_field', $_GET['cal_dates']) 
        : [];
    
    // Preserve dates from other months
    $dates_from_other_months = dgwltd_get_dates_from_other_months($existing_url_dates, $current_year, $current_month);
    
    // Combine with current month's selection
    $final_dates = array_merge($dates_from_other_months, $form_dates);
    
    // Redirect with final selection or clean URL if no dates
    $redirect_url = !empty($final_dates) 
        ? add_query_arg('cal_dates', $final_dates, $base_redirect_url)
        : $base_redirect_url;
        
    wp_redirect($redirect_url);
    exit;
}
?>