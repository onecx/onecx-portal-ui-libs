import type { MappingRule } from '../../mapper.types';
import { toColorString } from '../../mapper.utils';

// =============================================================================
// HELPER FUNCTIONS (defined first so they can be used in the array)
// =============================================================================

function generateRootSeverityRules(severity: string): MappingRule[] {
    const rules: MappingRule[] = [];

    // defaultState (no state prefix in PrimeNG)
    rules.push(
        {
            from: `usages.button.root.${severity}.defaultState.background`,
            to: `components.button.colorScheme.{mode}.root.${severity}.background`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.defaultState.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.color`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.defaultState.border.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.borderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.defaultState.border.style`,
            to: `components.button.root.borderStyle`,
        },
        {
            from: `usages.button.root.${severity}.defaultState.border.width`,
            to: `components.button.root.borderWidth`,
        }
    );

    // hover
    rules.push(
        {
            from: `usages.button.root.${severity}.hover.background`,
            to: `components.button.colorScheme.{mode}.root.${severity}.hoverBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.hover.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.hoverColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.hover.border.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.hoverBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.hover.border.style`,
            to: `components.button.root.borderStyle`,
        },
        {
            from: `usages.button.root.${severity}.hover.border.width`,
            to: `components.button.root.borderWidth`,
        }
    );

    // active
    rules.push(
        {
            from: `usages.button.root.${severity}.active.background`,
            to: `components.button.colorScheme.{mode}.root.${severity}.activeBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.active.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.activeColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.active.border.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.activeBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.active.border.style`,
            to: `components.button.root.borderStyle`,
        },
        {
            from: `usages.button.root.${severity}.active.border.width`,
            to: `components.button.root.borderWidth`,
        }
    );

    // focus
    rules.push(
        {
            from: `usages.button.root.${severity}.focus.background`,
            to: `components.button.colorScheme.{mode}.root.${severity}.focusBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.focus.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.focusColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.focus.border.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.focusBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.focus.border.style`,
            to: `components.button.root.borderStyle`,
        },
        {
            from: `usages.button.root.${severity}.focus.border.width`,
            to: `components.button.root.borderWidth`,
        }
    );

    // disabled
    rules.push(
        {
            from: `usages.button.root.${severity}.disabled.background`,
            to: `components.button.colorScheme.{mode}.root.${severity}.disabledBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.disabled.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.disabledColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.disabled.border.color`,
            to: `components.button.colorScheme.{mode}.root.${severity}.disabledBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.root.${severity}.disabled.border.style`,
            to: `components.button.root.borderStyle`,
        },
        {
            from: `usages.button.root.${severity}.disabled.border.width`,
            to: `components.button.root.borderWidth`,
        }
    );

    return rules;
}

function generateRootPlainRules(): MappingRule[] {
    return [
        {
            from: 'usages.button.root.plain.hoverBackground',
            to: 'components.button.colorScheme.{mode}.root.plain.hoverBackground',
            transform: toColorString,
        },
        {
            from: 'usages.button.root.plain.activeBackground',
            to: 'components.button.colorScheme.{mode}.root.plain.activeBackground',
            transform: toColorString,
        },
        {
            from: 'usages.button.root.plain.borderColor',
            to: 'components.button.colorScheme.{mode}.root.plain.borderColor',
            transform: toColorString,
        },
        {
            from: 'usages.button.root.plain.color',
            to: 'components.button.colorScheme.{mode}.root.plain.color',
            transform: toColorString,
        },
    ];
}

