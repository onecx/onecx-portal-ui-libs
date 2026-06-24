import * as z from "zod";
import { bg, bgContrast, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const dialogSettings = z
  .object({
    closable: withRef(z.boolean()).optional(),
    closeOnEscape: withRef(z.boolean()).optional(),
    autoZIndex: withRef(z.boolean()).optional(),
    baseZIndex: withRef(z.number()).optional(),
    blockScroll: withRef(z.boolean()).optional(),
    minX: withRef(z.string()).optional(),
    minY: withRef(z.string()).optional(),
    focusOnShow: withRef(z.boolean()).optional(),
    focusTrap: withRef(z.boolean()).optional(),
    closeIcon: withRef(z.string()).optional(),
    closeAriaLabel: withRef(z.string()).optional(),
    minimizeIcon: withRef(z.string()).optional(),
    maximizeIcon: withRef(z.string()).optional(),
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
    root: bgContrast
      .extend({
        bg: z
          .union([bg, withRef(z.string())])
          .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
        contrast: color.default(
          "{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"
        ),
        border: border.default({
          color: "{{primitives.border.defaultVariant.color}}",
        }),
        radius: withRef(z.string()).default("{{primitives.radius.md}}"),
        shadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
      })
      .optional(),
    header: z
      .object({
        padding: withRef(z.string()).default("{{primitives.space.md}}"),
        gap: withRef(z.string()).default("{{primitives.space.sm}}"),
        alignItems: withRef(z.string()).default("center"),
        justifyContent: withRef(z.string()).default("space-between"),
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
        justifyContent: withRef(z.string()).default("flex-end"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "dialog" });