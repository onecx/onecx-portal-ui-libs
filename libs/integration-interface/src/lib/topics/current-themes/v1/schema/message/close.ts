import z from 'zod'
import { withRef } from '../primitives'

const variableBasePrimary = z
  .object({
    default: z.object({}).optional(),
    info: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.defaultState.severity.info.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.primary.defaultState.severity.info.contrast}}').optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.info.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.primary.state.hover.severity.info.contrast}}').optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.info.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.primary.state.focus.severity.info.contrast}}').optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.info.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.info.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    success: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.defaultState.severity.success.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.success.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.success.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.success.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.success.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.success.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.success.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.success.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    warning: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.defaultState.severity.warning.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.warning.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.warning.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.warning.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.warning.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.warning.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.warning.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.warning.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    error: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.defaultState.severity.danger.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.primary.state.hover.severity.danger.contrast}}').optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.danger.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.primary.state.hover.severity.danger.contrast}}').optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.danger.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.primary.state.focus.severity.danger.contrast}}').optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.danger.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.danger.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    contrast: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.defaultState.severity.contrast.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.contrast.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.contrast.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.hover.severity.contrast.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.contrast.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.primary.state.focus.severity.contrast.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.contrast.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.primary.state.focus.severity.contrast.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional()

const variableBaseSecondary = z
  .object({
    default: z.object({}).optional(),
    info: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.defaultState.severity.info.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.secondary.state.hover.severity.info.contrast}}').optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.info.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.secondary.state.hover.severity.info.contrast}}').optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.info.bg.color}}')
              .optional(),
            color: z.string().default('{{primitives.variant.secondary.state.focus.severity.info.contrast}}').optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.info.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.info.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    success: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.defaultState.severity.success.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.success.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.success.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.success.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.success.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.success.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.success.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.success.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    warning: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.defaultState.severity.warning.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.warning.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.warning.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.warning.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.warning.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.warning.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.warning.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.warning.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    error: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.defaultState.severity.danger.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.danger.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.danger.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.danger.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.danger.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.danger.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.danger.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.danger.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
    contrast: z
      .object({
        default: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.defaultState.severity.contrast.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.contrast.contrast}}')
              .optional(),
          })
          .optional(),
        hover: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.contrast.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.hover.severity.contrast.contrast}}')
              .optional(),
          })
          .optional(),
        focus: z
          .object({
            backgroundColor: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.contrast.bg.color}}')
              .optional(),
            color: z
              .string()
              .default('{{primitives.variant.secondary.state.focus.severity.contrast.contrast}}')
              .optional(),
            focusRing: z
              .object({
                color: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.contrast.focusRing.color}}')
                  .optional(),
                shadow: z
                  .string()
                  .default('{{primitives.variant.secondary.state.focus.severity.contrast.focusRing.shadow.color}}')
                  .optional(),
              })
              .optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional()

const primaryClose = z
  .object({
    default: variableBasePrimary.optional(),
    text: variableBasePrimary.optional(),
    outlined: variableBasePrimary.optional(),
    filled: variableBasePrimary.optional(),
  })
  .prefault({})

const secondaryClose = z
  .object({
    default: variableBaseSecondary.optional(),
    text: variableBaseSecondary.optional(),
    outlined: variableBaseSecondary.optional(),
    filled: variableBaseSecondary.optional(),
  })
  .prefault({})

const closeBase = z
  .object({
    font: z
      .object({
        size: z.string().default('{{primitives.font.size.md}}').optional(),
      })
      .prefault({}),
    icon: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.size.md}}').optional(),
      })
      .prefault({}),
    border: z
      .object({
        radius: withRef(z.string()).default('{{primitives.radius.md}}').optional(),
        width: withRef(z.string()).default('{{primitives.border.width.md}}').optional(),
      })
      .prefault({}),
    width: withRef(z.string()).default('1.75rem').optional(),
    height: withRef(z.string()).default('1.75rem').optional(),
    focusRing: z
      .object({
        width: withRef(z.string()).default('{{primitives.focusRing.width}}').optional(),
        offset: withRef(z.string()).default('{{primitives.focusRing.offset}}').optional(),
        radius: withRef(z.string()).default('{{primitives.focusRing.radius.md}}').optional(),
        style: withRef(z.string()).default('{{primitives.focusRing.style}}').optional(),
      })
      .prefault({}),
    default: primaryClose.optional(),
    primary: primaryClose.optional(),
    secondary: secondaryClose.optional(),
  })
  .prefault({})

export const messageClose = closeBase
