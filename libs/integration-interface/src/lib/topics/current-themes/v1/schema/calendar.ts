/*
 * This file defines the schema for calendar theming.
 * It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, border, borderWithShadow, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { input } from "@angular/core";

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
    hover: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.onSurface.state.hover.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}"),
      })
      .optional(),
    color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
    focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
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

// Shared schema for pickable grid items (month, year)
export const pickerCell = z
  .object({
    padding: withRef(z.string()).default("{{primitives.space.sm}}"),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.onSurface.defaultState.defaultVariant.bg}}"),
    hover: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.onSurface.state.hover.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}"),
      })
      .optional(),
    active: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.onSurface.state.active.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.onSurface.state.active.defaultVariant.contrast}}"),
      })
      .optional(),
    color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
    border: border.default({
      radius: "{{primitives.radius.md}}",
    }),
    focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
    fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
    fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
  })
  .register(themeSchemaRegistry, { id: "pickerCell" });

export const panelButton = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
    hover: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.overlay.state.hover.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.overlay.state.hover.defaultVariant.contrast}}"),
      })
      .optional(),
    color: color.default("{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"),
    width: withRef(z.string()).default("2.5rem"),
    height: withRef(z.string()).default("2.5rem"),
    border: border.default({
      radius: "{{primitives.radius.md}}",
    }),
    focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
  })
  .register(themeSchemaRegistry, { id: "panelButton" });

// Shared schema for icon styling (calendar icon, clear icon)
export const iconStyles = z
  .object({
    color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.onSurface.defaultState.defaultVariant.bg}}"),
    hover: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.onSurface.state.hover.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}"),
      })
      .optional(),
    active: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.onSurface.state.active.defaultVariant.bg}}"),
        color: color.default("{{primitives.area.onSurface.state.active.defaultVariant.contrast}}"),
      })
      .optional(),
    focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    width: withRef(z.string()).optional(),
    height: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "iconStyles" });

// Shared schema for input background variants (outlined, filled)
export const inputStyleVariant = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    hoverBackground: z.union([bg, withRef(z.string())]).optional(),
    focusBackground: z.union([bg, withRef(z.string())]).optional(),
  })
  .register(themeSchemaRegistry, { id: "inputStyleVariant" });

export const calendarStyles = z
  .object({
    root: z
      .object({
        transitionDuration: withRef(z.string()).default("{{primitives.transition.duration}}"),
      })
      .optional(),
    input: z
      .object({
        fontFamily: withRef(z.string()).default("{{primitives.font.family}}"),
        fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        shadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
        variant: z
          .object({
            outlined: (inputStyleVariant as typeof inputStyleVariant).optional(),
            filled: (inputStyleVariant as typeof inputStyleVariant).optional(),
          })
          .optional(),
        color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
        placeholderColor: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
          width: "{{primitives.border.defaultVariant.width}}",
          style: "{{primitives.border.defaultVariant.style}}",
          radius: "{{primitives.radius.md}}",
        }),
        hover: z
          .object({
            color: color.default("{{primitives.variant.primary.state.hover.defaultVariant.contrast}}"),
            borderColor: color.default("{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}"),
          })
          .optional(),
        focus: z
          .object({
            color: color.default("{{primitives.variant.primary.state.focus.defaultVariant.contrast}}"),
            borderColor: color.default("{{primitives.variant.primary.state.focus.defaultVariant.border.defaultVariant.color}}"),
            ring: (borderWithShadow as typeof borderWithShadow).optional(),
          })
          .optional(),
        disabled: z
          .object({
            color: color.default("{{primitives.variant.primary.state.disabled.defaultVariant.contrast}}"),
            borderColor: color.default("{{primitives.variant.primary.state.disabled.defaultVariant.border.defaultVariant.color}}"),
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.variant.primary.state.disabled.defaultVariant.bg}}"),
          })
          .optional(),
        invalid: z
          .object({
            color: color.default("{{primitives.variant.primary.state.invalid.defaultVariant.contrast}}"),
            borderColor: color.default("{{primitives.variant.primary.state.invalid.defaultVariant.border.defaultVariant.color}}"),
            placeHolderColor: color.default("{{primitives.variant.primary.state.invalid.defaultVariant.contrast}}"),
            focusRing: color.default("{{primitives.variant.primary.state.invalid.defaultVariant.focusRing.color}}"),
          })
          .optional(),
        sm: z
          .object({
            padding: withRef(z.string()).default("{{primitives.space.sm}}"),
            fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
          })
          .optional(),
        lg: z
          .object({
            padding: withRef(z.string()).default("{{primitives.space.lg}}"),
            fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
          })
          .optional(),
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

        headerGap: withRef(z.string()).default("{{primitives.space.sm}}"),

        headerPanel: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
            color: color.default("{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"),
            border: border.default({
              color: "{{primitives.border.defaultVariant.color}}",
            }),
            padding: withRef(z.string()).default("{{primitives.space.md}}"),
            margin: withRef(z.string()).default("{{primitives.space.md}}"),

            // navigation selector buttons in header panel (including e.g. selectMonth, selectYear)
            yearMonthNav: z
              .object({
                gap: withRef(z.string()).default("{{primitives.space.sm}}"),
                fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
                fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
              })
              .optional(),
            
            selectMonth: (navigationSelector as typeof navigationSelector).optional(),
            selectYear: (navigationSelector as typeof navigationSelector).optional(),

            navButton: (panelButton as typeof panelButton).optional()
          })
          .optional(),
        
        datePanel: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
            color: color.default("{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"),
            border: border.default({
              color: "{{primitives.border.defaultVariant.color}}",
            }),
            padding: withRef(z.string()).default("{{primitives.space.md}}"),
            margin: withRef(z.string()).default("{{primitives.space.md}}"),

            //dayViewPanel
            dayView: (viewMargin as typeof viewMargin).optional(),
            weekDayLabel: z
              .object({
                padding: withRef(z.string()).default("{{primitives.space.xs}}"),
                fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
                color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
              })
              .optional(),
            dateCell: z
              .object({
                hoverBackground: z
                  .union([bg, withRef(z.string())])
                  .default("{{primitives.area.onSurface.state.hover.defaultVariant.bg}}"),
                selectedBackground: z
                  .union([bg, withRef(z.string())])
                  .default("{{primitives.area.onSurface.state.active.defaultVariant.bg}}"),
                // endpoints of the selected range
                rangeSelectedBackground: z
                  .union([bg, withRef(z.string())])
                  .default("{{primitives.area.onSurface.state.active.defaultVariant.bg}}"),
                // dates between selected endpoints of the range
                inRangeBackground: z
                  .union([bg, withRef(z.string())])
                  .default("{{primitives.variant.primary.defaultState.defaultVariant.bg}}"),
                color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
                hoverColor: color.default("{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}"),
                selectedColor: color.default("{{primitives.area.onSurface.state.active.defaultVariant.contrast}}"),
                rangeSelectedColor: color.default("{{primitives.area.onSurface.state.active.defaultVariant.contrast}}"),
                width: withRef(z.string()).default("2.5rem"),
                height: withRef(z.string()).default("2.5rem"),
                border: border.default({
                  radius: "{{primitives.radius.md}}",
                }),
                padding: withRef(z.string()).default("{{primitives.space.xs}}"),
                focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
              })
              .optional(),

            //monthViewPanel
            monthView: (viewMargin as typeof viewMargin).optional(),
            month: (pickerCell as typeof pickerCell).optional(),
            
            //yearViewPanel
            yearView: (viewMargin as typeof viewMargin).optional(),
            year: (pickerCell as typeof pickerCell).optional(),

            today: z
              .object({
                background: z
                  .union([bg, withRef(z.string())])
                  .default("{{primitives.variant.primary.defaultState.defaultVariant.bg}}"),
                color: color.default("{{primitives.variant.primary.defaultState.defaultVariant.contrast}}"),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),

    // Seperate button with calendar icon to open the panel
    calendarIconButton: (panelButton as typeof panelButton).optional(),
    // Calendar icon inside the input field
    inputCalendarIcon: (iconStyles as typeof iconStyles).optional(),

    timePicker: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        gap: withRef(z.string()).default("{{primitives.space.md}}"),
        buttonGap: withRef(z.string()).default("{{primitives.space.xs}}"),
        margin: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
    timePickerButton: (panelButton as typeof panelButton).optional(),
    timeInput: z
      .object({
        background: z.union([bg, withRef(z.string())]).optional(),
        color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        padding: withRef(z.string()).default("{{primitives.space.xs}}"),
        fontFamily: withRef(z.string()).default("{{primitives.font.family}}"),
        fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
        hover: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.area.onSurface.state.hover.defaultVariant.bg}}"),
            color: color.default("{{primitives.area.onSurface.state.hover.defaultVariant.contrast}}"),
            borderColor: color.default("{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}"),
          })
          .optional(),
        focus: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.area.onSurface.state.focus.defaultVariant.bg}}"),
            color: color.default("{{primitives.area.onSurface.state.focus.defaultVariant.contrast}}"),
            borderColor: color.default("{{primitives.variant.primary.state.focus.defaultVariant.border.defaultVariant.color}}"),
            focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
          })
          .optional(),
        width: withRef(z.string()).default("3rem"),
      })
      .optional(),
    timeSeparator: z
      .object({
        color: color.default("{{primitives.area.onSurface.defaultState.defaultVariant.contrast}}"),
        padding: withRef(z.string()).default("{{primitives.space.xs}}"),
        fontFamily: withRef(z.string()).default("{{primitives.font.family}}"),
        fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
      })
      .optional(),
    
    multiMonthDivider: z
      .object({
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        gap: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
   
    footerButtonBar: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        gap: withRef(z.string()).default("{{primitives.space.md}}"),
        todayButton: (panelButton as typeof panelButton).optional(),
        clearButton: (panelButton as typeof panelButton).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "calendarStyles" });

const withDefaultSeverity = <T extends z.ZodTypeAny>(styleSchema: T) =>
  z.object({
    defaultSeverity: styleSchema.optional(),
  }).optional();

export const calendarWithStates = z
  .object({
    defaultState: withDefaultSeverity(calendarStyles),
  })
  .register(themeSchemaRegistry, { id: "calendarWithStates" });

export const calendar = z
  .object({
    settings: (calendarSettings as typeof calendarSettings).optional(),
    defaultVariant: (calendarWithStates as typeof calendarWithStates).optional(),
  })
  .register(themeSchemaRegistry, { id: "calendar" });
