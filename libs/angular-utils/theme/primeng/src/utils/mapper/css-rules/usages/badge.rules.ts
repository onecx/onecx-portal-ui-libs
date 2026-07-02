import type { CssRule } from '../../mapper.types';

// CSS rules for properties that have no PrimeNG preset equivalent.
// Add a CssRule entry only when the property genuinely cannot be expressed
// via a mapping rule. See dev-docs/theming/theme-v2.adoc § Adding a New CSS Rule.

export const badgeCssRules: CssRule[] = [
    {
        selector: '.p-overlaybadge .p-badge',
        declarations: [
            {
                property: 'font-size',
                from: 'usages.badge.defaultVariant.defaultVariant.fontSize',
            },
            {
                property: 'color',
                from: 'usages.badge.variant.primary.color',
            }
        ]
    }
];