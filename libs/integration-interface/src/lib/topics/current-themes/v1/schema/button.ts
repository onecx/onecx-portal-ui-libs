/**
 * This file defines the schema for button theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bg, border, color, withRef } from "./primitives";
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
    color: color.default("{{primitives.variant.primary.defaultState.defaultVariant.contrast}}")
  })
  .register(themeSchemaRegistry, { id: "buttonColors" });

export const buttonStatefulColors = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    borderColor: color.optional(),
    color: color.optional(),
    hoverBackground: z.union([bg, withRef(z.string())]).optional(),
    hoverBorderColor: color.optional(),
    hoverColor: color.optional(),
    activeBackground: z.union([bg, withRef(z.string())]).optional(),
    activeBorderColor: color.optional(),
    activeColor: color.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonStatefulColors" });

export const buttonVariantSeverityColors = z
  .object({
    hoverBackground: z.union([bg, withRef(z.string())]).optional(),
    activeBackground: z.union([bg, withRef(z.string())]).optional(),
    borderColor: color.optional(),
    color: color.optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonVariantSeverityColors" });

export const buttonSeverities = z
  .object({
    secondary: z
      .object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.variant.secondary.defaultState.defaultVariant.bg.color}}"),
        borderColor: color.default("{{primitives.variant.secondary.defaultState.defaultVariant.border.defaultVariant.color}}"),
        color: color.default("{{primitives.variant.secondary.defaultState.defaultVariant.contrast}}"),
        hoverBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.secondary.state.hover.defaultVariant.bg.color}}"),
        hoverBorderColor: color.default("{{primitives.variant.secondary.state.hover.defaultVariant.border.defaultVariant.color}}"),
        hoverColor: color.default("{{primitives.variant.secondary.state.hover.defaultVariant.contrast}}"),
        activeBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.secondary.state.active.defaultVariant.bg.color}}"),
        activeBorderColor: color.default("{{primitives.variant.secondary.state.active.defaultVariant.border.defaultVariant.color}}"),
        activeColor: color.default("{{primitives.variant.secondary.state.active.defaultVariant.contrast}}"),
      })
      .optional(),
    success: z
      .object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.defaultState.variant.success.bg.color}}"),
        borderColor: color.default("{{primitives.variant.primary.defaultState.variant.success.border.defaultVariant.color}}"),
        color: color.default("{{primitives.variant.primary.defaultState.variant.success.contrast}}"),
        hoverBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.hover.variant.success.bg.color}}"),
        hoverBorderColor: color.default("{{primitives.variant.primary.state.hover.variant.success.border.defaultVariant.color}}"),
        hoverColor: color.default("{{primitives.variant.primary.state.hover.variant.success.contrast}}"),
        activeBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.active.variant.success.bg.color}}"),
        activeBorderColor: color.default("{{primitives.variant.primary.state.active.variant.success.border.defaultVariant.color}}"),
        activeColor: color.default("{{primitives.variant.primary.state.active.variant.success.contrast}}"),
      })
      .optional(),
    info: z
      .object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.defaultState.variant.info.bg.color}}"),
        borderColor: color.default("{{primitives.variant.primary.defaultState.variant.info.border.defaultVariant.color}}"),
        color: color.default("{{primitives.variant.primary.defaultState.variant.info.contrast}}"),
        hoverBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.hover.variant.info.bg.color}}"),
        hoverBorderColor: color.default("{{primitives.variant.primary.state.hover.variant.info.border.defaultVariant.color}}"),
        hoverColor: color.default("{{primitives.variant.primary.state.hover.variant.info.contrast}}"),
        activeBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.active.variant.info.bg.color}}"),
        activeBorderColor: color.default("{{primitives.variant.primary.state.active.variant.info.border.defaultVariant.color}}"),
        activeColor: color.default("{{primitives.variant.primary.state.active.variant.info.contrast}}"),
      })
      .optional(),
    warning: z
      .object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.defaultState.variant.warning.bg.color}}"),
        borderColor: color.default("{{primitives.variant.primary.defaultState.variant.warning.border.defaultVariant.color}}"),
        color: color.default("{{primitives.variant.primary.defaultState.variant.warning.contrast}}"),
        hoverBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.hover.variant.warning.bg.color}}"),
        hoverBorderColor: color.default("{{primitives.variant.primary.state.hover.variant.warning.border.defaultVariant.color}}"),
        hoverColor: color.default("{{primitives.variant.primary.state.hover.variant.warning.contrast}}"),
        activeBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.active.variant.warning.bg.color}}"),
        activeBorderColor: color.default("{{primitives.variant.primary.state.active.variant.warning.border.defaultVariant.color}}"),
        activeColor: color.default("{{primitives.variant.primary.state.active.variant.warning.contrast}}"),
      })
      .optional(),
    danger: z
      .object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.defaultState.variant.danger.bg.color}}"),
        borderColor: color.default("{{primitives.variant.primary.defaultState.variant.danger.border.defaultVariant.color}}"),
        color: color.default("{{primitives.variant.primary.defaultState.variant.danger.contrast}}"),
        hoverBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.hover.variant.danger.bg.color}}"),
        hoverBorderColor: color.default("{{primitives.variant.primary.state.hover.variant.danger.border.defaultVariant.color}}"),
        hoverColor: color.default("{{primitives.variant.primary.state.hover.variant.danger.contrast}}"),
        activeBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.active.variant.danger.bg.color}}"),
        activeBorderColor: color.default("{{primitives.variant.primary.state.active.variant.danger.border.defaultVariant.color}}"),
        activeColor: color.default("{{primitives.variant.primary.state.active.variant.danger.contrast}}"),
      })
      .optional(),
    contrast: z
      .object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.defaultState.variant.contrast.bg.color}}"),
        borderColor: color.default("{{primitives.variant.primary.defaultState.variant.contrast.border.defaultVariant.color}}"),
        color: color.default("{{primitives.variant.primary.defaultState.variant.contrast.contrast}}"),
        hoverBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.hover.variant.contrast.bg.color}}"),
        hoverBorderColor: color.default("{{primitives.variant.primary.state.hover.variant.contrast.border.defaultVariant.color}}"),
        hoverColor: color.default("{{primitives.variant.primary.state.hover.variant.contrast.contrast}}"),
        activeBackground: z.union([bg, withRef(z.string())]).default("{{primitives.variant.primary.state.active.variant.contrast.bg.color}}"),
        activeBorderColor: color.default("{{primitives.variant.primary.state.active.variant.contrast.border.defaultVariant.color}}"),
        activeColor: color.default("{{primitives.variant.primary.state.active.variant.contrast.contrast}}"),
      })
      .optional(),
    help: (buttonStatefulColors as typeof buttonStatefulColors).optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSeverities" });

export const buttonVariant = z
  .object({
    border: (border as typeof border).optional(),
    layout: z
      .object({
        gap: withRef(z.string()).optional(),
        paddingX: withRef(z.string()).optional(),
        paddingY: withRef(z.string()).optional(),
        iconOnlyWidth: withRef(z.string()).optional(),
      })
      .optional(),
    focusRing: (buttonFocusRing as typeof buttonFocusRing).optional(),
    text: z
      .object({
        fontWeight: withRef(z.string()).optional(),
        color: color.optional(),
      })
      .optional(),
    icon: z
      .object({
        color: color.optional(),
      })
      .optional(),
    severities: z
      .object({
        primary: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        secondary: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        success: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        info: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        warning: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        danger: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        contrast: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
        help: (buttonVariantSeverityColors as typeof buttonVariantSeverityColors).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonVariant" });

export const buttonSizes = z
  .object({
    sm: (buttonSize as typeof buttonSize).optional(),
    lg: (buttonSize as typeof buttonSize).optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonSizes" });

export const buttonDefaultVariant = z
  .object({
    border: border.default({
      radius: "{{primitives.radius.md}}",
    }),
    layout: z
      .object({
        gap: withRef(z.string()).default("{{primitives.space.xs}}"),
        paddingX: withRef(z.string()).default("{{primitives.space.md}}"),
        paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
        iconOnlyWidth: withRef(z.string()).default("{{primitives.space.lg}}"),
      })
      .optional(),
    focusRing: (buttonFocusRing as typeof buttonFocusRing).optional(),
    text: z
      .object({
        fontWeight: withRef(z.string()).default("{{primitives.font.weight}}"),
      })
      .optional(),
    icon: z
      .object({
        color: color.optional(),
      })
      .optional(),
    severities: z
      .object({
        primary: (buttonStatefulColors as typeof buttonStatefulColors).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonDefaultVariant" });

export const buttonVariants = z
  .object({
    outlined: (buttonVariant as typeof buttonVariant).optional(),
    text: (buttonVariant as typeof buttonVariant).optional(),
  })
  .register(themeSchemaRegistry, { id: "buttonVariants" });

export const button = z
  .object({
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
    roundedBorderRadius: withRef(z.string()).default("{{primitives.radius.full}}"),
    gap: withRef(z.string()).default("{{primitives.space.xs}}"),
    paddingX: withRef(z.string()).default("{{primitives.space.md}}"),
    paddingY: withRef(z.string()).default("{{primitives.space.sm}}"),
    iconOnlyWidth: withRef(z.string()).default("{{primitives.space.lg}}"),
    sizes: (buttonSizes as typeof buttonSizes).optional(),
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
    severities: (buttonSeverities as typeof buttonSeverities).optional(),
    defaultVariant: (buttonDefaultVariant as typeof buttonDefaultVariant).optional(),
    variants: (buttonVariants as typeof buttonVariants).optional(),
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
