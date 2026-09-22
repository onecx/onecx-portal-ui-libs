import * as z from 'zod'
import { bg, border, color, withRef } from '../primitives'

/**
 * Shape for the panelmenu panel — the card wrapping each top-level menu section
 * (`panelmenu.panel.*` upstream). No hover/focus states exist for the panel box
 * itself, so its tokens sit directly here instead of behind a `defaultState` wrapper.
 */
const panelMenuPanelFirstShape = z.object({
  borderWidth: withRef(z.string()).optional(),
  topBorderRadius: withRef(z.string()).optional(),
})

const panelMenuPanelLastShape = z.object({
  borderWidth: withRef(z.string()).optional(),
  bottomBorderRadius: withRef(z.string()).optional(),
})

export const panelMenuPanelShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  padding: withRef(z.string()).optional(),
  first: panelMenuPanelFirstShape.prefault({}),
  last: panelMenuPanelLastShape.prefault({}),
})

/**
 * Default tokens for the panelmenu panel.
 */
export const panelMenuPanelDefaults = {
  background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
  },
  padding: '{{primitives.space.xs}}',
  first: {
    borderWidth: '{{primitives.border.width.sm}}',
    topBorderRadius: '{{primitives.border.radius.md}}',
  },
  last: {
    borderWidth: '{{primitives.border.width.sm}}',
    bottomBorderRadius: '{{primitives.border.radius.md}}',
  },
}
