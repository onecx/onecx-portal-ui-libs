import z from 'zod'
import { themeSchemaRegistry } from './registry'
import { borderWithShadow, withRef } from './primitives'

const settings = z.object({
  closable: z.boolean().default(false),
  delay: z.number().default(300),
  showMultiple: z.boolean().default(true),
})

const container = z.object({
  border: z.object({
    radius: withRef(z.string()).default('{{primitives.radius.md}}').optional(),
    width: withRef(z.string()).default('{{primitives.border.width.md}}').optional(),
  }),
  transition: z
    .object({
      duration: withRef(z.number()).default('{{primitives.transition.duration}}').optional(),
    })
    .optional(),
})

const smPadding = z
  .object({
    padding: withRef(z.string()).default('{{primitives.space.sm}}').optional(),
  })
  .optional()

const lgPadding = z
  .object({
    padding: withRef(z.string()).default('{{primitives.space.lg}}').optional(),
  })
  .optional()

const content = z.object({
  padding: withRef(z.string()).default('{{primitives.space.md}}').optional(),
  gap: withRef(z.string()).default('{{primitives.space.md}}').optional(),
  sm: smPadding,
  lg: lgPadding,
})

const smFont = z
  .object({
    font: z
      .object({
        size: withRef(z.string()).default('{{primitives.font.size}}').optional(),
      })
      .optional(),
  })
  .optional()

const lgFont = z
  .object({
    font: z
      .object({
        size: withRef(z.string()).default('{{primitives.font.size}}').optional(),
      })
      .optional(),
  })
  .optional()

const text = z
  .object({
    font: z
      .object({
        size: withRef(z.string()).default('{{primitives.font.size}}').optional(),
        weight: withRef(z.string()).default('{{primitives.font.weight}}').optional(),
      })
      .optional(),
    sm: smFont,
    lg: lgFont,
  })
  .optional()

const iconBase = z.object({
  size: withRef(z.string()).default('1rem').optional(),
  sm: z.object({
    size: withRef(z.string()).default('0.875rem').optional(),
  }),
  lg: z.object({
    size: withRef(z.string()).default('1.125rem').optional(),
  }),
})

const icon = iconBase.optional()

const close = z
  .object({
    button: z
      .object({
        width: withRef(z.string()).default('1.75rem').optional(),
        height: withRef(z.string()).default('1.75rem').optional(),
        border: z
          .object({
            radius: withRef(z.string()).default('{{primitives.radius.md}}').optional(),
          })
          .optional(),
        icon: icon,
        focus: z.object({
          focusRing: borderWithShadow.optional().default({
            width: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.width}}',
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
            shadow: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}',
            style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
            offset: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.offset}}',
          }),
        }),
      })
      .optional(),
  })
  .optional()

const outlined = z
  .object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.info.contrast}}').optional(),
    border: z
      .object({
        color: withRef(z.string())
          .default('{{primitives.defaultVariant.defaultState.severity.info.border.color}}')
          .optional(),
        width: withRef(z.string())
          .default('{{primitives.defaultVariant.defaultState.severity.info.border.width}}')
          .optional(),
      })
      .optional(),
  })
  .optional()

const simple = z
  .object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.info.contrast}}').optional(),
    content: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.md}}').optional(),
      })
      .optional(),
  })
  .optional()

const infoSimple = z
  .object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.info.contrast}}').optional(),
  })
  .optional()

const closeWithInfo = z.object({
  button: z
    .object({
      hover: z
        .object({
          background: z.object({
            color: withRef(z.string())
              .default('{{primitives.defaultVariant.state.hover.severity.info.bg.color}}')
              .optional(),
          }),
        })
        .optional(),
      focus: z.object({
        focusRing: borderWithShadow.optional().default({
          width: '{{primitives.defaultVariant.state.focus.severity.info.focusRing.width}}',
          color: '{{primitives.defaultVariant.state.focus.severity.info.focusRing.color}}',
          shadow: '{{primitives.defaultVariant.state.focus.severity.info.focusRing.shadow}}',
          style: '{{primitives.defaultVariant.state.focus.severity.info.focusRing.style}}',
          offset: '{{primitives.defaultVariant.state.focus.severity.info.focusRing.offset}}',
        }),
      }),
    })
    .optional(),
})

