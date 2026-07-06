/**
 * This file defines the schema for inputtext theming. It allows customization of all InputText design tokens exposed by PrimeNG.
 */
import * as z from "zod";
import { bg, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const inputText = z
  .object({
    // Root background
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.input.defaultState.defaultVariant.bg}}"),

    // Text color
    color: color.default(
      "{{primitives.area.input.defaultState.defaultVariant.contrast}}"
    ),

    // Disabled state
    disabled: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.input.disabledState.defaultVariant.bg}}"),
        color: color.default(
          "{{primitives.area.input.disabledState.defaultVariant.contrast}}"
        ),
      })
      .optional(),

    // Filled mode
    filled: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.space.xs}}"),
        hover: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.space.xs}}"),
          })
          .optional(),
        focus: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default("{{primitives.space.xs}}"),
          })
          .optional(),
      })
      .optional(),

    // Border base
    border: border
      .default({
        color: "{{primitives.border.defaultVariant.color}}",
      })
      .optional(),

    // Border - hover state
    hover: z
      .object({
        border: border
          .default({
            color: "{{primitives.border.defaultVariant.color}}",
          })
          .optional(),
      })
      .optional(),

    // Border - focus state and focus ring
    focus: z
      .object({
        border: border
          .default({
            color: "{{primitives.border.defaultVariant.color}}",
          })
          .optional(),
        ring: z
          .object({
            width: withRef(z.string()).default("{{primitives.radius.xs}}"),
            style: withRef(z.string()).default("solid"),
            color: color.default("{{primitives.color.primary.defaultState.defaultVariant.bg}}"),
            offset: withRef(z.string()).default("0"),
            shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
          })
          .optional(),
      })
      .optional(),

    // Invalid state
    invalid: z
      .object({
        border: border
          .default({
            color: "{{primitives.color.error.defaultState.defaultVariant.bg}}",
          })
          .optional(),
        placeholder: z
          .object({
            color: color.default(
              "{{primitives.color.error.defaultState.defaultVariant.bg}}"
            ),
          })
          .optional(),
      })
      .optional(),

    // Placeholder color
    placeholder: z
      .object({
        color: color.default("{{primitives.font.color.muted}}"),
      })
      .optional(),

    // Shadow
    shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),

    // Padding
    padding: z
      .object({
        x: withRef(z.string()).default("{{primitives.space.md}}"),
        y: withRef(z.string()).default("{{primitives.space.sm}}"),
      })
      .optional(),

    // Border radius
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),

    // Typography
    fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
    fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),

    // Transition
    transitionDuration: withRef(z.string()).default("0.2s"),

    // Size variants - small
    sm: z
      .object({
        fontSize: withRef(z.string()).default("{{primitives.font.size.sm}}"),
        padding: z
          .object({
            x: withRef(z.string()).default("{{primitives.space.sm}}"),
            y: withRef(z.string()).default("{{primitives.space.xs}}"),
          })
          .optional(),
      })
      .optional(),

    // Size variants - large
    lg: z
      .object({
        fontSize: withRef(z.string()).default("{{primitives.font.size.lg}}"),
        padding: z
          .object({
            x: withRef(z.string()).default("{{primitives.space.lg}}"),
            y: withRef(z.string()).default("{{primitives.space.md}}"),
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "inputText" });
