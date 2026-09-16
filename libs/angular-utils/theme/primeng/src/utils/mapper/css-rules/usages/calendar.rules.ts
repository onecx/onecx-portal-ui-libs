import type { CssRule } from '../../mapper.types'

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

// Restructured calendar token paths.
const PANEL = 'usages.calendar.defaultVariant.panel.defaultVariant.defaultState'
const HEADER = `${PANEL}.header.defaultVariant.defaultState`
const DATE_CELL = `${PANEL}.datePanel.defaultVariant.defaultState.dayView.dateCell.defaultVariant`
const TIME_PICKER = `${PANEL}.timePicker.defaultVariant.defaultState`

export const calendarCssRules: CssRule[] = [
  // gap between title elements (month/year)
  {
    selector: '.p-datepicker-header .p-datepicker-title',
    declarations: [
      {
        property: 'gap',
        from: `${HEADER}.yearMonthNav.gap`,
      },
    ],
  },
  // Gap between calendar groups when multiple months are displayed
  {
    selector: '.p-datepicker-calendar-container',
    declarations: [
      {
        property: 'gap',
        from: `${PANEL}.multiMonthDivider.gap`,
      },
      {
        property: 'margin-top',
        from: `${PANEL}.headerGap`,
      },
    ],
  },
  // In-range background style for dates inside the selected range
  {
    selector: '.p-datepicker-day-range, .p-datepicker-day-inrange, .p-datepicker-day-in-range',
    declarations: [
      {
        property: 'background',
        from: `${DATE_CELL}.selected.inRangeBackground`,
      },
    ],
  },
  // time picker layout gaps and margin
  {
    selector: '.p-datepicker-time-picker',
    declarations: [
      {
        property: 'gap',
        from: `${TIME_PICKER}.gap`,
      },
      {
        property: 'margin',
        from: `${TIME_PICKER}.margin`,
      },
    ],
  },
  {
    selector: '.p-datepicker-time-picker > div',
    declarations: [
      {
        property: 'gap',
        from: `${TIME_PICKER}.buttonGap`,
      },
    ],
  },
]
