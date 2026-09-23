import * as z from 'zod'
import { bg, border, borderWithShadow, color, icon, layout, transition, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { tooltip } from './tooltip'
import { applyDefaultsRecursive } from './defaults-helper'

const DEFAULT_MENUBAR_BORDER = {
  color: '{{primitives.border.defaultVariant.color}}',
  radius: '{{primitives.radius.md}}',
}

const DEFAULT_MENUBAR_BACKGROUND = {
  color: '{{primitives.area.surface.defaultState.defaultVariant.bg}}',
}

const DEFAULT_MENUBAR_TRANSITION = {
  duration: '{{primitives.transition.duration}}',
}

const DEFAULT_MENUBAR_COLOR = '{{primitives.area.surface.defaultState.defaultVariant.contrast}}'

const DEFAULT_MENUBAR_ALIGN_ITEMS = '{{primitives.layout.alignItems}}'

const DEFAULT_MENUBAR_PADDING = '{{primitives.layout.padding}}'

const DEFAULT_MENUBAR_GAP = '{{primitives.layout.gap}}'

const DEFAULT_MENUBAR_SHADOW = '{{primitives.shadow.md}}'

const DEFAULT_MENUBAR_FOCUS_RING = {
  color: '{{primitives.border.defaultVariant.color}}',
  width: '{{primitives.border.defaultVariant.width}}',
  shadow: '{{primitives.shadow.md}}',
}

const menubarSettingsShape = z.object({
  autoHide: withRef(z.boolean()).optional(),
  autoHideDelay: withRef(z.number()).optional(),
  autoDisplay: withRef(z.boolean()).optional(),
  showDivider: withRef(z.boolean()).optional(),
  showBackdrop: withRef(z.boolean()).optional(),
})

const menubarBaseSeverityStylesShape = z.object({
  background: bg.optional(),
  color: color.optional(),
  border: border.optional(),
  transition: transition.optional(),
  shadow: withRef(z.string()).optional(),
  icon: icon.optional(),
})

const menubarSeverityWithCursorShape = menubarBaseSeverityStylesShape.extend({
  cursor: withRef(z.string()).optional(),
})

const menubarSeverityWithSizeShape = menubarBaseSeverityStylesShape.extend({
  size: withRef(z.string()).optional(),
})

const menubarBaseSeverityDefaults = {
  background: DEFAULT_MENUBAR_BACKGROUND,
  color: DEFAULT_MENUBAR_COLOR,
  border: DEFAULT_MENUBAR_BORDER,
  transition: DEFAULT_MENUBAR_TRANSITION,
  shadow: DEFAULT_MENUBAR_SHADOW,
}

const menubarItemShape = z.object({
  defaultVariant: z.object({
    defaultState: z.object({
      defaultSeverity: menubarSeverityWithCursorShape.optional(),
    }).prefault({}),
    state: z.object({
      focus: z.object({
        defaultSeverity: menubarSeverityWithCursorShape.optional(),
      }).optional(),
      active: z.object({
        defaultSeverity: menubarSeverityWithCursorShape.optional(),
      }).optional(),
    }).optional(),
  }).prefault({}),
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),
  tooltip: tooltip.optional(),
})

const menubarSubmenuScreenSettingsShape = z.object({
  xs: layout
    .extend({
      indent: withRef(z.string()).optional(),
    })
    .optional(),
})

const menubarSubmenuShape = z.object({
  defaultVariant: z.object({
    defaultState: z.object({
      defaultSeverity: menubarBaseSeverityStylesShape.optional(),
    }).prefault({}),
    state: z.object({
      active: z.object({
        defaultSeverity: menubarSeverityWithCursorShape.optional(),
      }).optional(),
      focus: z.object({
        defaultSeverity: menubarSeverityWithCursorShape.optional(),
      }).optional(),
    }).optional(),
  }).prefault({}),
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  minWidth: withRef(z.string()).optional(),
  maxWidth: withRef(z.string()).optional(),
  screenSettings: menubarSubmenuScreenSettingsShape.optional(),
})

const menubarSeparatorShape = border.optional()

//todo: when p-button schema is added use it instead of menubarMobileButton schema
const menubarMobileButtonShape = z.object({
  defaultVariant: z.object({
    defaultState: z.object({
      defaultSeverity: menubarSeverityWithSizeShape.optional(),
    }).prefault({}),
    state: z.object({
      hover: z.object({
        defaultSeverity: menubarSeverityWithSizeShape.optional(),
      }).optional(),
    }).optional(),
  }).prefault({}),
  focusRing: borderWithShadow.optional(),
})

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
                  cursor: 'pointer',
                },
              },
              active: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
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
                  cursor: 'pointer',
                },
              },
              focus: {
                defaultSeverity: {
                  ...menubarBaseSeverityDefaults,
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
          color: '{{primitives.border.defaultVariant.color}}',
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
