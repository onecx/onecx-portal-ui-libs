/**
 * This file defines the schema for button theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

/**
 * Focus ring styling.
 */
export const buttonFocusRing = z
  .object({
    color: color.default("{{primitives.primaryColor}}"),
    shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  })
  .register(themeSchemaRegistry, { id: "buttonFocusRing" });

/**
 * Size-specific properties.
 */
export const buttonSize = z
  .object({
    fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
    paddingX: withRef(z.string()).default("{{primitives.space.md}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    iconOnlyWidth: withRef(z.string()).default("{{primitives.space.lg}}"),
  })
  .register(themeSchemaRegistry, { id: "buttonSize" });

/**
 * Button styling with default and state-specific overrides.
 */
export const buttonColors = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.primaryColor}}"),
    borderColor: color.default("{{primitives.primaryColor}}"),
    color: color.default("{{primitives.primaryContrastColor}}"),
  })
  .optional();

/**
 * Main button usage schema.
 */
export const button = z
  .object({
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
    roundedBorderRadius: withRef(z.string()).default("{{primitives.radius.full}}"),
    gap: withRef(z.string()).default("{{primitives.space.xs}}"),
    paddingX: withRef(z.string()).default("{{primitives.space.md}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    iconOnlyWidth: withRef(z.string()).default("{{primitives.space.lg}}"),
    sm: (buttonSize as typeof buttonSize).optional(),
    lg: (buttonSize as typeof buttonSize).optional(),
    label: z
      .object({
        fontWeight: withRef(z.string()).default("{{primitives.font.weight.bold}}"),
      })
      .optional(),
    raisedShadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
    focusRing: (buttonFocusRing as typeof buttonFocusRing).optional(),
    badgeSize: withRef(z.string()).default("{{primitives.space.lg}}"),
    transitionDuration: withRef(z.string()).default("{{primitives.transitionDuration}}"),
    defaultState: (buttonColors as typeof buttonColors).optional(),
    state: z
      .object({
        hover: (buttonColors as typeof buttonColors).optional(),
        active: (buttonColors as typeof buttonColors).optional(),
        focus: (buttonColors as typeof buttonColors).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "button" });
