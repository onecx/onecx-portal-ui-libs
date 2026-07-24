/**
 * Primitives are the foundational design tokens that define the core visual properties of a theme, such as colors, typography, spacing, and borders. 
 * They serve as central reusable values that can be referenced throughout the theme to ensure consistency and enable easy global updates.
 */

import * as z from "zod";
import { themeSchemaRegistry } from "./registry";

// A reference to another value in the same theme using dot-notation path wrapped in double braces.
// At runtime the consumer resolves these references before applying the theme to PrimeNG.
// Example: "{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}" or "{{primitives.space.md}}"
export const themeRef = z
  .string()
  .regex(/^\{\{[\w.]+\}\}$/)
  .register(themeSchemaRegistry, { id: "themeRef" });

// Allows any typed schema value to alternatively be a theme reference string.
// Use this wrapper for non-string scalar types (enums, booleans) — they would otherwise
// reject a ref string. Plain z.string() fields already accept refs as-is.
export const withRef = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, themeRef]);

export const color = z.union([
  withRef(z.string()),
  z.object({ light: withRef(z.string()), dark: withRef(z.string()) }),
]);

export const bg = z
  .object({
    color: color.optional(),
    image: withRef(z.string()).optional(),
    position: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
    repeat: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "bg" });

// Named shadow tokens map to CSS box-shadow values at different elevation levels.
// Components reference these tokens for consistent elevation (e.g. cards, dialogs, dropdowns).
export const shadow = z
  .object({
    none: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
    xl: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "shadow" });

// Named border-radius tokens. Components reference these via semantic size names
// rather than hard-coded pixel values, enabling global shape changes from one place.
export const radius = z
  .object({
    none: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
    xl: withRef(z.string()).optional(),
    full: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "radius" });

const borderWidthSizes = z
  .object({
    none: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "borderWidthSizes" });

export const borderCommonShape = {
  color: color.optional(),
  width: z
    .union([
      withRef(borderWidthSizes),
      z.object({
        top: borderWidthSizes.optional(),
        right: borderWidthSizes.optional(),
        bottom: borderWidthSizes.optional(),
        left: borderWidthSizes.optional(),
      }),
    ])
    .optional(),
  style: withRef(z.string()).optional(),
  offset: withRef(
    z.object({
      none: withRef(z.string()).optional(),
      sm: withRef(z.string()).optional(),
      md: withRef(z.string()).optional(),
      lg: withRef(z.string()).optional(),
    })
  ).optional(),
};

export const border = z
  .object({
    ...borderCommonShape,
    radius: withRef(radius).optional(),
  })
  .register(themeSchemaRegistry, { id: "border" });

export const focusRing = z
  .object({
    ...borderCommonShape,
    shadow: withRef(shadow).optional(),
  })
  .register(themeSchemaRegistry, { id: "focusRing" });

// Layout tokens control structural constraints like content max-width and section gaps.
// Useful for theming applications that need different layout densities (compact vs. comfortable).
export const layout = z
  .object({
    // Max-width of the main content container, e.g. '1280px'
    contentMaxWidth: withRef(z.string()).optional(),
    // Max-width of overlay components (tooltips, popovers), e.g. '12.5rem'
    overlayMaxWidth: withRef(z.string()).optional(),
    // Default gap between layout sections / grid columns
    gap: withRef(z.string()).optional(),
    // Default padding inside layout sections / grid columns
    padding: withRef(z.string()).optional(),
    // Default margin outside layout sections / grid columns
    margin: withRef(z.string()).optional(),
    // Default alignment of content inside layout sections / grid columns
    alignItems: withRef(z.string()).optional(),
    // Default justification of content inside layout sections / grid columns
    justifyContent: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "layout" });

// screen variants scale used for padding, margin, and gap tokens across components on different specific device sizes.
// Defining it here allows components to reference e.g. screenVariants.md instead of a hard-coded value.
export const screenSettings = z
  .object({
    xs: layout.optional(),
    sm: layout.optional(),
    md: layout.optional(),
    lg: layout.optional(),
  })
  .register(themeSchemaRegistry, { id: "screenSettings" });

export const borderWithShadow = border
  .extend({
    shadow: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "borderWithShadow" });

export const bgContrast = z.object({
  bg: z.union([bg, withRef(z.string())]).optional(),
  contrast: color.optional(),
});

export const severityStyles = bgContrast
  .extend({
    border: border.optional(),
    focusRing: borderWithShadow.optional(),
    cursor: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "severityStyles" });

// Per-named-level style overrides. Each severity level maps to a severityStyles block
// (bg, contrast, border, focusRing) so individual components can be styled differently for success, info, warning, danger, and contrast cases.
export const severityVariants = z
  .object({
    success: severityStyles.optional(),
    info: severityStyles.optional(),
    warning: severityStyles.optional(),
    danger: severityStyles.optional(),
    contrast: severityStyles.optional(),
  })
  .register(themeSchemaRegistry, { id: "severityVariants" });

