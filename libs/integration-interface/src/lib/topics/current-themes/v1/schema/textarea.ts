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
    background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.area.surface.defaultState.defaultVariant.bg}}'),
    disabledBackground: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.surface.state.disabled.defaultVariant.bg}}"),
    filledBackground: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.defaultState.defaultVariant.bg}}"),
    filledHoverBackground: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.hover.defaultVariant.bg}}"),
    filledFocusBackground: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.focus.defaultVariant.bg}}"),
    borderColor: color.default("{{primitives.border.defaultVariant.color}}"),
    hoverBorderColor: color.default("{{primitives.area.surface.state.hover.defaultVariant.border.defaultVariant.color}}"),
    focusBorderColor: color.default("{{primitives.area.surface.state.focus.defaultVariant.border.defaultVariant.color}}"),
    invalidBorderColor: color.default("{{primitives.area.surface.state.invalid.defaultVariant.border.defaultVariant.color}}"),
    color: color.default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}"),
    disabledColor: color.default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}"),
    placeholderColor: color.default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}"),
    invalidPlaceholderColor: color.default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}"),
    shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
    paddingX: withRef(z.string()).default("{{primitives.space.sm}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
    focusRing: borderWithShadow.default({
      width: "{{primitives.focusRing.width}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.focusRing.color}}",
      offset: "{{primitives.focusRing.offset}}",
      shadow: "{{primitives.focusRing.shadow}}",
    }),
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
  .register(themeSchemaRegistry, { id: "textarea" });
