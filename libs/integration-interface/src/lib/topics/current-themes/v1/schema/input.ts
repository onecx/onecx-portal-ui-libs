import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

const defaultSmSize = {
  fontSize: '{{primitives.font.size}}',
  padding: {
    x: '{{primitives.space.sm}}',
    y: '{{primitives.space.xs}}',
  },
}

const defaultLgSize = {
  fontSize: '{{primitives.font.size}}',
  padding: {
    x: '{{primitives.space.lg}}',
    y: '{{primitives.space.md}}',
  },
}

const defaultInputVariantState = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  },
}

const hoverInputVariantState = {
  background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
  },
}

const focusInputVariantState = {
  background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
  },
}

const disabledInputVariantState = {
  background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
  },
}

const invalidInputVariantState = {
  background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
  },
}

const defaultInputVariant = {
  font: {
    weight: '{{primitives.font.weight}}',
    size: '{{primitives.font.size}}',
  },
  padding: {
    x: '{{primitives.space.md}}',
    y: '{{primitives.space.sm}}',
  },
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  },
  focusRing: {
    width: '{{primitives.focusRing.width}}',
    style: '{{primitives.focusRing.style}}',
    color: '{{primitives.focusRing.color}}',
    offset: '{{primitives.focusRing.offset}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.focusRing.shadow}}',
  },
  defaultState: defaultInputVariantState,
  hover: hoverInputVariantState,
  focus: focusInputVariantState,
  disabled: disabledInputVariantState,
  invalid: invalidInputVariantState,
  sizes: {
    sm: defaultSmSize,
    lg: defaultLgSize,
  },
}

export const inputPadding = z.object({
  x: withRef(z.string()).optional(),
  y: withRef(z.string()).optional(),
})

export const inputSize = z.object({
  fontSize: withRef(z.string()).optional(),
  padding: inputPadding.optional(),
})

export const inputTransition = z
  .object({
    duration: withRef(z.string()).default('{{primitives.transition.duration}}'),
  })
  .register(themeSchemaRegistry, { id: 'inputTransition' })

export const inputFocusRingSchema = borderWithShadow

export const inputFocusRing = inputFocusRingSchema
  .optional()
  .default({
    width: '{{primitives.focusRing.width}}',
    style: '{{primitives.focusRing.style}}',
    color: '{{primitives.focusRing.color}}',
    offset: '{{primitives.focusRing.offset}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.focusRing.shadow}}',
  })

export const inputState = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: borderWithShadow.optional(),
  placeholder: z
    .object({
      color: color.optional(),
    })
    .optional(),
})

export const inputFilledVariantState = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  placeholder: z
    .object({
      color: color.optional(),
    })
    .optional(),
})

export const inputFilledVariant = z.object({
  defaultState: inputFilledVariantState.optional(),
  hover: inputFilledVariantState.optional(),
  focus: inputFilledVariantState.optional(),
  disabled: inputFilledVariantState.optional(),
  invalid: inputFilledVariantState.optional(),
})

export const inputVariant = z.object({
  font: z
    .object({
      weight: withRef(z.string()).optional(),
      size: withRef(z.string()).optional(),
    })
    .optional()
    .default({
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    }),

  padding: inputPadding
    .optional()
    .default({
      x: '{{primitives.space.md}}',
      y: '{{primitives.space.sm}}',
    }),

  border: borderWithShadow.optional().default({
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.sm}}',
  }),

  focusRing: inputFocusRing,

  defaultState: inputState
    .optional()
    .default(defaultInputVariantState),

  hover: inputState
    .optional()
    .default(hoverInputVariantState),

  focus: inputState
    .optional()
    .default(focusInputVariantState),

  disabled: inputState
    .optional()
    .default(disabledInputVariantState),

  invalid: inputState
    .optional()
    .default(invalidInputVariantState),

  sizes: z
    .object({
      sm: inputSize
        .optional()
        .default(defaultSmSize),
      lg: inputSize
        .optional()
        .default(defaultLgSize),
    })
    .optional()
    .default({
      sm: defaultSmSize,
      lg: defaultLgSize,
    }),
})

export const input = z
  .object({
    transition: (inputTransition as typeof inputTransition).prefault({}),
    defaultVariant: inputVariant.optional().default(defaultInputVariant),
    variants: z
      .object({
        filled: inputFilledVariant
          .optional()
          .default({
            defaultState: {
              background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
              color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
              placeholder: {
                color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
              },
            },
            hover: {
              background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
              color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
              placeholder: {
                color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
              },
            },
            focus: {
              background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
              color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
              placeholder: {
                color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
              },
            },
            disabled: {
              background: '{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}',
              color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
              placeholder: {
                color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
              },
            },
            invalid: {
              background: '{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}',
              color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
              placeholder: {
                color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
              },
            },
          }),
      })
      .optional()
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'input' })