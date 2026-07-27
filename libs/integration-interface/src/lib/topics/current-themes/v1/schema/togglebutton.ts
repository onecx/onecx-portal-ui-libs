import * as z from 'zod'
import { bg, color, withRef, font } from './primitives'
import { themeSchemaRegistry } from './registry'

const defaultFont = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

export const togglebuttonSettings = z
  .object({
    // Component-specific settings can be added here if needed
  })
  .register(themeSchemaRegistry, { id: 'togglebuttonSettings' })

export const togglebutton = z
  .object({
    settings: (togglebuttonSettings as typeof togglebuttonSettings).optional(),

    // Root level properties (default/unchecked state)
    padding: withRef(z.string()).optional().default('{{primitives.space.xs}} {{primitives.space.sm}}'),
    gap: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
    font: z
      .object({
        family: withRef(z.string()).optional().default('{{primitives.font.family}}'),
        size: withRef(z.string()).optional().default('{{primitives.font.size}}'),
        weight: withRef(z.string()).optional().default('{{primitives.font.weight}}'),
        lineHeight: withRef(z.string()).optional().default('{{primitives.font.lineHeight}}'),
        letterSpacing: withRef(z.string()).optional().default('{{primitives.font.letterSpacing}}'),
        style: withRef(z.string()).optional().default('{{primitives.font.style}}'),
      })
      .optional(),
    border: z
      .object({
        color: color.optional().default('{{primitives.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default('{{primitives.radius.md}}'),
      })
      .optional(),
    transitionDuration: withRef(z.string()).optional().default('{{primitives.transition.duration}}'),
    background: z
      .union([bg, withRef(z.string())])
      .optional()
      .default('{{primitives.area.surface.defaultState.defaultVariant.bg}}'),
    color: color.optional().default('{{primitives.area.surface.defaultState.defaultVariant.contrast}}'),

    // Focus ring
    focusRing: z
      .object({
        width: withRef(z.string()).optional().default('{{primitives.focusRing.width}}'),
        style: withRef(z.string()).optional().default('{{primitives.focusRing.style}}'),
        color: color.optional().default('{{primitives.focusRing.color}}'),
        offset: withRef(z.string()).optional().default('{{primitives.focusRing.offset}}'),
        shadow: withRef(z.string()).optional().default('{{primitives.focusRing.shadow}}'),
      })
      .optional(),

    // Default (unchecked) states
    hover: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.area.surface.state.hover.defaultVariant.bg}}'),
        color: color.optional().default('{{primitives.area.surface.state.hover.defaultVariant.contrast}}'),
      })
      .optional(),

    disabled: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.area.surface.state.disabled.defaultVariant.bg}}'),
        color: color.optional().default('{{primitives.area.surface.state.disabled.defaultVariant.contrast}}'),
        border: z
          .object({
            color: color
              .optional()
              .default('{{primitives.area.surface.state.disabled.defaultVariant.border.defaultVariant.color}}'),
          })
          .optional(),
      })
      .optional(),

    invalid: z
      .object({
        border: z
          .object({
            color: color
              .optional()
              .default('{{primitives.defaultVariant.state.invalid.defaultSeverity.border.defaultVariant.color}}'),
          })
          .optional(),
      })
      .optional(),

    // checked variant
    checked: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.area.surface.selectedState.defaultVariant.bg}}'),
        color: color.optional().default('{{primitives.area.surface.selectedState.defaultVariant.contrast}}'),
        border: z
          .object({
            color: color
              .optional()
              .default('{{primitives.area.surface.selectedState.defaultVariant.border.defaultVariant.color}}'),
          })
          .optional(),
        hover: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .optional()
              .default('{{primitives.area.surface.selectedState.defaultVariant.bg}}'),
            color: color.optional().default('{{primitives.area.surface.selectedState.defaultVariant.contrast}}'),
          })
          .optional(),
        disabled: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .optional()
              .default('{{primitives.area.surface.state.disabled.defaultVariant.bg}}'),
            color: color.optional().default('{{primitives.area.surface.state.disabled.defaultVariant.contrast}}'),
          })
          .optional(),
        icon: z
          .object({
            color: color.optional().default('{{primitives.area.surface.selectedState.defaultVariant.contrast}}'),
            hover: z
              .object({
                color: color.optional().default('{{primitives.area.surface.selectedState.defaultVariant.contrast}}'),
              })
              .optional(),
          })
          .optional(),
        content: z
          .object({
            background: z.union([bg, withRef(z.string())]).optional(),
            shadow: withRef(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),

    // global size variants
    sm: z
      .object({
        fontSize: withRef(z.string()).optional().default('{{primitives.font.size.sm}}'),
        padding: withRef(z.string()).optional().default('{{primitives.space.xxs}} {{primitives.space.xs}}'),
      })
      .optional(),

    lg: z
      .object({
        fontSize: withRef(z.string()).optional().default('{{primitives.font.size.lg}}'),
        padding: withRef(z.string()).optional().default('{{primitives.space.sm}} {{primitives.space.md}}'),
      })
      .optional(),

    // Icon child-element
    icon: z
      .object({
        color: color.optional().default('{{primitives.area.surface.defaultState.defaultVariant.contrast}}'),
        hover: z
          .object({
            color: color.optional().default('{{primitives.area.surface.state.hover.defaultVariant.contrast}}'),
          })
          .optional(),
        disabled: z
          .object({
            color: color.optional().default('{{primitives.area.surface.state.disabled.defaultVariant.contrast}}'),
          })
          .optional(),
      })
      .optional(),

    // Content child-element
    content: z
      .object({
        padding: withRef(z.string()).optional().default('0'),
        border: z
          .object({
            radius: withRef(z.string()).optional().default('{{primitives.radius.md}}'),
          })
          .optional(),
        sm: z
          .object({
            padding: withRef(z.string()).optional().default('0'),
          })
          .optional(),
        lg: z
          .object({
            padding: withRef(z.string()).optional().default('0'),
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'togglebutton' })
