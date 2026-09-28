import * as z from 'zod'
import { bg, color, withRef } from '../primitives'

/**
 * PanelMenu item (a recursive menu row inside the panel's expanded content).
 * 
 * `submenu.indent` (`panelmenu.submenu.indent` upstream) is the item's own child:
 * it indents the nested `<ul>` wrapping an item's children, whenever the item has any.
 */
const panelMenuItemIconShape = z.object({
  color: color.optional(),
})

const panelMenuItemStateShape = z.object({
  color: color.optional(),
  background: z.union([bg, withRef(z.string())]).optional(),
  gap: withRef(z.string()).optional(),
  padding: withRef(z.string()).optional(),
  borderRadius: withRef(z.string()).optional(),
  icon: panelMenuItemIconShape.prefault({}),
  submenuIcon: panelMenuItemIconShape.prefault({}),
})

const panelMenuItemSubmenuShape = z.object({
  indent: withRef(z.string()).optional(),
})

export const panelMenuItemShape = z.object({
  defaultVariant: z
    .object({
      defaultState: panelMenuItemStateShape.prefault({}),
      hover: panelMenuItemStateShape.prefault({}),
      selected: panelMenuItemStateShape.prefault({}),
      disabled: panelMenuItemStateShape.prefault({}),
    })
    .prefault({}),
  submenu: panelMenuItemSubmenuShape.prefault({}),
})

/**
 * Default tokens for the panelmenu item row.
 */
export const panelMenuItemDefaults = {
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
  submenu: {
    indent: '{{primitives.space.md}}',
  },
}
