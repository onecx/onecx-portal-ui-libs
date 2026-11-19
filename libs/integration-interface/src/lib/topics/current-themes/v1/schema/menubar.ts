import * as z from 'zod'
import { bg, border, borderWithShadow, color, icon, layout, transition, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { tooltip } from './tooltip'
import { applyDefaultsRecursive } from './defaults-helper'

// Static scalar tokens sit next to the named variant/state members and must not vary by them, so
// they are registered with `axis: 'none'` on their inner schema (a `withRef` union would drop the
// marker).
const staticToken = (id: string) => withRef(z.string().register(themeSchemaRegistry, { id, axis: 'none' })).optional()

const DEFAULT_MENUBAR_BORDER = {
  color: '{{primitives.area.surface.defaultState.defaultSeverity.border.color}}',
  radius: '{{primitives.radius.md}}',
  style: '{{primitives.area.surface.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.sm}}',
  offset: '{{primitives.border.offset.none}}',
}

const DEFAULT_MENUBAR_BACKGROUND = {
  color: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
}

const DEFAULT_MENUBAR_TRANSITION = {
  duration: '{{primitives.transition.duration}}',
}

const DEFAULT_MENUBAR_COLOR = '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'

const DEFAULT_MENUBAR_ALIGN_ITEMS = '{{primitives.layout.alignItems}}'

const DEFAULT_MENUBAR_PADDING = '{{primitives.layout.padding}}'

const DEFAULT_MENUBAR_GAP = '{{primitives.layout.gap}}'

const DEFAULT_MENUBAR_SHADOW = '{{primitives.shadow.md}}'

const DEFAULT_MENUBAR_FOCUS_STATE = {
  background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
}

const DEFAULT_MENUBAR_ACTIVE_STATE = {
  background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
}

const DEFAULT_MENUBAR_FOCUS_RING = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.md}}',
  offset: '{{primitives.focusRing.offset.md}}',
  radius: '{{primitives.focusRing.radius.md}}',
  shadow: '{{primitives.focusRing.shadow.md}}',
}

// Behavioral options with no visual tokens — they opt out of any enclosing axis (axis: 'setting').
const menubarSettingsShape = z
  .object({
    autoHide: withRef(z.boolean()).optional(),
    autoHideDelay: withRef(z.number()).optional(),
    autoDisplay: withRef(z.boolean()).optional(),
    showDivider: withRef(z.boolean()).optional(),
    showBackdrop: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'menubarSettingsShape', axis: 'setting' })

// Leaf-token severity content (per-state tokens). Kept unmarked so its tokens fall back within the
// enclosing state scope; `shadow`/`cursor`/`size` sit next to the state axis and opt out (none).
const menubarBaseSeverityStylesShape = z.object({
  background: bg.optional(),
  color: color.optional(),
  border: border.optional(),
  transition: transition.optional(),
  shadow: staticToken('menubarBaseShadow'),
  icon: icon.optional(),
})

const menubarSeverityWithCursorShape = menubarBaseSeverityStylesShape.extend({
  cursor: staticToken('menubarItemCursor'),
})

const menubarSeverityWithSizeShape = menubarBaseSeverityStylesShape.extend({
  size: staticToken('menubarMobileButtonSize'),
})

const menubarBaseSeverityDefaults = {
  background: DEFAULT_MENUBAR_BACKGROUND,
  color: DEFAULT_MENUBAR_COLOR,
  border: DEFAULT_MENUBAR_BORDER,
  transition: DEFAULT_MENUBAR_TRANSITION,
  shadow: DEFAULT_MENUBAR_SHADOW,
}

// The item is a nested component (re-roots the fallback). It uses the primitives `variantWithStates`
// shape: the `defaultVariant` slot is unmarked (a marked node would classify its `state` group as a
// member); the `defaultState` baseline and the `state` group's keys (`focus`/`active`) are the named
// interactive states. Static tokens (`padding`/`gap`/`focusRing`/`tooltip`) sit next to the states
// and opt out of the axis (none).
const menubarItemShape = z
  .object({
    defaultVariant: z
      .object({
        defaultState: z
          .object({
            defaultSeverity: menubarSeverityWithCursorShape.optional(),
          })
          .prefault({}),
        state: z
          .object({
            focus: z
              .object({
                defaultSeverity: menubarSeverityWithCursorShape.optional(),
              })
              .optional(),
            active: z
              .object({
                defaultSeverity: menubarSeverityWithCursorShape.optional(),
              })
              .optional(),
          })
          .register(themeSchemaRegistry, { id: 'menubarItemStateGroupShape', axis: 'state' })
          .optional(),
      })
      .register(themeSchemaRegistry, { id: 'menubarItemVariantShape' })
      .prefault({}),
    padding: staticToken('menubarItemPadding'),
    gap: staticToken('menubarItemGap'),
    focusRing: borderWithShadow
      .extend({})
      .register(themeSchemaRegistry, { id: 'menubarItemFocusRingShape', axis: 'none' })
      .optional(),
    tooltip: tooltip
      .extend({})
      .register(themeSchemaRegistry, { id: 'menubarItemTooltipShape', axis: 'none' })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'menubarItemShape', axis: 'variant', child: true })

const menubarSubmenuScreenSettingsShape = z.object({
  xs: layout
    .extend({
      indent: withRef(z.string()).optional(),
    })
    .optional(),
})

