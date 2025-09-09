<div class="govuk-form-group">
        <fieldset class="govuk-fieldset" aria-describedby="calendar-hint">

            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h2 class="govuk-fieldset__heading">
                    <?php echo esc_html($month_name); ?>
                </h2>
            </legend>

            <div id="calendar-hint" class="govuk-hint">
                Select the dates you want to book.
            </div>

            <div class="dgwltd-calendar-grid__container">

                <div class="dgwltd-calendar__header dgwltd-calendar__grid">
                    <?php 
                    $day_headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    foreach ($day_headers as $day) {
                        echo '<span class="dgwltd-calendar-day-header has-lg-font-size">' . esc_html($day) . '</span>';
                    }
                    ?>
                </div>

                <div class="dgwltd-calendar__body dgwltd-calendar__grid">
                    <?php
                    // Empty cells for days before month starts
                    for ($i = 0; $i < $start_day; $i++) {
                        echo '<div class="dgwltd-calendar__empty"></div>';
                    }

                    // Days of the month
                    for ($day = 1; $day <= $days_in_month; $day++) {
                        $date_value = sprintf('%04d-%02d-%02d', $current_year, $current_month, $day);
                        $is_checked = in_array($date_value, $selected_dates);
                        $checkbox_id = 'date-' . $date_value;
                        ?>
                        <div class="dgwltd-calendar__day">
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
    </div>