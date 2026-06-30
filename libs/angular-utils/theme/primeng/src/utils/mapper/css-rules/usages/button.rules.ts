import type { CssRule } from '../../mapper.types';

export const buttonCssRules: CssRule[] = [
    {
        selector: '.p-button:disabled, .p-button.p-disabled',
        declarations: [
            {
                property: 'opacity',
                from: 'usages.button.disabledOpacity',
            },
        ],
    },
];

