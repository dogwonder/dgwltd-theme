# Calendar Enhancement Todo List

Progressive enhancement features using `@11ty/parse-date-strings` to complement the existing PHP calendar implementation.

## 1. Real-time Date Validation ✅ IMPLEMENTED

**Data-attribute configuration system:**

```php
<!-- No validation (default) -->
<form class="dgwltd-calendar__form">

<!-- Only future dates -->
<form class="dgwltd-calendar__form" data-validation="future">

<!-- Only past dates -->
<form class="dgwltd-calendar__form" data-validation="past">

<!-- Specific year only -->
<form class="dgwltd-calendar__form" data-validation="year" data-year="2025">

<!-- Date range -->
<form class="dgwltd-calendar__form" data-validation="range" 
      data-range-start="2025-01-01" 
      data-range-end="2025-12-31">

<!-- Custom min/max dates -->
<form class="dgwltd-calendar__form" data-validation="custom" 
      data-min-date="2025-03-01" 
      data-max-date="2025-06-30">
```

**PHP Implementation Examples:**

```php
// In calendar.php - add validation attributes based on context
$validation_attrs = '';

// Example: Only future bookings
if ($booking_type === 'future_only') {
    $validation_attrs = 'data-validation="future"';
}

// Example: Historical date picker
if ($is_historical) {
    $validation_attrs = 'data-validation="past"';
}

// Example: Limit to current year
if ($limit_to_year) {
    $current_year = date('Y');
    $validation_attrs = 'data-validation="year" data-year="' . esc_attr($current_year) . '"';
}

// Example: Event booking window
if ($event_start && $event_end) {
    $validation_attrs = sprintf(
        'data-validation="range" data-range-start="%s" data-range-end="%s"',
        esc_attr($event_start),
        esc_attr($event_end)
    );
}

// Apply to form
echo '<form method="post" action="' . esc_url($_SERVER['REQUEST_URI']) . '" class="dgwltd-calendar__form" ' . $validation_attrs . '>';
```

**Additional Validation Methods:**

```php
<!-- Day-of-week restrictions -->
<form data-validation="weekdays"> <!-- Monday-Friday only -->
<form data-validation="weekends"> <!-- Saturday-Sunday only -->
<form data-validation="days" data-allowed-days="1,3,5"> <!-- Mon, Wed, Fri -->

<!-- Blackout dates -->
<form data-validation="blackout" data-blackout-dates="2025-12-25,2025-01-01">
<form data-validation="blackout" data-blackout-ranges="2025-12-20:2025-01-05,2025-07-01:2025-07-15">

<!-- Business rules -->
<form data-validation="advance-notice" data-min-advance-days="3">
<form data-validation="booking-window" data-max-advance-days="90">
<form data-validation="business" data-min-advance-days="3" data-max-advance-days="90" data-allowed-days="1,2,3,4,5">
```

**Features implemented:**
- ✅ Configurable via data attributes
- ✅ Future/past date validation
- ✅ Year-specific validation  
- ✅ Date range validation
- ✅ Custom min/max date validation
- ✅ **Proactive checkbox disabling (no error messages after selection)**
- ✅ Day-of-week restrictions (weekdays, weekends, specific days)
- ✅ Blackout date/range exclusions
- ✅ Business rule validation (advance notice, booking windows)
- ✅ Accessible disabled state with tooltips and screen reader support
- ✅ Visual styling for disabled dates

## 2. Smart Date Range Selection ✅ IMPLEMENTED

**Data Attribute Configuration:**
```php
<!-- Enable range selection -->
<form class="dgwltd-calendar__form" data-range-selection="true">

<!-- Disable range selection (default) -->
<form class="dgwltd-calendar__form" data-range-selection="false">
<form class="dgwltd-calendar__form"> <!-- Default: disabled -->
```

**PHP Implementation Examples:**
```php
// Enable range selection for booking scenarios
$range_attrs = '';
if ($allow_range_selection) {
    $range_attrs = 'data-range-selection="true"';
}

// Apply to form
echo '<form method="post" action="' . esc_url($_SERVER['REQUEST_URI']) . '" class="dgwltd-calendar__form" ' . $range_attrs . '>';
```

**How it works (when enabled) - Mobile/Touch Friendly:**
1. **Click first date** → Shows "Range start selected" visual feedback + instruction
2. **Hover other dates** → Shows preview of potential range
3. **Click second date** → Auto-selects all dates between + completes range  
4. **Click elsewhere** → Exits range mode

**Features implemented:**
- ✅ **Optional via data-range-selection attribute (disabled by default)**
- ✅ **Mobile/touch accessible** - No keyboard modifiers required
- ✅ Click-first, click-second range selection pattern
- ✅ Visual feedback for range start selection
- ✅ Dynamic instruction text with ARIA status updates
- ✅ Hover preview of potential range
- ✅ Automatic intermediate date calculation using `@11ty/parse-date-strings`
- ✅ Respects disabled/invalid dates (skips them)
- ✅ Maintains normal checkbox behavior for single selections
- ✅ Clear visual feedback with CSS classes
- ✅ Accessible instructions only shown when enabled
- ✅ Exit range mode on outside click or uncheck

