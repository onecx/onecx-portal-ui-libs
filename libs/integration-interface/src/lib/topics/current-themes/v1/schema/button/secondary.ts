import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { buttonFont, createButtonSeverityFields, lgButtonTokens, mdButtonTokens, smButtonTokens } from './default'

const secondaryFocusRingDefaults = {
  color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

const secondaryBorderDefaults = {
  color: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const secondaryButtonHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonHover', 'variant.secondary.defaultVariant', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonHover' })

export const secondaryButtonActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonActive', 'variant.secondary.defaultVariant', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonActive' })

export const secondaryButtonFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonFocus', 'variant.secondary.defaultVariant', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonFocus' })

export const secondaryButtonDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonDisabled', 'variant.secondary.defaultVariant', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonDisabled' })

// Secondary Rounded State Schemas
export const secondaryButtonRoundedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.rounded.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.rounded.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.rounded.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.rounded.state.hover.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedHover',
      'variant.secondary.variant.rounded',
      'state.hover',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedHover' })

export const secondaryButtonRoundedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.rounded.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.rounded.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.rounded.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.rounded.state.active.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedActive',
      'variant.secondary.variant.rounded',
      'state.active',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedActive' })

export const secondaryButtonRoundedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.rounded.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.rounded.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.rounded.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.rounded.state.focus.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedFocus',
      'variant.secondary.variant.rounded',
      'state.focus',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedFocus' })

export const secondaryButtonRoundedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.rounded.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.rounded.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.rounded.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.rounded.state.disabled.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedDisabled',
      'variant.secondary.variant.rounded',
      'state.disabled',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedDisabled' })

export const secondaryButtonRounded = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.rounded.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.rounded.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      radius: '{{primitives.radius.full}}',
    }),
    hover: secondaryButtonRoundedHover.prefault({ severity: {} }),
    active: secondaryButtonRoundedActive.prefault({ severity: {} }),
    focus: secondaryButtonRoundedFocus.prefault({ severity: {} }),
    disabled: secondaryButtonRoundedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'secondaryButtonRounded',
      'variant.secondary.variant.rounded',
      'defaultState',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRounded' })

// Secondary IconOnly State Schemas
export const secondaryButtonIconOnlyHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.iconOnly.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.iconOnly.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.iconOnly.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.iconOnly.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonIconOnlyHover', 'variant.secondary.variant.iconOnly', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonIconOnlyHover' })

export const secondaryButtonIconOnlyActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.iconOnly.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.iconOnly.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.iconOnly.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.iconOnly.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonIconOnlyActive', 'variant.secondary.variant.iconOnly', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonIconOnlyActive' })

export const secondaryButtonIconOnlyFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.iconOnly.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.iconOnly.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.iconOnly.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.iconOnly.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonIconOnlyFocus', 'variant.secondary.variant.iconOnly', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonIconOnlyFocus' })

export const secondaryButtonIconOnlyDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.iconOnly.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.iconOnly.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.iconOnly.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.iconOnly.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonIconOnlyDisabled',
      'variant.secondary.variant.iconOnly',
      'state.disabled'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonIconOnlyDisabled' })

export const secondaryButtonIconOnly = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.iconOnly.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.iconOnly.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(secondaryBorderDefaults),
    width: withRef(z.string()).optional(),
    hover: secondaryButtonIconOnlyHover.prefault({ severity: {} }),
    active: secondaryButtonIconOnlyActive.prefault({ severity: {} }),
    focus: secondaryButtonIconOnlyFocus.prefault({ severity: {} }),
    disabled: secondaryButtonIconOnlyDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('secondaryButtonIconOnly', 'variant.secondary.variant.iconOnly', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonIconOnly' })

// Secondary Raised State Schemas
export const secondaryButtonRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raised.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raised.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raised.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raised.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedHover',
      'variant.secondary.variant.raised',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRaisedHover' })

export const secondaryButtonRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raised.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raised.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raised.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raised.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedActive',
      'variant.secondary.variant.raised',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRaisedActive' })

export const secondaryButtonRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raised.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raised.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raised.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raised.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedFocus',
      'variant.secondary.variant.raised',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRaisedFocus' })

export const secondaryButtonRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raised.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raised.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raised.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raised.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedDisabled',
      'variant.secondary.variant.raised',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRaisedDisabled' })

export const secondaryButtonRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raised.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raised.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: secondaryButtonRaisedHover.prefault({ severity: {} }),
    active: secondaryButtonRaisedActive.prefault({ severity: {} }),
    focus: secondaryButtonRaisedFocus.prefault({ severity: {} }),
    disabled: secondaryButtonRaisedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'secondaryButtonRaised',
      'variant.secondary.variant.raised',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRaised' })

// Secondary Text State Schemas
export const secondaryButtonTextHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.text.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.text.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.text.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.text.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextHover', 'variant.secondary.variant.text', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextHover' })

