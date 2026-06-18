/**
 * This file defines the schema for badge theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, border, color, font, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";

// Base badge style (size-specific properties)
const badgeSizeStyle = z.object({
  fontSize: withRef(z.string()).optional(),
  minWidth: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
});

// Badge style with size variants
const badgeStyleWithSizeVariants = z.object({
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
});

export const badge = z
  .object({
    // Dot section (from original PrimeNG tokens)
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
    
    // Severity variants (each can have their own size variants)
    variant: z.object({
      primary: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.defaultVariant.bg}}",
        color: "{{primitives.variant.primary.defaultState.defaultVariant.contrast}}",
      }),
      secondary: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.secondary.defaultState.defaultVariant.bg}}",
        color: "{{primitives.variant.secondary.defaultState.defaultVariant.contrast}}",
      }),
      success: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.variant.success.bg}}",
        color: "{{primitives.variant.primary.defaultState.variant.success.contrast}}",
      }),
      info: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.variant.info.bg}}",
        color: "{{primitives.variant.primary.defaultState.variant.info.contrast}}",
      }),
      warning: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.variant.warning.bg}}",
        color: "{{primitives.variant.primary.defaultState.variant.warning.contrast}}",
      }),
      danger: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.variant.danger.bg}}",
        color: "{{primitives.variant.primary.defaultState.variant.danger.contrast}}",
      }),
      contrast: badgeStyleWithSizeVariants.optional().default({
        background: "{{primitives.variant.primary.defaultState.variant.contrast.bg}}",
        color: "{{primitives.variant.primary.defaultState.variant.contrast.contrast}}",
      }),
    }).optional(),
  })
  .register(themeSchemaRegistry, { id: "badge" });
