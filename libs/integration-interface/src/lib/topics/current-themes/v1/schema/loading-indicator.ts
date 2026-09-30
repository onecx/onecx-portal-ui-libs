/**
 * This file defines the schema for the loading indicator theming.
 */
import * as z from 'zod'
import { bg, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

const loadingIndicatorOverlayShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
})

const loadingIndicatorSpinnerBorderShape = z.object({
  color: color.optional(),
  trackColor: color.optional(),
  width: withRef(z.string()).optional(),
})

const loadingIndicatorSpinnerShape = z.object({
  size: withRef(z.string()).optional(),
  border: loadingIndicatorSpinnerBorderShape.prefault({}),
  animationDuration: withRef(z.string()).optional(),
})

export const loadingIndicatorShape = z.object({
  overlay: loadingIndicatorOverlayShape.prefault({}),
  spinner: loadingIndicatorSpinnerShape.prefault({}),
})

export const loadingIndicatorDefaults = {
  overlay: {
    background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
  },
  spinner: {
    size: '{{primitives.space.lg}}',
    border: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      trackColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      width: '{{primitives.border.width.md}}',
    },
    animationDuration: '{{primitives.transition.duration}}',
  },
}

export const loadingIndicator = applyDefaultsRecursive(loadingIndicatorShape, loadingIndicatorDefaults).register(
  themeSchemaRegistry,
  { id: 'loadingIndicator' },
)
