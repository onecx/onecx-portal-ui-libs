/**
 * This file defines the schema for ripple theming.
 */
import * as z from 'zod'
import { bg, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const rippleSettings = z
  .object({
    disabled: withRef(z.boolean()).default(false),
    unbounded: withRef(z.boolean()).default(false),
    centered: withRef(z.boolean()).default(false),
    radius: withRef(z.number()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'rippleSettings' })

export const ripple = z
  .object({
    settings: (rippleSettings as typeof rippleSettings).optional(),
    background: z.union([bg, withRef(z.string())]).default(
      '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
    ),
  })
  .register(themeSchemaRegistry, { id: 'ripple' })
