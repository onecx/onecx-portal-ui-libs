/**
 * This file defines the schema for tooltip theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const tooltipSettings = z
  .object({
    position: withRef(
      z.enum(["top", "bottom", "left", "right"])
    ).default("top"),
    showDelay: withRef(z.number()).default(0),
    hideDelay: withRef(z.number()).default(0),
  })
  .register(themeSchemaRegistry, { id: "tooltipSettings" });

export const tooltip = z
  .object({
    settings: (tooltipSettings as typeof tooltipSettings).optional(),
    maxWidth: withRef(z.string()).default("{{primitives.layout.overlayMaxWidth}}"),
    gutter: withRef(z.string()).default("{{primitives.space.sm}}"),
    shadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    border: border.default({
      radius: "{{primitives.radius.md}}",
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
    color: color.default(
      "{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"
    ),
  })
  .register(themeSchemaRegistry, { id: "tooltip" });
