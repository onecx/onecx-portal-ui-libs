import * as z from "zod";
import { bg, color, withRef, borderWithShadow } from "./primitives";
import { themeSchemaRegistry } from "./registry";

export const textareaSettings = z
  .object({
    autoResize: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaSettings" });

export const textareaSize = z
  .object({
    fontSize: withRef(z.string()).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaSize" });

export const textareaBaseStyles = z
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
    shadow: withRef(z.string()).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    transitionDuration: withRef(z.number()).optional(),
    focusRing: borderWithShadow.optional(),
    sm: (textareaSize as typeof textareaSize).optional(),
    lg: (textareaSize as typeof textareaSize).optional(),
  })
  .register(themeSchemaRegistry, { id: "textareaBaseStyles" });

export const textareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultVariant.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color.optional().default('{{primitives.defaultVariant.defaultState.defaultVariant.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default("{{primitives.radius.md}}"),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.defaultState.defaultVariant.border.defaultVariant.color}}',
        radius: "{{primitives.radius.md}}",
      }),
    shadow: textareaBaseStyles.shape.shadow.default("{{primitives.shadow.none}}"),
    paddingX: textareaBaseStyles.shape.paddingX.default("{{primitives.space.sm}}"),
    paddingY: textareaBaseStyles.shape.paddingY.default("{{primitives.space.sm}}"),
    transitionDuration: textareaBaseStyles.shape.transitionDuration.default("{{primitives.transition.duration}}"),
    focusRing: textareaBaseStyles.shape.focusRing.default({
      width: "{{primitives.focusRing.width}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.focusRing.color}}",
      offset: "{{primitives.focusRing.offset}}",
      shadow: "{{primitives.focusRing.shadow}}",
    }),
    sm: textareaBaseStyles.shape.sm.default({
      fontSize: "{{primitives.font.size}}",
      paddingX: "{{primitives.space.xs}}",
      paddingY: "{{primitives.space.xs}}",
    }),
    lg: textareaBaseStyles.shape.lg.default({
      fontSize: "{{primitives.font.size}}",
      paddingX: "{{primitives.space.md}}",
      paddingY: "{{primitives.space.md}}",
    }),
  })
  .register(themeSchemaRegistry, { id: "textareaStyles" });

export const filledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultVariant.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color.optional().default('{{primitives.variant.primary.defaultState.defaultVariant.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default("{{primitives.radius.md}}"),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.defaultState.defaultVariant.border.defaultVariant.color}}',
        radius: "{{primitives.radius.md}}",
      }),
    shadow: textareaBaseStyles.shape.shadow.default("{{primitives.shadow.none}}"),
    paddingX: textareaBaseStyles.shape.paddingX.default("{{primitives.space.sm}}"),
    paddingY: textareaBaseStyles.shape.paddingY.default("{{primitives.space.sm}}"),
    transitionDuration: textareaBaseStyles.shape.transitionDuration.default("{{primitives.transition.duration}}"),
    focusRing: textareaBaseStyles.shape.focusRing.default({
      width: "{{primitives.focusRing.width}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.focusRing.color}}",
      offset: "{{primitives.focusRing.offset}}",
      shadow: "{{primitives.focusRing.shadow}}",
    }),
    sm: textareaBaseStyles.shape.sm.default({
      fontSize: "{{primitives.font.size}}",
      paddingX: "{{primitives.space.xs}}",
      paddingY: "{{primitives.space.xs}}",
    }),
    lg: textareaBaseStyles.shape.lg.default({
      fontSize: "{{primitives.font.size}}",
      paddingX: "{{primitives.space.md}}",
      paddingY: "{{primitives.space.md}}",
    }),
  })
  .register(themeSchemaRegistry, { id: "filledTextareaStyles" });

export const hoverTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.hover.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.hover.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.defaultVariant.state.hover.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "hoverTextareaStyles" });

export const activeTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.active.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.active.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.defaultVariant.state.active.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "activeTextareaStyles" });

export const selectedTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.selected.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.selected.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.defaultVariant.state.selected.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "selectedTextareaStyles" });

