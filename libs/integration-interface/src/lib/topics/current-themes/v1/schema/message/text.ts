import z from 'zod'
import { withRef } from '../primitives'

export const primaryTextMessage = z
  .object({
    default: z
      .object({
        default: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.info.contrast}}')
              .optional(),
          })
          .prefault({}),

        info: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.info.contrast}}')
              .optional(),
          })
          .prefault({}),

        success: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.success.contrast}}')
              .optional(),
          })
          .prefault({}),

        warning: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.warning.contrast}}')
              .optional(),
          })
          .prefault({}),

        error: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.danger.contrast}}')
              .optional(),
          })
          .prefault({}),

        contrast: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.primary.defaultState.severity.contrast.contrast}}')
              .optional(),
          })
          .prefault({}),
      })
      .prefault({}),
  })
  .prefault({})

export const secondaryTextMessage = z
  .object({
    default: z
      .object({
        default: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.info.contrast}}')
              .optional(),
          })
          .optional(),
        info: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.info.contrast}}')
              .optional(),
          })
          .optional(),
        success: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.success.contrast}}')
              .optional(),
          })
          .optional(),
        warning: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.warning.contrast}}')
              .optional(),
          })
          .optional(),
        error: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.danger.contrast}}')
              .optional(),
          })
          .optional(),
        contrast: z
          .object({
            color: withRef(z.string())
              .default('{{primitives.variant.secondary.defaultState.severity.contrast.contrast}}')
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional()
