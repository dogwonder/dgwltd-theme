import { toDateString, getToday } from './date-utils.js';

/**
 * Calendar Quick Navigation System
 * Provides jump to today, next available date, and keyboard shortcuts
 */
export class CalendarNavigation {
    constructor(calendarForm, validator) {
        this.form = calendarForm;
        this.validator = validator;
        this.today = getToday();
        
        this.init();
    }
    
    init() {
        this.addNavigationControls();
        this.addKeyboardShortcuts();
    }
    
    addNavigationControls() {
        // Find the calendar navigation area
        const paginationNav = this.form.querySelector('.govuk-pagination');
        if (!paginationNav) return;
        
        // Create navigation controls container
        const navControls = document.createElement('div');
        navControls.className = 'dgwltd-calendar__quick-nav';
        
        // Jump to today button
        const todayButton = this.createTodayButton();
        navControls.appendChild(todayButton);
        
        // Next available date button
        const nextAvailableButton = this.createNextAvailableButton();
        navControls.appendChild(nextAvailableButton);
        
        // Add keyboard shortcuts hint
        const shortcutsHint = this.createShortcutsHint();
        navControls.appendChild(shortcutsHint);
        
        // Insert before pagination
        paginationNav.parentNode.insertBefore(navControls, paginationNav);
    }
    
    createTodayButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'govuk-button govuk-button--secondary dgwltd-calendar__today-btn';
        button.textContent = 'Jump to Today';
        button.setAttribute('title', 'Navigate to current month and highlight today');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.jumpToToday();
        });
        
        return button;
    }
    
    createNextAvailableButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'govuk-button govuk-button--secondary dgwltd-calendar__next-available-btn';
        button.textContent = 'Next Available';
        button.setAttribute('title', 'Find and navigate to next available date');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.findNextAvailableDate();
        });
        
        return button;
    }
    
    createShortcutsHint() {
        const hint = document.createElement('div');
        hint.className = 'dgwltd-calendar__shortcuts-hint';
        hint.innerHTML = '<small><strong>Shortcuts:</strong> T = Today, N = Next Available</small>';
        return hint;
    }
    
    addKeyboardShortcuts() {
        // Add keyboard event listener
        document.addEventListener('keydown', (e) => {
            // Only activate when calendar form has focus or contains focused element
            if (!this.form.contains(document.activeElement)) {
                return;
            }
            
            // Don't interfere with form inputs
            if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case 't':
                    e.preventDefault();
                    this.jumpToToday();
                    break;
                case 'n':
                    e.preventDefault();
                    this.findNextAvailableDate();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    this.navigateToPreviousMonth();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    this.navigateToNextMonth();
                    break;
            }
        });
    }
    
    jumpToToday() {
        const currentMonth = this.getCurrentMonthFromUrl();
        const currentYear = this.getCurrentYearFromUrl();
        const todayMonth = this.today.month() + 1; // Day.js month() is 0-based
        const todayYear = this.today.year();
        
        // If we're not in today's month, navigate there
        if (currentMonth !== todayMonth || currentYear !== todayYear) {
            this.navigateToMonth(todayYear, todayMonth);
        } else {
            // We're already in today's month, just highlight today
            this.highlightToday();
        }
        
        // Show feedback
        this.showNavigationFeedback(`Navigated to ${this.formatDate(this.today)}`);
    }
    
    findNextAvailableDate() {
        const nextAvailable = this.findNextValidDate();
        
        if (nextAvailable) {
            const targetMonth = nextAvailable.month() + 1;
            const targetYear = nextAvailable.year();
            const currentMonth = this.getCurrentMonthFromUrl();
            const currentYear = this.getCurrentYearFromUrl();
            
            // Navigate to the month containing the next available date
            if (currentMonth !== targetMonth || currentYear !== targetYear) {
                // Add the date to URL so it gets highlighted when we navigate
                const dateStr = toDateString(nextAvailable);
                const newUrl = this.addHighlightParam(
                    this.buildNavigationUrl(targetYear, targetMonth),
                    dateStr
                );
                window.location.href = newUrl;
            } else {
                // We're in the right month, just highlight the date
                this.highlightDate(nextAvailable);
                this.showNavigationFeedback(`Next available date: ${this.formatDate(nextAvailable)}`);
            }
        } else {
            this.showNavigationFeedback('No available dates found in the next 365 days', 'error');
        }
    }
    
    findNextValidDate() {
        let testDate = this.today.add(1, 'day'); // Start from tomorrow
        
        // Search up to 365 days ahead
        for (let i = 0; i < 365; i++) {
            const dateStr = toDateString(testDate);
            const validation = this.validator.validateDate(dateStr);
            
            if (validation.valid) {
                return testDate;
            }
            
            testDate = testDate.add(1, 'day');
        }
        
        return null;
    }
    
    highlightToday() {
        const todayStr = toDateString(this.today);
        const todayCheckbox = this.form.querySelector(`input[value="${todayStr}"]`);
        
        if (todayCheckbox) {
            this.highlightCheckbox(todayCheckbox, 'today');
        }
    }
    
    highlightDate(date) {
        const dateStr = toDateString(date);
        const checkbox = this.form.querySelector(`input[value="${dateStr}"]`);
        
        if (checkbox) {
            this.highlightCheckbox(checkbox, 'next-available');
            // Scroll into view
            checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    highlightCheckbox(checkbox, type) {
        const dayContainer = checkbox.closest('.dgwltd-calendar__day');
        
        // Remove any existing highlight
        dayContainer.classList.remove('dgwltd-calendar__day--highlight-today', 'dgwltd-calendar__day--highlight-next');
        
        // Add appropriate highlight
        const highlightClass = type === 'today' 
            ? 'dgwltd-calendar__day--highlight-today'
            : 'dgwltd-calendar__day--highlight-next';
            
        dayContainer.classList.add(highlightClass);
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            dayContainer.classList.remove(highlightClass);
        }, 3000);
    }
    
    navigateToPreviousMonth() {
        const currentMonth = this.getCurrentMonthFromUrl();
        const currentYear = this.getCurrentYearFromUrl();
        
        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        
        if (prevMonth < 1) {
            prevMonth = 12;
            prevYear = currentYear - 1;
        }
        
        this.navigateToMonth(prevYear, prevMonth);
    }
    
    navigateToNextMonth() {
        const currentMonth = this.getCurrentMonthFromUrl();
        const currentYear = this.getCurrentYearFromUrl();
        
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear = currentYear + 1;
        }
        
        this.navigateToMonth(nextYear, nextMonth);
    }
    
    navigateToMonth(year, month) {
        const url = this.buildNavigationUrl(year, month);
        window.location.href = url;
    }
    
    buildNavigationUrl(year, month) {
        const baseUrl = this.removeQueryParams(window.location.href, ['cal_month', 'cal_year', 'highlight']);
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}cal_year=${year}&cal_month=${month}`;
    }
    
    addHighlightParam(url, dateStr) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}highlight=${dateStr}`;
    }
    
    getCurrentMonthFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('cal_month')) || new Date().getMonth() + 1;
    }
    
    getCurrentYearFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('cal_year')) || new Date().getFullYear();
    }
    
    removeQueryParams(url, params) {
        const urlObj = new URL(url);
        params.forEach(param => {
            urlObj.searchParams.delete(param);
        });
        return urlObj.toString();
    }
    
    showNavigationFeedback(message, type = 'info') {
        // Remove existing feedback
        const existingFeedback = this.form.querySelector('.dgwltd-calendar__nav-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `dgwltd-calendar__nav-feedback dgwltd-calendar__nav-feedback--${type}`;
        feedback.setAttribute('role', 'status');
        feedback.textContent = message;
        
        // Add to form
        const hint = this.form.querySelector('#calendar-hint');
        if (hint) {
            hint.appendChild(feedback);
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }
    
    formatDate(date) {
        // Convert Day.js object to native Date for Intl formatting
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date.toDate());
    }
}

/**
 * Initialize highlighting for dates specified in URL
 */
export function initializeHighlighting(form) {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightDate = urlParams.get('highlight');
    
    if (highlightDate) {
        const checkbox = form.querySelector(`input[value="${highlightDate}"]`);
        if (checkbox) {
            const dayContainer = checkbox.closest('.dgwltd-calendar__day');
            dayContainer.classList.add('dgwltd-calendar__day--highlight-next');
            
            // Scroll into view
            checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
                dayContainer.classList.remove('dgwltd-calendar__day--highlight-next');
            }, 5000);
        }
    }
}