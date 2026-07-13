import * as z from "zod";
import { bg, color, withRef, borderWithShadow } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const textareaSettings = z
  .object({
    autoResize: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaSettings" });

export const textareaSize = z
  .object({
    fontSize: withRef(z.string()).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaSize" });

export const textarea = z
  .object({
    settings: (textareaSettings as typeof textareaSettings).optional(),
    defaultVariant: z
      .object({
        defaultState: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default('{{primitives.defaultVariant.defaultState.defaultVariant.bg}}'),
            color: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
            placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
            border: {
              color: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.border.defaultVariant.color}}'),
              radius: withRef(z.string()).default("{{primitives.radius.md}}"),
            },
            shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
            paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
            paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
            transitionDuration: withRef(z.number()).default("{{primitives.transition.duration}}"),
            sm: (textareaSize as typeof textareaSize).optional().default({
              fontSize: "{{primitives.font.size}}",
              paddingX: "{{primitives.space.xs}}",
              paddingY: "{{primitives.space.xs}}",
            }),
            lg: (textareaSize as typeof textareaSize).optional().default({
              fontSize: "{{primitives.font.size}}",
              paddingX: "{{primitives.space.md}}",
              paddingY: "{{primitives.space.md}}",
            }),
          })
          .optional(),
        state: z
          .object({
            hover: z
              .object({
                borderColor: color.default("{{primitives.defaultVariant.state.hover.defaultVariant.border.defaultVariant.color}}"),
              })
              .optional(),
            focus: z
              .object({
                borderColor: color.default("{{primitives.defaultVariant.state.focus.defaultVariant.border.defaultVariant.color}}"),
                focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
              })
              .optional(),
            invalid: z
              .object({
                borderColor: color.default("{{primitives.defaultVariant.state.invalid.defaultVariant.border.defaultVariant.color}}"),
                placeholderColor: color.default("{{primitives.defaultVariant.state.invalid.defaultVariant.contrast}}"),
              })
              .optional(),
            disabled: z
              .object({
                background: z
                  .union([bg, withRef(z.string())])
                  .default('{{primitives.defaultVariant.state.disabled.defaultVariant.bg}}'),
                color: color.default("{{primitives.defaultVariant.state.disabled.defaultVariant.contrast}}"),
                borderColor: color.default("{{primitives.defaultVariant.state.disabled.defaultVariant.border.defaultVariant.color}}"),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    filledVariant: z
      .object({
        defaultState: z
          .object({
            background: z
              .union([bg, withRef(z.string())])
              .default('{{primitives.variant.primary.defaultState.defaultVariant.bg}}'),
            color: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
            placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
            border: {
              color: color.default('{{primitives.variant.primary.defaultState.defaultVariant.border.defaultVariant.color}}'),
              radius: withRef(z.string()).default("{{primitives.radius.md}}"),
            },
            shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
            paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
            paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
            transitionDuration: withRef(z.number()).default("{{primitives.transition.duration}}"),
            sm: (textareaSize as typeof textareaSize).optional().default({
              fontSize: "{{primitives.font.size}}",
              paddingX: "{{primitives.space.xs}}",
              paddingY: "{{primitives.space.xs}}",
            }),
            lg: (textareaSize as typeof textareaSize).optional().default({
              fontSize: "{{primitives.font.size}}",
              paddingX: "{{primitives.space.md}}",
              paddingY: "{{primitives.space.md}}",
            }),
          })
          .optional(),
        state: z
          .object({
            hover: z
              .object({
                background: z
                  .union([bg, withRef(z.string())])
                  .default('{{primitives.variant.primary.state.hover.defaultVariant.bg}}'),
                borderColor: color.default("{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}"),
              })
              .optional(),
            focus: z
              .object({
                background: z
                  .union([bg, withRef(z.string())])
                  .default('{{primitives.variant.primary.state.focus.defaultVariant.bg}}'),
                focusRing: (borderWithShadow as typeof borderWithShadow).optional(),
              })
              .optional(),
            disabled: z
              .object({
                background: z
                  .union([bg, withRef(z.string())])
                  .default('{{primitives.variant.primary.state.disabled.defaultVariant.bg}}'),
                borderColor: color.default("{{primitives.variant.primary.state.disabled.defaultVariant.border.defaultVariant.color}}"),
                })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "textarea" });
