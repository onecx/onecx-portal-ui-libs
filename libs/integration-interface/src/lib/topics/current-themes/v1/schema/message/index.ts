import z from 'zod'
import { primaryTextMessage, secondaryTextMessage } from './text'
import { primaryFilledMessage, secondaryFilledMessage } from './filled'
import { withRef } from '../primitives'
import { messageClose } from './close'

const settings = z.object({
  closable: z.boolean().default(false),
  delay: z.number().default(300),
  showMultiple: z.boolean().default(true),
})

const size = z
  .object({
    xs: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.xs}}').optional(),

        font: z
          .object({
            size: withRef(z.string()).default('{{primitives.font.size.xs}}').optional(),
          })
          .default({}),

        icon: z
          .object({
            size: withRef(z.string()).default('{{primitives.icon.size.xs}}').optional(),
          })
          .default({}),

        close: z
          .object({
            icon: z
              .object({
                size: withRef(z.string()).default('{{primitives.icon.size.xs}}').optional(),
              })
              .default({}),
          })
          .prefault({}),
      })
      .prefault({}),

    sm: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.sm}}').optional(),

        font: z
          .object({
            size: withRef(z.string()).default('{{primitives.font.size.sm}}').optional(),
          })
          .default({}),

        icon: z
          .object({
            size: withRef(z.string()).default('{{primitives.icon.size.sm}}').optional(),
          })
          .default({}),

        close: z
          .object({
            icon: z
              .object({
                size: withRef(z.string()).default('{{primitives.icon.size.sm}}').optional(),
              })
              .prefault({}),
          })
          .prefault({}),
      })
      .prefault({}),

    md: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.md}}').optional(),

        font: z
          .object({
            size: withRef(z.string()).default('{{primitives.font.size.md}}').optional(),
          })
          .default({}),

        icon: z
          .object({
            size: withRef(z.string()).default('{{primitives.icon.size.md}}').optional(),
          })
          .default({}),

        close: z
          .object({
            icon: z
              .object({
                size: withRef(z.string()).default('{{primitives.icon.size.md}}').optional(),
              })
              .default({}),
          })
          .prefault({}),
      })
      .prefault({}),

    lg: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.lg}}').optional(),

        font: z
          .object({
            size: withRef(z.string()).default('{{primitives.font.size.lg}}').optional(),
          })
          .default({}),

        icon: z
          .object({
            size: withRef(z.string()).default('{{primitives.icon.size.lg}}').optional(),
          })
          .default({}),

        close: z
          .object({
            icon: z
              .object({
                size: withRef(z.string()).default('{{primitives.icon.size.lg}}').optional(),
              })
              .default({}),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({})

const messageBaseStyles = z.object({
  border: z
    .object({
      radius: withRef(z.string()).default('{{primitives.radius.md}}').optional(),
      width: withRef(z.string()).default('{{primitives.border.width.md}}').optional(),
    })
    .optional()
    .prefault({}),
  transition: z
    .object({
      duration: withRef(z.number()).default('{{primitives.transition.duration}}').optional(),
    })
    .optional()
    .prefault({}),
  padding: withRef(z.string()).default('{{primitives.space.md}}').optional(),
  gap: withRef(z.string()).default('{{primitives.space.md}}').optional(),
  icon: z
    .object({
      size: withRef(z.string()).default('{{primitives.icon.size.md}}').optional(),
    })
    .optional()
    .prefault({}),
  font: z
    .object({
      size: withRef(z.string()).default('{{primitives.font.size.md}}').optional(),
      weight: withRef(z.string()).default('{{primitives.font.weight.md}}').optional(),
    })
    .optional()
    .prefault({}),
})

const primary = z
  .object({
    text: primaryTextMessage.optional(),
    filled: primaryFilledMessage.optional(),
    outlined: primaryFilledMessage.optional(),
  })
  .optional()

const secondary = z
  .object({
    text: secondaryTextMessage.optional(),
    filled: secondaryFilledMessage.optional(),
    outlined: secondaryFilledMessage.optional(),
  })
  .optional()

export const message = messageBaseStyles
  .extend({
    settings: settings.prefault({}),
    primary: primary.prefault({}),
    secondary: secondary.prefault({}),
    size: size.prefault({}),
    close: messageClose.prefault({}),
  })
  .optional()
