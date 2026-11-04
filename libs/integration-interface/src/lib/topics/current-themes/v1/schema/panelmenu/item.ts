import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

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

// `submenu` is a static token group (the child-menu `indent`) that sits next to `defaultVariant`
// at the item root; it does not vary by state, so it opts out of the item's axis (axis: 'none').
const panelMenuItemSubmenuShape = z
  .object({
    indent: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'panelmenu.item.submenu', axis: 'none' })

// The item is a child component (re-roots the fallback) whose single `defaultVariant` key is the
// default variant member. Its `defaultVariant` slot holds the states (axis: 'state'); the
// per-state content shape stays unmarked so its tokens fall back within the item's state scope.
export const panelMenuItemShape = z
  .object({
    defaultVariant: z
      .object({
        defaultState: panelMenuItemStateShape.prefault({}),
        hover: panelMenuItemStateShape.prefault({}),
        selected: panelMenuItemStateShape.prefault({}),
        disabled: panelMenuItemStateShape.prefault({}),
      })
      .register(themeSchemaRegistry, { id: 'panelmenu.item.defaultVariant', axis: 'state' })
      .prefault({}),
    submenu: panelMenuItemSubmenuShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'panelmenu.item', axis: 'variant', child: true })

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
