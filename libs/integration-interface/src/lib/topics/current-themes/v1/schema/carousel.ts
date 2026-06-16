/**
 * This file defines the schema for carousel theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, bgContrast, border, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const carouselSettings = z
  .object({
    orientation: withRef(z.enum(["horizontal", "vertical"])).default("horizontal"),
    showIndicators: withRef(z.boolean()).default(true),
  })
  .register(themeSchemaRegistry, { id: "carouselSettings" });

export const indicatorStyles = bgContrast
  .extend({
    bg: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.overlay.defaultState.defaultVariant.bg}}"),
    contrast: color.default(
      "{{primitives.area.overlay.defaultState.defaultVariant.contrast}}"
    ),
    width: withRef(z.string()).default("1rem"),
    height: withRef(z.string()).default("1rem"),
    border: border.default({
      radius: "{{primitives.radius.md}}",
    }),
    focusRing: border.optional(),
  })
  .register(themeSchemaRegistry, { id: "indicatorStyles" });

export const indicatorWithStates = z
  .object({
    defaultState: (indicatorStyles as typeof indicatorStyles).optional(),
    state: z
      .object({
        hover: (indicatorStyles as typeof indicatorStyles).optional(),
        active: (indicatorStyles as typeof indicatorStyles).optional(),
        focus: (indicatorStyles as typeof indicatorStyles).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "indicatorWithStates" });

export const carousel = z
  .object({
    settings: (carouselSettings as typeof carouselSettings).optional(),
    container: bgContrast.extend({
      padding: withRef(z.string()).default("{{primitives.space.md}}"),
      border: border.optional(),
    }).optional(),
    content: z.object({
      gap: withRef(z.string()).default("{{primitives.space.md}}"),
    }).optional(),
    indicator: z.object({
      padding: withRef(z.string()).default("{{primitives.space.md}}"),
      gap: withRef(z.string()).default("{{primitives.layout.gap}}"),
      styles: (indicatorWithStates as typeof indicatorWithStates).optional(),
    }).optional(),
    navigation: z.object({
      padding: withRef(z.string()).default("{{primitives.space.sm}}"),
    }).optional(),
  })
  .register(themeSchemaRegistry, { id: "carousel" });
