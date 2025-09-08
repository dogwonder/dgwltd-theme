import { parseDate, getDateRange, isDateInArray, toDateString } from './date-utils.js';

/**
 * Smart Date Range Selection System
 * Handles range selection with mobile-friendly click-to-click pattern
 */
export class DateRangeSelector {
    constructor(calendarForm, validator) {
        this.form = calendarForm;
        this.validator = validator;
        this.lastSelectedDate = null;
        this.isRangeMode = false;
        this.previewRange = [];
        
        this.init();
    }
    
    init() {
        const checkboxes = this.form.querySelectorAll('input[name="selected_dates[]"]');
        
        checkboxes.forEach(checkbox => {
            // Add click handler for range selection
            checkbox.addEventListener('click', (e) => this.handleDateClick(e, checkbox));
            
            // Add hover handlers for range preview
            checkbox.addEventListener('mouseenter', (e) => this.handleDateHover(e, checkbox));
            checkbox.addEventListener('mouseleave', () => this.clearRangePreview());
        });
        
        // Clear range mode on outside click
        document.addEventListener('click', (e) => {
            if (!this.form.contains(e.target)) {
                this.exitRangeMode();
            }
        });
    }
    
    handleDateClick(event, checkbox) {
        if (checkbox.disabled) {
            event.preventDefault();
            return false;
        }
        
        const currentDate = parseDate(checkbox.value);
        
        // If we're in range mode and have a start date
        if (this.isRangeMode && this.lastSelectedDate) {
            event.preventDefault();
            
            // Ensure the clicked checkbox is checked (since we prevented default)
            checkbox.checked = true;
            
            // Complete the range selection
            this.selectDateRange(this.lastSelectedDate, currentDate, checkbox);
            this.exitRangeMode();
            return false;
        }
        
        // First click or regular selection
        if (checkbox.checked) {
            this.lastSelectedDate = currentDate;
            this.isRangeMode = true;
            this.showRangeStartFeedback(checkbox);
        } else {
            // If unchecking, exit range mode
            this.exitRangeMode();
        }
    }
    
    handleDateHover(event, checkbox) {
        if (!this.isRangeMode || !this.lastSelectedDate || checkbox.disabled) {
            return;
        }
        
        const hoverDate = parseDate(checkbox.value);
        this.showRangePreview(this.lastSelectedDate, hoverDate);
    }
    
    selectDateRange(startDate, endDate) {
        // Ensure correct order
        if (startDate > endDate) {
            [startDate, endDate] = [endDate, startDate];
        }
        
        // Get all dates in range using unified utility
        const datesInRange = getDateRange(startDate, endDate);
        
        // Debug logging
        console.log('Range selection debug:', {
            startDate: toDateString(startDate),
            endDate: toDateString(endDate), 
            datesInRange: datesInRange
        });
        
        // Select all valid dates in range
        const checkboxes = this.form.querySelectorAll('input[name="selected_dates[]"]');
        
        let selectedCount = 0;
        checkboxes.forEach(checkbox => {
            const checkboxValue = checkbox.value; // This is already a YYYY-MM-DD string
            const inRange = isDateInArray(checkboxValue, datesInRange);
            const isDisabled = checkbox.disabled;
            
            console.log('Checkbox check:', {
                value: checkboxValue,
                inRange: inRange,
                disabled: isDisabled,
                willSelect: inRange && !isDisabled
            });
            
            if (inRange && !isDisabled) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                selectedCount++;
                console.log('✅ Selected checkbox:', checkboxValue);
            }
        });
        
        console.log(`Total selected: ${selectedCount} out of ${datesInRange.length} dates in range`);
        
        this.clearRangePreview();
    }
    
    
    showRangePreview(startDate, endDate) {
        this.clearRangePreview();
        
        // Ensure correct order
        if (startDate > endDate) {
            [startDate, endDate] = [endDate, startDate];
        }
        
        const datesInRange = getDateRange(startDate, endDate);
        const checkboxes = this.form.querySelectorAll('input[name="selected_dates[]"]');
        
        checkboxes.forEach(checkbox => {
            const checkboxDate = checkbox.value;
            
            if (isDateInArray(checkboxDate, datesInRange) && !checkbox.disabled) {
                const dayContainer = checkbox.closest('.dgwltd-calendar__day');
                dayContainer.classList.add('dgwltd-calendar__day--preview-range');
            }
        });
        
        this.previewRange = datesInRange;
    }
    
    clearRangePreview() {
        const previewElements = this.form.querySelectorAll('.dgwltd-calendar__day--preview-range');
        previewElements.forEach(el => {
            el.classList.remove('dgwltd-calendar__day--preview-range');
        });
        this.previewRange = [];
    }
    
    showRangeStartFeedback(checkbox) {
        // Add visual feedback for range start
        const dayContainer = checkbox.closest('.dgwltd-calendar__day');
        dayContainer.classList.add('dgwltd-calendar__day--range-start');
        
        // Add instruction text
        this.showRangeInstruction();
    }
    
    showRangeInstruction() {
        // Remove any existing instruction
        const existingInstruction = this.form.querySelector('.dgwltd-calendar__range-instruction');
        if (existingInstruction) {
            existingInstruction.remove();
        }
        
        // Add new instruction
        const instruction = document.createElement('div');
        instruction.className = 'dgwltd-calendar__range-instruction';
        instruction.setAttribute('role', 'status');
        instruction.textContent = 'Range start selected. Click another date to complete the range.';
        
        const hint = this.form.querySelector('#calendar-hint');
        if (hint) {
            hint.appendChild(instruction);
        }
    }
    
    exitRangeMode() {
        this.isRangeMode = false;
        this.lastSelectedDate = null;
        this.clearRangePreview();
        this.clearRangeStartFeedback();
        this.clearRangeInstruction();
    }
    
    clearRangeStartFeedback() {
        const rangeStartElements = this.form.querySelectorAll('.dgwltd-calendar__day--range-start');
        rangeStartElements.forEach(el => {
            el.classList.remove('dgwltd-calendar__day--range-start');
        });
    }
    
    clearRangeInstruction() {
        const instruction = this.form.querySelector('.dgwltd-calendar__range-instruction');
        if (instruction) {
            instruction.remove();
        }
    }
}

/**
 * Add instructional text for range selection
 */
export function addRangeInstructions(form) {
    const hint = form.querySelector('#calendar-hint');
    if (hint) {
        const rangeInstruction = document.createElement('div');
        rangeInstruction.className = 'dgwltd-calendar__range-hint';
        rangeInstruction.innerHTML = '<div class="govuk-phase-banner"><p class="govuk-phase-banner__content"><strong class="govuk-tag govuk-phase-banner__content__tag">Tip</strong> <span class="govuk-phase-banner__text">Click two dates to select a date range</span></p></div>';
        hint.appendChild(rangeInstruction);
    }
}