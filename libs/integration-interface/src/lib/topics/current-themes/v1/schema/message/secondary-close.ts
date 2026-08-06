import z from 'zod'
import { themeSchemaRegistry } from '../registry'

export class SecondaryCloseMessageSchema {
  static readonly tokens = {
    width: z.string().default('{{primitives.icon.size.md}}'),
    height: z.string().default('{{primitives.icon.size.md}}'),
  }
  private static readonly defaultInfo = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.defaultState.severity.info.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.defaultState.severity.info.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.defaultState.severity.info.border.color}}'),
        })
        .prefault({}),
      focusRing: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.focus.severity.info.focusRing.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly defaultSuccess = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.defaultState.severity.success.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.defaultState.severity.success.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.defaultState.severity.success.border.color}}'),
        })
        .prefault({}),
      focusRing: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.focus.severity.success.focusRing.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly defaultWarning = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.defaultState.severity.warning.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.defaultState.severity.warning.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.defaultState.severity.warning.border.color}}'),
        })
        .prefault({}),
      focusRing: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.focus.severity.warning.focusRing.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly defaultError = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.defaultState.severity.danger.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.defaultState.severity.danger.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.defaultState.severity.danger.border.color}}'),
        })
        .prefault({}),
      focusRing: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.focus.severity.danger.focusRing.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly defaultContrast = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.defaultState.severity.contrast.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.defaultState.severity.contrast.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.defaultState.severity.contrast.border.color}}'),
        })
        .prefault({}),
      focusRing: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.focus.severity.contrast.focusRing.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly defaultTokensSecondary = {
    info: this.defaultInfo,
    success: this.defaultSuccess,
    warning: this.defaultWarning,
    error: this.defaultError,
    contrast: this.defaultContrast,
  }

  private static readonly hoverInfo = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.state.hover.severity.info.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.state.hover.severity.info.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.hover.severity.info.border.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly hoverSuccess = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.state.hover.severity.success.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.state.hover.severity.success.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.hover.severity.success.border.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly hoverWarning = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.state.hover.severity.warning.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.state.hover.severity.warning.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.hover.severity.warning.border.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly hoverError = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.state.hover.severity.error.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.state.hover.severity.error.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.hover.severity.error.border.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly hoverContrast = z
    .object({
      backgroundColor: z.string().default('{{primitives.variant.secondary.state.hover.severity.contrast.bg.color}}'),
      color: z.string().default('{{primitives.variant.secondary.state.hover.severity.contrast.contrast}}'),
      border: z
        .object({
          color: z.string().default('{{primitives.variant.secondary.state.hover.severity.contrast.border.color}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly hoverTokensSecondary = {
    info: this.hoverInfo,
    success: this.hoverSuccess,
    warning: this.hoverWarning,
    error: this.hoverError,
    contrast: this.hoverContrast,
  }

  static readonly close = z
    .object({
      text: z
        .object({
          ...this.defaultTokensSecondary,
          hover: z
            .object({
              ...this.hoverTokensSecondary,
            })
            .prefault({}),
        })
        .prefault({}),
      outline: z
        .object({
          ...this.defaultTokensSecondary,
          hover: z
            .object({
              ...this.hoverTokensSecondary,
            })
            .prefault({}),
        })
        .prefault({}),
      filled: z
        .object({
          ...this.defaultTokensSecondary,
          hover: z
            .object({
              ...this.hoverTokensSecondary,
            })
            .prefault({}),
        })
        .prefault({}),
    })
    .prefault({})

  static readonly schema = (SecondaryCloseMessageSchema.close as typeof SecondaryCloseMessageSchema.close).register(
    themeSchemaRegistry,
    { id: 'messageCloseButton' }
  )
}
