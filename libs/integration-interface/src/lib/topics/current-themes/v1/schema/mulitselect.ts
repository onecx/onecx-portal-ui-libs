import * as z from 'zod'
import { bg, color, withRef, borderWithShadow, font } from './primitives'
import { themeSchemaRegistry } from './registry'

export const multiselectSettings = z
  .object({
    fluid: withRef(z.boolean()).optional(),
    variant: withRef(z.enum(['filled', 'outlined'])).optional(),
    scrollHeight: withRef(z.string()).optional(),
    filter: withRef(z.boolean()).optional(),
    readonly: withRef(z.boolean()).optional(),
    loadingIcon: withRef(z.string()).optional(),
    filterLocale: withRef(z.string()).optional(),
    resetFilterOnHide: withRef(z.boolean()).optional(),
    showClear: withRef(z.boolean()).optional(),
    virtualScroll: withRef(z.boolean()).optional(),
    virtualScrollItemSize: withRef(z.number()).optional(),
    selectOnFocus: withRef(z.boolean()).optional(),
    autoOptionFocus: withRef(z.boolean()).optional(),
    display: withRef(z.enum(['comma', 'chip'])).optional(),
    maxSelectedLabels: withRef(z.number()).optional(),
    selectedItemsLabel: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectSettings' })

export const multiselectSize = z
  .object({
    font: (font as typeof font).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectSize' })

export const multiselectBaseStyles = z
  .object({
    // Root container
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    placeholderColor: color.optional(),
    border: z
      .object({
        color: color.optional(),
        radius: withRef(z.string()).optional(),
      })
      .optional(),
    font: (font as typeof font).optional(),
    shadow: withRef(z.string()).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    transitionDuration: withRef(z.number()).optional(),
    focusRing: borderWithShadow.optional(),
    sm: (multiselectSize as typeof multiselectSize).optional(),
    lg: (multiselectSize as typeof multiselectSize).optional(),

    // Trigger icon dropdown
    dropdown: z
      .object({
        width: withRef(z.string()).optional(),
        color: color.optional(),
      })
      .optional(),

    // Popover overlay panel
    overlay: z
      .object({
        background: z.union([bg, withRef(z.string())]).optional(),
        color: color.optional(),
        border: z
          .object({
            color: color.optional(),
            radius: withRef(z.string()).optional(),
          })
          .optional(),
        shadow: withRef(z.string()).optional(),
      })
      .optional(),

    // List padding and gap constraints
    list: z
      .object({
        padding: withRef(z.string()).optional(),
        gap: withRef(z.string()).optional(),
        header: z
          .object({
            padding: withRef(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),

    // Option rows
    option: z
      .object({
        focusBackground: z.union([bg, withRef(z.string())]).optional(),
        selectedBackground: z.union([bg, withRef(z.string())]).optional(),
        selectedFocusBackground: z.union([bg, withRef(z.string())]).optional(),
        color: color.optional(),
        focusColor: color.optional(),
        selectedColor: color.optional(),
        selectedFocusColor: color.optional(),
        padding: withRef(z.string()).optional(),
        borderRadius: withRef(z.string()).optional(),
        gap: withRef(z.string()).optional(),
      })
      .optional(),

    // Groups
    optionGroup: z
      .object({
        background: z.union([bg, withRef(z.string())]).optional(),
        color: color.optional(),
        font: (font as typeof font).optional(),
        padding: withRef(z.string()).optional(),
      })
      .optional(),

    // Inline icon controls
    clearIcon: z
      .object({
        color: color.optional(),
      })
      .optional(),

    // Chip display
    chip: z
      .object({
        borderRadius: withRef(z.string()).optional(),
      })
      .optional(),

    // Missing text indicator
    emptyMessage: z
      .object({
        padding: withRef(z.string()).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectBaseStyles' })

// ─── Default Variant: Baseline / Default State ───────────────────────
export const multiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultVariant.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
    placeholderColor: color.default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.defaultState.defaultVariant.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default('{{primitives.radius.md}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.defaultState.defaultVariant.border.defaultVariant.color}}',
        radius: '{{primitives.radius.md}}',
      }),
    font: multiselectBaseStyles.shape.font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    shadow: multiselectBaseStyles.shape.shadow.default('{{primitives.shadow.none}}'),
    paddingX: multiselectBaseStyles.shape.paddingX.default('{{primitives.space.md}}'),
    paddingY: multiselectBaseStyles.shape.paddingY.default('{{primitives.space.md}}'),
    transitionDuration: multiselectBaseStyles.shape.transitionDuration.default('{{primitives.transition.duration}}'),
    focusRing: multiselectBaseStyles.shape.focusRing.default({
      width: '{{primitives.focusRing.width}}',
      style: '{{primitives.focusRing.style}}',
      color: '{{primitives.focusRing.color}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
    }),
    sm: multiselectBaseStyles.shape.sm.default({
      font: {
        size: '{{primitives.font.size}}',
      },
      paddingX: '{{primitives.space.sm}}',
      paddingY: '{{primitives.space.sm}}',
    }),
    lg: multiselectBaseStyles.shape.lg.default({
      font: {
        size: '{{primitives.font.size}}',
      },
      paddingX: '{{primitives.space.lg}}',
      paddingY: '{{primitives.space.lg}}',
    }),
    dropdown: z
      .object({
        width: withRef(z.string()).optional().default('2.5rem'),
        color: color.optional().default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
      })
      .optional()
      .default({
        width: '2.5rem',
        color: '{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}',
      }),
    overlay: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.area.overlay.defaultState.defaultVariant.bg}}'),
        color: color.optional().default('{{primitives.area.overlay.defaultState.defaultVariant.contrast}}'),
        border: z
          .object({
            color: color.optional().default('{{primitives.border.defaultVariant.color}}'),
            radius: withRef(z.string()).optional().default('{{primitives.radius.md}}'),
          })
          .optional()
          .default({
            color: '{{primitives.border.defaultVariant.color}}',
            radius: '{{primitives.radius.md}}',
          }),
        shadow: withRef(z.string()).optional().default('{{primitives.shadow.md}}'),
      })
      .optional()
      .default({
        background: '{{primitives.area.overlay.defaultState.defaultVariant.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultVariant.contrast}}',
        border: {
          color: '{{primitives.border.defaultVariant.color}}',
          radius: '{{primitives.radius.md}}',
        },
        shadow: '{{primitives.shadow.md}}',
      }),
    list: z
      .object({
        padding: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
        gap: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
        header: z
          .object({
            padding: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
          })
          .optional()
          .default({
            padding: '{{primitives.space.xs}}',
          }),
      })
      .optional()
      .default({
        padding: '{{primitives.space.xs}}',
        gap: '{{primitives.space.xs}}',
        header: {
          padding: '{{primitives.space.xs}}',
        },
      }),
    option: z
      .object({
        focusBackground: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.defaultVariant.state.hover.defaultVariant.bg}}'),
        selectedBackground: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.variant.primary.defaultState.defaultVariant.bg}}'),
        selectedFocusBackground: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('{{primitives.variant.primary.state.focus.defaultVariant.bg}}'),
        color: color.optional().default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
        focusColor: color.optional().default('{{primitives.defaultVariant.state.hover.defaultVariant.contrast}}'),
        selectedColor: color.optional().default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
        selectedFocusColor: color
          .optional()
          .default('{{primitives.variant.primary.state.focus.defaultVariant.contrast}}'),
        padding: withRef(z.string()).optional().default('{{primitives.space.sm}}'),
        borderRadius: withRef(z.string()).optional().default('{{primitives.radius.sm}}'),
        gap: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
      })
      .optional()
      .default({
        focusBackground: '{{primitives.defaultVariant.state.hover.defaultVariant.bg}}',
        selectedBackground: '{{primitives.variant.primary.defaultState.defaultVariant.bg}}',
        selectedFocusBackground: '{{primitives.variant.primary.state.focus.defaultVariant.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}',
        focusColor: '{{primitives.defaultVariant.state.hover.defaultVariant.contrast}}',
        selectedColor: '{{primitives.variant.primary.defaultState.defaultVariant.contrast}}',
        selectedFocusColor: '{{primitives.variant.primary.state.focus.defaultVariant.contrast}}',
        padding: '{{primitives.space.sm}}',
        borderRadius: '{{primitives.radius.sm}}',
        gap: '{{primitives.space.xs}}',
      }),
    optionGroup: z
      .object({
        background: z
          .union([bg, withRef(z.string())])
          .optional()
          .default('transparent'),
        color: color.optional().default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
        font: (font as typeof font).optional().default({
          weight: '{{primitives.font.weight}}',
        }),
        padding: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
      })
      .optional()
      .default({
        background: 'transparent',
        color: '{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}',
        font: {
          weight: '{{primitives.font.weight}}',
        },
        padding: '{{primitives.space.xs}}',
      }),
    clearIcon: z
      .object({
        color: color.optional().default('{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}',
      }),
    chip: z
      .object({
        borderRadius: withRef(z.string()).optional().default('{{primitives.radius.full}}'),
      })
      .optional()
      .default({
        borderRadius: '{{primitives.radius.full}}',
      }),
    emptyMessage: z
      .object({
        padding: withRef(z.string()).optional().default('{{primitives.space.xs}}'),
      })
      .optional()
      .default({
        padding: '{{primitives.space.xs}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'multiselectStyles' })

// ─── Default Variant: State Styles via .extend ───────────────────────
export const hoverMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.state.hover.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.state.hover.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'hoverMultiselectStyles' })

export const activeMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.state.active.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.state.active.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'activeMultiselectStyles' })

export const selectedMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.selected.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.state.selected.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.state.selected.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'selectedMultiselectStyles' })

