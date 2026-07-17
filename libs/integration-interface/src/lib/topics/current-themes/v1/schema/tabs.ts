import * as z from "zod";
import { bg, borderWithShadow, color, font, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const tabsSettings = z
  .object({
    unstyled: withRef(z.boolean()).optional(),
    lazy: withRef(z.boolean()).default(false),
    selectOnFocus: withRef(z.boolean()).default(false),
    showNavigators: withRef(z.boolean()).default(true),
    scrollStrategy: withRef(
      z.union([z.enum(["nearest", "center"]), z.literal(false)])
    ).default("nearest"),
  })
  .register(themeSchemaRegistry, { id: 'tabsSettings' })

export const tabsFocusRing = borderWithShadow
  .omit({ radius: true })
  .extend({
    width: withRef(z.string()).default("{{primitives.focusRing.width}}"),
    style: withRef(z.string()).default("{{primitives.focusRing.style}}"),
    color: color.default("{{primitives.focusRing.color}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow}}"),
  })
  .register(themeSchemaRegistry, { id: "tabsFocusRing" });

export const tabsTabState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
    borderColor: color.default("{{primitives.border.defaultVariant.color}}"),
    color: color.default(
      "{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"
    ),
  })
  .register(themeSchemaRegistry, { id: "tabsTabState" });

export const tabsTabFocusState = tabsTabState
  .extend({
    focusRing: (tabsFocusRing as typeof tabsFocusRing).optional(),
  })
  .register(themeSchemaRegistry, { id: "tabsTabFocusState" });

export const tabsTabDisabledState = tabsTabState
  .extend({
    cursor: withRef(z.string()).default("not-allowed"),
  })
  .register(themeSchemaRegistry, { id: "tabsTabDisabledState" });

export const tabsTabFont = font
  .pick({ weight: true, size: true })
  .extend({
    weight: withRef(z.string()).default("{{primitives.font.weight}}"),
    size: withRef(z.string()).default("{{primitives.font.size}}"),
  })
  .register(themeSchemaRegistry, { id: "tabsTabFont" });

export const tabs = z
  .object({
    settings: (tabsSettings as typeof tabsSettings).optional(),
    transition: z
      .object({
        duration: withRef(z.number()).default("{{primitives.transition.duration}}"),
      })
      .optional(),
    tablist: z
      .object({
        border: z
          .object({
            width: withRef(z.string()).default("1px"),
            color: color.default("{{primitives.border.defaultVariant.color}}"),
          })
          .optional(),
        contentFlexGrow: withRef(z.string()).default("1"),
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
      })
      .optional(),
    viewport: z
      .object({
        scrollBehavior: withRef(z.string()).default("smooth"),
        overscrollBehavior: withRef(z.string()).default("contain auto"),
        scrollbarWidth: withRef(z.string()).default("none"),
        webkitScrollbarDisplay: withRef(z.string()).default("none"),
      })
      .optional(),
    tab: z
      .object({
        defaultState: (tabsTabState as typeof tabsTabState).optional(),
        state: z
          .object({
            hover: tabsTabState.default({
              background: "{{primitives.area.surface.state.hover.defaultVariant.bg}}",
              borderColor: "{{primitives.border.defaultVariant.color}}",
              color: "{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}",
            }),
            active: tabsTabState.default({
              background: "{{primitives.area.surface.state.selected.defaultVariant.bg}}",
              borderColor:
                "{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}",
              color:
                "{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}",
            }),
            focus: (tabsTabFocusState as typeof tabsTabFocusState).optional(),
            disabled: (tabsTabDisabledState as typeof tabsTabDisabledState).optional(),
          })
          .optional(),
        border: z
          .object({
            width: withRef(z.string()).default("1px"),
          })
          .optional(),
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        font: (tabsTabFont as typeof tabsTabFont).optional(),
        margin: withRef(z.string()).default("0"),
        gap: withRef(z.string()).default("{{primitives.space.sm}}"),
        cursor: withRef(z.string()).default("pointer"),
        userSelect: withRef(z.string()).default("none"),
        whiteSpace: withRef(z.string()).default("nowrap"),
        scrollableFlexGrow: withRef(z.string()).default("0"),
      })
      .optional(),
    tabpanel: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
        color: color.default(
          "{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"
        ),
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        focusRing: (tabsFocusRing as typeof tabsFocusRing).optional(),
      })
      .optional(),
    navButton: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
        color: color.default(
          "{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"
        ),
        hoverColor: color.default(
          "{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}"
        ),
        width: withRef(z.string()).default("2.5rem"),
        height: withRef(z.string()).default("100%"),
        cursor: withRef(z.string()).default("pointer"),
        focusBackground: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.surface.state.selected.defaultVariant.bg}}"),
        focusRing: (tabsFocusRing as typeof tabsFocusRing).optional(),
        shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
      })
      .optional(),
    activeBar: z
      .object({
        size: withRef(z.string()).default("2px"),
        bottom: withRef(z.string()).default("0"),
        borderRadius: withRef(z.string()).default("{{primitives.radius.sm}}"),
        transition: withRef(z.string()).default(
          "250ms cubic-bezier(0.35, 0, 0.25, 1)"
        ),
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.variant.primary.defaultState.defaultVariant.bg}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "tabs" });