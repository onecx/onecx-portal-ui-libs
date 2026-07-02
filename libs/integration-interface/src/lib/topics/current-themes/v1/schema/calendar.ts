/*
 * This file defines the schema for calendar theming.
 * It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, border, borderWithShadow, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const calendarSettings = z
  .object({
    unstyled: withRef(z.boolean()),
    inputStyle: withRef(z.string()),
    inputStyleClass: withRef(z.string()),
    panelStyle: withRef(z.string()),
    panelStyleClass: withRef(z.string()),
    todayButtonStyleClass: withRef(z.string()),
    clearButtonStyleClass: withRef(z.string()),
    showIcon: withRef(z.boolean()),
    icon: withRef(z.string()),
    iconDisplay: withRef(z.enum(['input', 'button'])),
    appendTo: withRef(z.string()),
    size: withRef(z.enum(['small', 'large'])),
    variant: withRef(z.enum(['filled', 'outlined'])),
    fluid: withRef(z.boolean()),
    invalid: withRef(z.boolean()),
  })
  .register(themeSchemaRegistry, { id: "calendarSettings" });

// Shared schema for month/year navigation selectors (selectMonth, selectYear)
export const navigationSelector = z
  .object({
    hoverBackground: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.content.hoverState.defaultVariant.bg}}"),
    color: color.default("{{primitives.area.content.defaultState.defaultVariant.contrast}}"),
    hoverColor: color.default("{{primitives.area.content.hoverState.defaultVariant.contrast}}"),
    padding: withRef(z.string()).default("{{primitives.space.sm}}"),
    border: border.default({
      radius: "{{primitives.radius.sm}}",
    }),
    fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
    fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
  })
  .register(themeSchemaRegistry, { id: "navigationSelector" });

// Shared schema for view containers (dayView, monthView, yearView)
export const viewMargin = z
  .object({
    margin: withRef(z.string()).default("{{primitives.space.sm}}"),
  })
  .register(themeSchemaRegistry, { id: "viewMargin" });

// Shared schema for view items (month, year)
export const viewItem = z
  .object({
    padding: withRef(z.string()).default("{{primitives.space.sm}}"),
    border: border.default({
      radius: "{{primitives.radius.md}}",
    }),
  })
  .register(themeSchemaRegistry, { id: "viewItem" });

export const calendar = z
  .object({
    settings: (calendarSettings as typeof calendarSettings).optional(),
    root: z
      .object({
        transitionDuration: withRef(z.string()).default("{{primitives.transition.duration}}"),
      })
      .optional(),
    panel: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
          radius: "{{primitives.radius.md}}",
        }),
        shadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
    header: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
    title: z
      .object({
        gap: withRef(z.string()).default("{{primitives.space.sm}}"),
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
      })
      .optional(),
    dropdown: z
      .object({
        width: withRef(z.string()).default("2.5rem"),
        sm: z
          .object({
            width: withRef(z.string()).default("2rem"),
          })
          .optional(),
        lg: z
          .object({
            width: withRef(z.string()).default("3rem"),
          })
          .optional(),
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.defaultState.defaultVariant.bg}}"),
        hoverBackground: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.hoverState.defaultVariant.bg}}"),
        activeBackground: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.activeState.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.content.defaultState.defaultVariant.contrast}}"),
        hoverColor: color.default("{{primitives.area.content.hoverState.defaultVariant.contrast}}"),
        activeColor: color.default("{{primitives.area.content.activeState.defaultVariant.contrast}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
          radius: "{{primitives.radius.md}}",
        }),
        hoverBorderColor: color.default("{{primitives.border.defaultVariant.hoverColor}}"),
        activeBorderColor: color.default("{{primitives.border.defaultVariant.activeColor}}"),
        focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
      })
      .optional(),
    inputIcon: z
      .object({
        color: color.default("{{primitives.area.content.defaultState.defaultVariant.contrast}}"),
      })
      .optional(),
    selectMonth: (navigationSelector as typeof navigationSelector).optional(),
    selectYear: (navigationSelector as typeof navigationSelector).optional(),
    group: z
      .object({
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        gap: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
    dayView: (viewMargin as typeof viewMargin).optional(),
    weekDay: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.xs}}"),
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
        color: color.default("{{primitives.area.content.defaultState.defaultVariant.contrast}}"),
      })
      .optional(),
    date: z
      .object({
        hoverBackground: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.hoverState.defaultVariant.bg}}"),
        selectedBackground: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.activeState.defaultVariant.bg}}"),
        rangeSelectedBackground: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.activeState.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.content.defaultState.defaultVariant.contrast}}"),
        hoverColor: color.default("{{primitives.area.content.hoverState.defaultVariant.contrast}}"),
        selectedColor: color.default("{{primitives.area.content.activeState.defaultVariant.contrast}}"),
        rangeSelectedColor: color.default("{{primitives.area.content.activeState.defaultVariant.contrast}}"),
        width: withRef(z.string()).default("2.5rem"),
        height: withRef(z.string()).default("2.5rem"),
        border: border.default({
          radius: "{{primitives.radius.md}}",
        }),
        padding: withRef(z.string()).default("{{primitives.space.xs}}"),
        focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
      })
      .optional(),
    monthView: (viewMargin as typeof viewMargin).optional(),
    month: (viewItem as typeof viewItem).optional(),
    yearView: (viewMargin as typeof viewMargin).optional(),
    year: (viewItem as typeof viewItem).optional(),
    buttonBar: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
      })
      .optional(),
    timePicker: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        gap: withRef(z.string()).default("{{primitives.space.md}}"),
        buttonGap: withRef(z.string()).default("{{primitives.space.xs}}"),
      })
      .optional(),
    today: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.content.defaultState.primaryVariant.bg}}"),
        color: color.default("{{primitives.area.content.defaultState.primaryVariant.contrast}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "calendar" });