export const focusMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.state.focus.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.state.focus.defaultVariant.border.defaultVariant.color}}',
      }),
    focusRing: borderWithShadow.optional().default({
      width: '{{primitives.focusRing.width}}',
      style: '{{primitives.focusRing.style}}',
      color: '{{primitives.focusRing.color}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'focusMultiselectStyles' })

export const disabledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.disabled.defaultVariant.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.state.disabled.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.state.disabled.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'disabledMultiselectStyles' })

export const invalidMultiselectStyles = multiselectBaseStyles
  .extend({
    placeholderColor: color.default('{{primitives.defaultVariant.state.invalid.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.defaultVariant.state.invalid.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.defaultVariant.state.invalid.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'invalidMultiselectStyles' })

const withDefaultSeverity = <T extends z.ZodTypeAny>(styleSchema: T) =>
  z
    .object({
      defaultSeverity: styleSchema.optional(),
    })
    .optional()

export const multiselectWithStates = z
  .object({
    defaultState: withDefaultSeverity(multiselectStyles),
    state: z
      .object({
        hover: withDefaultSeverity(hoverMultiselectStyles),
        active: withDefaultSeverity(activeMultiselectStyles),
        selected: withDefaultSeverity(selectedMultiselectStyles),
        focus: withDefaultSeverity(focusMultiselectStyles),
        disabled: withDefaultSeverity(disabledMultiselectStyles),
        invalid: withDefaultSeverity(invalidMultiselectStyles),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectWithStates' })

// ─── Filled Variant: Deep Baseline Styles ────────────────────────────
export const filledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultVariant.bg}}'),
    color: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
    placeholderColor: color.default('{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.defaultState.defaultVariant.border.defaultVariant.color}}'),
        radius: withRef(z.string()).optional().default('{{primitives.radius.md}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.defaultState.defaultVariant.border.defaultVariant.color}}',
        radius: '{{primitives.radius.md}}',
      }),
    font: multiselectBaseStyles.shape.font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    shadow: multiselectBaseStyles.shape.shadow.default('{{primitives.shadow.none}}'),
    paddingX: multiselectBaseStyles.shape.paddingX.default('{{primitives.space.md}}'),
    paddingY: multiselectBaseStyles.shape.paddingY.default('{{primitives.space.md}}'),
    transitionDuration: multiselectBaseStyles.shape.transitionDuration.default('{{primitives.transition.duration}}'),
    focusRing: multiselectBaseStyles.shape.focusRing.default({
      width: '{{primitives.focusRing.width}}',
      style: '{{primitives.focusRing.style}}',
      color: '{{primitives.focusRing.color}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
    }),
    sm: multiselectBaseStyles.shape.sm.default({
      font: {
        size: '{{primitives.font.size}}',
      },
      paddingX: '{{primitives.space.sm}}',
      paddingY: '{{primitives.space.sm}}',
    }),
    lg: multiselectBaseStyles.shape.lg.default({
      font: {
        size: '{{primitives.font.size}}',
      },
      paddingX: '{{primitives.space.lg}}',
      paddingY: '{{primitives.space.lg}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'filledMultiselectStyles' })

// ─── Filled Variant: State Styles via .extend ────────────────────────
export const hoverFilledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.hover.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.state.hover.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'hoverFilledMultiselectStyles' })

export const activeFilledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.active.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.state.active.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.state.active.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'activeFilledMultiselectStyles' })

export const selectedFilledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.selected.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.state.selected.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.state.selected.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'selectedFilledMultiselectStyles' })

