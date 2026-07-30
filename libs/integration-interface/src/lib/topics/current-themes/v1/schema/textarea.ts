import * as z from 'zod'
import { bg, color, withRef, font, borderWithShadow } from './primitives'
import { themeSchemaRegistry } from './registry'

// FocusRing is a standalone concept — not bounded to border
const focusRingDefaults = {
  width: '{{primitives.focusRing.width.md}}',
  color: '{{primitives.defaultVariant.contrast}}',
  offset: '{{primitives.focusRing.offset.md}}',
  radius: '{{primitives.focusRing.radius.md}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

// Font for textarea component — excludes family (set globally, not at component level)
const textareaFont = font.omit({ family: true, size: true }).default({
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
})

// Font for size variants — only size, weight, lineHeight, letterSpacing
const sizeFont = font.pick({
  size: true,
})

// Border defaults reused across all variant levels (borderWithShadow includes shadow)
const borderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.md}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

const defaultSmSize = {
  font: {
    size: '{{primitives.font.size}}',
  },
  paddingX: '{{primitives.space.xs}}',
  paddingY: '{{primitives.space.xs}}',
}

const defaultMdSize = {
  font: {
    size: '{{primitives.font.size}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
}

const defaultLgSize = {
  font: {
    size: '{{primitives.font.size}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
}

export const textareaSettings = z
  .object({
    autoResizeX: withRef(z.boolean()).optional(),
    autoResizeY: withRef(z.boolean()).optional(),
    variant: withRef(z.enum(['filled', 'outlined'])).optional(),
    fluid: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'textareaSettings' })

export const textareaSize = z
  .object({
    font: (sizeFont as typeof sizeFont).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'textareaSize' })

// Border with shadow — reused across all variant levels
const borderToken = borderWithShadow.default(borderDefaults)

// Base tokens shared across all states and variants (always populated with defaults)
const baseTokens = {
  font: textareaFont as typeof textareaFont,
  border: borderToken as typeof borderToken,
  transitionDuration: withRef(z.number()).optional().default('{{primitives.transition.duration}}'),
  sm: (textareaSize as typeof textareaSize).optional().default(defaultSmSize),
  md: (textareaSize as typeof textareaSize).optional().default(defaultMdSize),
  lg: (textareaSize as typeof textareaSize).optional().default(defaultLgSize),
}

// Default variant (outlined) styles
export const textareaStyles = z
  .object({
    ...baseTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    cursor: withRef(z.string()).default('pointer'),
  })
  .register(themeSchemaRegistry, { id: 'textareaStyles' })

// Hover state for default variant
export const hoverTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    cursor: withRef(z.string()).default('pointer'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'hoverTextareaStyles' })

// Active state for default variant
export const activeTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'activeTextareaStyles' })

// Focus state for default variant
export const focusTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'focusTextareaStyles' })

// Disabled state for default variant
export const disabledTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    cursor: withRef(z.string()).default('pointer'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'disabledTextareaStyles' })

// Invalid state for default variant
export const invalidTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'invalidTextareaStyles' })

// Default variant (outlined) with all states
export const textareaWithStates = z
  .object({
    ...baseTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    hover: (hoverTextareaStyles as typeof hoverTextareaStyles).prefault({}),
    active: (activeTextareaStyles as typeof activeTextareaStyles).prefault({}),
    focus: (focusTextareaStyles as typeof focusTextareaStyles).prefault({}),
    disabled: (disabledTextareaStyles as typeof disabledTextareaStyles).prefault({}),
    invalid: (invalidTextareaStyles as typeof invalidTextareaStyles).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'textareaWithStates' })

// Filled variant default styles
export const filledTextareaStyles = z
  .object({
    ...baseTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
    }),
    focusRing: borderWithShadow.optional().default(focusRingDefaults),
  })
  .register(themeSchemaRegistry, { id: 'filledTextareaStyles' })

// Hover state for filled variant
export const hoverFilledTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'hoverFilledTextareaStyles' })

// Active state for filled variant
export const activeFilledTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.active.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.state.active.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.active.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'activeFilledTextareaStyles' })

// Focus state for filled variant
export const focusFilledTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'focusFilledTextareaStyles' })

// Disabled state for filled variant
export const disabledFilledTextareaStyles = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'disabledFilledTextareaStyles' })

// Invalid state for filled variant
export const invalidFilledTextareaStyles = z
  .object({
    placeholderColor: color.default('{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.style}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'invalidFilledTextareaStyles' })

// Filled variant with all states
export const filledTextareaStateWithStates = z
  .object({
    ...baseTokens,
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      ...borderDefaults,
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
    }),
    hover: (hoverFilledTextareaStyles as typeof hoverFilledTextareaStyles).prefault({}),
    active: (activeFilledTextareaStyles as typeof activeFilledTextareaStyles).prefault({}),
    focus: (focusFilledTextareaStyles as typeof focusFilledTextareaStyles).prefault({}),
    disabled: (disabledFilledTextareaStyles as typeof disabledFilledTextareaStyles).prefault({}),
    invalid: (invalidFilledTextareaStyles as typeof invalidFilledTextareaStyles).prefault({}),
    focusRing: borderWithShadow.optional().default(focusRingDefaults),
  })
  .register(themeSchemaRegistry, { id: 'filledTextareaStateWithStates' })

export const textarea = z
  .object({
    settings: (textareaSettings as typeof textareaSettings).optional(),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    font: textareaFont as typeof textareaFont,
    border: borderToken as typeof borderToken,
    transitionDuration: withRef(z.number()).optional().default('{{primitives.transition.duration}}'),
    sm: (textareaSize as typeof textareaSize).optional().default(defaultSmSize),
    md: (textareaSize as typeof textareaSize).optional().default(defaultMdSize),
    lg: (textareaSize as typeof textareaSize).optional().default(defaultLgSize),
    hover: (hoverTextareaStyles as typeof hoverTextareaStyles).prefault({}),
    active: (activeTextareaStyles as typeof activeTextareaStyles).prefault({}),
    focus: (focusTextareaStyles as typeof focusTextareaStyles).prefault({}),
    disabled: (disabledTextareaStyles as typeof disabledTextareaStyles).prefault({}),
    invalid: (invalidTextareaStyles as typeof invalidTextareaStyles).prefault({}),
    focusRing: borderWithShadow.optional().default(focusRingDefaults),
    filled: (filledTextareaStateWithStates as typeof filledTextareaStateWithStates).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'textarea' })
