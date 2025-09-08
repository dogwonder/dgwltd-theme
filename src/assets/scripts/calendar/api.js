import { revalidateAllDates } from './validation.js';

//REquires validation method to be added data-validation="blackout"

// Simple test data - in production this would come from your API/JSON file
const TEST_DATA = {
  "unavailable_dates": [
    "2025-09-16",
    "2025-09-20", 
    "2025-09-25",
    "2025-12-25",
    "2025-01-01"
  ]
};

/**
 * Simple Calendar API Integration
 * Fetches unavailable dates and applies them as blackout dates
 */
export class CalendarAPI {
    constructor(calendarForm, validator) {
        this.form = calendarForm;
        this.validator = validator;
        this.apiEndpoint = this.form.dataset.apiEndpoint;
    }

    /**
     * Initialize API integration - fetch data and apply blackout dates
     */
    async init() {
        try {
            const data = await this.fetchUnavailableDates();
            this.applyBlackoutDates(data.unavailable_dates || []);
        } catch (error) {
            console.warn('Calendar API failed, using fallback:', error);
        }
    }

    /**
     * Fetch unavailable dates from API or use test data
     */
    async fetchUnavailableDates() {
        // For now, return test data - in production this would be:
        // const response = await fetch(this.apiEndpoint);
        // return await response.json();
        
        return Promise.resolve(TEST_DATA);
    }

    /**
     * Apply fetched dates as blackout dates by updating the form's data attribute
     * This integrates with the existing validation system
     */
    applyBlackoutDates(unavailableDates) {
        if (!unavailableDates || unavailableDates.length === 0) return;

        // Get existing blackout dates from form
        const existingBlackout = this.form.dataset.blackoutDates || '';
        const existingDates = existingBlackout ? existingBlackout.split(',').map(d => d.trim()) : [];
        
        // Combine existing and API dates, removing duplicates
        const allBlackoutDates = [...new Set([...existingDates, ...unavailableDates])];
        
        // Update form data attribute
        this.form.dataset.blackoutDates = allBlackoutDates.join(',');
        
        // Set validation type to blackout if not already set
        if (!this.form.dataset.validation) {
            this.form.dataset.validation = 'blackout';
        }
        
        // Re-validate all dates to apply the new blackout dates
        const dateCheckboxes = this.form.querySelectorAll('input[name="selected_dates[]"]');
        revalidateAllDates(this.validator, dateCheckboxes);
        
        console.log('✅ Applied blackout dates from API:', allBlackoutDates);
    }
}