import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Enable plugins for consistent timezone handling and comparisons
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Unified Date Utilities for Calendar System
 * Provides consistent date handling across all calendar modules
 * Uses Day.js for reliable, production-ready date operations
 */

/**
 * Parse any date input and return a normalized Day.js object
 * @param {string|Date|dayjs} input - Date input in any format
 * @returns {dayjs.Dayjs} Normalized Day.js object
 */
export function parseDate(input) {
    if (!input) return null;
    
    // Handle Day.js objects
    if (dayjs.isDayjs(input)) {
        return input.startOf('day'); // Normalize to start of day
    }
    
    // Handle strings and Date objects
    const parsed = dayjs(input);
    
    if (!parsed.isValid()) {
        console.warn('Invalid date input:', input);
        return null;
    }
    
    // Normalize to start of day to avoid time-based issues
    return parsed.startOf('day');
}

/**
 * Convert any date input to YYYY-MM-DD string format
 * @param {string|Date|dayjs} input - Date input in any format
 * @returns {string} YYYY-MM-DD formatted string or empty string if invalid
 */
export function toDateString(input) {
    const date = parseDate(input);
    return date ? date.format('YYYY-MM-DD') : '';
}

/**
 * Get today's date as a normalized Day.js object
 * @returns {dayjs.Dayjs} Today at start of day
 */
export function getToday() {
    return dayjs().startOf('day');
}

/**
 * Generate an array of dates between two dates (inclusive)
 * @param {string|Date|dayjs} startDate - Start date
 * @param {string|Date|dayjs} endDate - End date  
 * @returns {string[]} Array of YYYY-MM-DD formatted date strings
 */
export function getDateRange(startDate, endDate) {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    if (!start || !end || !start.isValid() || !end.isValid()) {
        console.warn('Invalid date range:', startDate, endDate);
        return [];
    }
    
    // Ensure correct order
    const [rangeStart, rangeEnd] = start.isAfter(end) ? [end, start] : [start, end];
    
    const dates = [];
    let current = rangeStart;
    
    // Include both start and end dates
    while (current.isSameOrBefore(rangeEnd)) {
        dates.push(current.format('YYYY-MM-DD'));
        current = current.add(1, 'day');
    }
    
    return dates;
}

/**
 * Check if a date is within a range (inclusive)
 * @param {string|Date|dayjs} date - Date to check
 * @param {string|Date|dayjs} startDate - Range start
 * @param {string|Date|dayjs} endDate - Range end
 * @returns {boolean} True if date is within range
 */
export function isDateInRange(date, startDate, endDate) {
    const target = parseDate(date);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    if (!target || !start || !end) return false;
    
    return target.isSameOrAfter(start) && target.isSameOrBefore(end);
}

/**
 * Check if a date is in an array of date strings
 * @param {string|Date|dayjs} date - Date to check
 * @param {string[]} dateArray - Array of YYYY-MM-DD strings
 * @returns {boolean} True if date is in array
 */
export function isDateInArray(date, dateArray) {
    const dateStr = toDateString(date);
    return dateArray.includes(dateStr);
}

/**
 * Format a date for display
 * @param {string|Date|dayjs} date - Date to format
 * @param {string} format - Day.js format string (default: 'MMMM D, YYYY')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'MMMM D, YYYY') {
    const parsed = parseDate(date);
    return parsed ? parsed.format(format) : '';
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 * @param {string|Date|dayjs} date - Date to check
 * @returns {number} Day of week number
 */
export function getDayOfWeek(date) {
    const parsed = parseDate(date);
    return parsed ? parsed.day() : -1;
}

/**
 * Check if date is today
 * @param {string|Date|dayjs} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
    const parsed = parseDate(date);
    const today = getToday();
    return parsed ? parsed.isSame(today, 'day') : false;
}

/**
 * Check if date is in the past
 * @param {string|Date|dayjs} date - Date to check
 * @returns {boolean} True if date is before today
 */
export function isPast(date) {
    const parsed = parseDate(date);
    const today = getToday();
    return parsed ? parsed.isBefore(today, 'day') : false;
}

/**
 * Check if date is in the future
 * @param {string|Date|dayjs} date - Date to check
 * @returns {boolean} True if date is after today
 */
export function isFuture(date) {
    const parsed = parseDate(date);
    const today = getToday();
    return parsed ? parsed.isAfter(today, 'day') : false;
}