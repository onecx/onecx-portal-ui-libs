import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { buttonFont, createButtonSeverityFields, lgButtonTokens, mdButtonTokens, smButtonTokens } from './default'

const primaryVariantFocusRingDefaults = {
  color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

const primaryVariantBorderDefaults = {
  color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const primaryVariantButtonHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonHover', 'variant.primary.defaultVariant', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonHover' })

export const primaryVariantButtonActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonActive', 'variant.primary.defaultVariant', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonActive' })

export const primaryVariantButtonFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonFocus', 'variant.primary.defaultVariant', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonFocus' })

export const primaryVariantButtonDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonDisabled', 'variant.primary.defaultVariant', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonDisabled' })

// Primary Variant Rounded State Schemas
export const primaryVariantButtonRoundedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRoundedHover',
      'variant.primary.variant.rounded',
      'state.hover',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRoundedHover' })

export const primaryVariantButtonRoundedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRoundedActive',
      'variant.primary.variant.rounded',
      'state.active',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRoundedActive' })

export const primaryVariantButtonRoundedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRoundedFocus',
      'variant.primary.variant.rounded',
      'state.focus',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRoundedFocus' })

export const primaryVariantButtonRoundedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRoundedDisabled',
      'variant.primary.variant.rounded',
      'state.disabled',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRoundedDisabled' })

export const primaryVariantButtonRounded = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      radius: '{{primitives.radius.full}}',
    }),
    hover: primaryVariantButtonRoundedHover.prefault({ severity: {} }),
    active: primaryVariantButtonRoundedActive.prefault({ severity: {} }),
    focus: primaryVariantButtonRoundedFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonRoundedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRounded',
      'variant.primary.variant.rounded',
      'defaultState',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRounded' })

// Primary Variant IconOnly State Schemas
export const primaryVariantButtonIconOnlyHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.iconOnly.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.iconOnly.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.iconOnly.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.iconOnly.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonIconOnlyHover', 'variant.primary.variant.iconOnly', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonIconOnlyHover' })

export const primaryVariantButtonIconOnlyActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.iconOnly.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.iconOnly.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.iconOnly.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.iconOnly.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonIconOnlyActive', 'variant.primary.variant.iconOnly', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonIconOnlyActive' })

export const primaryVariantButtonIconOnlyFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.iconOnly.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.iconOnly.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.iconOnly.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.iconOnly.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonIconOnlyFocus', 'variant.primary.variant.iconOnly', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonIconOnlyFocus' })

export const primaryVariantButtonIconOnlyDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.iconOnly.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.iconOnly.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.iconOnly.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.iconOnly.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonIconOnlyDisabled',
      'variant.primary.variant.iconOnly',
      'state.disabled'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonIconOnlyDisabled' })

export const primaryVariantButtonIconOnly = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.iconOnly.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.iconOnly.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(primaryVariantBorderDefaults),
    width: withRef(z.string()).optional(),
    hover: primaryVariantButtonIconOnlyHover.prefault({ severity: {} }),
    active: primaryVariantButtonIconOnlyActive.prefault({ severity: {} }),
    focus: primaryVariantButtonIconOnlyFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonIconOnlyDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('primaryVariantButtonIconOnly', 'variant.primary.variant.iconOnly', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonIconOnly' })

// Primary Variant Raised State Schemas
export const primaryVariantButtonRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRaisedHover',
      'variant.primary.variant.raised',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRaisedHover' })

export const primaryVariantButtonRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRaisedActive',
      'variant.primary.variant.raised',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRaisedActive' })

export const primaryVariantButtonRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRaisedFocus',
      'variant.primary.variant.raised',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRaisedFocus' })

export const primaryVariantButtonRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRaisedDisabled',
      'variant.primary.variant.raised',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRaisedDisabled' })

export const primaryVariantButtonRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raised.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: primaryVariantButtonRaisedHover.prefault({ severity: {} }),
    active: primaryVariantButtonRaisedActive.prefault({ severity: {} }),
    focus: primaryVariantButtonRaisedFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonRaisedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'primaryVariantButtonRaised',
      'variant.primary.variant.raised',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonRaised' })

// Primary Variant Text State Schemas
export const primaryVariantButtonTextHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonTextHover', 'variant.primary.variant.text', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextHover' })

