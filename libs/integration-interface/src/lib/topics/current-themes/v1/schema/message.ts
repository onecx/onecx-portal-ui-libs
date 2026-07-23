import z from 'zod'
import { themeSchemaRegistry } from './registry'
import { bg, border, borderWithShadow, color, font, withRef } from './primitives'

const DEFAULT_PADDING = '{{primitives.space.sm}}'
const DEFAULT_TEXT_COLOR = '{{primitives.defaultVariant.defaultState.variant.info.contrast}}'
const DEFAULT_FONT = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

const settings = z.object({
  closable: z.boolean().default(false),
  delay: z.number().default(300),
  showMultiple: z.boolean().default(true),
})

const closeButtonVariables = z.object({
  contrast: withRef(z.string()).optional(),
  bg: withRef(z.string()).optional(),
})

const closeButtonWithSeverity = z.object({
  defaultSeverity: z.object({}),
  severity: z.object({
    success: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.success.contrast}}',
      bg: '{{}}primitives.defaultVariant.defaultState.variant.success.bg}}',
    }),
    info: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.info.contrast}}',
      bg: '{{primitives.defaultVariant.defaultState.variant.info.bg}}',
    }),
    warn: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.warning.contrast}}',
      bg: '{{primitives.defaultVariant.defaultState.variant.warning.bg}}',
    }),
    danger: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.danger.contrast}}',
      bg: '{{primitives.defaultVariant.defaultState.variant.danger.bg}}',
    }),
    contrast: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.contrast.contrast}}',
      bg: '{{primitives.defaultVariant.defaultState.variant.contrast.bg}}',
    }),
    error: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
      bg: '{{primitives.defaultVariant.defaultState.variant.error.bg}}',
    }),
    secondary: closeButtonVariables.default({
      contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
      bg: '{{primitives.defaultVariant.defaultState.variant.error.bg}}',
    }),
  }),
})

const closeButton = z.object({
  defaultState: closeButtonWithSeverity.optional(),
  state: z.object({
    hover: closeButtonWithSeverity.optional(),
    focus: closeButtonWithSeverity
      .extend({
        focusRing: borderWithShadow.optional(),
      })
      .optional(),
    active: closeButtonWithSeverity
      .extend({
        focusRing: borderWithShadow.optional(),
      })
      .optional(),
  }),
})

const icon = z.object({
  color: color.optional().default(DEFAULT_TEXT_COLOR).optional(),
  name: withRef(z.string()).optional(),
  padding: withRef(z.string()).default(DEFAULT_PADDING).optional(),
})

const img = z.object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  src: withRef(z.string()).optional(),
  objectFit: withRef(z.string()).optional(),
  padding: withRef(z.string()).default(DEFAULT_PADDING).optional(),
})

const messageSizeBase = z.object({
  font: font.optional(),
  padding: withRef(z.string()),
  gap: withRef(z.string()),
  iconSize: withRef(z.string()),
})

const messageSizeVariants = z.object({
  defaultSize: messageSizeBase
    .default({
      font: DEFAULT_FONT,
      padding: '{{primitives.space.md}}',
      gap: '{{primitives.space.md}}',
      iconSize: 'md',
    })
    .optional(),
  size: z.object({
    sm: messageSizeBase
      .default({
        font: DEFAULT_FONT,
        padding: '{{primitives.space.sm}}',
        gap: '{{primitives.space.sm}}',
        iconSize: 'sm',
      })
      .optional(),
    md: messageSizeBase
      .default({
        font: DEFAULT_FONT,
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        iconSize: 'md',
      })
      .optional(),
    lg: messageSizeBase
      .default({
        font: DEFAULT_FONT,
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        iconSize: 'md',
      })
      .optional(),
  }),
})

const withTextLeafBase = z.object({
  font: font.optional(),
  icon: icon.optional(),
  img: img.optional(),
  closeButton: closeButton.optional(),
  sizeVariants: messageSizeVariants.optional(),
})

const withTextLeafVariable = withTextLeafBase.extend({
  contrast: color.optional(),
})

const withText = z.object({
  defaultState: z.object({
    defaultSeverity: withTextLeafVariable.optional(),
    severity: z.object({
      success: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.success.contrast}}',
      }),
      info: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.info.contrast}}',
      }),
      warn: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.warning.contrast}}',
      }),
      danger: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.danger.contrast}}',
      }),
      contrast: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.contrast.contrast}}',
      }),
      error: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
      }),
      secondary: withTextLeafVariable.default({
        font: DEFAULT_FONT,
        contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
      }),
    }),
  }),
})

const withOutlineLeafBase = z.object({
  font: font.optional(),
  icon: icon.optional(),
  img: img.optional(),
  border: border.optional(),
  closeButton: closeButton.optional(),
  sizeVariants: messageSizeVariants.optional(),
})

const withOutlineLeafVariable = withOutlineLeafBase.extend({
  contrast: color.optional(),
  borderColor: color.optional(),
})

const withOutline = z
  .object({
    defaultState: z.object({
      defaultSeverity: withOutlineLeafVariable.default({
        contrast: '{{primitives.defaultVariant.defaultState.variant.info.contrast}}',
        borderColor: '{{primitives.defaultVariant.defaultState.variant.info.border.variant.info.color}}',
      }),
      severity: z.object({
        success: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.success.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.success.border.variant.success.color}}',
        }),
        info: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.info.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.info.border.variant.info.color}}',
        }),
        warn: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.warning.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.warning.border.variant.warning.color}}',
        }),
        danger: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.danger.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.danger.border.variant.danger.color}}',
        }),
        contrast: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.contrast.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.contrast.border.variant.contrast.color}}',
        }),
        error: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.error.border.variant.error.color}}',
        }),
        secondary: withOutlineLeafVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.error.border.variant.error.color}}',
        }),
      }),
    }),
  })
  .optional()

const withOutLineFilledBase = z.object({
  font: font.optional(),
  icon: icon.optional(),
  img: img.optional(),
  border: border.optional(),
  closeButton: closeButton.optional(),
  sizeVariants: messageSizeVariants.optional(),
})

const withOutLineFilledVariable = withOutLineFilledBase.extend({
  contrast: color.optional(),
  borderColor: color.optional(),
  bg: z.union([bg, withRef(z.string())]),
})

const withOutlineFilled = z
  .object({
    defaultState: z.object({
      defaultSeverity: withOutLineFilledVariable.optional(),
      severity: z.object({
        success: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.success.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.success.border.variant.success.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.success.bg}}',
        }),
        info: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.info.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.info.border.variant.info.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.info.bg}}',
        }),
        warn: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.warning.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.warning.border.variant.warning.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.warning.bg}}',
        }),
        danger: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.danger.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.danger.border.variant.danger.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.danger.bg}}',
        }),
        contrast: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.contrast.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.contrast.border.variant.contrast.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.contrast.bg}}',
        }),
        error: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.error.border.variant.error.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.error.bg}}',
        }),
        secondary: withOutLineFilledVariable.default({
          contrast: '{{primitives.defaultVariant.defaultState.variant.error.contrast}}',
          borderColor: '{{primitives.defaultVariant.defaultState.variant.error.border.variant.error.color}}',
          bg: '{{primitives.defaultVariant.defaultState.variant.error.bg}}',
        }),
      }),
    }),
  })
  .optional()

export const message = z
  .object({
    settings: (settings as typeof settings).optional(),
    defaultVariant: withOutlineFilled.optional(),
    variants: z
      .object({
        withText: withText.optional(),
        withOutline: withOutline.optional(),
        withOutLineFilled: withOutlineFilled.optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'message' })