// A single interaction-state group: a baseline style (defaultVariant) and per-level severity overrides (variants). 
// Used as the type for variantWithStates.defaultState and each state entry.
export const severityVariantGroup = z
  .object({
    defaultSeverity: severityStyles.optional(),
    severity: severityVariants.optional(),
  })
  .register(themeSchemaRegistry, { id: "severityVariantGroup" });

export const variantWithStates = bgContrast
  .extend({
    defaultState: severityVariantGroup.optional(),
    state: z
      .object({
        hover: severityVariantGroup.optional(),
        active: severityVariantGroup.optional(),
        selected: severityVariantGroup.optional(),
        focus: severityVariantGroup.optional(),
        invalid: severityVariantGroup.optional(),
        disabled: severityVariantGroup.optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "variantWithStates" });

type ColorVariantsShape = {
  primary: z.ZodOptional<typeof variantWithStates>;
  secondary: z.ZodOptional<typeof variantWithStates>;
  tertiary: z.ZodOptional<typeof variantWithStates>;
  quaternary: z.ZodOptional<typeof variantWithStates>;
  quinary: z.ZodOptional<typeof variantWithStates>;
};

const colorVariantsShape: ColorVariantsShape = {
  primary: variantWithStates.optional(),
  secondary: variantWithStates.optional(),
  tertiary: variantWithStates.optional(),
  quaternary: variantWithStates.optional(),
  quinary: variantWithStates.optional(),
  // TODO: Add a link variant to all components that support link display (e.g. buttons)
};

export const colorVariants = z
  .object(colorVariantsShape)
  .register(themeSchemaRegistry, { id: "colorVariants" });

export const area = variantWithStates.extend({});

type AreasShape = {
  canvas: z.ZodOptional<typeof area>;
  surface: z.ZodOptional<typeof area>;
  overlay: z.ZodOptional<typeof area>;
}

const areasShape: AreasShape = {
  canvas: area.optional(),
  surface: area.optional(),
  overlay: area.optional(),
};


export const areas = z
  .object(areasShape)
  .register(themeSchemaRegistry, { id: "areas" });

// Spacing scale used for padding, margin, and gap tokens across components.
// Defining it here allows components to reference e.g. space.md instead of a hard-coded value.
export const space = z
  .object({
    xs: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
    xl: withRef(z.string()).optional(),
    xxl: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "space" });

// Defined here (before primitives) so it can be referenced in the primitives object.
// Also used further below in usages/blockStyles for per-component typography overrides.
export const font = z
  .object({
    family: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
    weight: withRef(z.string()).optional(),
    lineHeight: withRef(z.string()).optional(),
    letterSpacing: withRef(z.string()).optional(),
    style: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "font" });

export const transition = z
  .object({
    duration: withRef(z.number()).optional(),
  })
  .register(themeSchemaRegistry, { id: "transition" });

export const icon = z.object({
  size: withRef(z.string()).optional(),
  color: color.optional(),
  content: z.string().optional(),
  font: font.optional(),
  url: z.string().optional(),
}).register(themeSchemaRegistry, { id: "icon" });

type PrimitivesShape = {
  defaultVariant: z.ZodOptional<typeof variantWithStates>;
  variant: z.ZodOptional<typeof colorVariants>;
  screenSettings: z.ZodOptional<typeof screenSettings>;
  area: z.ZodOptional<typeof areas>;
  shadow: z.ZodOptional<typeof shadow>;
  font: z.ZodOptional<typeof font>;
  space: z.ZodOptional<typeof space>;
  layout: z.ZodOptional<typeof layout>;
  radius: z.ZodOptional<typeof radius>;
  border: z.ZodOptional<typeof border>;
  focusRing: z.ZodOptional<typeof focusRing>;
  transition: z.ZodOptional<typeof transition>;
};

const primitivesShape: PrimitivesShape = {
  defaultVariant: (variantWithStates as typeof variantWithStates).optional(),
  variant: (colorVariants as typeof colorVariants).optional(),
  screenSettings: (screenSettings as typeof screenSettings).optional(),
  area: (areas as typeof areas).optional(),
  shadow: (shadow as typeof shadow).optional(),
  // Global typography baseline applied to all text unless overridden at a more specific level
  font: (font as typeof font).optional(),
  space: (space as typeof space).optional(),
  layout: (layout as typeof layout).optional(),
  radius: (radius as typeof radius).optional(),
  // Global default border style applied to components that don't define their own border token
  border: (border as typeof border).optional(),
  focusRing: (focusRing as typeof focusRing).optional(),
  transition: (transition as typeof transition).optional(),
};

export const primitives = z
  .object(primitivesShape)
  .optional()
  .register(themeSchemaRegistry, { id: "primitives" });