const info = z
  .object({
    background: z.object({
      color: withRef(z.string())
        .default('{{primitives.defaultVariant.defaultState.severity.info.bg.color}}')
        .optional(),
    }),
    border: borderWithShadow
      .default({
        width: '{{primitives.defaultVariant.defaultState.severity.info.border.width}}',
        color: '{{primitives.defaultVariant.defaultState.severity.info.border.color}}',
        offset: '{{primitives.defaultVariant.defaultState.severity.info.border.offset}}',
        style: '{{primitives.defaultVariant.defaultState.severity.info.border.style}}',
        shadow: '{{primitives.defaultVariant.defaultState.severity.info.focusRing.shadow}}',
      })
      .optional(),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.info.contrast}}').optional(),
    close: closeWithInfo.optional(),
    simple: infoSimple,
    outlined: z.object({
      color: withRef(z.string())
        .default('{{primitives.defaultVariant.defaultState.severity.info.contrast}}')
        .optional(),
      border: z
        .object({
          color: withRef(z.string())
            .default('{{primitives.defaultVariant.defaultState.severity.info.border.color}}')
            .optional(),
        })
        .optional(),
    }),
  })
  .optional()

const successCloseButton = z
  .object({
    button: z.object({
      hover: z
        .object({
          background: z.object({
            color: withRef(z.string())
              .default('{{primitives.defaultVariant.state.hover.severity.success.bg.color}}')
              .optional(),
          }),
        })
        .optional(),
      focus: z
        .object({
          focusRing: borderWithShadow.optional().default({
            width: '{{primitives.defaultVariant.state.focus.severity.success.focusRing.width}}',
            color: '{{primitives.defaultVariant.state.focus.severity.success.focusRing.color}}',
            shadow: '{{primitives.defaultVariant.state.focus.severity.success.focusRing.shadow}}',
            style: '{{primitives.defaultVariant.state.focus.severity.success.focusRing.style}}',
            offset: '{{primitives.defaultVariant.state.focus.severity.success.focusRing.offset}}',
          }),
        })
        .optional(),
    }),
  })
  .optional()

const success = z
  .object({
    background: z.object({
      color: withRef(z.string())
        .default('{{primitives.defaultVariant.defaultState.severity.success.bg.color}}')
        .optional(),
    }),
    border: borderWithShadow.optional().default({
      width: '{{primitives.defaultVariant.defaultState.severity.success.border.width}}',
      color: '{{primitives.defaultVariant.defaultState.severity.success.border.color}}',
      offset: '{{primitives.defaultVariant.defaultState.severity.success.border.offset}}',
      style: '{{primitives.defaultVariant.defaultState.severity.success.border.style}}',
      shadow: '{{primitives.defaultVariant.defaultState.severity.success.focusRing.shadow}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.success.contrast}}'),
    close: successCloseButton,
    outlined: z.object({
      color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.success.contrast}}'),
      border: z
        .object({
          color: withRef(z.string()).default(
            '{{primitives.defaultVariant.defaultState.severity.success.border.color}}'
          ),
        })
        .optional(),
    }),
    simple: z.object({
      color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.success.contrast}}'),
    }),
  })
  .optional()

