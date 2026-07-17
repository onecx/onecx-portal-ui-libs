import * as z from "zod";
import { bg, border, color, withRef, transition, icon, borderWithShadow, layout } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { tooltip } from "./tooltip";

const DEFAULT_MENUBAR_BORDER = {
  color: "{{primitives.border.defaultVariant.color}}",
  radius: "{{primitives.radius.md}}",
};

const DEFAULT_MENUBAR_BACKGROUND = {
  color: "{{primitives.area.surface.defaultState.defaultVariant.bg}}",
};

const DEFAULT_MENUBAR_TRANSITION = {
  duration: "{{primitives.transition.duration}}",
};

const DEFAULT_MENUBAR_FOCUS_RING = {
  color: "{{primitives.border.defaultVariant.color}}",
  width: "{{primitives.border.defaultVariant.width}}",
  shadow: "{{primitives.shadow.md}}",
};

const DEFAULT_MENUBAR_COLOR = "{{primitives.area.surface.defaultState.defaultVariant.contrast}}";

const DEFAULT_MENUBAR_ALIGN_ITEMS = "{{primitives.layout.alignItems}}";

const DEFAULT_MENUBAR_PADDING = "{{primitives.layout.padding}}";

const DEFAULT_MENUBAR_GAP = "{{primitives.layout.gap}}";

const DEFAULT_MENUBAR_SHADOW = "{{primitives.shadow.md}}";

export const menubarSettings = z
  .object({
    autoHide: withRef(z.boolean()).optional(),
    autoHideDelay: withRef(z.number()).optional(),
    autoDisplay: withRef(z.boolean()).optional(),
    showDivider: withRef(z.boolean()).optional(),
    showBackdrop: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarSettings" });

export const menubarItemSeverity = z.object({
  background: bg.default(DEFAULT_MENUBAR_BACKGROUND),
  color: color.default(DEFAULT_MENUBAR_COLOR),
  border: border.default(DEFAULT_MENUBAR_BORDER),
  transition: transition.default(DEFAULT_MENUBAR_TRANSITION),
  cursor: withRef(z.string()).default("pointer"),
  icon: icon.optional(),
}).register(themeSchemaRegistry, { id: "menubarItemSeverity" });

export const menubarItem = z
  .object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: (menubarItemSeverity as typeof menubarItemSeverity).optional(),
      }),
      state: z.object({
        focus: (menubarItemSeverity as typeof menubarItemSeverity).optional(),
        active: (menubarItemSeverity as typeof menubarItemSeverity).optional(),
      })
    }),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    focusRing: borderWithShadow.optional(),
    tooltip: tooltip.optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarItem" });

export const menubarSubmenuSeverity = z.object({
  background: bg.default(DEFAULT_MENUBAR_BACKGROUND),
  border: border.default(DEFAULT_MENUBAR_BORDER),
  shadow: withRef(z.string()).default(DEFAULT_MENUBAR_SHADOW),
  icon: icon.optional(),
}).register(themeSchemaRegistry, { id: "menubarSubmenuSeverity" });

export const menubarSubmenuScreenSettings = z
  .object({
    xs: layout.extend({
        indent: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarSubmenuScreenSettings" });

export const menubarSubmenu = z
  .object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: (menubarSubmenuSeverity as typeof menubarSubmenuSeverity).optional(),
      }),
      state: z.object({
        active: z.object({
          defaultSeverity: (menubarSubmenuSeverity as typeof menubarSubmenuSeverity).extend({
            cursor: withRef(z.string()).default("pointer"),
          }).optional(),
        }),
        focus: z.object({
          defaultSeverity: (menubarSubmenuSeverity as typeof menubarSubmenuSeverity).extend({
            cursor: withRef(z.string()).default("pointer"),
          }).optional(),
        }),
      })
    }),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    minWidth: withRef(z.string()).default("10rem"),
    maxWidth: withRef(z.string()).default("20rem"),
    screenSettings: (menubarSubmenuScreenSettings as typeof menubarSubmenuScreenSettings).optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarSubmenu" });

export const menubarSeparator = border.default(DEFAULT_MENUBAR_BORDER).register(themeSchemaRegistry, { id: "menubarSeparator" });

export const menubarMobileButtonSeverity = z.object({
  background: bg.default(DEFAULT_MENUBAR_BACKGROUND),
  color: color.default(DEFAULT_MENUBAR_COLOR),
  icon: icon.optional(),
  size: withRef(z.string()).default("2.5rem"),
  border: border.default(DEFAULT_MENUBAR_BORDER),
}).register(themeSchemaRegistry, { id: "menubarMobileButtonSeverity" });

//todo: when p-button schema is added use it instead of menubarMobileButton schema
export const menubarMobileButton = z
  .object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: (menubarMobileButtonSeverity as typeof menubarMobileButtonSeverity).optional(),
      }),
      state: z.object({
        hover: z.object({
          defaultSeverity: (menubarMobileButtonSeverity as typeof menubarMobileButtonSeverity).extend({
            cursor: withRef(z.string()).default("pointer"),
          }).optional(),
        }),
      }),
    }),
    focusRing: borderWithShadow.default(DEFAULT_MENUBAR_FOCUS_RING),
  })
  .register(themeSchemaRegistry, { id: "menubarMobileButton" });
 

export const menubar = z
  .object({
    settings: (menubarSettings as typeof menubarSettings).optional(),
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: z.object({
          alignItems: withRef(z.string()).default(DEFAULT_MENUBAR_ALIGN_ITEMS),
          background: bg.default(DEFAULT_MENUBAR_BACKGROUND),
          color: color.default(DEFAULT_MENUBAR_COLOR),
          border: border.default(DEFAULT_MENUBAR_BORDER),
          transition: transition.default(DEFAULT_MENUBAR_TRANSITION),
          padding: withRef(z.string()).default(DEFAULT_MENUBAR_PADDING),
          gap: withRef(z.string()).default(DEFAULT_MENUBAR_GAP),
          item: (menubarItem as typeof menubarItem).optional(),
          submenu: (menubarSubmenu as typeof menubarSubmenu).optional(),
          separator: (menubarSeparator as typeof menubarSeparator).optional(),
          mobileButton: (menubarMobileButton as typeof menubarMobileButton).optional(),
        })
      }), 
    }),
  })
  .register(themeSchemaRegistry, { id: "menubar" });