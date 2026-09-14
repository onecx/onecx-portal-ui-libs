import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class PrimaryMessageSchema {
  static readonly closeIcon = z.object({})

  private static readonly tokensBase = {
    transition: z
      .object({
        duration: withRef(z.number()).default('{{primitives.transition.duration}}'),
      })
      .prefault({}),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: z
      .object({
        size: withRef(z.string()).default('{{primitives.font.size.md}}'),
        weight: withRef(z.string()).default('{{primitives.font.weight.medium}}'),
      })
      .prefault({}),
    icon: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
      })
      .prefault({}),
  }

  private static readonly tokensFilledAndOutlined = {
    ...this.tokensBase,
    border: z
      .object({
        radius: withRef(z.string()).default('{{primitives.radius.md}}'),
        width: withRef(z.string()).default('{{primitives.border.width.md}}'),
      })
      .prefault({}),
    shadow: withRef(z.string()).default('{{primitives.shadow.none}}'),
  }

  private static readonly textInfo = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.info.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.info.contrast}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly textSuccess = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.success.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.success.contrast}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly textWarning = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.warning.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.warning.contrast}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly textError = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.error.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.error.contrast}}'),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly textContrast = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.contrast.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.contrast.contrast}}'),
        })
        .prefault({}),
    })
    .prefault({})

  static readonly severityTokensForText = {
    info: this.textInfo,
    success: this.textSuccess,
    warning: this.textWarning,
    error: this.textError,
    contrast: this.textContrast,
  }

  private static readonly filledInfo = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.info.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.info.contrast}}'),
        })
        .prefault({}),
      backgroundColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.info.bg.color}}'
      ),
      border: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.info.border.color}}'),
        })
        .prefault({}),
      shadowColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.info.shadow.color}}'
      ),
    })
    .prefault({})

  private static readonly filledSuccess = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.success.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.success.contrast}}'),
        })
        .prefault({}),
      backgroundColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.success.bg.color}}'
      ),
      border: z
        .object({
          color: withRef(z.string()).default(
            '{{primitives.variant.primary.defaultState.severity.success.border.color}}'
          ),
        })
        .prefault({}),
      shadowColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.success.shadow.color}}'
      ),
    })
    .prefault({})

  private static readonly filledWarning = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.warning.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.warning.contrast}}'),
        })
        .prefault({}),
      backgroundColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.warning.bg.color}}'
      ),
      border: z
        .object({
          color: withRef(z.string()).default(
            '{{primitives.variant.primary.defaultState.severity.warning.border.color}}'
          ),
        })
        .prefault({}),
      shadowColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.warning.shadow.color}}'
      ),
    })
    .prefault({})

  private static readonly filledError = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.error.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.error.contrast}}'),
        })
        .prefault({}),
      backgroundColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.error.bg.color}}'
      ),
      border: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.error.border.color}}'),
        })
        .prefault({}),
      shadowColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.error.shadow.color}}'
      ),
    })
    .prefault({})

  private static readonly filledContrast = z
    .object({
      color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.contrast.contrast}}'),
      icon: z
        .object({
          color: withRef(z.string()).default('{{primitives.variant.primary.defaultState.severity.contrast.contrast}}'),
        })
        .prefault({}),
      backgroundColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.contrast.bg.color}}'
      ),
      border: z
        .object({
          color: withRef(z.string()).default(
            '{{primitives.variant.primary.defaultState.severity.contrast.border.color}}'
          ),
        })
        .prefault({}),
      shadowColor: withRef(z.string()).default(
        '{{primitives.variant.primary.defaultState.severity.contrast.shadow.color}}'
      ),
    })
    .prefault({})

  static readonly severityTokensForFilled = {
    info: this.filledInfo,
    success: this.filledSuccess,
    warning: this.filledWarning,
    error: this.filledError,
    contrast: this.filledContrast,
  }

  static readonly severityTokens = {
    text: z
      .object({
        ...this.tokensBase,
        ...this.severityTokensForText,
      })
      .prefault({}),
    outline: z
      .object({
        ...this.tokensFilledAndOutlined,
        ...this.severityTokensForFilled,
      })
      .prefault({}),
    filled: z
      .object({
        ...this.tokensFilledAndOutlined,
        ...this.severityTokensForFilled,
      })
      .prefault({}),
  }
  static readonly schema = z
    .object({
      ...this.severityTokens,
    })
    .prefault({})
    .register(themeSchemaRegistry, { id: 'primaryMessage' })
}
