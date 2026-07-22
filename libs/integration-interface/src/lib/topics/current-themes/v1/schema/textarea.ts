import * as z from "zod";
import { bg, color, withRef, borderWithShadow, font } from "./primitives";
import { themeSchemaRegistry } from "./registry";

const defaultFocusRing = {
  width: "{{primitives.focusRing.width}}",
  style: "{{primitives.focusRing.style}}",
  color: "{{primitives.focusRing.color}}",
  offset: "{{primitives.focusRing.offset}}",
  shadow: "{{primitives.focusRing.shadow}}",
};

const defaultFont = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
};

const defaultSmSize = {
  font: {
    size: "{{primitives.font.size}}",
  },
  paddingX: "{{primitives.space.xs}}",
  paddingY: "{{primitives.space.xs}}",
};

const defaultMdSize = {
  font: {
    size: "{{primitives.font.size}}",
  },
  paddingX: "{{primitives.space.md}}",
  paddingY: "{{primitives.space.md}}",
};

const defaultLgSize = {
  font: {
    size: "{{primitives.font.size}}",
  },
  paddingX: "{{primitives.space.md}}",
  paddingY: "{{primitives.space.md}}",
};

export const textareaSettings = z
  .object({
    autoResizeX: withRef(z.boolean()).optional(),
    autoResizeY: withRef(z.boolean()).optional(),
    variant: withRef(z.enum(['filled', 'outlined'])).optional(),
    fluid: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaSettings" });

export const textareaSize = z
  .object({
    font: (font as typeof font).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaSize" });

export const textareaBaseStyles = z
  .object({
    font: (font as typeof font).optional().default(defaultFont),
    shadow: withRef(z.string()).optional().default("{{primitives.shadow.none}}"),
    paddingX: withRef(z.string()).optional().default("{{primitives.space.sm}}"),
    paddingY: withRef(z.string()).optional().default("{{primitives.space.sm}}"),
    transitionDuration: withRef(z.number()).optional().default("{{primitives.transition.duration}}"),
    sm: (textareaSize as typeof textareaSize).optional().default(defaultSmSize),
    md: (textareaSize as typeof textareaSize).optional().default(defaultMdSize),
    lg: (textareaSize as typeof textareaSize).optional().default(defaultLgSize),
  })
  .register(themeSchemaRegistry, { id: "textareaBaseStyles" });

export const textareaChangeableStyles = z
  .object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    placeholderColor: color.optional(),
    border: z
      .object({
        color: color.optional(),
        radius: withRef(z.string()).optional(),
      })
      .optional(),
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaChangeableStyles" });

export const textareaStyles = textareaBaseStyles
  .extend(textareaChangeableStyles.shape)
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: color.optional().default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default("{{primitives.radius.md}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaStyles" });

export const filledTextareaStyles = textareaBaseStyles
  .extend(textareaChangeableStyles.shape)
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: color.optional().default('{{primitives.variant.primary.defaultState.defaultSeverity.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default("{{primitives.radius.md}}"),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "filledTextareaStyles" });

export const hoverTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.hover.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "hoverTextareaStyles" });

export const activeTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.active.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.active.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional(),
    focusRing: borderWithShadow.optional().default(defaultFocusRing),
  })
  .register(themeSchemaRegistry, { id: "activeTextareaStyles" });

export const selectedTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.selected.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "selectedTextareaStyles" });

export const focusTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.focus.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional(),
    focusRing: borderWithShadow.optional().default(defaultFocusRing),
  })
  .register(themeSchemaRegistry, { id: "focusTextareaStyles" });

export const disabledTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}"),
    color: color.default("{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.disabled.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "disabledTextareaStyles" });

export const invalidTextareaStyles = textareaChangeableStyles
  .extend({
    placeholderColor: color.default("{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.invalid.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "invalidTextareaStyles" });

const withDefaultSeverity = <T extends z.ZodTypeAny>(styleSchema: T) =>
  z.object({
    defaultSeverity: styleSchema.optional(),
  }).optional();

export const textareaWithStates = z
  .object({
    defaultState: withDefaultSeverity(textareaStyles),
    state: z
      .object({
        hover: withDefaultSeverity(hoverTextareaStyles),
        active: withDefaultSeverity(activeTextareaStyles),
        selected: withDefaultSeverity(selectedTextareaStyles),
        focus: withDefaultSeverity(focusTextareaStyles),
        disabled: withDefaultSeverity(disabledTextareaStyles),
        invalid: withDefaultSeverity(invalidTextareaStyles),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "textareaWithStates" });

export const hoverFilledTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.hover.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.hover.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "hoverFilledTextareaStyles" });

export const activeFilledTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.active.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.active.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional(),
    focusRing: borderWithShadow.optional().default(defaultFocusRing),
  })
  .register(themeSchemaRegistry, { id: "activeFilledTextareaStyles" });

export const selectedFilledTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.selected.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.selected.defaultSeverity.border.defaultVariant.color}}"),
      })
  })
  .register(themeSchemaRegistry, { id: "selectedFilledTextareaStyles" });

export const focusFilledTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.focus.defaultSeverity.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.focus.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional(),
    focusRing: borderWithShadow.optional().default(defaultFocusRing),
  })
  .register(themeSchemaRegistry, { id: "focusFilledTextareaStyles" });

export const disabledFilledTextareaStyles = textareaChangeableStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}"),
    color: color.default("{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.disabled.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "disabledFilledTextareaStyles" });

export const invalidFilledTextareaStyles = textareaChangeableStyles
  .extend({
    placeholderColor: color.default("{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.invalid.defaultSeverity.border.defaultVariant.color}}"),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "invalidFilledTextareaStyles" });

export const filledTextareaStateWithStates = z
  .object({
    defaultState: withDefaultSeverity(filledTextareaStyles),
    state: z
      .object({
        hover: withDefaultSeverity(hoverFilledTextareaStyles),
        active: withDefaultSeverity(activeFilledTextareaStyles),
        selected: withDefaultSeverity(selectedFilledTextareaStyles),
        focus: withDefaultSeverity(focusFilledTextareaStyles),
        disabled: withDefaultSeverity(disabledFilledTextareaStyles),
        invalid: withDefaultSeverity(invalidFilledTextareaStyles),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "filledTextareaStateWithStates" });

export const textarea = z
  .object({
    settings: (textareaSettings as typeof textareaSettings).optional(),
    defaultVariant: (textareaWithStates as typeof textareaWithStates).optional(),
    variant: z
      .object({
        filledVariant: (filledTextareaStateWithStates as typeof filledTextareaStateWithStates).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: "textarea" });
