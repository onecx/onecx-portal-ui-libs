import * as z from 'zod'
import { bg, borderWithShadow, color, font, icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// Font for button component — excludes family and size (set globally/individually)
export const buttonFont = font.omit({ family: true, size: true }).default({
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
})

// Helper style creator for standard button severities
export function createButtonSeverityStyle(
  id: string,
  variantPath: string,
  statePath: string,
  severityName: string,
  radius = '{{primitives.radius.md}}',
  shadow = '{{primitives.shadow.none}}'
) {
  const borderDefaults = {
    color: `{{primitives.${variantPath}.${statePath}.severity.${severityName}.border.color}}`,
    style: `{{primitives.${variantPath}.${statePath}.severity.${severityName}.border.style}}`,
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.none}}',
    radius,
    shadow,
  }

  return z
    .object({
      background: z
        .union([bg, withRef(z.string())])
        .default(`{{primitives.${variantPath}.${statePath}.severity.${severityName}.bg}}`),
      color: color.default(`{{primitives.${variantPath}.${statePath}.severity.${severityName}.contrast}}`),
      border: borderWithShadow.default(borderDefaults),
    })
    .register(themeSchemaRegistry, { id })
}

const SEVERITIES = ['success', 'info', 'warning', 'danger', 'contrast'] as const

// Helper group creator for severities as nested `severity` object inside state schemas
export function createButtonSeverityFields(
  prefix: string,
  variantPath: string,
  statePath: string,
  radius = '{{primitives.radius.md}}',
  shadow = '{{primitives.shadow.none}}'
) {
  return {
    severity: z
      .object(
        Object.fromEntries(
          SEVERITIES.map(severity => [
            severity,
            createButtonSeverityStyle(
              `${prefix}Severity${severity[0].toUpperCase()}${severity.slice(1)}`,
              variantPath,
              statePath,
              severity,
              radius,
              shadow
            ).prefault({}).optional()
          ])
        )
      )
      .prefault({}),
  }
}

export const focusRingDefaults = {
  color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const defaultButtonHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonHover', 'defaultVariant.defaultVariant', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonHover' })

export const defaultButtonActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonActive', 'defaultVariant.defaultVariant', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonActive' })

export const defaultButtonFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonFocus', 'defaultVariant.defaultVariant', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonFocus' })

export const defaultButtonDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonDisabled', 'defaultVariant.defaultVariant', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonDisabled' })

// Default Rounded State Schemas
export const defaultButtonRoundedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRoundedHover',
      'defaultVariant.variant.rounded',
      'state.hover',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRoundedHover' })

export const defaultButtonRoundedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRoundedActive',
      'defaultVariant.variant.rounded',
      'state.active',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRoundedActive' })

export const defaultButtonRoundedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRoundedFocus',
      'defaultVariant.variant.rounded',
      'state.focus',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRoundedFocus' })

export const defaultButtonRoundedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRoundedDisabled',
      'defaultVariant.variant.rounded',
      'state.disabled',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRoundedDisabled' })

export const defaultButtonRounded = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      radius: '{{primitives.radius.full}}',
    }),
    hover: defaultButtonRoundedHover.prefault({ severity: {} }),
    active: defaultButtonRoundedActive.prefault({ severity: {} }),
    focus: defaultButtonRoundedFocus.prefault({ severity: {} }),
    disabled: defaultButtonRoundedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'defaultButtonRounded',
      'defaultVariant.variant.rounded',
      'defaultState',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRounded' })

// Default IconOnly State Schemas
export const defaultButtonIconOnlyHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonIconOnlyHover', 'defaultVariant.variant.iconOnly', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonIconOnlyHover' })

export const defaultButtonIconOnlyActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonIconOnlyActive', 'defaultVariant.variant.iconOnly', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonIconOnlyActive' })

export const defaultButtonIconOnlyFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonIconOnlyFocus', 'defaultVariant.variant.iconOnly', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonIconOnlyFocus' })

export const defaultButtonIconOnlyDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonIconOnlyDisabled', 'defaultVariant.variant.iconOnly', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonIconOnlyDisabled' })

