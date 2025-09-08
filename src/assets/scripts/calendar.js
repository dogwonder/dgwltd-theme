// Import modular components
import { CalendarValidator, disableDateCheckbox, enableDateCheckbox, revalidateAllDates } from './calendar/validation.js';
import { DateRangeSelector, addRangeInstructions } from './calendar/range-selection.js';
import { CalendarNavigation, initializeHighlighting } from './calendar/navigation.js';
import { CalendarAPI } from './calendar/api.js';

/**
 * Enhanced Calendar System
 * Modular architecture with validation, range selection, and navigation
 * 
 * Basic Usage Examples:
 * <form> - No validation (default)
 * <form data-validation="future"> - Only future dates
 * <form data-validation="past"> - Only past dates  
 * <form data-validation="year" data-year="2025"> - Specific year only
 * <form data-validation="range" data-range-start="2025-01-01" data-range-end="2025-12-31"> - Date range
 * <form data-validation="custom" data-min-date="2025-03-01" data-max-date="2025-06-30"> - Custom range
 * 
 * Day-of-Week Restrictions:
 * <form data-validation="weekdays"> - Monday-Friday only
 * <form data-validation="weekends"> - Saturday-Sunday only
 * <form data-validation="days" data-allowed-days="1,3,5"> - Monday, Wednesday, Friday (0=Sun, 1=Mon, etc.)
 * 
 * Blackout Dates:
 * <form data-validation="blackout" data-blackout-dates="2025-12-25,2025-01-01"> - Exclude specific dates
 * <form data-validation="blackout" data-blackout-ranges="2025-12-20:2025-01-05,2025-07-01:2025-07-15"> - Exclude date ranges
 * 
 * Business Rules:
 * <form data-validation="advance-notice" data-min-advance-days="3"> - Minimum 3 days notice
 * <form data-validation="booking-window" data-max-advance-days="90"> - Maximum 90 days ahead
 * <form data-validation="business" data-min-advance-days="3" data-max-advance-days="90" data-allowed-days="1,2,3,4,5"> - Combined rules
 * 
 * Range Selection (Optional):
 * <form data-range-selection="true"> - Enable click-to-click range selection
 * <form data-range-selection="false"> - Disable range selection (default)
 * <form> - Range selection disabled by default
 * 
 * Quick Navigation (Optional):
 * <form data-navigation="true"> - Enable navigation buttons and keyboard shortcuts
 * <form data-navigation="false"> - Disable navigation (default)
 * <form> - Navigation disabled by default
 * 
 * Navigation Features (when enabled):
 * - Jump to Today button (T key shortcut)
 * - Next Available Date finder (N key shortcut)  
 * - Keyboard navigation (Arrow keys for month navigation)
 * - URL-based date highlighting (always available)
 * 
 * API Integration (Optional):
 * <form data-api-enabled="true"> - Enable API integration
 * 
 * 
 * UX Behavior:
 * - Invalid dates are proactively DISABLED (not selectable)
 * - Tooltips and screen reader text explain why dates are disabled
 * - No error messages after attempted selection
 * - Mobile/touch friendly interactions
 * - Accessible keyboard navigation
 */

/**
 * Initialize enhanced calendar system when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    const calendarForm = document.querySelector('.dgwltd-calendar__form');
    if (!calendarForm) return;

    // Initialize validation system
    const validator = new CalendarValidator(calendarForm);
    
    // Proactively disable invalid date checkboxes
    const dateCheckboxes = calendarForm.querySelectorAll('input[name="selected_dates[]"]');
    
    dateCheckboxes.forEach(checkbox => {
        const validation = validator.validateDate(checkbox.value);
        
        if (!validation.valid) {
            disableDateCheckbox(checkbox, validation.reason);
        } else {
            enableDateCheckbox(checkbox);
        }
    });

    // Initialize smart date range selection if enabled
    const rangeSelectionEnabled = calendarForm.dataset.rangeSelection === 'true';
    let rangeSelector = null;
    
    if (rangeSelectionEnabled) {
        rangeSelector = new DateRangeSelector(calendarForm, validator);
        addRangeInstructions(calendarForm);
    }

    // Initialize quick navigation system if enabled
    const navigationEnabled = calendarForm.dataset.navigation === 'true';
    let navigation = null;
    
    if (navigationEnabled) {
        navigation = new CalendarNavigation(calendarForm, validator);
    }
    
    // Initialize URL-based highlighting (always available)
    initializeHighlighting(calendarForm);

    // Initialize API integration if enabled
    const apiEnabled = calendarForm.dataset.apiEnabled === 'true';
    let calendarAPI = null;
    
    if (apiEnabled) {
        calendarAPI = new CalendarAPI(calendarForm, validator);
        // Fetch and apply blackout dates from API
        calendarAPI.init();
    }

    // Re-validate when dynamic conditions might change
    calendarForm.addEventListener('change', function() {
        if (validator.needsRevalidation()) {
            revalidateAllDates(validator, dateCheckboxes);
        }
    });
    
    // Add success feedback for form functionality
    console.log('✅ Enhanced Calendar System initialized:', {
        validation: validator.validationType,
        rangeSelection: rangeSelectionEnabled,
        navigation: navigationEnabled,
        apiIntegration: apiEnabled,
        totalDates: dateCheckboxes.length,
        validDates: Array.from(dateCheckboxes).filter(cb => !cb.disabled).length
    });
});