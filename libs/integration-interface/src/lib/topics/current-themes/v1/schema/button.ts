/**
 * This file defines the schema for button theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, color, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const buttonFocusRing = z
  .object({
    color: color.default("{{primitives.focusRing.color}}"),
    shadow: withRef(z.string()).default("{{primitives.shadow.sm}}"),
  })
  .register(themeSchemaRegistry, { id: "buttonFocusRing" });

export const buttonSize = z
  .object({
    fontSize: withRef(z.string()).default("{{primitives.font.size}}"),
    paddingX: withRef(z.string()).default("{{primitives.space.md}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    iconOnlyWidth: withRef(z.string()).default("{{primitives.space.lg}}"),
  })
  .register(themeSchemaRegistry, { id: "buttonSize" });

export const buttonColors = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}"),
    borderColor: color.default("{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}"),
    color: color.default("{{primitives.variant.primary.defaultState.defaultVariant.contrast}}"),
  })
  .register(themeSchemaRegistry, { id: "buttonColors" });

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
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
      })
      .optional(),
    raisedShadow: withRef(z.string()).default("{{primitives.shadow.md}}"),
    disabledOpacity: withRef(z.number()).default("{{primitives.disabledOpacity}}"),
    focusRing: (buttonFocusRing as typeof buttonFocusRing).optional(),
    badgeSize: withRef(z.string()).default("{{primitives.space.lg}}"),
    transitionDuration: withRef(z.string()).default("{{primitives.transition.duration}}"),
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
