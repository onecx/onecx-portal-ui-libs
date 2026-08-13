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

// Helper group creator for severities as flat fields direct on parental state schemas
export function createButtonSeverityFields(
  prefix: string,
  variantPath: string,
  statePath: string,
  radius = '{{primitives.radius.md}}',
  shadow = '{{primitives.shadow.none}}'
) {
  return Object.fromEntries(
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
}

export const primaryFocusRingDefaults = {
  color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const primaryBorderDefaults = {
  color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const primaryButtonHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonHover', 'defaultVariant.defaultVariant', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonHover' })

export const primaryButtonActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonActive', 'defaultVariant.defaultVariant', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonActive' })

export const primaryButtonFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonFocus', 'defaultVariant.defaultVariant', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonFocus' })

export const primaryButtonDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonDisabled', 'defaultVariant.defaultVariant', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonDisabled' })

// Primary Rounded State Schemas
export const primaryButtonRoundedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.hover.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRoundedHover',
      'defaultVariant.variant.rounded',
      'state.hover',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRoundedHover' })

export const primaryButtonRoundedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.active.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRoundedActive',
      'defaultVariant.variant.rounded',
      'state.active',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRoundedActive' })

export const primaryButtonRoundedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.focus.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRoundedFocus',
      'defaultVariant.variant.rounded',
      'state.focus',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRoundedFocus' })

export const primaryButtonRoundedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.rounded.state.disabled.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRoundedDisabled',
      'defaultVariant.variant.rounded',
      'state.disabled',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRoundedDisabled' })

export const primaryButtonRounded = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      radius: '{{primitives.radius.full}}',
    }),
    hover: primaryButtonRoundedHover.prefault({}),
    active: primaryButtonRoundedActive.prefault({}),
    focus: primaryButtonRoundedFocus.prefault({}),
    disabled: primaryButtonRoundedDisabled.prefault({}),
    ...createButtonSeverityFields(
      'primaryButtonRounded',
      'defaultVariant.variant.rounded',
      'defaultState',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRounded' })

// Primary IconOnly State Schemas
export const primaryButtonIconOnlyHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonIconOnlyHover', 'defaultVariant.variant.iconOnly', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonIconOnlyHover' })

export const primaryButtonIconOnlyActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonIconOnlyActive', 'defaultVariant.variant.iconOnly', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonIconOnlyActive' })

export const primaryButtonIconOnlyFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonIconOnlyFocus', 'defaultVariant.variant.iconOnly', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonIconOnlyFocus' })

export const primaryButtonIconOnlyDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.iconOnly.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonIconOnlyDisabled', 'defaultVariant.variant.iconOnly', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonIconOnlyDisabled' })

export const primaryButtonIconOnly = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(primaryBorderDefaults),
    width: withRef(z.string()).optional(),
    icon: icon.default({
      color: '{{primitives.defaultVariant.variant.iconOnly.defaultState.defaultSeverity.contrast}}',
      size: '{{primitives.icon.size.sm}}',
    }),
    hover: primaryButtonIconOnlyHover.prefault({}),
    active: primaryButtonIconOnlyActive.prefault({}),
    focus: primaryButtonIconOnlyFocus.prefault({}),
    disabled: primaryButtonIconOnlyDisabled.prefault({}),
    ...createButtonSeverityFields('primaryButtonIconOnly', 'defaultVariant.variant.iconOnly', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonIconOnly' })

// Primary Raised State Schemas
export const primaryButtonRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRaisedHover',
      'defaultVariant.variant.raised',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRaisedHover' })

export const primaryButtonRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRaisedActive',
      'defaultVariant.variant.raised',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRaisedActive' })

export const primaryButtonRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRaisedFocus',
      'defaultVariant.variant.raised',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRaisedFocus' })

export const primaryButtonRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raised.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonRaisedDisabled',
      'defaultVariant.variant.raised',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRaisedDisabled' })

export const primaryButtonRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: primaryButtonRaisedHover.prefault({}),
    active: primaryButtonRaisedActive.prefault({}),
    focus: primaryButtonRaisedFocus.prefault({}),
    disabled: primaryButtonRaisedDisabled.prefault({}),
    ...createButtonSeverityFields(
      'primaryButtonRaised',
      'defaultVariant.variant.raised',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonRaised' })

// Primary Text State Schemas
export const primaryButtonTextHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonTextHover', 'defaultVariant.variant.text', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextHover' })

export const primaryButtonTextActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonTextActive', 'defaultVariant.variant.text', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextActive' })

export const primaryButtonTextFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonTextFocus', 'defaultVariant.variant.text', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextFocus' })

export const primaryButtonTextDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.text.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonTextDisabled', 'defaultVariant.variant.text', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextDisabled' })

export const primaryButtonText = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(primaryBorderDefaults),
    hover: primaryButtonTextHover.prefault({}),
    active: primaryButtonTextActive.prefault({}),
    focus: primaryButtonTextFocus.prefault({}),
    disabled: primaryButtonTextDisabled.prefault({}),
    ...createButtonSeverityFields('primaryButtonText', 'defaultVariant.variant.text', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonText' })

// Primary TextRaised State Schemas
export const primaryButtonTextRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonTextRaisedHover',
      'defaultVariant.variant.raisedText',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextRaisedHover' })

export const primaryButtonTextRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonTextRaisedActive',
      'defaultVariant.variant.raisedText',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextRaisedActive' })

export const primaryButtonTextRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonTextRaisedFocus',
      'defaultVariant.variant.raisedText',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextRaisedFocus' })

export const primaryButtonTextRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.raisedText.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryButtonTextRaisedDisabled',
      'defaultVariant.variant.raisedText',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextRaisedDisabled' })

export const primaryButtonTextRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: primaryButtonTextRaisedHover.prefault({}),
    active: primaryButtonTextRaisedActive.prefault({}),
    focus: primaryButtonTextRaisedFocus.prefault({}),
    disabled: primaryButtonTextRaisedDisabled.prefault({}),
    ...createButtonSeverityFields(
      'primaryButtonTextRaised',
      'defaultVariant.variant.raisedText',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonTextRaised' })

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

// Primary Outlined State Schemas
export const primaryButtonOutlinedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonOutlinedHover', 'defaultVariant.variant.outlined', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonOutlinedHover' })

export const primaryButtonOutlinedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonOutlinedActive', 'defaultVariant.variant.outlined', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonOutlinedActive' })

export const primaryButtonOutlinedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonOutlinedFocus', 'defaultVariant.variant.outlined', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonOutlinedFocus' })

export const primaryButtonOutlinedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryBorderDefaults,
      color: '{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.variant.outlined.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryButtonOutlinedDisabled', 'defaultVariant.variant.outlined', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonOutlinedDisabled' })

export const primaryButtonOutlined = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(primaryBorderDefaults),
    hover: primaryButtonOutlinedHover.prefault({}),
    active: primaryButtonOutlinedActive.prefault({}),
    focus: primaryButtonOutlinedFocus.prefault({}),
    disabled: primaryButtonOutlinedDisabled.prefault({}),
    ...createButtonSeverityFields('primaryButtonOutlined', 'defaultVariant.variant.outlined', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryButtonOutlined' })
