<?php
// Time selection logic - intersection approach: only show times available for ALL selected dates
function dgwltd_get_time_slots($selected_dates) {
    
    $weekday_hours = range(9, 20);
    $weekend_hours = range(8, 22);
    
    if (empty($selected_dates)) {
        // Default to weekday hours if no dates selected
        return ['hours' => $weekday_hours, 'type' => 'weekday'];
    }
    
    $all_weekend = true;
    $all_weekday = true;
    
    foreach ($selected_dates as $date) {
        $timestamp = strtotime($date);
        if ($timestamp) {
            $day_of_week = date('w', $timestamp); // 0 = Sunday, 6 = Saturday
            $is_weekend_day = ($day_of_week == 0 || $day_of_week == 6);
            
            if ($is_weekend_day) {
                $all_weekday = false;
            } else {
                $all_weekend = false;
            }
        }
    }
    
    // Intersection logic: only show weekend hours if ALL dates are weekends
    if ($all_weekend) {
        return ['hours' => $weekend_hours, 'type' => 'weekend'];
    } elseif ($all_weekday) {
        return ['hours' => $weekday_hours, 'type' => 'weekday'];
    } else {
        // Mixed dates - use intersection (most restrictive)
        return ['hours' => $weekday_hours, 'type' => 'mixed'];
    }
}

$time_config = dgwltd_get_time_slots($selected_dates);
$selected_time = isset($_GET['cal_time']) ? sanitize_text_field($_GET['cal_time']) : '';
?>

<div class="govuk-form-group cluster">
    <fieldset class="govuk-fieldset" aria-describedby="time-hint">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            <h2 class="govuk-fieldset__heading">
                Select time
            </h2>
        </legend>
        <div id="time-hint" class="govuk-hint">
            Choose your preferred time slot 
            <?php if ($time_config['type'] === 'weekend') : ?>
                (8 AM - 10 PM for all weekend dates)
            <?php elseif ($time_config['type'] === 'mixed') : ?>
                (9 AM - 8 PM available for all selected dates)
            <?php else : ?>
                (9 AM - 8 PM for all weekday dates)
            <?php endif; ?>
        </div>
        
        <div class="govuk-date-input" id="time-selection">
            <div class="govuk-date-input__item">
                <div class="govuk-form-group">
                    <label class="govuk-label govuk-date-input__label" for="cal_time">
                        Time
                    </label>
                    <select class="govuk-select govuk-date-input__input govuk-input--width-4" id="cal_time" name="cal_time">
                        <option value="">Select time</option>
                        <?php foreach ($time_config['hours'] as $hour) : 
                            $hour_display = $hour <= 12 ? $hour : $hour;
                            $hour_value = sprintf('%02d:00', $hour);
                            $is_selected = ($selected_time === $hour_value);
                        ?>
                            <option value="<?php echo esc_attr($hour_value); ?>" <?php selected($is_selected); ?>>
                                <?php echo esc_html($hour_value); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
        </div>
    </fieldset>
</div>