export const primaryVariantButtonTextActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonTextActive', 'variant.primary.variant.text', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextActive' })

export const primaryVariantButtonTextFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonTextFocus', 'variant.primary.variant.text', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextFocus' })

export const primaryVariantButtonTextDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonTextDisabled', 'variant.primary.variant.text', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextDisabled' })

export const primaryVariantButtonText = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(primaryVariantBorderDefaults),
    hover: primaryVariantButtonTextHover.prefault({ severity: {} }),
    active: primaryVariantButtonTextActive.prefault({ severity: {} }),
    focus: primaryVariantButtonTextFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonTextDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('primaryVariantButtonText', 'variant.primary.variant.text', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonText' })

// Primary Variant TextRaised State Schemas
export const primaryVariantButtonTextRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonTextRaisedHover',
      'variant.primary.variant.raisedText',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextRaisedHover' })

export const primaryVariantButtonTextRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonTextRaisedActive',
      'variant.primary.variant.raisedText',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextRaisedActive' })

export const primaryVariantButtonTextRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonTextRaisedFocus',
      'variant.primary.variant.raisedText',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextRaisedFocus' })

export const primaryVariantButtonTextRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonTextRaisedDisabled',
      'variant.primary.variant.raisedText',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextRaisedDisabled' })

export const primaryVariantButtonTextRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raisedText.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: primaryVariantButtonTextRaisedHover.prefault({ severity: {} }),
    active: primaryVariantButtonTextRaisedActive.prefault({ severity: {} }),
    focus: primaryVariantButtonTextRaisedFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonTextRaisedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'primaryVariantButtonTextRaised',
      'variant.primary.variant.raisedText',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonTextRaised' })

// Primary Variant Outlined State Schemas
export const primaryVariantButtonOutlinedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonOutlinedHover', 'variant.primary.variant.outlined', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonOutlinedHover' })

export const primaryVariantButtonOutlinedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonOutlinedActive', 'variant.primary.variant.outlined', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonOutlinedActive' })

export const primaryVariantButtonOutlinedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('primaryVariantButtonOutlinedFocus', 'variant.primary.variant.outlined', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonOutlinedFocus' })

export const primaryVariantButtonOutlinedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...primaryVariantBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields(
      'primaryVariantButtonOutlinedDisabled',
      'variant.primary.variant.outlined',
      'state.disabled'
    ),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonOutlinedDisabled' })

export const primaryVariantButtonOutlined = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(primaryVariantBorderDefaults),
    hover: primaryVariantButtonOutlinedHover.prefault({ severity: {} }),
    active: primaryVariantButtonOutlinedActive.prefault({ severity: {} }),
    focus: primaryVariantButtonOutlinedFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonOutlinedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('primaryVariantButtonOutlined', 'variant.primary.variant.outlined', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButtonOutlined' })

export const primaryVariantButton = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    font: buttonFont as typeof buttonFont,
    border: borderWithShadow.default(primaryVariantBorderDefaults),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    focusRing: borderWithShadow.default(primaryVariantFocusRingDefaults),
    hover: primaryVariantButtonHover.prefault({ severity: {} }),
    active: primaryVariantButtonActive.prefault({ severity: {} }),
    focus: primaryVariantButtonFocus.prefault({ severity: {} }),
    disabled: primaryVariantButtonDisabled.prefault({ severity: {} }),
    rounded: primaryVariantButtonRounded.prefault({ severity: {} }),
    iconOnly: primaryVariantButtonIconOnly.prefault({ severity: {} }),
    raised: primaryVariantButtonRaised.prefault({ severity: {} }),
    text: primaryVariantButtonText.prefault({ severity: {} }),
    textRaised: primaryVariantButtonTextRaised.prefault({ severity: {} }),
    outlined: primaryVariantButtonOutlined.prefault({ severity: {} }),
    sm: smButtonTokens.prefault({}),
    md: mdButtonTokens.prefault({}),
    lg: lgButtonTokens.prefault({}),
    ...createButtonSeverityFields('primaryVariantButtonBrandDefault', 'variant.primary.defaultVariant', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'primaryVariantButton' })
