import * as z from "zod";
import { bg, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const input = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.input.defaultState.defaultVariant.bg}}"),
    color: color.default(
      "{{primitives.area.input.defaultState.defaultVariant.contrast}}"
    ),
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
    border: border
      .default({
        color: "{{primitives.border.defaultVariant.color}}",
      })
      .optional(),
    hover: z
      .object({
        border: border
          .default({
            color: "{{primitives.border.defaultVariant.color}}",
          })
          .optional(),
      })
      .optional(),
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
    placeholder: z
      .object({
        color: color.default("{{primitives.font.color.muted}}"),
      })
      .optional(),
    shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
    padding: z
      .object({
        x: withRef(z.string()).default("{{primitives.space.md}}"),
        y: withRef(z.string()).default("{{primitives.space.sm}}"),
      })
      .optional(),
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
    transitionDuration: withRef(z.string()).default("0.2s"),
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
  .register(themeSchemaRegistry, { id: "input" });
