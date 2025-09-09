import { parseDate } from './date-utils.js';

/**
 * Lightweight Calendar Form Validation
 * Handles time requirement validation and single date input validation
 */
export class CalendarFormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.submitButton = this.form.querySelector('button[type="submit"]:not([name="clear_selection"])');
        this.timeSelect = this.form.querySelector('#cal_time');
        this.singleDateInputs = {
            day: this.form.querySelector('#calendar-single-day'),
            month: this.form.querySelector('#calendar-single-month'),
            year: this.form.querySelector('#calendar-single-year')
        };
        
        this.init();
    }

    init() {
        // Time requirement validation
        if (this.form.dataset.required === 'time' && this.timeSelect && this.submitButton) {
            this.initTimeValidation();
        }

        // Single date input validation
        if (this.singleDateInputs.day && this.singleDateInputs.month && this.singleDateInputs.year) {
            this.initSingleDateValidation();
        }

        // Form submit validation
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    initTimeValidation() {
        const updateSubmitButton = () => {
            const hasTime = this.timeSelect.value.trim() !== '';
            this.submitButton.disabled = !hasTime;
            
            if (!hasTime) {
                this.submitButton.setAttribute('title', 'Please select a time before continuing');
            } else {
                this.submitButton.removeAttribute('title');
            }
        };

        // Initial check
        updateSubmitButton();

        // Update on time change
        this.timeSelect.addEventListener('change', updateSubmitButton);
    }

    initSingleDateValidation() {
        // Validate when all fields are filled and user moves away from date inputs
        Object.values(this.singleDateInputs).forEach(input => {
            input.addEventListener('blur', () => {
                // Only validate if all three fields have values
                if (this.hasCompleteDate()) {
                    this.validateSingleDate();
                } else {
                    // Clear any existing errors if date is incomplete
                    this.clearSingleDateErrors();
                    this.updateErrorDisplay();
                }
            });

            // Clear errors when user starts typing after an error
            input.addEventListener('input', () => {
                if (input.classList.contains('govuk-input--error')) {
                    this.clearSingleDateErrors();
                    this.updateErrorDisplay();
                }
            });
        });
    }

    hasCompleteDate() {
        const day = this.singleDateInputs.day.value.trim();
        const month = this.singleDateInputs.month.value.trim();
        const year = this.singleDateInputs.year.value.trim();

        // All three fields must have values
        return day !== '' && month !== '' && year !== '';
    }

    validateSingleDate() {
        // Only validate if we have a complete date
        if (!this.hasCompleteDate()) {
            this.clearSingleDateErrors();
            this.updateErrorDisplay();
            return { valid: true, errors: [] };
        }

        const day = this.singleDateInputs.day.value.trim();
        const month = this.singleDateInputs.month.value.trim();
        const year = this.singleDateInputs.year.value.trim();

        const errors = [];
        const invalidFields = [];

        // Basic field validation
        if (isNaN(parseInt(day)) || parseInt(day) < 1 || parseInt(day) > 31) {
            errors.push('Enter a valid day');
            invalidFields.push('day');
        }

        if (isNaN(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
            errors.push('Enter a valid month');
            invalidFields.push('month');
        }

        if (isNaN(parseInt(year)) || parseInt(year) < 1900 || parseInt(year) > 2100) {
            errors.push('Enter a valid year');
            invalidFields.push('year');
        }

        // Day.js validation if basic fields are valid
        if (errors.length === 0) {
            const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const dayJsDate = parseDate(dateString);
            
            if (!dayJsDate || !dayJsDate.isValid()) {
                errors.push('Enter a real date');
                invalidFields.push('day', 'month', 'year');
            } else {
                // Check if date is in the past (optional)
                const today = parseDate();
                if (dayJsDate.isBefore(today, 'day')) {
                    errors.push('Enter a date in the future');
                    invalidFields.push('day', 'month', 'year');
                }
            }
        }

        // Apply error styling
        this.clearSingleDateErrors();
        invalidFields.forEach(field => {
            if (this.singleDateInputs[field]) {
                this.singleDateInputs[field].classList.add('govuk-input--error');
            }
        });

        // Update error display
        this.updateErrorDisplay(errors);

        return { valid: errors.length === 0, errors };
    }

    clearSingleDateErrors() {
        Object.values(this.singleDateInputs).forEach(input => {
            input.classList.remove('govuk-input--error');
        });
    }

    updateErrorDisplay(errors = []) {
        const errorSummary = this.form.querySelector('.govuk-error-summary');
        const errorList = this.form.querySelector('.govuk-error-summary__list');
        
        if (!errorSummary || !errorList) return;

        if (errors.length === 0) {
            errorSummary.setAttribute('hidden', '');
            errorList.innerHTML = '';
            return;
        }

        // Populate error list
        const errorItems = errors.map(error => 
            `<li><a href="#calendar-single">${error}</a></li>`
        ).join('');
        
        errorList.innerHTML = errorItems;
        errorSummary.removeAttribute('hidden');
        
        // Focus the error summary for accessibility
        errorSummary.focus();
    }

    handleSubmit(e) {
        let hasErrors = false;

        // Only validate on submit if we have a complete date
        if (this.hasCompleteDate()) {
            const validation = this.validateSingleDate();
            if (!validation.valid) {
                hasErrors = true;
                // Focus first invalid field
                const firstErrorField = Object.values(this.singleDateInputs).find(input => 
                    input.classList.contains('govuk-input--error')
                );
                if (firstErrorField) {
                    firstErrorField.focus();
                }
            }
        }

        if (hasErrors) {
            e.preventDefault();
        }
    }
}

/**
 * Initialize form validation when DOM is ready
 */
export function initializeFormValidation() {
    const calendarForm = document.querySelector('.dgwltd-calendar__form');
    if (calendarForm) {
        new CalendarFormValidator(calendarForm);
        console.log('✅ Calendar Form Validation initialized');
    }
}