export const defaultButtonIconOnly = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(borderDefaults),
    width: withRef(z.string()).optional(),
    icon: icon.default({
      color: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
      size: '{{primitives.icon.size.sm}}',
    }),
    hover: defaultButtonIconOnlyHover.prefault({ severity: {} }),
    active: defaultButtonIconOnlyActive.prefault({ severity: {} }),
    focus: defaultButtonIconOnlyFocus.prefault({ severity: {} }),
    disabled: defaultButtonIconOnlyDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('defaultButtonIconOnly', 'defaultVariant.variant.iconOnly', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonIconOnly' })

// Default Raised State Schemas
export const defaultButtonRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRaisedHover',
      'defaultVariant.variant.raised',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRaisedHover' })

export const defaultButtonRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRaisedActive',
      'defaultVariant.variant.raised',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRaisedActive' })

export const defaultButtonRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRaisedFocus',
      'defaultVariant.variant.raised',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRaisedFocus' })

export const defaultButtonRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonRaisedDisabled',
      'defaultVariant.variant.raised',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRaisedDisabled' })

export const defaultButtonRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: defaultButtonRaisedHover.prefault({ severity: {} }),
    active: defaultButtonRaisedActive.prefault({ severity: {} }),
    focus: defaultButtonRaisedFocus.prefault({ severity: {} }),
    disabled: defaultButtonRaisedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'defaultButtonRaised',
      'defaultVariant.variant.raised',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonRaised' })

// Default Text State Schemas
export const defaultButtonTextHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonTextHover', 'defaultVariant.variant.text', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextHover' })

export const defaultButtonTextActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonTextActive', 'defaultVariant.variant.text', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextActive' })

export const defaultButtonTextFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonTextFocus', 'defaultVariant.variant.text', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextFocus' })

export const defaultButtonTextDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonTextDisabled', 'defaultVariant.variant.text', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextDisabled' })

export const defaultButtonText = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(borderDefaults),
    hover: defaultButtonTextHover.prefault({ severity: {} }),
    active: defaultButtonTextActive.prefault({ severity: {} }),
    focus: defaultButtonTextFocus.prefault({ severity: {} }),
    disabled: defaultButtonTextDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('defaultButtonText', 'defaultVariant.variant.text', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonText' })

// Default TextRaised State Schemas
export const defaultButtonTextRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonTextRaisedHover',
      'defaultVariant.variant.raisedText',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextRaisedHover' })

export const defaultButtonTextRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonTextRaisedActive',
      'defaultVariant.variant.raisedText',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextRaisedActive' })

export const defaultButtonTextRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonTextRaisedFocus',
      'defaultVariant.variant.raisedText',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextRaisedFocus' })

export const defaultButtonTextRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'defaultButtonTextRaisedDisabled',
      'defaultVariant.variant.raisedText',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextRaisedDisabled' })

export const defaultButtonTextRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: defaultButtonTextRaisedHover.prefault({ severity: {} }),
    active: defaultButtonTextRaisedActive.prefault({ severity: {} }),
    focus: defaultButtonTextRaisedFocus.prefault({ severity: {} }),
    disabled: defaultButtonTextRaisedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'defaultButtonTextRaised',
      'defaultVariant.variant.raisedText',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonTextRaised' })

// Size variant token schemas
export const smButtonTokens = z.object({
  font: font.pick({ size: true }).default({ size: '{{primitives.font.size.sm}}' }),
  paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
})

export const mdButtonTokens = z.object({
  font: font.pick({ size: true }).default({ size: '{{primitives.font.size.md}}' }),
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
})

export const lgButtonTokens = z.object({
  font: font.pick({ size: true }).default({ size: '{{primitives.font.size.lg}}' }),
  paddingX: withRef(z.string()).default('{{primitives.space.lg}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
})

// Default Outlined State Schemas
export const defaultButtonOutlinedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonOutlinedHover', 'defaultVariant.variant.outlined', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonOutlinedHover' })

export const defaultButtonOutlinedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonOutlinedActive', 'defaultVariant.variant.outlined', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonOutlinedActive' })

export const defaultButtonOutlinedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonOutlinedFocus', 'defaultVariant.variant.outlined', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonOutlinedFocus' })

export const defaultButtonOutlinedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('defaultButtonOutlinedDisabled', 'defaultVariant.variant.outlined', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonOutlinedDisabled' })

export const defaultButtonOutlined = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(borderDefaults),
    hover: defaultButtonOutlinedHover.prefault({ severity: {} }),
    active: defaultButtonOutlinedActive.prefault({ severity: {} }),
    focus: defaultButtonOutlinedFocus.prefault({ severity: {} }),
    disabled: defaultButtonOutlinedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('defaultButtonOutlined', 'defaultVariant.variant.outlined', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'defaultButtonOutlined' })
