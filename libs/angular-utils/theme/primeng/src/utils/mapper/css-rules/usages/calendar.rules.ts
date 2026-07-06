import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

export const calendarCssRules: CssRule[] = [
	// gap between title elements (month/year)
	{
		selector: '.p-datepicker-header .p-datepicker-title',
		declarations: [
			{
				property: 'gap',
				from: 'usages.calendar.panel.headerPanel.yearMonthNav.gap',
			},
		],
	},
	// Gap between calendar groups when multiple months are displayed
	{
		selector: '.p-datepicker-calendar-container',
		declarations: [
			{
				property: 'gap',
				from: 'usages.calendar.multiMonthDivider.gap',
			},
			{
				property: 'margin-top',
				from: 'usages.calendar.panel.headerGap',
			},
		],
	},
	// In-range background style for dates inside the selected range
	{
		selector: '.p-datepicker-day-range, .p-datepicker-day-inrange, .p-datepicker-day-in-range',
		declarations: [
			{
				property: 'background',
				from: 'usages.calendar.panel.datePanel.date.inRangeBackground',
			},
		],
	},
	// time picker layout gaps and margin
	{
		selector: '.p-datepicker-time-picker',
		declarations: [
			{
				property: 'gap',
				from: 'usages.calendar.timePicker.gap',
			},
			{
				property: 'margin',
				from: 'usages.calendar.timePicker.margin',
			},
		],
	},
	{
		selector: '.p-datepicker-time-picker > div',
		declarations: [
			{
				property: 'gap',
				from: 'usages.calendar.timePicker.buttonGap',
			},
		],
	},
];