export const focusTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.focus.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.focus.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.defaultVariant.state.focus.defaultVariant.border.defaultVariant.color}}",
      }),
    focusRing: borderWithShadow.optional().default({
      width: "{{primitives.focusRing.width}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.focusRing.color}}",
      offset: "{{primitives.focusRing.offset}}",
      shadow: "{{primitives.focusRing.shadow}}",
    }),
  })
  .register(themeSchemaRegistry, { id: "focusTextareaStyles" });

export const disabledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.defaultVariant.state.disabled.defaultVariant.bg}}"),
    color: color.default("{{primitives.defaultVariant.state.disabled.defaultVariant.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.disabled.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.defaultVariant.state.disabled.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "disabledTextareaStyles" });

export const invalidTextareaStyles = textareaBaseStyles
  .extend({
    placeholderColor: color.default("{{primitives.defaultVariant.state.invalid.defaultVariant.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.defaultVariant.state.invalid.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.defaultVariant.state.invalid.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "invalidTextareaStyles" });

export const textareaWithStates = z
  .object({
    defaultState: (textareaStyles as typeof textareaStyles).optional(),
    state: z
      .object({
        hover: (hoverTextareaStyles as typeof hoverTextareaStyles).optional(),
        active: (activeTextareaStyles as typeof activeTextareaStyles).optional(),
        selected: (selectedTextareaStyles as typeof selectedTextareaStyles).optional(),
        focus: (focusTextareaStyles as typeof focusTextareaStyles).optional(),
        disabled: (disabledTextareaStyles as typeof disabledTextareaStyles).optional(),
        invalid: (invalidTextareaStyles as typeof invalidTextareaStyles).optional(),
      })
      .optional()
  })
  .register(themeSchemaRegistry, { id: "textareaWithStates" });

export const hoverFilledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.hover.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "hoverFilledTextareaStyles" });

export const activeFilledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.active.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.active.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.variant.primary.state.active.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "activeFilledTextareaStyles" });

export const selectedFilledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.selected.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.selected.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.variant.primary.state.selected.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "selectedFilledTextareaStyles" });

export const focusFilledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.focus.defaultVariant.bg}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.focus.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.variant.primary.state.focus.defaultVariant.border.defaultVariant.color}}",
      }),
    focusRing: borderWithShadow.optional().default({
      width: "{{primitives.focusRing.width}}",
      style: "{{primitives.focusRing.style}}",
      color: "{{primitives.focusRing.color}}",
      offset: "{{primitives.focusRing.offset}}",
      shadow: "{{primitives.focusRing.shadow}}",
    }),
  })
  .register(themeSchemaRegistry, { id: "focusFilledTextareaStyles" });

export const disabledFilledTextareaStyles = textareaBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default("{{primitives.variant.primary.state.disabled.defaultVariant.bg}}"),
    color: color.default("{{primitives.variant.primary.state.disabled.defaultVariant.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.disabled.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.variant.primary.state.disabled.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "disabledFilledTextareaStyles" });

export const invalidFilledTextareaStyles = textareaBaseStyles
  .extend({
    placeholderColor: color.default("{{primitives.variant.primary.state.invalid.defaultVariant.contrast}}"),
    border: z
      .object({
        color: color.optional().default("{{primitives.variant.primary.state.invalid.defaultVariant.border.defaultVariant.color}}"),
      })
      .optional()
      .default({
        color: "{{primitives.variant.primary.state.invalid.defaultVariant.border.defaultVariant.color}}",
      }),
  })
  .register(themeSchemaRegistry, { id: "invalidFilledTextareaStyles" });

export const filledTextareaStateWithStates = z
  .object({
    defaultState: (filledTextareaStyles as typeof filledTextareaStyles).optional(),
    state: z
      .object({
        hover: (hoverFilledTextareaStyles as typeof hoverFilledTextareaStyles).optional(),
        active: (activeFilledTextareaStyles as typeof activeFilledTextareaStyles).optional(),
        selected: (selectedFilledTextareaStyles as typeof selectedFilledTextareaStyles).optional(),
        focus: (focusFilledTextareaStyles as typeof focusFilledTextareaStyles).optional(),
        disabled: (disabledFilledTextareaStyles as typeof disabledFilledTextareaStyles).optional(),
        invalid: (invalidFilledTextareaStyles as typeof invalidFilledTextareaStyles).optional(),
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
