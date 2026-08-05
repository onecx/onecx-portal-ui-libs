import type { CssRule } from '../../mapper.types';

export const buttonCssRules: CssRule[] = [
    {
        selector: '.p-button',
        declarations: [
            {
                property: 'font-size',
                from: 'usages.button.fontSize',
            },
        ],
    },
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

