import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

export const tabsCssRules: CssRule[] = [
	{
		selector: '.p-tablist-content',
		declarations: [
			{
				property: 'flex-grow',
				from: 'usages.tabs.tablist.contentFlexGrow',
			},
		],
	},
	{
		selector: '.p-tablist-viewport',
		declarations: [
			{
				property: 'scroll-behavior',
				from: 'usages.tabs.viewport.scrollBehavior',
			},
			{
				property: 'overscroll-behavior',
				from: 'usages.tabs.viewport.overscrollBehavior',
			},
			{
				property: 'scrollbar-width',
				from: 'usages.tabs.viewport.scrollbarWidth',
			},
		],
	},
	{
		selector: '.p-tablist-viewport::-webkit-scrollbar',
		declarations: [
			{
				property: 'display',
				from: 'usages.tabs.viewport.webkitScrollbarDisplay',
			},
		],
	},
	{
		selector: '.p-tab',
		declarations: [
			{
				property: 'font-size',
				from: 'usages.tabs.tab.font.size',
			},
			{
				property: 'cursor',
				from: 'usages.tabs.tab.cursor',
			},
			{
				property: 'user-select',
				from: 'usages.tabs.tab.userSelect',
			},
			{
				property: 'white-space',
				from: 'usages.tabs.tab.whiteSpace',
			},
		],
	},
	{
		selector: '.p-tabs-scrollable .p-tab',
		declarations: [
			{
				property: 'flex-grow',
				from: 'usages.tabs.tab.scrollableFlexGrow',
			},
		],
	},
	{
		selector: '.p-tab-active',
		declarations: [
			{
				property: '--p-ripple-background',
				from: 'usages.tabs.tab.activeRippleBackground',
			},
		],
	},
	{
		selector: '.p-tab:not(.p-disabled):focus-visible',
		declarations: [
			{
				property: 'background',
				from: 'usages.tabs.tab.focusBackground',
			},
		],
	},
	{
		selector: '.p-tablist-nav-button',
		declarations: [
			{
				property: 'height',
				from: 'usages.tabs.navButton.height',
			},
			{
				property: 'cursor',
				from: 'usages.tabs.navButton.cursor',
			},
		],
	},
	{
		selector: '.p-tablist-nav-button:focus-visible',
		declarations: [
			{
				property: 'background',
				from: 'usages.tabs.navButton.focusBackground',
			},
		],
	},
	{
		selector: '.p-tablist-active-bar',
		declarations: [
			{
				property: 'border-radius',
				from: 'usages.tabs.activeBar.borderRadius',
			},
			{
				property: 'transition',
				from: 'usages.tabs.activeBar.transition',
			},
		],
	},
];