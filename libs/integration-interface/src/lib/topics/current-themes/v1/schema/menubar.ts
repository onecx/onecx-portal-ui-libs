import * as z from "zod";
import { bg, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { max } from "rxjs";

export const menubarSettings = z
  .object({
    autoHide: withRef(z.boolean()).optional(),
    autoHideDelay: withRef(z.number()).optional(),
    autoDisplay: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarSettings" });

export const menubarItemIcon = z
  .object({
    color: color.default(
      "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
    ),
  })
  .register(themeSchemaRegistry, { id: "menubarItemIcon" });

export const menubarFocusRing = z
  .object({
    width: withRef(z.string()).default("{{primitives.focusRing.width}}"),
    style: withRef(z.string()).default("{{primitives.focusRing.style}}"),
    color: color.default("{{primitives.focusRing.color}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow}}"),
  })
  .register(themeSchemaRegistry, { id: "menubarFocusRing" });

export const menubarItemState = z
  .object({
    color: color.default(
      "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
    ),
    icon: (menubarItemIcon as typeof menubarItemIcon).optional(),
    border: border.default({
      color: "{{primitives.border.defaultVariant.color}}",
      radius: "{{primitives.radius.md}}",
      width: "{{primitives.border.defaultVariant.width}}",
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.surface.state.hover.defaultVariant.bg}}"),
  })
  .register(themeSchemaRegistry, { id: "menubarItemState" });

export const menubarInteractiveItemState = menubarItemState.register(themeSchemaRegistry, { id: "menubarInteractiveItemState" });

export const menubarActiveItemState = menubarInteractiveItemState.register(themeSchemaRegistry, { id: "menubarActiveItemState" });

export const menubarItemBase = z
  .object({
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
  })
  .register(themeSchemaRegistry, { id: "menubarItemBase" });

export const menubarItem = z
  .object({
    base: (menubarItemBase as typeof menubarItemBase).optional(),
    defaultState: (menubarItemState as typeof menubarItemState).optional(),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    cursor: withRef(z.string()).default("pointer"),
    state: z
      .object({
        focus: (menubarInteractiveItemState as typeof menubarInteractiveItemState).optional(),
        active: (menubarActiveItemState as typeof menubarActiveItemState).optional(),
      })
      .optional(),
    focusRing: (menubarFocusRing as typeof menubarFocusRing).optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarItem" });

export const menubarSubmenuIconState = z
  .object({
    color: color.default(
      "{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"
    ),
  })
  .register(themeSchemaRegistry, { id: "menubarSubmenuIconState" });

export const menubarSubmenu = z
  .object({
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
    border: border.default({
      color: "{{primitives.border.defaultVariant.color}}",
      radius: "{{primitives.radius.md}}",
    }),
    shadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
    minWidth: withRef(z.string()).default("10rem"),
    maxWidth: withRef(z.string()).default("20rem"),
    mobile: z
      .object({
        indent: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
    icon: z
      .object({
        size: withRef(z.string()).default("1rem"),
        color: withRef(z.string()).default("{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"),
        state: z
          .object({
            focus: (menubarSubmenuIconState as typeof menubarSubmenuIconState).optional(),
            active: (menubarSubmenuIconState as typeof menubarSubmenuIconState).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarSubmenu" });

export const menubarSeparator = z
  .object({
    border: z
      .object({
        color: color.default("{{primitives.border.defaultVariant.color}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "menubarSeparator" });

export const menubarMobileButton = z
  .object({
    size: withRef(z.string()).default("2.5rem"),
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
    border: z
      .object({
        color: color.default("{{primitives.border.defaultVariant.color}}"),
      })
      .optional(),
    defaultState: z
      .object({
        color: color.default(
          "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
        ),
        background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
      })
      .optional(),
    state: z
      .object({
        hover: z
          .object({
            color: color.default(
              "{{primitives.area.surface.state.hover.defaultVariant.contrast}}"
            ),
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.area.surface.state.hover.defaultVariant.bg}}"),
          })
          .optional(),
      })
      .optional(),
    focusRing: (menubarFocusRing as typeof menubarFocusRing).optional(),
    icon:  z
      .object({
        size: withRef(z.string()).default("1rem"),
        name: withRef(z.string()).default("bars"),
      })
      .optional(),
    cursor: withRef(z.string()).default("pointer"), 
  })
  .register(themeSchemaRegistry, { id: "menubarMobileButton" });

export const menubar = z
  .object({
    settings: (menubarSettings as typeof menubarSettings).optional(),
    alignItems: withRef(z.string()).default("center"),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
    color: color.default(
      "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
    ),
    border: border.default({
      color: "{{primitives.border.defaultVariant.color}}",
      radius: "{{primitives.radius.md}}",
    }),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    gap: withRef(z.string()).default("{{primitives.space.sm}}"),
    transition: z
      .object({
        duration: withRef(z.number()).default("{{primitives.transition.duration}}"),
      })
      .optional(),
    item: (menubarItem as typeof menubarItem).optional(),
    submenu: (menubarSubmenu as typeof menubarSubmenu).optional(),
    separator: (menubarSeparator as typeof menubarSeparator).optional(),
    mobileButton: (menubarMobileButton as typeof menubarMobileButton).optional(),
  })
  .register(themeSchemaRegistry, { id: "menubar" });