import * as z from "zod";
import { deepPartialSchema } from "./deepPartial";

// !IMPORTANT: All objects that contain a default property on the top level, must contain either state or variant on the top level, never both of them
// !IMPORTANT: All subobjects of variant and state must have the same structure as the default object on the same level

// A reference to another value in the same theme using dot-notation path wrapped in double braces.
// At runtime the consumer resolves these references before applying the theme to PrimeNG.
// Example: "{{primitives.variant.primary.bg.color}}" or "{{primitives.space.md}}"
const themeRef = z
  .string()
  .regex(/^\{\{[\w.]+\}\}$/)
  .meta({ id: "themeRef" });

// Allows any typed schema value to alternatively be a theme reference string.
// Use this wrapper for non-string scalar types (enums, booleans) — they would otherwise
// reject a ref string. Plain z.string() fields already accept refs as-is.
const withRef = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, themeRef]);

const color = z.union([
  withRef(z.string()),
  z.object({ light: withRef(z.string()), dark: withRef(z.string()) }),
]);

const bg = z
  .object({
    color: color.optional(),
    image: withRef(z.string()).optional(),
    position: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
    repeat: withRef(z.string()).optional(),
  })
  .meta({ id: "bg" });

const border = z
  .object({
    color: color.optional(),
    width: z
      .union([
        withRef(z.string()),
        z.object({
          top: withRef(z.string()).optional(),
          right: withRef(z.string()).optional(),
          bottom: withRef(z.string()).optional(),
          left: withRef(z.string()).optional(),
        }),
      ])
      .optional(),
    style: withRef(z.string()).optional(),
    radius: withRef(z.string()).optional(),
    offset: withRef(z.string()).optional(),
  })
  .meta({ id: "border" });

const componentBorders = z
  .object({
    button: border.optional(),
    input: border.optional(),
    card: border.optional(),
    dialog: border.optional(),
  })
  .meta({ id: "componentBorders" });

const borderWithVariants = z
  .object({
    default: border.optional(),
    variant: componentBorders.optional(),
  })
  .meta({ id: "borderWithVariants" });

const bgContrast = z.object({
  bg: z.union([bg, withRef(z.string())]).optional(),
  contrast: color.optional(),
});

const severityStyles = bgContrast
  .extend({
    border: borderWithVariants.optional(),
    focusRing: border.optional(),
  })
  .meta({ id: "severityStyles" });

// Per-named-level style overrides. Each severity level maps to a severityStyles block
// (bg, contrast, border, focusRing) so individual components can be styled differently
// for success, info, warning, danger, and contrast cases.
const severityVariants = z
  .object({
    success: severityStyles.optional(),
    info: severityStyles.optional(),
    warning: severityStyles.optional(),
    danger: severityStyles.optional(),
    contrast: severityStyles.optional(),
  })
  .meta({ id: "severityVariants" });

// A single interaction-state group: a baseline style (default) and per-level severity
// overrides (variants). Used as the type for variantWithStates.default and each state.
const severityVariantGroup = z
  .object({
    default: severityStyles.optional(),
    variant: severityVariants.optional(),
  })
  .meta({ id: "severityVariantGroup" });



const variantWithStates = bgContrast
  .extend({
    default: severityVariantGroup.optional(),
    state: z
      .object({
        hover: severityVariantGroup.optional(),
        active: severityVariantGroup.optional(),
        selected: severityVariantGroup.optional(),
        focus: severityVariantGroup.optional(),
      })
      .optional(),
  })
  .meta({ id: "variantWithStates" });

const colorVariants = z
  .object({
    primary: variantWithStates.optional(),
    secondary: variantWithStates.optional(),
    tertiary: variantWithStates.optional(),
    quaternary: variantWithStates.optional(),
    quinary: variantWithStates.optional(),
    // TODO: Add a link variant to all components that support link display (e.g. buttons)
  })
  .meta({ id: "colorVariants" });
// NOTE: transform disabled — z.transform() prevents JSON schema generation.
// Runtime: unset tertiary/quaternary/quinary fall back to secondary.
// .transform((v) => ({
//   ...v,
//   tertiary: v.tertiary ?? v.secondary,
//   quaternary: v.quaternary ?? v.secondary,
//   quinary: v.quinary ?? v.secondary,
// }));

// NOTE: transform disabled — z.transform() prevents JSON schema generation.
// Runtime: default bg to 'initial' when not set.
const area = variantWithStates.extend({});

const areas = z
  .object({
    canvas: area.optional(),
    surface: area.optional(),
    onSurface: area.optional(),
    overlay: area.optional(),
  })
  .meta({ id: "areas" });

