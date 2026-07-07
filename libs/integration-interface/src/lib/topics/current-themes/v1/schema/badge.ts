/**
 * This file defines the schema for badge theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, border, color, font, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const badgeSettings = z
  .object({
    badgeSize: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "badgeSettings" });

// Base badge style (size-specific properties)
export const badgeSizeStyle = z
  .object({
    fontSize: withRef(z.string()).optional(),
    minWidth: withRef(z.string()).optional(),
    height: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "badgeSizeStyle" });

// Badge style with size variants
export const badgeStyleWithSizeVariants = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: border.optional(),
    font: font.optional(),
    padding: withRef(z.string()).optional(),
    // Default size
    defaultVariant: badgeSizeStyle.optional(),
    // Size variants
    sizeVariant: z.object({
      sm: badgeSizeStyle.optional(),
      lg: badgeSizeStyle.optional(),
      xl: badgeSizeStyle.optional(),
    }).optional(),
  })
  .register(themeSchemaRegistry, { id: "badgeStyleWithSizeVariants" });

const colorVariant = (severity: string) => ({
  background: `{{primitives.variant.primary.defaultState.defaultVariant.${severity}.bg}}`,
  color: `{{primitives.variant.primary.defaultState.defaultVariant.${severity}.contrast}}`,
});

export const badge = z
  .object({
    settings: (badgeSettings as typeof badgeSettings).optional(),

    // Dot section
    dot: z.object({
      size: withRef(z.string()).default("0.5rem"),
    }).optional(),
    
    // Default variant (severity = default, size = default)
    defaultVariant: badgeStyleWithSizeVariants.optional().default({
      background: "{{primitives.variant.primary.defaultState.defaultVariant.bg}}",
      color: "{{primitives.variant.primary.defaultState.defaultVariant.contrast}}",
      border: {
        radius: "{{primitives.radius.full}}",
      },
      font: {
        size: "{{primitives.font.size}}",
        weight: "{{primitives.font.weight}}",
      },
      padding: "{{primitives.space.sm}}",
      defaultVariant: {
        fontSize: "{{primitives.font.size}}",
        minWidth: "1.5rem",
        height: "1.5rem",
      },
      sizeVariant: {
        sm: {
          fontSize: "{{primitives.font.size}}",
          minWidth: "1.25rem",
          height: "1.25rem",
        },
        lg: {
          fontSize: "{{primitives.font.size}}",
          minWidth: "1.75rem",
          height: "1.75rem",
        },
        xl: {
          fontSize: "{{primitives.font.size}}",
          minWidth: "2rem",
          height: "2rem",
        },
      },
    }),
    
    // Severity variants
    variant: z.object({
      primary: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.defaultVariant.bg}}",
        color: "{{primitives.variant.primary.defaultState.defaultVariant.contrast}}",
      }),
      secondary: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.secondary.defaultState.defaultVariant.bg}}",
        color: "{{primitives.variant.secondary.defaultState.defaultVariant.contrast}}",
      }),
      success: badgeStyleWithSizeVariants.optional().default(colorVariant("success")),
      info: badgeStyleWithSizeVariants.optional().default(colorVariant("info")),
      warning: badgeStyleWithSizeVariants.optional().default(colorVariant("warning")),
      danger: badgeStyleWithSizeVariants.optional().default(colorVariant("danger")),
      contrast: badgeStyleWithSizeVariants.optional().default(colorVariant("contrast")),
    }).optional(),
  })
  .register(themeSchemaRegistry, { id: "badge" });
