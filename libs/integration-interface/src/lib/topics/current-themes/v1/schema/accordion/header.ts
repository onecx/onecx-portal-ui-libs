import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'

export class AccordionHeaderSchema {
  private static readonly tokens = {
    padding: z.string().optional().default('{{primitives.space.md}}'),
    font: font.pick({ weight: true, size: true }).default({
      weight: '{{primitives.font.weight.bold}}',
      size: '{{primitives.font.size.md}}',
    }),
    border: border.pick({ radius: true, width: true, color: true }).default({
      radius: '{{primitives.radius.md}}',
      width: '{{primitives.border.width.md}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.border.shadow.none}}',
    }),
  }

  private static readonly toggleIconTokens = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    hover: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
      })
      .prefault({}),
    active: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
        hover: z
          .object({
            color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
          })
          .prefault({}),
      })
      .prefault({}),
    focus: z
      .object({
        color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  }

  private static readonly hoverTokens = z
    .object({
      color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
      background: bg.pick({ color: true }).default({
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}',
      }),
    })
    .prefault({})

  private static readonly focusTokens = z
    .object({
      color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
      background: bg.pick({ color: true }).default({
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}',
      }),
    })
    .prefault({})

  private static readonly activeTokens = z
    .object({
      color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
      background: bg.pick({ color: true }).default({
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
      }),
      hover: z
        .object({
          color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
          background: bg.pick({ color: true }).default({
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
          }),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly variants = {
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    focus: this.focusTokens,
    hover: this.hoverTokens,
    active: this.activeTokens,
  }

  private static readonly firstLastTokens = {
    border: border
      .pick({ radius: true, width: true })
      .default({
        radius: '{{primitives.radius.md}}',
        width: '{{primitives.border.width.md}}',
      })
      .prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      ...this.variants,
      toggleIcon: z
        .object({
          ...this.toggleIconTokens,
        })
        .prefault({}),
      first: z
        .object({
          ...this.firstLastTokens,
        })
        .prefault({}),
      last: z
        .object({
          ...this.firstLastTokens,
        })
        .prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'accordionHeader' })
}