function generateOutlinedSeverityRules(severity: string): MappingRule[] {
    const rules: MappingRule[] = [];

    // defaultState (no state prefix in PrimeNG)
    rules.push(
        {
            from: `usages.button.outlined.${severity}.defaultState.background`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.borderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.defaultState.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.color`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.defaultState.border.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.borderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.defaultState.border.style`,
            to: `components.button.outlined.${severity}.borderStyle`,
        },
        {
            from: `usages.button.outlined.${severity}.defaultState.border.width`,
            to: `components.button.outlined.${severity}.borderWidth`,
        }
    );

    // hover
    rules.push(
        {
            from: `usages.button.outlined.${severity}.hover.background`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.hoverBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.hover.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.hoverColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.hover.border.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.hoverBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.hover.border.style`,
            to: `components.button.outlined.${severity}.borderStyle`,
        },
        {
            from: `usages.button.outlined.${severity}.hover.border.width`,
            to: `components.button.outlined.${severity}.borderWidth`,
        }
    );

    // active
    rules.push(
        {
            from: `usages.button.outlined.${severity}.active.background`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.activeBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.active.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.activeColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.active.border.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.activeBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.active.border.style`,
            to: `components.button.outlined.${severity}.borderStyle`,
        },
        {
            from: `usages.button.outlined.${severity}.active.border.width`,
            to: `components.button.outlined.${severity}.borderWidth`,
        }
    );

    // focus
    rules.push(
        {
            from: `usages.button.outlined.${severity}.focus.background`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.focusBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.focus.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.focusColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.focus.border.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.focusBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.focus.border.style`,
            to: `components.button.outlined.${severity}.borderStyle`,
        },
        {
            from: `usages.button.outlined.${severity}.focus.border.width`,
            to: `components.button.outlined.${severity}.borderWidth`,
        }
    );

    // disabled
    rules.push(
        {
            from: `usages.button.outlined.${severity}.disabled.background`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.disabledBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.disabled.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.disabledColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.disabled.border.color`,
            to: `components.button.colorScheme.{mode}.outlined.${severity}.disabledBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.outlined.${severity}.disabled.border.style`,
            to: `components.button.outlined.${severity}.borderStyle`,
        },
        {
            from: `usages.button.outlined.${severity}.disabled.border.width`,
            to: `components.button.outlined.${severity}.borderWidth`,
        }
    );

    return rules;
}

function generateOutlinedPlainRules(): MappingRule[] {
    return [
        {
            from: 'usages.button.outlined.plain.hoverBackground',
            to: 'components.button.colorScheme.{mode}.outlined.plain.hoverBackground',
            transform: toColorString,
        },
        {
            from: 'usages.button.outlined.plain.activeBackground',
            to: 'components.button.colorScheme.{mode}.outlined.plain.activeBackground',
            transform: toColorString,
        },
        {
            from: 'usages.button.outlined.plain.borderColor',
            to: 'components.button.colorScheme.{mode}.outlined.plain.borderColor',
            transform: toColorString,
        },
        {
            from: 'usages.button.outlined.plain.color',
            to: 'components.button.colorScheme.{mode}.outlined.plain.color',
            transform: toColorString,
        },
    ];
}

