import z from 'zod'
import { themeSchemaRegistry } from './registry'
import { severityVariantGroup, withRef, bgContrast, border, font, borderWithShadow, transition } from './primitives'

const iconBase = z.object({
  name: withRef(z.string()).optional(),
  size: withRef(z.string()).optional(),
  color: withRef(z.string()).optional(),
})

const settings = z.object({
  closable: withRef(z.boolean()).optional(),
  closeIconName: withRef(z.string()).optional(),
  size: withRef(z.enum(['xs', 'sm', 'md', 'lg'])).optional(),
  showMultiple: withRef(z.boolean()).optional(),
  delay: withRef(z.number()).default(5000),
})

const variants = severityVariantGroup.default({
  defaultVariant: {
    bg: '{{primitives.defaultVariant.defaultState.defaultVariant.bg}}',
    border: {
      defaultVariant: {
        radius: '{{primitives.radius.md}}',
        width: '{{primitives.border.defaultVariant.width}}',
        color: '{{primitives.border.defaultVariant.color}}',
      },
    },
  },
  variant: {
    success: {
      bg: '{{primitives.variant.primary.defaultState.defaultVariant.bg}}',
    },
  },
})

const closeButtonState = bgContrast.extend({
  border: border.optional(),
  focusRing: borderWithShadow.optional(),
})

const container = z.object({
  padding: withRef(z.string()).default('{{primitives.space.md}}'),
  gap: withRef(z.string()).default('{{primitives.space.md}}'),
  font: font.optional(),
  transition: transition.optional(),
  variants: variants,
  messageIcon: iconBase.optional(),
  closeButton: z
    .object({
      states: z
        .object({
          default: (closeButtonState as typeof closeButtonState)
            .extend({
              icon: iconBase.optional(),
            })
            .optional(),
          hover: (closeButtonState as typeof closeButtonState).optional(),
          active: (closeButtonState as typeof closeButtonState).optional(),
          focus: (closeButtonState as typeof closeButtonState).optional(),
          disabled: (closeButtonState as typeof closeButtonState).optional(),
        })
        .optional(),
    })
    .optional(),
})

export const message = z
  .object({
    settings: (settings as typeof settings).optional(),
    container: (container as typeof container).optional(),
  })
  .register(themeSchemaRegistry, { id: 'message' })
