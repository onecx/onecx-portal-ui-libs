/**
 * This file defines the schema for toggleswitch theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const toggleswitchSettings = z
  .object({
    // Component-specific settings can be added here if needed
  })
  .register(themeSchemaRegistry, { id: "toggleswitchSettings" });

export const toggleswitchFocusRing = z
  .object({
    width: withRef(z.string()).default("{{primitives.focusRing.width}}"),
    style: withRef(z.string()).default("{{primitives.focusRing.style}}"),
    color: color.default("{{primitives.focusRing.color}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow}}"),
  })
  .register(themeSchemaRegistry, { id: "toggleswitchFocusRing" });

export const toggleswitchColors = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.surface.defaultState.defaultVariant.bg}}"),
    borderColor: color.default("{{primitives.border.defaultVariant.color}}"),
  })
  .register(themeSchemaRegistry, { id: "toggleswitchColors" });

export const toggleswitchHandleColors = z
  .object({
    background: color.default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}"),
    color: color.optional(),
  })
  .register(themeSchemaRegistry, { id: "toggleswitchHandleColors" });

export const toggleswitch = z
  .object({
    settings: (toggleswitchSettings as typeof toggleswitchSettings).optional(),
    border: z
      .object({
        radius: withRef(z.string()).default("{{primitives.radius.full}}"),
        width: withRef(z.string()).default("{{primitives.border.defaultVariant.width}}"),
        style: withRef(z.string()).default("{{primitives.border.defaultVariant.style}}"),
      })
      .optional(),
    width: withRef(z.string()).default("2.5rem"),
    height: withRef(z.string()).default("1.5rem"),
    gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
    shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
    transition: z
      .object({
        duration: withRef(z.string()).default("{{primitives.transition.duration}}"),
      })
      .optional(),
    slide: z
      .object({
        duration: withRef(z.string()).default("{{primitives.transition.duration}}"),
      })
      .optional(),
    focusRing: (toggleswitchFocusRing as typeof toggleswitchFocusRing).optional(),
    defaultState: (toggleswitchColors as typeof toggleswitchColors).optional(),
    state: z
      .object({
        hover: toggleswitchColors.default({
          background: "{{primitives.area.surface.state.hover.defaultVariant.bg}}",
          borderColor: "{{primitives.border.defaultVariant.color}}",
        }),
        checked: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.variant.primary.defaultState.defaultVariant.bg}}"),
            borderColor: color.default(
              "{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}"
            ),
            hover: (toggleswitchColors as typeof toggleswitchColors).optional(),
          })
          .optional(),
        disabled: (toggleswitchColors as typeof toggleswitchColors).optional(),
        invalid: z
          .object({
            borderColor: color.optional(),
          })
          .optional(),
      })
      .optional(),
    handle: z
      .object({
        borderRadius: withRef(z.string()).default("{{primitives.radius.full}}"),
        size: withRef(z.string()).default("1.25rem"),
        width: withRef(z.string()).default("1.25rem"),
        height: withRef(z.string()).default("1.25rem"),
        defaultState: (toggleswitchHandleColors as typeof toggleswitchHandleColors).optional(),
        state: z
          .object({
            hover: (toggleswitchHandleColors as typeof toggleswitchHandleColors).optional(),
            checked: z
              .object({
                background: color.default(
                  "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
                ),
                color: color.optional(),
                hover: (toggleswitchHandleColors as typeof toggleswitchHandleColors).optional(),
              })
              .optional(),
            disabled: z
              .object({
                background: color.default(
                  "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
                ),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "toggleswitch" });
