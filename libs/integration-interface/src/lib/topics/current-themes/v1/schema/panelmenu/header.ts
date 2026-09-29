import * as z from 'zod'
import { bg, color, withRef } from '../primitives'

/**
 * PanelMenu header (the clickable trigger row of each top-level panel).
 * `selected` covers the row that represents the current navigation destination
 */
const panelMenuHeaderIconShape = z.object({
  color: color.optional(),
})

const panelMenuHeaderStateShape = z.object({
  color: color.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  gap: withRef(z.string()).optional(),
  padding: withRef(z.string()).optional(),
  borderRadius: withRef(z.string()).optional(),
  icon: panelMenuHeaderIconShape.prefault({}),
  submenuIcon: panelMenuHeaderIconShape.prefault({}),
})

export const panelMenuHeaderShape = z.object({
  defaultVariant: z
    .object({
      defaultState: panelMenuHeaderStateShape.prefault({}),
      hover: panelMenuHeaderStateShape.prefault({}),
      selected: panelMenuHeaderStateShape.prefault({}),
      disabled: panelMenuHeaderStateShape.prefault({}),
    })
    .prefault({}),
})

/**
 * Default tokens for the panelmenu header row.
 */
export const panelMenuHeaderDefaults = {
  defaultVariant: {
    defaultState: {
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      gap: '{{primitives.space.sm}}',
      padding: '{{primitives.space.sm}}',
      borderRadius: '{{primitives.border.radius.md}}',
      icon: {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      },
      submenuIcon: {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      },
    },
    hover: {
      background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
      icon: {
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
      },
      submenuIcon: {
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
      },
    },
    selected: {
      background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
      icon: {
        color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
      },
      submenuIcon: {
        color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
      },
    },
    disabled: {
      color: '{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}',
      icon: {
        color: '{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}',
      },
      submenuIcon: {
        color: '{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}',
      },
    },
  },
}
