import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { buttonFont, createButtonSeverityFields } from './primary'

const secondaryFocusRingDefaults = {
  color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

const secondaryBorderDefaults = {
  color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

export const secondaryButtonHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonHover', 'variant.primary.defaultVariant', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonHover' })

export const secondaryButtonActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonActive', 'variant.primary.defaultVariant', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonActive' })

export const secondaryButtonFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonFocus', 'variant.primary.defaultVariant', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonFocus' })

export const secondaryButtonDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonDisabled', 'variant.primary.defaultVariant', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonDisabled' })

// Secondary Rounded State Schemas
export const secondaryButtonRoundedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.hover.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedHover',
      'variant.primary.variant.rounded',
      'state.hover',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedHover' })

export const secondaryButtonRoundedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.active.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedActive',
      'variant.primary.variant.rounded',
      'state.active',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedActive' })

export const secondaryButtonRoundedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.focus.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedFocus',
      'variant.primary.variant.rounded',
      'state.focus',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedFocus' })

export const secondaryButtonRoundedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.rounded.state.disabled.defaultSeverity.border.style}}',
      radius: '{{primitives.radius.full}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRoundedDisabled',
      'variant.primary.variant.rounded',
      'state.disabled',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRoundedDisabled' })

export const secondaryButtonRounded = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.rounded.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.rounded.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      radius: '{{primitives.radius.full}}',
    }),
    hover: secondaryButtonRoundedHover.prefault({}),
    active: secondaryButtonRoundedActive.prefault({}),
    focus: secondaryButtonRoundedFocus.prefault({}),
    disabled: secondaryButtonRoundedDisabled.prefault({}),
    ...createButtonSeverityFields(
      'secondaryButtonRounded',
      'variant.primary.variant.rounded',
      'defaultState',
      '{{primitives.radius.full}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonRounded' })

// Secondary Raised State Schemas
export const secondaryButtonRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedHover',
      'variant.primary.variant.raised',
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
      .default('{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedActive',
      'variant.primary.variant.raised',
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
      .default('{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedFocus',
      'variant.primary.variant.raised',
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
      .default('{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raised.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonRaisedDisabled',
      'variant.primary.variant.raised',
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
      .default('{{primitives.variant.primary.variant.raised.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raised.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: secondaryButtonRaisedHover.prefault({}),
    active: secondaryButtonRaisedActive.prefault({}),
    focus: secondaryButtonRaisedFocus.prefault({}),
    disabled: secondaryButtonRaisedDisabled.prefault({}),
    ...createButtonSeverityFields(
      'secondaryButtonRaised',
      'variant.primary.variant.raised',
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
      .default('{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextHover', 'variant.primary.variant.text', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextHover' })

export const secondaryButtonTextActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextActive', 'variant.primary.variant.text', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextActive' })

export const secondaryButtonTextFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextFocus', 'variant.primary.variant.text', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextFocus' })

export const secondaryButtonTextDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.text.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonTextDisabled', 'variant.primary.variant.text', 'state.disabled'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonTextDisabled' })

export const secondaryButtonText = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.text.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.text.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(secondaryBorderDefaults),
    hover: secondaryButtonTextHover.prefault({}),
    active: secondaryButtonTextActive.prefault({}),
    focus: secondaryButtonTextFocus.prefault({}),
    disabled: secondaryButtonTextDisabled.prefault({}),
    ...createButtonSeverityFields('secondaryButtonText', 'variant.primary.variant.text', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonText' })

// Secondary TextRaised State Schemas
export const secondaryButtonTextRaisedHover = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.hover.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedHover',
      'variant.primary.variant.raisedText',
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
      .default('{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.active.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedActive',
      'variant.primary.variant.raisedText',
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
      .default('{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedFocus',
      'variant.primary.variant.raisedText',
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
      .default('{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.raisedText.state.disabled.defaultSeverity.border.style}}',
      shadow: '{{primitives.shadow.md}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaisedDisabled',
      'variant.primary.variant.raisedText',
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
      .default('{{primitives.variant.primary.variant.raisedText.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.raisedText.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      shadow: '{{primitives.shadow.md}}',
    }),
    hover: secondaryButtonTextRaisedHover.prefault({}),
    active: secondaryButtonTextRaisedActive.prefault({}),
    focus: secondaryButtonTextRaisedFocus.prefault({}),
    disabled: secondaryButtonTextRaisedDisabled.prefault({}),
    ...createButtonSeverityFields(
      'secondaryButtonTextRaised',
      'variant.primary.variant.raisedText',
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
      .default('{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.hover.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonOutlinedHover', 'variant.primary.variant.outlined', 'state.hover'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedHover' })

export const secondaryButtonOutlinedActive = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.active.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonOutlinedActive', 'variant.primary.variant.outlined', 'state.active'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedActive' })

export const secondaryButtonOutlinedFocus = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.focus.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields('secondaryButtonOutlinedFocus', 'variant.primary.variant.outlined', 'state.focus'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedFocus' })

export const secondaryButtonOutlinedDisabled = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...secondaryBorderDefaults,
      color: '{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.variant.outlined.state.disabled.defaultSeverity.border.style}}',
    }),
    ...createButtonSeverityFields(
      'secondaryButtonOutlinedDisabled',
      'variant.primary.variant.outlined',
      'state.disabled'
    ),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlinedDisabled' })

export const secondaryButtonOutlined = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.variant.outlined.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.variant.outlined.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default(secondaryBorderDefaults),
    hover: secondaryButtonOutlinedHover.prefault({}),
    active: secondaryButtonOutlinedActive.prefault({}),
    focus: secondaryButtonOutlinedFocus.prefault({}),
    disabled: secondaryButtonOutlinedDisabled.prefault({}),
    ...createButtonSeverityFields('secondaryButtonOutlined', 'variant.primary.variant.outlined', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButtonOutlined' })

export const secondaryButton = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    font: buttonFont as typeof buttonFont,
    border: borderWithShadow.default(secondaryBorderDefaults),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    focusRing: borderWithShadow.default(secondaryFocusRingDefaults),
    hover: secondaryButtonHover.prefault({}),
    active: secondaryButtonActive.prefault({}),
    focus: secondaryButtonFocus.prefault({}),
    disabled: secondaryButtonDisabled.prefault({}),
    rounded: secondaryButtonRounded.prefault({}),
    raised: secondaryButtonRaised.prefault({}),
    text: secondaryButtonText.prefault({}),
    textRaised: secondaryButtonTextRaised.prefault({}),
    outlined: secondaryButtonOutlined.prefault({}),
    ...createButtonSeverityFields('secondaryButtonBrandDefault', 'variant.primary.defaultVariant', 'defaultState'),
  })
  .register(themeSchemaRegistry, { id: 'secondaryButton' })
