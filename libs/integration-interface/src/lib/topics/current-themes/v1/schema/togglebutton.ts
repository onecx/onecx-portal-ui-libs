import * as z from 'zod'
import { bg, color, withRef, font, border, borderWithShadow } from './primitives'
import { themeSchemaRegistry } from './registry'

// Root level properties
const defaultFont = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

const defaultBorder = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.sm}}',
  radius: '{{primitives.border.radius.md}}',
}

const defaultFocusRing = {
  width: '{{primitives.focusRing.width.md}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  offset: '{{primitives.focusRing.offset.md}}',
  radius: '{{primitives.focusRing.radius.md}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

export const togglebuttonSettings = z
  .object({
    // Component-specific settings can be added here if needed
  })
  .register(themeSchemaRegistry, { id: 'togglebuttonSettings' })

// Default (unchecked) interaction states
export const hoverTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const focusTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const disabledTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const invalidTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

// checked variant
export const checkedHoverTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.variant.primary.state.hover.defaultSeverity.bg}}'),
  color: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
    style: '{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const checkedFocusTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.variant.primary.state.focus.defaultSeverity.bg}}'),
  color: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}',
    style: '{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const checkedDisabledTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const checkedInvalidTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}'),
  color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
})

export const checkedTogglebuttonTokens = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
  color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
  border: border.default({
    color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
  hover: checkedHoverTogglebuttonTokens.prefault({}),
  focus: checkedFocusTogglebuttonTokens.prefault({}),
  disabled: checkedDisabledTogglebuttonTokens.prefault({}),
  invalid: checkedInvalidTogglebuttonTokens.prefault({}),
})

// icon child-element
export const iconHoverTogglebuttonTokens = z.object({
  color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
})

export const iconFocusTogglebuttonTokens = z.object({
  color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
})

export const iconDisabledTogglebuttonTokens = z.object({
  color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
})

export const iconCheckedHoverTogglebuttonTokens = z.object({
  color: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
})

export const iconCheckedFocusTogglebuttonTokens = z.object({
  color: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
})

export const iconCheckedDisabledTogglebuttonTokens = z.object({
  color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
})

export const iconCheckedTogglebuttonTokens = z.object({
  color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
  hover: iconCheckedHoverTogglebuttonTokens.prefault({}),
  focus: iconCheckedFocusTogglebuttonTokens.prefault({}),
  disabled: iconCheckedDisabledTogglebuttonTokens.prefault({}),
})

export const iconTogglebuttonTokens = z.object({
  color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  hover: iconHoverTogglebuttonTokens.prefault({}),
  focus: iconFocusTogglebuttonTokens.prefault({}),
  disabled: iconDisabledTogglebuttonTokens.prefault({}),
  checked: iconCheckedTogglebuttonTokens.prefault({}),
})

// global size variants
export const smTogglebuttonTokens = z.object({
  font: font.pick({ size: true }).default({ size: '{{primitives.font.size.sm}}' }),
  paddingX: withRef(z.string()).default('{{primitives.space.xs}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.xxs}}'),
})

export const lgTogglebuttonTokens = z.object({
  font: font.pick({ size: true }).default({ size: '{{primitives.font.size.lg}}' }),
  paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
  paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
})

// content child-element
export const contentTogglebuttonTokens = z.object({
  paddingX: withRef(z.string()).default('0'),
  paddingY: withRef(z.string()).default('0'),
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
  border: border.pick({ radius: true }).default({
    radius: '{{primitives.border.radius.md}}',
  }),
  shadow: withRef(z.string()).default('{{primitives.shadow.none}}'),
})

export const togglebutton = z
  .object({
    settings: (togglebuttonSettings as typeof togglebuttonSettings).optional(),

    // Root level properties (default/unchecked state)
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
    gap: withRef(z.string()).default('{{primitives.space.xs}}'),
    font: font.default(defaultFont),
    border: border.default(defaultBorder),
    transitionDuration: withRef(z.string()).default('{{primitives.transition.duration}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),

    // Focus ring
    focusRing: borderWithShadow.default(defaultFocusRing),

    // Default (unchecked) interaction states
    hover: hoverTogglebuttonTokens.prefault({}),
    focus: focusTogglebuttonTokens.prefault({}),
    disabled: disabledTogglebuttonTokens.prefault({}),
    invalid: invalidTogglebuttonTokens.prefault({}),

    // checked variant
    checked: checkedTogglebuttonTokens.prefault({}),

    // global size variants
    sm: smTogglebuttonTokens.prefault({}),
    lg: lgTogglebuttonTokens.prefault({}),

    // Icon child-element
    icon: iconTogglebuttonTokens.prefault({}),

    // Content child-element
    content: contentTogglebuttonTokens.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'togglebutton' })
