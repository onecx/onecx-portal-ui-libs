import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

export const dialogCssRules: CssRule[] = [
	{
		selector: '.p-dialog-mask.p-overlay-mask',
		declarations: [
			{
				property: 'background-color',
				from: 'primitives.area.overlay.defaultState.defaultVariant.bg.color',
			},
			{
				property: 'background-image',
				from: 'primitives.area.overlay.defaultState.defaultVariant.bg.image',
			},
			{
				property: 'background-position',
				from: 'primitives.area.overlay.defaultState.defaultVariant.bg.position',
			},
			{
				property: 'background-size',
				from: 'primitives.area.overlay.defaultState.defaultVariant.bg.size',
			},
			{
				property: 'background-repeat',
				from: 'primitives.area.overlay.defaultState.defaultVariant.bg.repeat',
			},
		],
	},
	{
		selector: '.p-dialog .p-resizable-handle',
		declarations: [
			{
				property: 'border-bottom-right-radius',
				from: 'usages.dialog.root.borderRadius',
			},
		],
	},
];