export const focusFilledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.focus.defaultVariant.bg}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.state.focus.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.state.focus.defaultVariant.border.defaultVariant.color}}',
      }),
    focusRing: borderWithShadow.optional().default({
      width: '{{primitives.focusRing.width}}',
      style: '{{primitives.focusRing.style}}',
      color: '{{primitives.focusRing.color}}',
      offset: '{{primitives.focusRing.offset}}',
      shadow: '{{primitives.focusRing.shadow}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'focusFilledMultiselectStyles' })

export const disabledFilledMultiselectStyles = multiselectBaseStyles
  .extend({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.state.disabled.defaultVariant.bg}}'),
    color: color.default('{{primitives.variant.primary.state.disabled.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.state.disabled.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.state.disabled.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'disabledFilledMultiselectStyles' })

export const invalidFilledMultiselectStyles = multiselectBaseStyles
  .extend({
    placeholderColor: color.default('{{primitives.variant.primary.state.invalid.defaultVariant.contrast}}'),
    border: z
      .object({
        color: color
          .optional()
          .default('{{primitives.variant.primary.state.invalid.defaultVariant.border.defaultVariant.color}}'),
      })
      .optional()
      .default({
        color: '{{primitives.variant.primary.state.invalid.defaultVariant.border.defaultVariant.color}}',
      }),
  })
  .register(themeSchemaRegistry, { id: 'invalidFilledMultiselectStyles' })

export const filledMultiselectStates = z
  .object({
    hover: hoverFilledMultiselectStyles.optional().default({}),
    active: activeFilledMultiselectStyles.optional().default({}),
    selected: selectedFilledMultiselectStyles.optional().default({}),
    focus: focusFilledMultiselectStyles.optional().default({}),
    disabled: disabledFilledMultiselectStyles.optional().default({}),
    invalid: invalidFilledMultiselectStyles.optional().default({}),
  })
  .register(themeSchemaRegistry, { id: 'filledMultiselectStates' })

export const filledMultiselectStateWithStates = z
  .object({
    defaultState: withDefaultSeverity(filledMultiselectStyles),
    state: (filledMultiselectStates as typeof filledMultiselectStates).optional().default({}),
  })
  .register(themeSchemaRegistry, { id: 'filledMultiselectStateWithStates' })

export const multiselect = z
  .object({
    settings: (multiselectSettings as typeof multiselectSettings).optional(),
    outlined: (outlinedMultiselectStateWithStates as typeof outlinedMultiselectStateWithStates).prefault({}),
    filled: (filledMultiselectStateWithStates as typeof filledMultiselectStateWithStates).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselect' })
