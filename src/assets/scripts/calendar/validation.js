import { parseDate, toDateString, isDateInRange, getToday, formatDateUK } from './date-utils.js';

/**
 * Calendar Date Validation System
 * Handles all validation rules and date constraint checking
 */
export class CalendarValidator {
    constructor(formElement) {
        this.form = formElement;
        this.validationType = this.form.dataset.validation;
        this.today = getToday(); // Use unified today calculation
    }

    /**
     * Main validation method
     * @param {string} dateString - Date string to validate
     * @returns {Object} { valid: boolean, reason: string }
     */
    validateDate(dateString) {
        try {
            const parsedDate = parseDate(dateString);
            if (!parsedDate) {
                return { valid: false, reason: 'Invalid date format' };
            }

            switch (this.validationType) {
                case 'future':
                    return this.validateFuture(parsedDate);
                case 'past':
                    return this.validatePast(parsedDate);
                case 'range':
                    return this.validateRange(parsedDate);
                case 'year':
                    return this.validateYear(parsedDate);
                case 'custom':
                    return this.validateCustomRange(parsedDate);
                case 'weekdays':
                    return this.validateWeekdays(parsedDate);
                case 'weekends':
                    return this.validateWeekends(parsedDate);
                case 'days':
                    return this.validateSpecificDays(parsedDate);
                case 'blackout':
                    return this.validateBlackout(parsedDate);
                case 'advance-notice':
                    return this.validateAdvanceNotice(parsedDate);
                case 'booking-window':
                    return this.validateBookingWindow(parsedDate);
                case 'business':
                    return this.validateBusinessRules(parsedDate);
                case 'none':
                default:
                    return { valid: true, reason: '' };
            }
        } catch (error) {
            return { valid: false, reason: 'Date parsing error' };
        }
    }

    validateFuture(date) {
        if (!date.isBefore(this.today)) {
            return { valid: true, reason: '' };
        }
        return { valid: false, reason: 'Only future dates are allowed' };
    }

    validatePast(date) {
        if (!date.isAfter(this.today)) {
            return { valid: true, reason: '' };
        }
        return { valid: false, reason: 'Only past dates are allowed' };
    }

    validateRange(date) {
        const startDate = this.form.dataset.rangeStart ? parseDate(this.form.dataset.rangeStart) : null;
        const endDate = this.form.dataset.rangeEnd ? parseDate(this.form.dataset.rangeEnd) : null;

        if (!startDate && !endDate) {
            return { valid: false, reason: 'Range validation requires start or end date' };
        }

        if (startDate && date.isBefore(startDate)) {
            return { valid: false, reason: `Date must be after ${this.formatDate(startDate)}` };
        }

        if (endDate && date.isAfter(endDate)) {
            return { valid: false, reason: `Date must be before ${this.formatDate(endDate)}` };
        }

        return { valid: true, reason: '' };
    }

    validateYear(date) {
        const targetYear = parseInt(this.form.dataset.year);
        if (!targetYear) {
            return { valid: false, reason: 'Year validation requires data-year attribute' };
        }

        if (date.year() === targetYear) {
            return { valid: true, reason: '' };
        }

        return { valid: false, reason: `Only dates in ${targetYear} are allowed` };
    }

    validateCustomRange(date) {
        const minDate = this.form.dataset.minDate ? parseDate(this.form.dataset.minDate) : null;
        const maxDate = this.form.dataset.maxDate ? parseDate(this.form.dataset.maxDate) : null;

        if (minDate && date.isBefore(minDate)) {
            return { valid: false, reason: `Date must be after ${this.formatDate(minDate)}` };
        }

        if (maxDate && date.isAfter(maxDate)) {
            return { valid: false, reason: `Date must be before ${this.formatDate(maxDate)}` };
        }

        return { valid: true, reason: '' };
    }

