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
				from: 'usages.calendar.title.gap',
			},
		],
	},
	// Gap between calendar groups when multiple months are displayed
	{
		selector: '.p-datepicker-calendar-container',
		declarations: [
			{
				property: 'gap',
				from: 'usages.calendar.group.gap',
			},
		],
	},
	// time picker layout gaps
	{
		selector: '.p-datepicker-time-picker',
		declarations: [
			{
				property: 'gap',
				from: 'usages.calendar.timePicker.gap',
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