export const secondaryButtonTextActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.text.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.text.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.text.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.text.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextActive', 'variant.secondary.variant.text', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextActive' })

export const secondaryButtonTextFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.text.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.text.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.text.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.text.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextFocus', 'variant.secondary.variant.text', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextFocus' })

export const secondaryButtonTextDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.text.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.text.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.text.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.text.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextDisabled', 'variant.secondary.variant.text', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextDisabled' })

export const secondaryButtonText = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.text.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.text.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(secondaryBorderDefaults),
    hover: secondaryButtonTextHover.prefault({ severity: {} }),
    active: secondaryButtonTextActive.prefault({ severity: {} }),
    focus: secondaryButtonTextFocus.prefault({ severity: {} }),
    disabled: secondaryButtonTextDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('secondaryButtonText', 'variant.secondary.variant.text', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonText' })

// Secondary TextRaised State Schemas
export const secondaryButtonTextRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raisedText.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raisedText.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raisedText.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raisedText.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedHover',
      'variant.secondary.variant.raisedText',
      'state.hover',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextRaisedHover' })

export const secondaryButtonTextRaisedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raisedText.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raisedText.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raisedText.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raisedText.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedActive',
      'variant.secondary.variant.raisedText',
      'state.active',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextRaisedActive' })

export const secondaryButtonTextRaisedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raisedText.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raisedText.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raisedText.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raisedText.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedFocus',
      'variant.secondary.variant.raisedText',
      'state.focus',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextRaisedFocus' })

export const secondaryButtonTextRaisedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raisedText.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raisedText.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.raisedText.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.raisedText.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedDisabled',
      'variant.secondary.variant.raisedText',
      'state.disabled',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextRaisedDisabled' })

export const secondaryButtonTextRaised = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.raisedText.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.raisedText.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: secondaryButtonTextRaisedHover.prefault({ severity: {} }),
    active: secondaryButtonTextRaisedActive.prefault({ severity: {} }),
    focus: secondaryButtonTextRaisedFocus.prefault({ severity: {} }),
    disabled: secondaryButtonTextRaisedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaised',
      'variant.secondary.variant.raisedText',
      'defaultState',
      '{{primitives.radius.md}}',
      '{{primitives.shadow.md}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextRaised' })

// Secondary Outlined State Schemas
export const secondaryButtonOutlinedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.outlined.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.outlined.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.outlined.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.outlined.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonOutlinedHover', 'variant.secondary.variant.outlined', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedHover' })

export const secondaryButtonOutlinedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.outlined.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.outlined.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.outlined.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.outlined.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonOutlinedActive', 'variant.secondary.variant.outlined', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedActive' })

export const secondaryButtonOutlinedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.outlined.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.outlined.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.outlined.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.outlined.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonOutlinedFocus', 'variant.secondary.variant.outlined', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedFocus' })

export const secondaryButtonOutlinedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.outlined.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.outlined.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.secondary.variant.outlined.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.secondary.variant.outlined.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonOutlinedDisabled',
      'variant.secondary.variant.outlined',
      'state.disabled'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedDisabled' })

export const secondaryButtonOutlined = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.variant.outlined.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.variant.outlined.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(secondaryBorderDefaults),
    hover: secondaryButtonOutlinedHover.prefault({ severity: {} }),
    active: secondaryButtonOutlinedActive.prefault({ severity: {} }),
    focus: secondaryButtonOutlinedFocus.prefault({ severity: {} }),
    disabled: secondaryButtonOutlinedDisabled.prefault({ severity: {} }),
    ...createButtonSeverityFields('secondaryButtonOutlined', 'variant.secondary.variant.outlined', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlined' })

export const secondaryButton = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.secondary.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    font: buttonFont as typeof buttonFont,
    border: borderWithShadow.default(secondaryBorderDefaults),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    focusRing: borderWithShadow.default(secondaryFocusRingDefaults),
    hover: secondaryButtonHover.prefault({ severity: {} }),
    active: secondaryButtonActive.prefault({ severity: {} }),
    focus: secondaryButtonFocus.prefault({ severity: {} }),
    disabled: secondaryButtonDisabled.prefault({ severity: {} }),
    rounded: secondaryButtonRounded.prefault({ severity: {} }),
    iconOnly: secondaryButtonIconOnly.prefault({ severity: {} }),
    raised: secondaryButtonRaised.prefault({ severity: {} }),
    text: secondaryButtonText.prefault({ severity: {} }),
    textRaised: secondaryButtonTextRaised.prefault({ severity: {} }),
    outlined: secondaryButtonOutlined.prefault({ severity: {} }),
    sm: smButtonTokens.prefault({}),
    md: mdButtonTokens.prefault({}),
    lg: lgButtonTokens.prefault({}),
    ...createButtonSeverityFields('secondaryButtonBrandDefault', 'variant.secondary.defaultVariant', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButton' })
