import * as z from "zod";
import { bg, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const dialogSettings = z
  .object({
    header: z
      .object({
        close: z
          .object({
            enabled: withRef(z.boolean()).optional(),
          })
          .optional(),
      })
      .optional(),
    draggable: withRef(z.boolean()).optional(),
    dismissableMask: withRef(z.boolean()).optional(),
    modal: withRef(z.boolean()).optional(),
    maximizable: withRef(z.boolean()).optional(),
    resizable: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: "dialogSettings" });

export const dialog = z
  .object({
    settings: (dialogSettings as typeof dialogSettings).optional(),
    root: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
        borderColor: color.default("{{primitives.border.defaultVariant.color}}"),
        color: color.default(
          "{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"
        ),
        borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
        shadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
      })
      .optional(),
    header: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        gap: withRef(z.string()).default("{{primitives.space.sm}}"),
      })
      .optional(),
    title: z
      .object({
        fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
      })
      .optional(),
    content: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
      })
      .optional(),
    footer: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        gap: withRef(z.string()).default("{{primitives.space.sm}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "dialog" });