    validateWeekdays(date) {
        const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            return { valid: true, reason: '' };
        }
        return { valid: false, reason: 'Only weekdays are allowed' };
    }

    validateWeekends(date) {
        const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return { valid: true, reason: '' };
        }
        return { valid: false, reason: 'Only weekends are allowed' };
    }

    validateSpecificDays(date) {
        const allowedDays = this.form.dataset.allowedDays?.split(',').map(d => parseInt(d.trim()));
        if (!allowedDays || allowedDays.length === 0) {
            return { valid: false, reason: 'No allowed days specified' };
        }

        const dayOfWeek = date.day();
        if (allowedDays.includes(dayOfWeek)) {
            return { valid: true, reason: '' };
        }

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const allowedDayNames = allowedDays.map(d => dayNames[d]).join(', ');
        return { valid: false, reason: `Only ${allowedDayNames} are allowed` };
    }

    validateBlackout(date) {
        const blackoutDates = this.form.dataset.blackoutDates?.split(',').map(d => d.trim()) || [];
        const blackoutRanges = this.form.dataset.blackoutRanges?.split(',').map(r => r.trim()) || [];

        // Check specific blackout dates
        const dateStr = toDateString(date);
        if (blackoutDates.includes(dateStr)) {
            return { valid: false, reason: 'Date is not available' };
        }

        // Check blackout ranges
        for (const range of blackoutRanges) {
            const [startStr, endStr] = range.split(':');
            if (startStr && endStr) {
                const startDate = parseDate(startStr);
                const endDate = parseDate(endStr);
                if (!date.isBefore(startDate) && !date.isAfter(endDate)) {
                    return { valid: false, reason: 'Date is in blackout period' };
                }
            }
        }

        return { valid: true, reason: '' };
    }

    validateAdvanceNotice(date) {
        const minAdvanceDays = parseInt(this.form.dataset.minAdvanceDays) || 0;
        const minDate = this.today.add(minAdvanceDays, 'day');

        if (!date.isBefore(minDate)) {
            return { valid: true, reason: '' };
        }

        return { valid: false, reason: `Requires ${minAdvanceDays} days advance notice` };
    }

    validateBookingWindow(date) {
        const maxAdvanceDays = parseInt(this.form.dataset.maxAdvanceDays) || 365;
        const maxDate = this.today.add(maxAdvanceDays, 'day');

        if (!date.isAfter(maxDate)) {
            return { valid: true, reason: '' };
        }

        return { valid: false, reason: `Cannot book more than ${maxAdvanceDays} days in advance` };
    }

    validateBusinessRules(date) {
        // Combine multiple business rules
        const advanceNotice = this.validateAdvanceNotice(date);
        if (!advanceNotice.valid) return advanceNotice;

        const bookingWindow = this.validateBookingWindow(date);
        if (!bookingWindow.valid) return bookingWindow;

        const specificDays = this.validateSpecificDays(date);
        if (!specificDays.valid) return specificDays;

        return { valid: true, reason: '' };
    }

    needsRevalidation() {
        // Return true if validation depends on current selections (e.g., max selections)
        return this.form.dataset.maxSelections || this.validationType === 'consecutive';
    }

    formatDate(date) {
        // Convert Day.js object to native Date for Intl formatting
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date.toDate());
    }
}

/**
 * Disable a date checkbox with visual feedback
 */
export function disableDateCheckbox(checkbox, reason) {
    const dayContainer = checkbox.closest('.dgwltd-calendar__day');
    const label = dayContainer.querySelector('.govuk-checkboxes__label');
    
    // Disable the checkbox
    checkbox.disabled = true;
    checkbox.setAttribute('aria-describedby', checkbox.id + '-disabled-reason');
    
    // Add visual styling
    dayContainer.classList.add('dgwltd-calendar__day--disabled');
    
    // Add hidden description for screen readers
    let reasonElement = dayContainer.querySelector('.dgwltd-calendar__disabled-reason');
    if (!reasonElement) {
        reasonElement = document.createElement('span');
        reasonElement.className = 'dgwltd-calendar__disabled-reason govuk-visually-hidden';
        reasonElement.id = checkbox.id + '-disabled-reason';
        dayContainer.appendChild(reasonElement);
    }
    reasonElement.textContent = reason;
    
    // Add title attribute for tooltip
    label.setAttribute('title', reason);
}

/**
 * Enable a date checkbox
 */
export function enableDateCheckbox(checkbox) {
    const dayContainer = checkbox.closest('.dgwltd-calendar__day');
    const label = dayContainer.querySelector('.govuk-checkboxes__label');
    const reasonElement = dayContainer.querySelector('.dgwltd-calendar__disabled-reason');
    
    // Enable the checkbox
    checkbox.disabled = false;
    checkbox.removeAttribute('aria-describedby');
    
    // Remove visual styling
    dayContainer.classList.remove('dgwltd-calendar__day--disabled');
    
    // Remove screen reader description
    if (reasonElement) {
        reasonElement.remove();
    }
    
    // Remove tooltip
    label.removeAttribute('title');
}

/**
 * Re-validate all dates (for dynamic constraints)
 */
export function revalidateAllDates(validator, checkboxes) {
    checkboxes.forEach(checkbox => {
        const validation = validator.validateDate(checkbox.value);
        
        if (!validation.valid) {
            disableDateCheckbox(checkbox, validation.reason);
        } else {
            enableDateCheckbox(checkbox);
        }
    });
}