const warning = z.object({
  background: z.object({
    color: withRef(z.string())
      .default('{{primitives.defaultVariant.defaultState.severity.warning.bg.color}}')
      .optional(),
  }),
  color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.warning.contrast}}'),
  border: borderWithShadow
    .default({
      width: '{{primitives.defaultVariant.defaultState.severity.warning.border.width}}',
      color: '{{primitives.defaultVariant.defaultState.severity.warning.border.color}}',
      offset: '{{primitives.defaultVariant.defaultState.severity.warning.border.offset}}',
      style: '{{primitives.defaultVariant.defaultState.severity.warning.border.style}}',
      shadow: '{{primitives.defaultVariant.defaultState.severity.warning.focusRing.shadow}}',
    })
    .optional(),
  close: z.object({
    width: withRef(z.string()).default('1.75rem').optional(),
    height: withRef(z.string()).default('1.75rem').optional(),
    button: z.object({
      hover: z.object({
        background: z.object({
          color: withRef(z.string())
            .default('{{primitives.defaultVariant.state.hover.severity.warning.bg.color}}')
            .optional(),
        }),
      }),
      focus: z.object({
        focusRing: borderWithShadow.optional().default({
          width: '{{primitives.defaultVariant.state.focus.severity.warning.focusRing.width}}',
          color: '{{primitives.defaultVariant.state.focus.severity.warning.focusRing.color}}',
          shadow: '{{primitives.defaultVariant.state.focus.severity.warning.focusRing.shadow}}',
          style: '{{primitives.defaultVariant.state.focus.severity.warning.focusRing.style}}',
          offset: '{{primitives.defaultVariant.state.focus.severity.warning.focusRing.offset}}',
        }),
      }),
    }),
  }),
  outlined: z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.warning.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.warning.border.color}}'),
      })
      .optional(),
  }),
  simple: z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.warning.contrast}}'),
  }),
})

const error = z.object({
  background: z.object({
    color: withRef(z.string())
      .default('{{primitives.defaultVariant.defaultState.severity.danger.bg.color}}')
      .optional(),
  }),
  color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.danger.contrast}}'),
  border: borderWithShadow
    .default({
      width: '{{primitives.defaultVariant.defaultState.severity.danger.border.width}}',
      color: '{{primitives.defaultVariant.defaultState.severity.danger.border.color}}',
      offset: '{{primitives.defaultVariant.defaultState.severity.danger.border.offset}}',
      style: '{{primitives.defaultVariant.defaultState.severity.danger.border.style}}',
      shadow: '{{primitives.defaultVariant.defaultState.severity.danger.focusRing.shadow}}',
    })
    .optional(),
  close: z.object({
    width: withRef(z.string()).default('1.75rem').optional(),
    height: withRef(z.string()).default('1.75rem').optional(),
    button: z.object({
      hover: z.object({
        background: z.object({
          color: withRef(z.string())
            .default('{{primitives.defaultVariant.state.hover.severity.danger.bg.color}}')
            .optional(),
        }),
      }),
      focus: z.object({
        focusRing: borderWithShadow.optional().default({
          width: '{{primitives.defaultVariant.state.focus.severity.danger.focusRing.width}}',
          color: '{{primitives.defaultVariant.state.focus.severity.danger.focusRing.color}}',
          shadow: '{{primitives.defaultVariant.state.focus.severity.danger.focusRing.shadow}}',
          style: '{{primitives.defaultVariant.state.focus.severity.danger.focusRing.style}}',
          offset: '{{primitives.defaultVariant.state.focus.severity.danger.focusRing.offset}}',
        }),
      }),
    }),
  }),
  outlined: z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.danger.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.danger.border.color}}'),
      })
      .optional(),
  }),
  simple: z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.danger.contrast}}'),
  }),
})