function generateTextSeverityRules(severity: string): MappingRule[] {
    const rules: MappingRule[] = [];

    // defaultState (no state prefix in PrimeNG)
    rules.push(
        {
            from: `usages.button.text.${severity}.defaultState.background`,
            to: `components.button.colorScheme.{mode}.text.${severity}.background`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.defaultState.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.color`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.defaultState.border.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.borderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.defaultState.border.style`,
            to: `components.button.text.${severity}.borderStyle`,
        },
        {
            from: `usages.button.text.${severity}.defaultState.border.width`,
            to: `components.button.text.${severity}.borderWidth`,
        }
    );

    // hover
    rules.push(
        {
            from: `usages.button.text.${severity}.hover.background`,
            to: `components.button.colorScheme.{mode}.text.${severity}.hoverBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.hover.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.hoverColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.hover.border.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.hoverBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.hover.border.style`,
            to: `components.button.text.${severity}.borderStyle`,
        },
        {
            from: `usages.button.text.${severity}.hover.border.width`,
            to: `components.button.text.${severity}.borderWidth`,
        }
    );

    // active
    rules.push(
        {
            from: `usages.button.text.${severity}.active.background`,
            to: `components.button.colorScheme.{mode}.text.${severity}.activeBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.active.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.activeColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.active.border.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.activeBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.active.border.style`,
            to: `components.button.text.${severity}.borderStyle`,
        },
        {
            from: `usages.button.text.${severity}.active.border.width`,
            to: `components.button.text.${severity}.borderWidth`,
        }
    );

    // focus
    rules.push(
        {
            from: `usages.button.text.${severity}.focus.background`,
            to: `components.button.colorScheme.{mode}.text.${severity}.focusBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.focus.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.focusColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.focus.border.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.focusBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.focus.border.style`,
            to: `components.button.text.${severity}.borderStyle`,
        },
        {
            from: `usages.button.text.${severity}.focus.border.width`,
            to: `components.button.text.${severity}.borderWidth`,
        }
    );

    // disabled
    rules.push(
        {
            from: `usages.button.text.${severity}.disabled.background`,
            to: `components.button.colorScheme.{mode}.text.${severity}.disabledBackground`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.disabled.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.disabledColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.disabled.border.color`,
            to: `components.button.colorScheme.{mode}.text.${severity}.disabledBorderColor`,
            transform: toColorString,
        },
        {
            from: `usages.button.text.${severity}.disabled.border.style`,
            to: `components.button.text.${severity}.borderStyle`,
        },
        {
            from: `usages.button.text.${severity}.disabled.border.width`,
            to: `components.button.text.${severity}.borderWidth`,
        }
    );

    return rules;
}

function generateTextPlainRules(): MappingRule[] {
    return [
        {
            from: 'usages.button.text.plain.hoverBackground',
            to: 'components.button.colorScheme.{mode}.text.plain.hoverBackground',
            transform: toColorString,
        },
        {
            from: 'usages.button.text.plain.activeBackground',
            to: 'components.button.colorScheme.{mode}.text.plain.activeBackground',
            transform: toColorString,
        },
        {
            from: 'usages.button.text.plain.borderColor',
            to: 'components.button.colorScheme.{mode}.text.plain.borderColor',
            transform: toColorString,
        },
        {
            from: 'usages.button.text.plain.color',
            to: 'components.button.colorScheme.{mode}.text.plain.color',
            transform: toColorString,
        },
    ];
}

// =============================================================================
// BUTTON MAPPING RULES
// =============================================================================

export const buttonMappingRules: MappingRule[] = [
    // =========================================================================
    // ROOT SECTION (usages.button.root.*)
    // Maps to: components.button.root.* and components.button.colorScheme.{mode}.root.primary.*
    // =========================================================================
    {
        from: 'usages.button.root.background',
        to: 'components.button.colorScheme.{mode}.root.primary.background',
        transform: toColorString,
    },
    {
        from: 'usages.button.root.color',
        to: 'components.button.colorScheme.{mode}.root.primary.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.root.border.color',
        to: 'components.button.colorScheme.{mode}.root.primary.borderColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.root.border.style',
        to: 'components.button.root.borderStyle',
    },
    {
        from: 'usages.button.root.border.width',
        to: 'components.button.root.borderWidth',
    },
    {
        from: 'usages.button.root.focusRing.width',
        to: 'components.button.root.focusRing.width',
    },
    {
        from: 'usages.button.root.focusRing.style',
        to: 'components.button.root.focusRing.style',
    },
    {
        from: 'usages.button.root.focusRing.color',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.root.focusRing.offset',
        to: 'components.button.root.focusRing.offset',
    },
    {
        from: 'usages.button.root.focusRing.radius',
        to: 'components.button.root.focusRing.radius',
    },
    {
        from: 'usages.button.root.focusRing.shadow',
        to: 'components.button.colorScheme.{mode}.root.primary.focusRing.shadow',
    },
    {
        from: 'usages.button.root.transitionDuration',
        to: 'components.button.root.transitionDuration',
    },
    {
        from: 'usages.button.root.iconOnlyWidth',
        to: 'components.button.root.iconOnlyWidth',
    },
    {
        from: 'usages.button.root.label.fontWeight',
        to: 'components.button.root.label.fontWeight',
    },
    {
        from: 'usages.button.root.icon.fontSize',
        to: 'components.button.root.icon.fontSize',
    },
    {
        from: 'usages.button.root.badge.size',
        to: 'components.button.root.badge.size',
    },
    {
        from: 'usages.button.root.badge.fontSize',
        to: 'components.button.root.badge.fontSize',
    },
    {
        from: 'usages.button.root.badge.fontWeight',
        to: 'components.button.root.badge.fontWeight',
    },
    {
        from: 'usages.button.root.badge.borderRadius',
        to: 'components.button.root.badge.borderRadius',
    },
    {
        from: 'usages.button.root.loadingIcon.fontSize',
        to: 'components.button.root.loadingIcon.fontSize',
    },

    // =========================================================================
    // ROOT SECTION - PRIMARY SEVERITY STATES (usages.button.root.primary.*)
    // Maps to: components.button.colorScheme.{mode}.root.primary.*
    // =========================================================================
    ...generateRootSeverityRules('primary'),
    ...generateRootSeverityRules('secondary'),
    ...generateRootSeverityRules('success'),
    ...generateRootSeverityRules('info'),
    ...generateRootSeverityRules('warn'),
    ...generateRootSeverityRules('help'),
    ...generateRootSeverityRules('danger'),
    ...generateRootSeverityRules('contrast'),
    ...generateRootPlainRules(),

    // =========================================================================
    // GLOBAL DEFAULTS (usages.button.*)
    // Maps to: components.button.root.*
    // =========================================================================
    {
        from: 'usages.button.fontSize',
        to: 'components.button.root.fontSize',
    },
    {
        from: 'usages.button.disabledOpacity',
        to: 'components.button.root.disabledOpacity',
    },
    {
        from: 'usages.button.roundedBorderRadius',
        to: 'components.button.root.roundedBorderRadius',
    },
    {
        from: 'usages.button.badgeSize',
        to: 'components.button.root.badgeSize',
    },
    {
        from: 'usages.button.layout.gap',
        to: 'components.button.root.gap',
    },
    {
        from: 'usages.button.layout.paddingX',
        to: 'components.button.root.paddingX',
    },
    {
        from: 'usages.button.layout.paddingY',
        to: 'components.button.root.paddingY',
    },
    {
        from: 'usages.button.layout.iconOnlyWidth',
        to: 'components.button.root.iconOnlyWidth',
    },
    {
        from: 'usages.button.layout.text.fontWeight',
        to: 'components.button.root.label.fontWeight',
    },

    // =========================================================================
    // SIZES (usages.button.sizes.*)
    // Maps to: components.button.root.sm|md|lg.*
    // =========================================================================
    // SM size
    {
        from: 'usages.button.sizes.sm.fontSize',
        to: 'components.button.root.sm.fontSize',
    },
    {
        from: 'usages.button.sizes.sm.paddingX',
        to: 'components.button.root.sm.paddingX',
    },
    {
        from: 'usages.button.sizes.sm.paddingY',
        to: 'components.button.root.sm.paddingY',
    },
    {
        from: 'usages.button.sizes.sm.iconOnlyWidth',
        to: 'components.button.root.sm.iconOnlyWidth',
    },

    // MD size
    {
        from: 'usages.button.sizes.md.fontSize',
        to: 'components.button.root.md.fontSize',
    },
    {
        from: 'usages.button.sizes.md.paddingX',
        to: 'components.button.root.md.paddingX',
    },
    {
        from: 'usages.button.sizes.md.paddingY',
        to: 'components.button.root.md.paddingY',
    },
    {
        from: 'usages.button.sizes.md.iconOnlyWidth',
        to: 'components.button.root.md.iconOnlyWidth',
    },

    // LG size
    {
        from: 'usages.button.sizes.lg.fontSize',
        to: 'components.button.root.lg.fontSize',
    },
    {
        from: 'usages.button.sizes.lg.paddingX',
        to: 'components.button.root.lg.paddingX',
    },
    {
        from: 'usages.button.sizes.lg.paddingY',
        to: 'components.button.root.lg.paddingY',
    },
    {
        from: 'usages.button.sizes.lg.iconOnlyWidth',
        to: 'components.button.root.lg.iconOnlyWidth',
    },

    // =========================================================================
    // TRANSITION (usages.button.transition.*)
    // Maps to: components.button.root.transitionDuration
    // =========================================================================
    {
        from: 'usages.button.transition.duration',
        to: 'components.button.root.transitionDuration',
    },

    // =========================================================================
    // OUTLINED SECTION - ALL SEVERITIES
    // Maps to: components.button.colorScheme.{mode}.outlined.{severity}.*
    // =========================================================================
    ...generateOutlinedSeverityRules('primary'),
    ...generateOutlinedSeverityRules('secondary'),
    ...generateOutlinedSeverityRules('success'),
    ...generateOutlinedSeverityRules('info'),
    ...generateOutlinedSeverityRules('warn'),
    ...generateOutlinedSeverityRules('help'),
    ...generateOutlinedSeverityRules('danger'),
    ...generateOutlinedSeverityRules('contrast'),
    ...generateOutlinedPlainRules(),

    // =========================================================================
    // TEXT SECTION - ALL SEVERITIES
    // Maps to: components.button.colorScheme.{mode}.text.{severity}.*
    // =========================================================================
    ...generateTextSeverityRules('primary'),
    ...generateTextSeverityRules('secondary'),
    ...generateTextSeverityRules('success'),
    ...generateTextSeverityRules('info'),
    ...generateTextSeverityRules('warn'),
    ...generateTextSeverityRules('help'),
    ...generateTextSeverityRules('danger'),
    ...generateTextSeverityRules('contrast'),
    ...generateTextPlainRules(),

    // =========================================================================
    // LINK VARIANT
    // Maps to: components.button.colorScheme.{mode}.link.*
    // =========================================================================
    {
        from: 'usages.button.link.defaultState.color',
        to: 'components.button.colorScheme.{mode}.link.color',
        transform: toColorString,
    },
    {
        from: 'usages.button.link.hover.color',
        to: 'components.button.colorScheme.{mode}.link.hoverColor',
        transform: toColorString,
    },
    {
        from: 'usages.button.link.active.color',
        to: 'components.button.colorScheme.{mode}.link.activeColor',
        transform: toColorString,
    },
];