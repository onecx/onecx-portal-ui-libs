import z from 'zod'
import { themeSchemaRegistry } from './registry'
import { bg, borderWithShadow, color, font, withRef } from './primitives'

const DEFAULT_VALUES = {
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
    lineHeight: '{{primitives.font.lineHeight}}',
    letterSpacing: '{{primitives.font.letterSpacing}}',
    style: '{{primitives.font.style}}',
  },
  textColor: {
    default: '{{primitives.defaultVariant.defaultState.defaultVariant.contrast}}',
    focus: '{{primitives.defaultVariant.focusState.defaultVariant.contrast}}',
    hover: '{{primitives.defaultVariant.hoverState.defaultVariant.contrast}}',
    active: '{{primitives.defaultVariant.activeState.defaultVariant.contrast}}',
    disabled: '{{primitives.defaultVariant.disabledState.defaultVariant.contrast}}',
  },
  borderColor: {
    default: '{{primitives.defaultVariant.defaultState.defaultVariant.border.defaultVariant.color}}',
    focus: '{{primitives.defaultVariant.focusState.defaultVariant.border.defaultVariant.color}}',
    hover: '{{primitives.defaultVariant.hoverState.defaultVariant.border.defaultVariant.color}}',
    active: '{{primitives.defaultVariant.activeState.defaultVariant.border.defaultVariant.color}}',
    disabled: '{{primitives.defaultVariant.disabledState.defaultVariant.border.defaultVariant.color}}',
  },
  bg: {
    default: '{{primitives.defaultVariant.defaultState.defaultVariant.bg}}',
    focus: '{{primitives.defaultVariant.focusState.defaultVariant.bg}}',
    hover: '{{primitives.defaultVariant.hoverState.defaultVariant.bg}}',
    active: '{{primitives.defaultVariant.activeState.defaultVariant.bg}}',
    disabled: '{{primitives.defaultVariant.disabledState.defaultVariant.bg}}',
  },
  focusRing: {
    color: '{{primitives.defaultVariant.focusState.defaultVariant.border.defaultVariant.color}}',
    width: '{{primitives.defaultVariant.focusState.defaultVariant.border.defaultVariant.width}}',
    style: '{{primitives.defaultVariant.focusState.defaultVariant.border.defaultVariant.style}}',
    shadow: '{{primitives.defaultVariant.focusState.defaultVariant.shadow}}',
  },
  padding: '{{primitives.space.sm}}',
}

const settings = z.object({
  toggleable: z.boolean().default(true),
  collapsed: z.boolean().default(true),
})

const icon = z.object({
  color: color.optional().default(DEFAULT_VALUES.textColor.default).optional(),
  size: withRef(z.enum(['xs', 'sm', 'md', 'lg', 'xl']))
    .default('sm')
    .optional(),
  name: withRef(z.string()).default('chevron-down').optional(),
  padding: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
})

const img = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  src: withRef(z.string()).optional(),
  objectFit: withRef(z.string()).optional(),
  padding: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
})
const legendDefault = z.object({
  font: font.default({
    ...DEFAULT_VALUES.font,
  }),
  color: color.optional().default(DEFAULT_VALUES.textColor.default),
  padding: withRef(z.string()).default(DEFAULT_VALUES.padding),
  img: img.optional(),
  icon: icon.optional(),
})

const containerDefault = z.object({
  bg: z.union([bg, withRef(z.string())]).default(DEFAULT_VALUES.bg.default),
  contrast: color.optional().default(DEFAULT_VALUES.textColor.default),
  border: z
    .object({
      color: color.optional().default(DEFAULT_VALUES.borderColor.default),
      radius: withRef(z.string()).optional().default('{{primitives.radius.md}}'),
    })
    .optional(),
  padding: withRef(z.string()).default(DEFAULT_VALUES.padding),
  gap: withRef(z.string()).default(DEFAULT_VALUES.padding),
  transitionDuration: withRef(z.string()).default('{{primitives.transition.duration}}'),
  font: font.default({
    ...DEFAULT_VALUES.font,
  }),
})

const contentDefault = z.object({
  font: font.default({
    ...DEFAULT_VALUES.font,
  }),
  color: color.optional().default(DEFAULT_VALUES.textColor.default),
  padding: withRef(z.string()).default(DEFAULT_VALUES.padding),
})

const fieldsetDefault = z.object({
  container: z.object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: containerDefault.optional(),
      }),
    }),
  }),
  legend: z.object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: legendDefault.optional(),
      }),
    }),
  }),
  content: z.object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: contentDefault.optional(),
      }),
    }),
  }),
})

const defaultVariant = z.object({
  defaultState: z.object({
    defaultSeverity: fieldsetDefault,
  }),
})

