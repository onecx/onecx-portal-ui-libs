import type { CssRule } from '../../mapper.types';

export const buttonCssRules: CssRule[] = [
    // ─── Default State ────────────────────────────────────────────────────────
    {
        selector: 'button',
        declarations: [
            {
                property: 'background-color',
                from: 'usages.button.defaultState.background',
            },
            {
                property: 'color',
                from: 'usages.button.defaultState.color',
            },
            {
                property: 'border-color',
                from: 'usages.button.defaultState.borderColor',
            },
            {
                property: 'border-radius',
                from: 'usages.button.borderRadius',
            },
            {
                property: 'gap',
                from: 'usages.button.gap',
            },
            {
                property: 'padding',
                value: 'var(--onecx-theme-usages.button.paddingY) var(--onecx-theme-usages.button.paddingX)',
            },
            {
                property: 'transition-duration',
                from: 'usages.button.transitionDuration',
            },
            {
                property: 'box-shadow',
                from: 'usages.button.raisedShadow',
            },
        ],
    },
    // ─── Hover State ──────────────────────────────────────────────────────────
    {
        selector: 'button:hover',
        declarations: [
            {
                property: 'background-color',
                from: 'usages.button.state.hover.background',
            },
            {
                property: 'color',
                from: 'usages.button.state.hover.color',
            },
            {
                property: 'border-color',
                from: 'usages.button.state.hover.borderColor',
            },
        ],
    },
    // ─── Active State ─────────────────────────────────────────────────────────
    {
        selector: 'button:active',
        declarations: [
            {
                property: 'background-color',
                from: 'usages.button.state.active.background',
            },
            {
                property: 'color',
                from: 'usages.button.state.active.color',
            },
            {
                property: 'border-color',
                from: 'usages.button.state.active.borderColor',
            },
        ],
    },
    // ─── Focus State ──────────────────────────────────────────────────────────
    {
        selector: 'button:focus',
        declarations: [
            {
                property: 'outline-color',
                from: 'usages.button.focusRing.color',
            },
            {
                property: 'box-shadow',
                from: 'usages.button.focusRing.shadow',
            },
        ],
    },
];