// The submenu is a nested component (re-roots the fallback). Like `item`, it uses the primitives
// `variantWithStates` shape (unmarked `defaultVariant` slot; a named `state` group holds the
// interactive states). Static tokens and behavioral settings opt out of the axis (none).
const menubarSubmenuShape = z
  .object({
    defaultVariant: z
      .object({
        defaultState: z
          .object({
            defaultSeverity: menubarBaseSeverityStylesShape.optional(),
          })
          .prefault({}),
        state: z
          .object({
            active: z
              .object({
                defaultSeverity: menubarSeverityWithCursorShape.optional(),
              })
              .optional(),
            focus: z
              .object({
                defaultSeverity: menubarSeverityWithCursorShape.optional(),
              })
              .optional(),
          })
          .register(themeSchemaRegistry, { id: 'menubarSubmenuStateGroupShape', axis: 'state' })
          .optional(),
      })
      .register(themeSchemaRegistry, { id: 'menubarSubmenuVariantShape' })
      .prefault({}),
    padding: staticToken('menubarSubmenuPadding'),
    gap: staticToken('menubarSubmenuGap'),
    minWidth: staticToken('menubarSubmenuMinWidth'),
    maxWidth: staticToken('menubarSubmenuMaxWidth'),
    screenSettings: menubarSubmenuScreenSettingsShape.register(themeSchemaRegistry, {
      id: 'menubarSubmenuScreenSettingsShape',
      axis: 'none',
    }).optional(),
  })
  .register(themeSchemaRegistry, { id: 'menubarSubmenuShape', axis: 'variant', child: true })

const menubarSeparatorShape = border.optional()

//todo: when p-button schema is added use it instead of menubarMobileButton schema
// The mobile button is a nested component (re-roots the fallback), mirroring `item`/`submenu`.
const menubarMobileButtonShape = z
  .object({
    defaultVariant: z
      .object({
        defaultState: z
          .object({
            defaultSeverity: menubarSeverityWithSizeShape.optional(),
          })
          .prefault({}),
        state: z
          .object({
            hover: z
              .object({
                defaultSeverity: menubarSeverityWithSizeShape.optional(),
              })
              .optional(),
          })
          .register(themeSchemaRegistry, { id: 'menubarMobileButtonStateGroupShape', axis: 'state' })
          .optional(),
      })
      .register(themeSchemaRegistry, { id: 'menubarMobileButtonVariantShape' })
      .prefault({}),
    focusRing: borderWithShadow
      .extend({})
      .register(themeSchemaRegistry, { id: 'menubarMobileButtonFocusRingShape', axis: 'none' })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'menubarMobileButtonShape', axis: 'variant', child: true })

export const menubarShape = z.object({
  settings: menubarSettingsShape.optional(),
  defaultVariant: z.object({
    defaultState: z.object({
      defaultSeverity: z.object({
        alignItems: withRef(z.string()).optional(),
        background: bg.optional(),
        backdrop: bg.optional(),
        color: color.optional(),
        border: border.optional(),
        transition: transition.optional(),
        padding: withRef(z.string()).optional(),
        gap: withRef(z.string()).optional(),
        item: menubarItemShape.optional(),
        submenu: menubarSubmenuShape.optional(),
        separator: menubarSeparatorShape.optional(),
        mobileButton: menubarMobileButtonShape.optional(),
      }).prefault({}),
    }).prefault({}),
  }).prefault({}),
})

export type MenubarShapeInput = z.input<typeof menubarShape>

export const menubarDefaults = {
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
        alignItems: DEFAULT_MENUBAR_ALIGN_ITEMS,
        background: DEFAULT_MENUBAR_BACKGROUND,
        color: DEFAULT_MENUBAR_COLOR,
        border: DEFAULT_MENUBAR_BORDER,
        transition: DEFAULT_MENUBAR_TRANSITION,
        padding: DEFAULT_MENUBAR_PADDING,
        gap: DEFAULT_MENUBAR_GAP,
        item: {
          defaultVariant: {
            defaultState: {
              defaultSeverity: {
                ...menubarBaseSeverityDefaults,
                cursor: 'pointer',
              },
            },
            state: {
              focus: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
                  ...DEFAULT_MENUBAR_FOCUS_STATE,
                  cursor: 'pointer',
                },
              },
              active: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
                  ...DEFAULT_MENUBAR_ACTIVE_STATE,
                  cursor: 'pointer',
                },
              },
            },
          },
          padding: '{{primitives.space.md}}',
          gap: '{{primitives.space.sm}}',
        },
        submenu: {
          defaultVariant: {
            defaultState: {
              defaultSeverity: {
                ...menubarBaseSeverityDefaults,
              },
            },
            state: {
              active: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
                  ...DEFAULT_MENUBAR_ACTIVE_STATE,
                  cursor: 'pointer',
                },
              },
              focus: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
                  ...DEFAULT_MENUBAR_FOCUS_STATE,
                  cursor: 'pointer',
                },
              },
            },
          },
          padding: '{{primitives.space.md}}',
          gap: '{{primitives.space.sm}}',
          minWidth: '10rem',
          maxWidth: '20rem',
          screenSettings: {
            xs: {
              indent: '{{primitives.space.md}}',
            },
          },
        },
        separator: {
          color: '{{primitives.area.surface.defaultState.defaultSeverity.border.color}}',
          radius: '{{primitives.radius.md}}',
        },
        mobileButton: {
          defaultVariant: {
            defaultState: {
              defaultSeverity: {
                ...menubarBaseSeverityDefaults,
                size: '2.5rem',
              },
            },
            state: {
              hover: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
                  size: '2.5rem',
                  cursor: 'pointer',
                },
              },
            },
          },
          focusRing: DEFAULT_MENUBAR_FOCUS_RING,
        },
      },
    },
  },
}

export const menubar = applyDefaultsRecursive(menubarShape, menubarDefaults).register(themeSchemaRegistry, {
  id: 'menubar',
})