const text = z.object({
  font: font.default({
    ...DEFAULT_VALUES.font,
  }),
  padding: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
})

const focusRing = borderWithShadow.optional().default({
  color: DEFAULT_VALUES.focusRing.color,
  width: DEFAULT_VALUES.focusRing.width,
  style: DEFAULT_VALUES.focusRing.style,
  shadow: DEFAULT_VALUES.focusRing.shadow,
})

const withImgAndTextBase = z.object({
  img: img.optional(),
  text: text.optional(),
  gap: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
})

const withImgAndText = z.object({
  defaultState: z.object({
    defaultSeverity: withImgAndTextBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.default).optional(),
    }),
  }),
  state: z.object({
    hover: z.object({
      defaultSeverity: withImgAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.hover).optional(),
      }),
    }),
    focus: z.object({
      defaultSeverity: withImgAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.focus).optional(),
        focusRing: focusRing.optional(),
      }),
    }),
    active: z.object({
      defaultSeverity: withImgAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.active).optional(),
        focusRing: focusRing.optional(),
      }),
    }),
    disabled: z.object({
      defaultSeverity: withImgAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.disabled).optional(),
        focusRing: focusRing.optional(),
        opacity: withRef(z.number())
          .default('{{primitives.defaultVariant.disabledState.defaultVariant.opacity}}')
          .optional(),
      }),
    }),
  }),
})

const withIconAndTextBase = z.object({
  icon: icon.optional(),
  text: text.optional(),
  gap: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
  cursor: withRef(z.string()).optional(),
})

const withIconAndText = z.object({
  defaultState: z.object({
    defaultSeverity: withIconAndTextBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.default).optional(),
    }),
  }),
  state: z.object({
    hover: z.object({
      defaultSeverity: withIconAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.hover).optional(),
      }),
    }),
    focus: z.object({
      defaultSeverity: withIconAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.focus).optional(),
        focusRing: focusRing.optional(),
      }),
    }),
    active: z.object({
      defaultSeverity: withIconAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.active).optional(),
        focusRing: focusRing.optional(),
      }),
    }),
    disabled: z.object({
      defaultSeverity: withIconAndTextBase.extend({
        color: color.default(DEFAULT_VALUES.textColor.disabled).optional(),
        focusRing: focusRing.optional(),
        opacity: withRef(z.number())
          .default('{{primitives.defaultVariant.disabledState.defaultVariant.opacity}}')
          .optional(),
        cursor: withRef(z.string()).default('not-allowed').optional(),
      }),
    }),
  }),
})

const withImgButtonBase = z.object({
  img: img.optional(),
  text: text.optional(),
  gap: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
  cursor: withRef(z.string()).optional(),
})

const withImgAndButton = z.object({
  defaultState: z.object({
    defaultSeverity: withImgButtonBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.default).optional(),
      borderColor: color.default(DEFAULT_VALUES.borderColor.default).optional(),
      bg: z
        .union([bg, withRef(z.string())])
        .default(DEFAULT_VALUES.bg.default)
        .optional(),
    }),
  }),
  state: z.object({
    hover: z.object({
      defaultSeverity: withImgButtonBase.extend({
        color: color.optional().default(DEFAULT_VALUES.textColor.hover).optional(),
        borderColor: color.default(DEFAULT_VALUES.borderColor.hover).optional(),
        bg: z
          .union([bg, withRef(z.string())])
          .default(DEFAULT_VALUES.bg.hover)
          .optional(),
      }),
    }),
    focus: withImgButtonBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.focus).optional(),
      borderColor: color.default(DEFAULT_VALUES.borderColor.focus).optional(),
      bg: z
        .union([bg, withRef(z.string())])
        .default(DEFAULT_VALUES.bg.focus)
        .optional(),
      focusRing: focusRing.optional(),
    }),
    active: withImgButtonBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.active).optional(),
      borderColor: color.default(DEFAULT_VALUES.borderColor.active).optional(),
      bg: z
        .union([bg, withRef(z.string())])
        .default(DEFAULT_VALUES.bg.active)
        .optional(),
      focusRing: focusRing.optional(),
    }),
    disabled: withImgButtonBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.disabled).optional(),
      borderColor: color.default(DEFAULT_VALUES.borderColor.disabled).optional(),
      bg: z
        .union([bg, withRef(z.string())])
        .default(DEFAULT_VALUES.bg.disabled)
        .optional(),
      focusRing: focusRing.optional(),
      opacity: withRef(z.number())
        .default('{{primitives.defaultVariant.disabledState.defaultVariant.opacity}}')
        .optional(),
      cursor: withRef(z.string()).default('not-allowed').optional(),
    }),
  }),
})