// Named shadow tokens map to CSS box-shadow values at different elevation levels.
// Components reference these tokens for consistent elevation (e.g. cards, dialogs, dropdowns).
const shadow = z
  .object({
    none: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
    xl: withRef(z.string()).optional(),
  })
  .meta({ id: "shadow" });

// Named border-radius tokens. Components reference these via semantic size names
// rather than hard-coded pixel values, enabling global shape changes from one place.
const radius = z
  .object({
    none: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
    xl: withRef(z.string()).optional(),
    full: withRef(z.string()).optional(),
  })
  .meta({ id: "radius" });

// Spacing scale used for padding, margin, and gap tokens across components.
// Defining it here allows components to reference e.g. space.md instead of a hard-coded value.
const space = z
  .object({
    xs: withRef(z.string()).optional(),
    sm: withRef(z.string()).optional(),
    md: withRef(z.string()).optional(),
    lg: withRef(z.string()).optional(),
    xl: withRef(z.string()).optional(),
    xxl: withRef(z.string()).optional(),
  })
  .meta({ id: "space" });

// Layout tokens control structural constraints like content max-width and section gaps.
// Useful for theming applications that need different layout densities (compact vs. comfortable).
const layout = z
  .object({
    // Max-width of the main content container, e.g. '1280px'
    contentMaxWidth: withRef(z.string()).optional(),
    // Default gap between layout sections / grid columns
    gap: withRef(z.string()).optional(),
  })
  .meta({ id: "layout" });

// Defined here (before primitives) so it can be referenced in the primitives object.
// Also used further below in usages/blockStyles for per-component typography overrides.
const font = z
  .object({
    family: withRef(z.string()).optional(),
    size: withRef(z.string()).optional(),
    weight: withRef(z.string()).optional(),
    lineHeight: withRef(z.string()).optional(),
    letterSpacing: withRef(z.string()).optional(),
    style: withRef(z.string()).optional(),
  })
  .meta({ id: "font" });

const primitives = z
  .object({
    default: (variantWithStates as typeof variantWithStates).optional(),
    variant: colorVariants as typeof colorVariants,
    area: (areas as typeof areas).optional(),
    shadow: (shadow as typeof shadow).optional(),
    // Global typography baseline applied to all text unless overridden at a more specific level
    font: (font as typeof font).optional(),
    space: (space as typeof space).optional(),
    layout: (layout as typeof layout).optional(),
    radius: (radius as typeof radius).optional(),
    // Global default border style applied to components that don't define their own border token
    border: (borderWithVariants as typeof borderWithVariants).optional(),
    focusRing: (border as typeof border).optional(),
  })
  .optional()
  .meta({ id: "primitives" });

// Font with defaults pointing to primitives — used by region so that unset font
// properties inherit from the global primitives.font baseline.
const fontWithDefaults = z
  .object({
    family: withRef(z.string()).default("{{primitives.font.family}}"),
    size: withRef(z.string()).default("{{primitives.font.size}}"),
    weight: withRef(z.string()).default("{{primitives.font.weight}}"),
    lineHeight: withRef(z.string()).default("{{primitives.font.lineHeight}}"),
    letterSpacing: withRef(z.string()).default(
      "{{primitives.font.letterSpacing}}"
    ),
    style: withRef(z.string()).default("{{primitives.font.style}}"),
  })
  .meta({ id: "fontWithDefaults" });

const region = z
  .object({
    font: fontWithDefaults.optional(),
  })
  .meta({ id: "region" });

const blockStyles = bgContrast
  .extend({
    border: border.default({
      color: "{{primitives.border.default.color}}",
      width: "{{primitives.border.default.width}}",
      style: "{{primitives.border.default.style}}",
      radius: "{{primitives.radius.md}}",
    }),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    font: font.default({
      family: "{{primitives.font.family}}",
      size: "{{primitives.font.size}}",
      weight: "{{primitives.font.weight}}",
      lineHeight: "{{primitives.font.lineHeight}}",
      letterSpacing: "{{primitives.font.letterSpacing}}",
      style: "{{primitives.font.style}}",
    }),
    textAlign: withRef(z.string()).default("left"),
  })
  .meta({ id: "blockStyles" });

const tableStyles = blockStyles
  .extend({
    // Override bg/contrast from blockStyles with defaults pointing to the surface area primitive
    bg: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.area.surface.default.default.bg}}"),
    contrast: color.default(
      "{{primitives.area.surface.default.default.contrast}}"
    ),
    padding: withRef(z.string()).default("{{primitives.space.md}}"),
    borderCollapse: withRef(z.enum(["collapse", "separate"])).default(
      "separate"
    ),
    // Controls the box-shadow of the table container element, e.g. for elevation or
    // visual separation from the surrounding page surface.
    shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
  })
  .meta({ id: "tableStyles" });

