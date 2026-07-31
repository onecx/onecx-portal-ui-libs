import z from 'zod'
import { withRef } from '../primitives'

export const primaryFilledMessage = z
  .object({
    default: z
      .object({
        default: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.info.bg.color}}')
              .optional(),
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.info.contrast}}')
              .optional(),
            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.info.border.color}}')
                  .optional(),
              })
              .prefault({}),
            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.info.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        info: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.info.bg.color}}')
              .optional(),
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.info.contrast}}')
              .optional(),
            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.info.border.color}}')
                  .optional(),
              })
              .prefault({}),
            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.info.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        success: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.success.bg.color}}')
              .optional(),
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.success.contrast}}')
              .optional(),
            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.success.border.color}}')
                  .optional(),
              })
              .prefault({}),
            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.success.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        warning: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.warning.bg.color}}')
              .optional(),
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.warning.contrast}}')
              .optional(),
            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.warning.border.color}}')
                  .optional(),
              })
              .prefault({}),
            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.warning.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        error: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.danger.bg.color}}')
              .optional(),
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.danger.contrast}}')
              .optional(),
            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.danger.border.color}}')
                  .optional(),
              })
              .prefault({}),
            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.danger.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        contrast: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.contrast.bg.color}}')
              .optional(),
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.contrast.contrast}}')
              .optional(),
            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.contrast.border.color}}')
                  .optional(),
              })
              .prefault({}),
            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.primary.defaultState.severity.contrast.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({})

export const secondaryFilledMessage = z
  .object({
    default: z
      .object({
        default: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.info.bg.color}}')
              .optional(),

            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.info.contrast}}')
              .optional(),

            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.info.border.color}}')
                  .optional(),
              })
              .prefault({}),

            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.info.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        info: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.info.bg.color}}')
              .optional(),

            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.info.contrast}}')
              .optional(),

            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.info.border.color}}')
                  .optional(),
              })
              .prefault({}),

            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.info.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        success: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.success.bg.color}}')
              .optional(),

            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.success.contrast}}')
              .optional(),

            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.success.border.color}}')
                  .optional(),
              })
              .prefault({}),

            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.success.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        warning: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.warning.bg.color}}')
              .optional(),

            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.warning.contrast}}')
              .optional(),

            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.warning.border.color}}')
                  .optional(),
              })
              .prefault({}),

            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.warning.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        error: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.danger.bg.color}}')
              .optional(),

            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.danger.contrast}}')
              .optional(),

            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.danger.border.color}}')
                  .optional(),
              })
              .prefault({}),

            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.danger.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),

        contrast: z
          .object({
            backgroundColor: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.contrast.bg.color}}')
              .optional(),

            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.contrast.contrast}}')
              .optional(),

            border: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.contrast.border.color}}')
                  .optional(),
              })
              .prefault({}),

            shadow: z
              .object({
                color: withRef(z.string())
                  .default('{{primitives.variant.secondary.defaultState.severity.contrast.shadow.color}}')
                  .optional(),
              })
              .prefault({}),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({})
