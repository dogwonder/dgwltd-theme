<div class="govuk-form-group">
        <fieldset class="govuk-fieldset" role="group" aria-describedby="calendar-single-hint">

            <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
                <h2 class="govuk-fieldset__heading">Select a single date</h2>
            </legend>

            <div id="calendar-single-hint" class="govuk-hint">
            For example, 27 3 2007
            </div>
    
            <div class="govuk-date-input" id="calendar-single">
                <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                    <label class="govuk-label govuk-date-input__label" for="calendar-single-day">
                        Day
                    </label>
                    <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="calendar-single-day" name="cal_day_single" type="text" inputmode="numeric" value="<?php echo esc_attr($_POST['cal_day_single'] ?? ''); ?>">
                    </div>
                </div>
                <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                    <label class="govuk-label govuk-date-input__label" for="calendar-single-month">
                        Month
                    </label>
                    <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="calendar-single-month" name="cal_month_single" type="text" inputmode="numeric" value="<?php echo esc_attr($_POST['cal_month_single'] ?? ''); ?>">
                    </div>
                </div>
                <div class="govuk-date-input__item">
                    <div class="govuk-form-group">
                    <label class="govuk-label govuk-date-input__label" for="calendar-single-year">
                        Year
                    </label>
                    <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="calendar-single-year" name="cal_year_single" type="text" inputmode="numeric" value="<?php echo esc_attr($_POST['cal_year_single'] ?? ''); ?>">
                    </div>
                </div>
            </div>

        </fieldset>
</div>
    