/**
 * This file defines the schema for the loading indicator theming.
 */
import z from 'zod'
import { bg, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const loadingIndicatorOverlay = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
  })
  .register(themeSchemaRegistry, { id: 'loadingIndicatorOverlay' })

export const loadingIndicatorSpinner = z
  .object({
    size: withRef(z.string()).default('{{primitives.space.lg}}'),
    border: z
      .object({
        color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
        trackColor: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
        width: withRef(z.string()).default('{{primitives.border.width.md}}'),
      }),
    animationDuration: withRef(z.string()).default('{{primitives.transition.duration}}'),
  })
  .register(themeSchemaRegistry, { id: 'loadingIndicatorSpinner' })

export const loadingIndicator = z
  .object({
    overlay: (loadingIndicatorOverlay as typeof loadingIndicatorOverlay).prefault({}),
    spinner: (loadingIndicatorSpinner as typeof loadingIndicatorSpinner).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'loadingIndicator' })