const tableSettings = z
  .object({
    checkboxColumnPosition: withRef(z.enum(["start", "end"])).default("start"),
    actionColumnPosition: withRef(z.enum(["start", "end"])).default("end"),
    actionColumnSticky: withRef(z.boolean()).default(false),
  })
  .meta({ id: "tableSettings" });

const tableCellStyles = blockStyles
  .extend({
    // Controls vertical alignment within a cell (e.g. 'top', 'middle', 'bottom').
    // Needed when rows can vary in height due to multi-line content.
    verticalAlign: withRef(z.string()).default("middle"),
    // When true, overflowing text is truncated with an ellipsis instead of wrapping.
    // Useful for cells with constrained width (e.g. description or name columns).
    truncate: withRef(z.boolean()).default(false),
  })
  .meta({ id: "tableCellStyles" });

const cellWithStates = z
  .object({
    default: (tableCellStyles as typeof tableCellStyles).optional(),
    state: z
      .object({
        hover: (tableCellStyles as typeof tableCellStyles).optional(),
        active: (tableCellStyles as typeof tableCellStyles).optional(),
        selected: (tableCellStyles as typeof tableCellStyles).optional(),
        focus: (tableCellStyles as typeof tableCellStyles).optional(),
      })
      .optional(),
  })
  .meta({ id: "cellWithStates" });

const tableRowStyles = blockStyles
  .extend({
    // Allows setting a fixed row height (e.g. '48px') for consistent row sizing
    // regardless of cell content, typically used in dense/compact table layouts.
    height: withRef(z.string()).optional(),
    cell: (cellWithStates as typeof cellWithStates).optional(),
  })
  .meta({ id: "tableRowStyles" });

const rowWithStates = z
  .object({
    default: (tableRowStyles as typeof tableRowStyles).optional(),
    state: z
      .object({
        hover: (tableRowStyles as typeof tableRowStyles).optional(),
        active: (tableRowStyles as typeof tableRowStyles).optional(),
        selected: (tableRowStyles as typeof tableRowStyles).optional(),
        focus: (tableRowStyles as typeof tableRowStyles).optional(),
      })
      .optional(),
  })
  .meta({ id: "rowWithStates" });

const alternatingRowStyles = z
  .object({
    odd: (rowWithStates as typeof rowWithStates).optional(),
    even: (rowWithStates as typeof rowWithStates).optional(),
  })
  .meta({ id: "alternatingRowStyles" });

const tableRow = z.object({
  default: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
  state: z.object({
    hover: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
    active: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
    selected: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
    focus: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
  }),
});

const table = z
  .object({
    settings: (tableSettings as typeof tableSettings).optional(),
    default: (tableStyles as typeof tableStyles).optional(),
    header: (rowWithStates as typeof rowWithStates).optional(),
    footer: (rowWithStates as typeof rowWithStates).optional(),
    row: (tableRow as typeof tableRow).optional(),
  })
  .meta({ id: "table" });

const usages = z
  .object({
    region: (region as typeof region).optional(),
    table: (table as typeof table).optional(),
  })
  .meta({ id: "usages" });

const regionOverride = z
  .object({
    primitives: deepPartialSchema(primitives).optional() as z.ZodOptional<ReturnType<typeof deepPartialSchema<typeof primitives>>>,
    usages: deepPartialSchema(usages).optional() as z.ZodOptional<ReturnType<typeof deepPartialSchema<typeof usages>>>,
  }).optional()
  .meta({ id: "regionOverride" });

const regionOverrides = z
  .object({
    header: regionOverride as typeof regionOverride,
    subHeader: regionOverride as typeof regionOverride,
    bodyStart: regionOverride as typeof regionOverride,
    bodyHeader: regionOverride as typeof regionOverride,
    bodyFooter: regionOverride as typeof regionOverride,
    bodyEnd: regionOverride as typeof regionOverride,
    footer: regionOverride as typeof regionOverride,
  }).optional()
  .meta({ id: "regionOverrides" });

export const theme = z
  .object({
    v2: z.object({
      primitives: primitives as typeof primitives,
      usages: usages.optional(),
      regionOverrides: regionOverrides as typeof regionOverrides,
    }).optional(),
    v1: z.any().optional(),
  })
  .meta({ id: "theme" });

export type Themes = z.input<typeof theme>;