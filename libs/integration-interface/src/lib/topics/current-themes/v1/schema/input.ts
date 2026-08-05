/**
 * This file defines the schema for input theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, borderWithShadow, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

const focusRingDefaults = {
  width: '{{primitives.border.width.md}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

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
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
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
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
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
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
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
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
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
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.none}}',
  },
  placeholder: {
    color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
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
    duration: withRef(z.number()).default('{{primitives.transition.duration}}'),
  })
  .register(themeSchemaRegistry, { id: 'inputTransition' })

export const inputFocusRingSchema = borderWithShadow

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
  defaultState: inputFilledVariantState.default({
    background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
    placeholder: {
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
    },
  }),
  hover: inputFilledVariantState.default({
    background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
    color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
    placeholder: {
      color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
    },
  }),
  focus: inputFilledVariantState.default({
    background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
    color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
    placeholder: {
      color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
    },
  }),
  disabled: inputFilledVariantState.default({
    background: '{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}',
    color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
    placeholder: {
      color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
    },
  }),
  invalid: inputFilledVariantState.default({
    background: '{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}',
    color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
    placeholder: {
      color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
    },
  }),
})

export const input = z
  .object({
    transition: (inputTransition as typeof inputTransition).prefault({}),
    font: z
      .object({
        weight: withRef(z.string()).optional(),
        size: withRef(z.string()).optional(),
      })
      .default({
        weight: '{{primitives.font.weight}}',
        size: '{{primitives.font.size}}',
      }),
    padding: inputPadding.default({
      x: '{{primitives.space.md}}',
      y: '{{primitives.space.sm}}',
    }),
    border: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    focusRing: borderWithShadow.optional().default(focusRingDefaults),
    defaultState: inputState.default(defaultInputVariantState),
    hover: inputState.default(hoverInputVariantState),
    focus: inputState.default(focusInputVariantState),
    disabled: inputState.default(disabledInputVariantState),
    invalid: inputState.default(invalidInputVariantState),
    sizes: z
      .object({
        sm: inputSize.default(defaultSmSize),
        lg: inputSize.default(defaultLgSize),
      })
      .default({
        sm: defaultSmSize,
        lg: defaultLgSize,
      }),
    filled: (inputFilledVariant as typeof inputFilledVariant).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'input' })
