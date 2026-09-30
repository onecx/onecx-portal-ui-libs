import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, icon, withRef } from '../primitives'

const breadcrumbItemStateShape = z.object({
  color: color.optional(),

  background: bg.pick({ color: true }).optional(),

  border: border
    .pick({
      radius: true,
      width: true,
      color: true,
    })
    .optional(),

  gap: withRef(z.string()).optional(),

  icon: icon
    .pick({
      color: true,
      size: true,
    })
    .optional(),

  label: z
    .object({
      font: font
        .pick({
          weight: true,
          size: true,
        })
        .prefault({}),
    })
    .prefault({}),

  focusRing: borderWithShadow.optional(),

  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
})

const breadcrumbItemVariantShape = z.object({
  defaultState: breadcrumbItemStateShape.prefault({}),
  hover: breadcrumbItemStateShape.prefault({}),
  focus: breadcrumbItemStateShape.prefault({}),
  active: breadcrumbItemStateShape.prefault({}),
  disabled: breadcrumbItemStateShape.prefault({}),
})

export const breadcrumbItemShape = z.object({
  defaultVariant: breadcrumbItemVariantShape.prefault({}),
})

export const breadcrumbItemDefaults = {
  defaultVariant: {
    defaultState: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',

      background: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
      },

      border: {
        radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
        width: '{{primitives.border.width.md}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      },

      gap: '{{primitives.space.sm}}',

      icon: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        size: '{{primitives.icon.md}}',
      },

      label: {
        font: {
          weight: '{{primitives.font.weight}}',
          size: '{{primitives.font.size}}',
        },
      },

      focusRing: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
        width: '{{primitives.focusRing.width.md}}',
        offset: '{{primitives.focusRing.offset.md}}',
        radius: '{{primitives.focusRing.radius.md}}',
        shadow: '{{primitives.focusRing.shadow.md}}',
      },

      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
    },

    hover: {
      background: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}',
      },

      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',

      border: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      },

      icon: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      },
    },

    focus: {
      background: {
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}',
      },

      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',

      border: {
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      },

      icon: {
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
      },
    },

    active: {
      background: {
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
      },

      color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',

      border: {
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
      },

      icon: {
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
      },
    },

    disabled: {
      background: {
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}',
      },

      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',

      border: {
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      },

      icon: {
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
      },
    },
  },
}