## 3. Date Conflict Detection

```javascript
// Check against booking data from REST API
function checkDateAvailability(selectedDates) {
    return selectedDates.map(dateStr => {
        const date = parse(dateStr);
        // Compare against unavailable dates from server
        return { date: dateStr, available: checkAgainstBookings(date) };
    });
}
```

**Implementation notes:**
- Integrate with WordPress REST API for booking data
- Add visual indicators for unavailable dates
- Disable unavailable date checkboxes
- Show tooltip/message explaining unavailability

## 4. Enhanced Date Display

```javascript
// Convert PHP date format to user-friendly display
function formatDateForUser(phpDateString) {
    const date = parse(phpDateString);
    return new Intl.DateTimeFormat('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    }).format(date);
}
```

**Implementation notes:**
- Enhance the selected dates notification banner
- Add tooltips with full date names
- Improve accessibility with better date descriptions
- Support multiple locale formats

## 5. Quick Date Navigation ✅ IMPLEMENTED

**Data Attribute Configuration:**
```php
<!-- Enable navigation -->
<form class="dgwltd-calendar__form" data-navigation="true">

<!-- Disable navigation (default) -->
<form class="dgwltd-calendar__form" data-navigation="false">
<form class="dgwltd-calendar__form"> <!-- Default: disabled -->
```

**PHP Implementation Examples:**
```php
// Enable navigation for complex booking systems
$nav_attrs = '';
if ($enable_navigation) {
    $nav_attrs = 'data-navigation="true"';
}

// Apply to form
echo '<form method="post" action="' . esc_url($_SERVER['REQUEST_URI']) . '" class="dgwltd-calendar__form" ' . $nav_attrs . '>';
```

**Features implemented (when enabled):**
- ✅ **Optional via data-navigation attribute (disabled by default)**
- ✅ **"Jump to Today" button** - Navigate to current month and highlight today's date
- ✅ **"Next Available Date" finder** - Finds and navigates to next valid date (searches 365 days ahead)
- ✅ **Keyboard shortcuts:**
  - `T` key = Jump to Today
  - `N` key = Next Available Date  
  - `←` key = Previous Month
  - `→` key = Next Month
- ✅ **Visual date highlighting** - Temporary highlights for today and next available dates
- ✅ **URL-based navigation** - Support for highlighting dates via URL parameters (always available)
- ✅ **Accessible feedback** - ARIA status updates and screen reader announcements
- ✅ **Smooth scrolling** - Auto-scroll to highlighted dates
- ✅ **Smart month navigation** - Auto-navigate to months containing target dates

**How it works (when enabled):**
1. **Navigation controls** added above calendar pagination
2. **Keyboard shortcuts** active when calendar has focus
3. **URL highlighting** via `?highlight=2025-01-15` parameter (always works)
4. **Validation integration** - Next Available respects all validation rules
5. **Visual feedback** - Status messages and temporary highlighting

## 6. Date Summary Calculations

```javascript
// Real-time calculations without server round-trip
function calculateBookingSummary(selectedDates) {
    const dates = selectedDates.map(parse).sort();
    return {
        count: dates.length,
        firstDate: dates[0],
        lastDate: dates[dates.length - 1],
        totalDays: calculateDaysBetween(dates[0], dates[dates.length - 1])
    };
}
```

**Implementation notes:**
- Add live summary widget showing selection stats
- Calculate booking duration and costs
- Update summary in real-time as selections change
- Display in existing notification banner area

## 7. Accessibility Improvements

- Screen reader announcements for date selections
- Keyboard navigation with date parsing for focus management
- Live region updates with formatted date strings

**Implementation notes:**
- Add ARIA live regions for dynamic updates
- Implement proper focus management
- Enhanced keyboard navigation patterns
- Screen reader friendly date announcements

## 8. URL State Synchronization

```javascript
// Parse URL parameters and sync with calendar state
function syncWithUrlParams() {
    const urlDates = new URLSearchParams(location.search).getAll('cal_dates');
    return urlDates.map(dateStr => ({
        original: dateStr,
        parsed: parse(dateStr),
        valid: validateDateInput(dateStr)
    }));
}
```

**Implementation notes:**
- Maintain browser back/forward compatibility
- Sync JavaScript state with URL parameters
- Handle malformed URL date parameters gracefully
- Preserve existing WordPress URL structure

## Priority Implementation Order

1. **✅ Real-time Date Validation** - Foundation for other features - **COMPLETED**
2. **Smart Date Range Selection** - High UX impact
3. **Enhanced Date Display** - Improves usability immediately  
4. **Date Summary Calculations** - Provides booking context
5. **Quick Date Navigation** - Power user features
6. **URL State Synchronization** - Technical robustness
7. **Accessibility Improvements** - Continuous enhancement
8. **Date Conflict Detection** - Requires backend integration

## Technical Considerations

