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

export const inputHoverState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    placeholder: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputHoverState' })

export const inputFocusState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    placeholder: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputFocusState' })

export const inputDisabledState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    placeholder: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputDisabledState' })

export const inputInvalidState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    placeholder: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputInvalidState' })

export const inputFilledHoverState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
    placeholder: z
      .object({
        color: color.default('{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputFilledHoverState' })

export const inputFilledFocusState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
    placeholder: z
      .object({
        color: color.default('{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputFilledFocusState' })

export const inputFilledDisabledState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}'),
    placeholder: z
      .object({
        color: color.default('{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputFilledDisabledState' })

export const inputFilledInvalidState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}'),
    placeholder: z
      .object({
        color: color.default('{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'inputFilledInvalidState' })

export const inputFilledVariant = z.object({
  background: z
    .union([bg, withRef(z.string())])
    .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
  color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
  placeholder: z
    .object({
      color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    })
    .prefault({}),
  hover: (inputFilledHoverState as typeof inputFilledHoverState).prefault({}),
  focus: (inputFilledFocusState as typeof inputFilledFocusState).prefault({}),
  disabled: (inputFilledDisabledState as typeof inputFilledDisabledState).prefault({}),
  invalid: (inputFilledInvalidState as typeof inputFilledInvalidState).prefault({}),
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
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    placeholder: z
      .object({
        color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      })
      .prefault({}),
    hover: (inputHoverState as typeof inputHoverState).prefault({}),
    focus: (inputFocusState as typeof inputFocusState).prefault({}),
    disabled: (inputDisabledState as typeof inputDisabledState).prefault({}),
    invalid: (inputInvalidState as typeof inputInvalidState).prefault({}),
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
