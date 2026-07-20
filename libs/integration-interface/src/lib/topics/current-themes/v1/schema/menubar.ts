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

export const menubarBaseSeverityStyles = z.object({
  background: bg.default(DEFAULT_MENUBAR_BACKGROUND),
  color: color.default(DEFAULT_MENUBAR_COLOR),
  border: border.default(DEFAULT_MENUBAR_BORDER),
  transition: transition.default(DEFAULT_MENUBAR_TRANSITION),
  shadow: withRef(z.string()).default(DEFAULT_MENUBAR_SHADOW),
  icon: icon.optional(),
}).register(themeSchemaRegistry, { id: "menubarBaseSeverityStyles" });

export const menubarSeverityWithCursor = menubarBaseSeverityStyles.extend({
  cursor: withRef(z.string()).default("pointer"),
}).register(themeSchemaRegistry, { id: "menubarSeverityWithCursor" });

export const menubarSeverityWithSize = menubarBaseSeverityStyles.extend({
  size: withRef(z.string()).default("2.5rem"),
}).register(themeSchemaRegistry, { id: "menubarSeverityWithSize" });

export const menubarItem = z
  .object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: (menubarSeverityWithCursor as typeof menubarSeverityWithCursor).optional(),
      }),
      state: z.object({
        focus: z.object({
          defaultSeverity: (menubarSeverityWithCursor as typeof menubarSeverityWithCursor).optional(),
        }).optional(),
        active: z.object({
          defaultSeverity: (menubarSeverityWithCursor as typeof menubarSeverityWithCursor).optional(),
        }).optional(),
      })
    }),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    focusRing: borderWithShadow.optional(),
    tooltip: tooltip.optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarItem" });

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
        defaultSeverity: (menubarBaseSeverityStyles as typeof menubarBaseSeverityStyles).optional(),
      }),
      state: z.object({
        active: z.object({
          defaultSeverity: (menubarSeverityWithCursor as typeof menubarSeverityWithCursor).optional(),
        }),
        focus: z.object({
          defaultSeverity: (menubarSeverityWithCursor as typeof menubarSeverityWithCursor).optional(),
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

//todo: when p-button schema is added use it instead of menubarMobileButton schema
export const menubarMobileButton = z
  .object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: (menubarSeverityWithSize as typeof menubarSeverityWithSize).optional(),
      }),
      state: z.object({
        hover: z.object({
          defaultSeverity: (menubarSeverityWithSize as typeof menubarSeverityWithSize).extend({
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
          backdrop: bg.optional(),
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