const withIconButtonBase = z.object({
  icon: icon.optional(),
  text: text.optional(),
  gap: withRef(z.string()).default(DEFAULT_VALUES.padding).optional(),
  cursor: withRef(z.string()).optional(),
})

const withIconAndButton = z.object({
  defaultState: z.object({
    defaultSeverity: withIconButtonBase.extend({
      color: color.optional().default(DEFAULT_VALUES.textColor.default).optional(),
      borderColor: color.default(DEFAULT_VALUES.borderColor.default).optional(),
      bg: z
        .union([bg, withRef(z.string())])
        .default(DEFAULT_VALUES.bg.default)
        .optional(),
    }),
  }),
  state: z.object({
    hover: z.object({
      defaultSeverity: withIconButtonBase.extend({
        color: color.optional().default(DEFAULT_VALUES.textColor.hover).optional(),
        borderColor: color.default(DEFAULT_VALUES.borderColor.hover).optional(),
        bg: z
          .union([bg, withRef(z.string())])
          .default(DEFAULT_VALUES.bg.hover)
          .optional(),
      }),
    }),
    focus: z.object({
      defaultSeverity: withIconButtonBase.extend({
        color: color.optional().default(DEFAULT_VALUES.textColor.focus).optional(),
        borderColor: color.default(DEFAULT_VALUES.borderColor.focus).optional(),
        bg: z
          .union([bg, withRef(z.string())])
          .default(DEFAULT_VALUES.bg.focus)
          .optional(),
        focusRing,
      }),
    }),
    active: z.object({
      defaultSeverity: withIconButtonBase.extend({
        color: color.optional().default(DEFAULT_VALUES.textColor.active).optional(),
        borderColor: color.default(DEFAULT_VALUES.borderColor.active).optional(),
        bg: z
          .union([bg, withRef(z.string())])
          .default(DEFAULT_VALUES.bg.active)
          .optional(),
        focusRing: focusRing.optional(),
      }),
    }),
    disabled: z.object({
      defaultSeverity: withIconButtonBase.extend({
        color: color.optional().default(DEFAULT_VALUES.textColor.disabled).optional(),
        borderColor: color.default(DEFAULT_VALUES.borderColor.disabled).optional(),
        bg: z
          .union([bg, withRef(z.string())])
          .default(DEFAULT_VALUES.bg.disabled)
          .optional(),
        focusRing: focusRing.optional(),
        opacity: withRef(z.number())
          .default('{{primitives.defaultVariant.disabledState.defaultVariant.opacity}}')
          .optional(),
        cursor: withRef(z.string()).default('not-allowed').optional(),
      }),
    }),
  }),
})

const withToggleDefaultSeverity = z.object({
  legend: z.object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: legendDefault.optional(),
      }),
      state: z.object({
        hover: z.object({
          defaultSeverity: z.object({
            color: color.default('{{primitives.defaultVariant.hoverState.defaultVariant.contrast}}').optional(),
          }),
        }),
        focus: z.object({
          defaultSeverity: z.object({
            color: color.default('{{primitives.defaultVariant.focusState.defaultVariant.contrast}}').optional(),
            focusRing: focusRing.optional(),
          }),
        }),
        active: z.object({
          defaultSeverity: z.object({
            color: color.default('{{primitives.defaultVariant.activeState.defaultVariant.contrast}}').optional(),
            focusRing: focusRing.optional(),
          }),
        }),
        disabled: z.object({
          defaultSeverity: z.object({
            color: color.default('{{primitives.defaultVariant.disabledState.defaultVariant.contrast}}').optional(),
            opacity: withRef(z.string())
              .default('{{primitives.defaultVariant.disabledState.defaultVariant.opacity}}')
              .optional(),
            cursor: withRef(z.string()).default('not-allowed').optional(),
          }),
        }),
      }),
    }),
    withImgAndText,
    withIconAndText,
    withImgAndButton,
    withIconAndButton,
  }),
  container: z.object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: containerDefault.optional(),
      }),
    }),
  }),
  content: z.object({
    defaultVariant: z.object({
      defaultState: z.object({
        defaultSeverity: contentDefault.optional(),
      }),
    }),
  }),
})

const withToggle = z.object({
  defaultState: z.object({
    defaultSeverity: withToggleDefaultSeverity,
  }),
  state: z.object({
    expanded: z.object({
      defaultSeverity: withToggleDefaultSeverity,
    }),
    collapsed: z.object({
      defaultSeverity: withToggleDefaultSeverity,
    }),
  }),
})

export const fieldset = z
  .object({
    settings: settings.optional(),
    defaultVariant: defaultVariant.optional(),
    variant: z
      .object({
        withToggle,
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldset' })