- Maintain progressive enhancement (calendar works without JavaScript)
- Preserve existing PHP functionality and security
- Follow WordPress coding standards for JavaScript
- Ensure compatibility with GOV.UK Design System styling
- Test across all target browsers and assistive technologies
- Integration with existing build process (`npm run watch`/`npm run build`)

## Modular Architecture ✅ IMPLEMENTED

The JavaScript has been split into focused, maintainable modules:

**File Structure:**
```
src/assets/scripts/
├── calendar.js              # Main orchestrator and initialization
└── calendar/
    ├── validation.js         # Date validation and constraint system
    ├── range-selection.js    # Smart range selection with mobile support  
    └── navigation.js         # Quick navigation and keyboard shortcuts
```

**Benefits:**
- ✅ **Separation of concerns** - Each module has a single responsibility
- ✅ **Maintainability** - Easy to modify individual features
- ✅ **Performance** - Tree-shaking friendly ES6 modules
- ✅ **Testing** - Each module can be tested independently
- ✅ **Scalability** - Easy to add new features as separate modules

## Files Modified/Created

- ✅ `src/assets/scripts/calendar.js` - Main orchestrator (modular architecture)
- ✅ `src/assets/scripts/calendar/validation.js` - Validation system
- ✅ `src/assets/scripts/calendar/range-selection.js` - Range selection system
- ✅ `src/assets/scripts/calendar/navigation.js` - Navigation and shortcuts
- `template-parts/_organisms/calendar.php` - Add JavaScript hooks/classes
- SCSS files for visual enhancements
- Add to existing WordPress script enqueuing in `functions.php`

## CSS Needed for Validation

```scss
// Disabled date styling
.dgwltd-calendar__day--disabled {
    opacity: 0.5;
    pointer-events: none;
    
    .govuk-checkboxes__input {
        cursor: not-allowed;
        
        &:disabled {
            opacity: 0.5;
        }
    }
    
    .govuk-checkboxes__label {
        color: #6f777b; // GOV.UK secondary text color
        cursor: not-allowed;
        
        &:hover {
            color: #6f777b;
        }
    }
}

// Screen reader only disabled reason
.dgwltd-calendar__disabled-reason {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}

// Optional: Add strikethrough pattern for disabled dates
.dgwltd-calendar__day--disabled::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 1px;
    background: #6f777b;
    transform: translateY(-50%);
}

// Range selection preview styling
.dgwltd-calendar__day--preview-range {
    .govuk-checkboxes__label {
        background-color: rgba(29, 112, 184, 0.1); // Light blue preview
        border: 1px dashed #1d70b8;
        border-radius: 3px;
        
        &:hover {
            background-color: rgba(29, 112, 184, 0.2);
        }
    }
}

// Range selection hint styling
.dgwltd-calendar__range-hint {
    font-size: 14px;
    color: #6f777b;
    margin-top: 8px;
    font-style: italic;
}

// Range start selection feedback
.dgwltd-calendar__day--range-start {
    .govuk-checkboxes__label {
        background-color: #1d70b8;
        color: white;
        border: 2px solid #003078;
        border-radius: 3px;
        
        &:hover {
            background-color: #003078;
        }
    }
}

// Dynamic range instruction
.dgwltd-calendar__range-instruction {
    font-size: 16px;
    color: #1d70b8;
    font-weight: 600;
    margin-top: 12px;
    padding: 8px 12px;
    background-color: #f3f2f1;
    border-left: 4px solid #1d70b8;
    border-radius: 0 4px 4px 0;
}

// Quick navigation controls
.dgwltd-calendar__quick-nav {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #b1b4b6;
    
    .govuk-button {
        margin-bottom: 0;
        font-size: 16px;
        
        &:not(:last-child) {
            margin-right: 8px;
        }
    }
}

// Keyboard shortcuts hint
.dgwltd-calendar__shortcuts-hint {
    color: #6f777b;
    font-size: 14px;
    margin-left: auto;
    
    strong {
        color: #0b0c0c;
    }
}

// Date highlighting
.dgwltd-calendar__day--highlight-today {
    .govuk-checkboxes__label {
        background-color: #00703c;
        color: white;
        border: 2px solid #005a30;
        animation: highlight-pulse 1s ease-in-out;
        
        &:hover {
            background-color: #005a30;
        }
    }
}

.dgwltd-calendar__day--highlight-next {
    .govuk-checkboxes__label {
        background-color: #d53880;
        color: white;
        border: 2px solid #a9206e;
        animation: highlight-pulse 1s ease-in-out;
        
        &:hover {
            background-color: #a9206e;
        }
    }
}

@keyframes highlight-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

// Navigation feedback
.dgwltd-calendar__nav-feedback {
    font-size: 16px;
    font-weight: 600;
    margin-top: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    
    &--info {
        color: #1d70b8;
        background-color: #f3f2f1;
        border-left: 4px solid #1d70b8;
    }
    
    &--error {
        color: #d4351c;
        background-color: #fef7f7;
        border-left: 4px solid #d4351c;
    }
}
```