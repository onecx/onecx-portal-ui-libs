/**
 * This file defines the schema for tooltip theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, border, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

export const tooltipSettings = z
  .object({
    position: withRef(z.enum(['top', 'bottom', 'left', 'right'])).default('top'),
    showDelay: withRef(z.number()).default(0),
    hideDelay: withRef(z.number()).default(0),
  })
  .register(themeSchemaRegistry, { id: 'tooltipSettings' })

export const tooltipShape = z.object({
  settings: (tooltipSettings as typeof tooltipSettings).optional(),
  maxWidth: withRef(z.string()).optional(),
  gutter: withRef(z.string()).optional(),
  shadow: withRef(z.string()).optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  border: border.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
})

export const tooltipDefaults = {
  maxWidth: '{{primitives.layout.overlayMaxWidth}}',
  gutter: '{{primitives.space.sm}}',
  shadow: '{{primitives.shadow.md}}',
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
  border: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  },
  background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
}

export const tooltip = applyDefaultsRecursive(tooltipShape, tooltipDefaults).register(themeSchemaRegistry, {
  id: 'tooltip',
})