const secondary = z.object({
  background: z.object({
    color: withRef(z.string())
      .default('{{primitives.variant.secondary.defaultState.defaultSeverity.bg.color}}')
      .optional(),
  }),
  color: withRef(z.string()).default('{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}'),
  border: borderWithShadow
    .default({
      width: '{{primitives.variant.secondary.defaultState.defaultSeverity.border.width}}',
      color: '{{primitives.variant.secondary.defaultState.defaultSeverity.border.color}}',
      offset: '{{primitives.variant.secondary.defaultState.defaultSeverity.border.offset}}',
      style: '{{primitives.variant.secondary.defaultState.defaultSeverity.border.style}}',
      shadow: '{{primitives.variant.secondary.defaultState.defaultSeverity.focusRing.shadow}}',
    })
    .optional(),
  shadow: z.object({
    color: withRef(z.string())
      .default('{{primitives.variant.secondary.defaultState.defaultSeverity.shadow.color}}')
      .optional(),
  }),
  close: z.object({
    width: withRef(z.string()).default('1.75rem').optional(),
    height: withRef(z.string()).default('1.75rem').optional(),
    button: z.object({
      hover: z.object({
        background: z.object({
          color: withRef(z.string())
            .default('{{primitives.variant.secondary.state.hover.defaultSeverity.bg.color}}')
            .optional(),
        }),
      }),
      focus: z.object({
        focusRing: borderWithShadow.optional().default({
          width: '{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.width}}',
          color: '{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.color}}',
          shadow: '{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.shadow}}',
          style: '{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.style}}',
          offset: '{{primitives.variant.secondary.state.focus.defaultSeverity.focusRing.offset}}',
        }),
      }),
    }),
  }),
  outlined: z.object({
    color: withRef(z.string()).default('{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default(
          '{{primitives.variant.secondary.defaultState.defaultSeverity.border.color}}'
        ),
      })
      .optional(),
  }),
  simple: z.object({
    color: withRef(z.string()).default('{{primitives.variant.secondary.defaultState.defaultSeverity.contrast}}'),
  }),
})

const contrast = z.object({
  background: z.object({
    color: withRef(z.string())
      .default('{{primitives.defaultVariant.defaultState.severity.contrast.bg.color}}')
      .optional(),
  }),
  color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.contrast.contrast}}'),
  border: borderWithShadow
    .default({
      width: '{{primitives.defaultVariant.defaultState.severity.contrast.border.width}}',
      color: '{{primitives.defaultVariant.defaultState.severity.contrast.border.color}}',
      offset: '{{primitives.defaultVariant.defaultState.severity.contrast.border.offset}}',
      style: '{{primitives.defaultVariant.defaultState.severity.contrast.border.style}}',
      shadow: '{{primitives.defaultVariant.defaultState.severity.contrast.focusRing.shadow}}',
    })
    .optional(),
  close: z.object({
    width: withRef(z.string()).default('1.75rem').optional(),
    height: withRef(z.string()).default('1.75rem').optional(),
    button: z.object({
      hover: z.object({
        background: z.object({
          color: withRef(z.string())
            .default('{{primitives.defaultVariant.state.hover.severity.contrast.bg.color}}')
            .optional(),
        }),
      }),
      focus: z.object({
        focusRing: borderWithShadow.optional().default({
          width: '{{primitives.defaultVariant.state.focus.severity.contrast.focusRing.width}}',
          color: '{{primitives.defaultVariant.state.focus.severity.contrast.focusRing.color}}',
          shadow: '{{primitives.defaultVariant.state.focus.severity.contrast.focusRing.shadow}}',
          style: '{{primitives.defaultVariant.state.focus.severity.contrast.focusRing.style}}',
          offset: '{{primitives.defaultVariant.state.focus.severity.contrast.focusRing.offset}}',
        }),
      }),
    }),
  }),
  outlined: z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.contrast.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.contrast.border.color}}'),
      })
      .optional(),
  }),
  simple: z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.severity.contrast.contrast}}'),
  }),
})

export const message = z
  .object({
    settings: settings.optional(),
    root: container,
    content,
    text,
    icon,
    close,
    simple,
    outlined,
    info,
    success,
    warning,
    error,
    secondary,
    contrast,
  })
  .register(themeSchemaRegistry, { id: 'message' })
