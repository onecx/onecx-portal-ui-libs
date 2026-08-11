import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class AccordionHeaderSchema {
  private static readonly tokens = {
    padding: z.string().optional().default('{{primitives.space.md}}'),
    font: z
      .object({
        weight: z.string().optional().default('{{primitives.font.weight.bold}}'),
        size: z.string().optional().default('{{primitives.font.size.md}}'),
      })
      .prefault({}),
    border: z
      .object({
        radius: z.string().optional().default('{{primitives.radius.md}}'),
        width: z.string().optional().default('{{primitives.border.width.md}}'),
        color: z.string().optional().default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
      })
      .prefault({}),
    focusRing: z
      .object({
        width: withRef(z.string()).default(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.width}}'
        ),
        style: withRef(z.string()).default(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}'
        ),
        shadow: withRef(z.string()).default(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.shadow}}'
        ),
        offset: withRef(z.string()).default(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.offset}}'
        ),
        color: withRef(z.string()).default(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}'
        ),
      })
      .prefault({}),
  }

  private static readonly toggleIconTokens = {
    color: z.string().optional().default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    hover: z
      .object({
        color: z.string().optional().default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
      })
      .prefault({}),
    active: z
      .object({
        color: z.string().optional().default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
        hover: z
          .object({
            color: z.string().optional().default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
          })
          .prefault({}),
      })
      .prefault({}),
    focus: z
      .object({
        color: z.string().optional().default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
      })
      .prefault({}),
  }

  private static readonly hoverTokens = z
    .object({
      color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
      background: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}'),
    })
    .prefault({})

  private static readonly focusTokens = z
    .object({
      color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
      background: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}'),
    })
    .prefault({})

  private static readonly activeTokens = z
    .object({
      color: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
      background: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}'),
      hover: z
        .object({
          color: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
          background: withRef(z.string()).default(
            '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}'
          ),
        })
        .prefault({}),
    })
    .prefault({})

  private static readonly variants = {
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'),
    focus: this.focusTokens,
    hover: this.hoverTokens,
    active: this.activeTokens,
  }

  private static readonly firstLastTokens = {
    border: z
      .object({
        radius: z
          .union([
            withRef(z.string()),
            z
              .object({
                top: z.string().optional(),
                right: z.string().optional(),
                bottom: z.string().optional(),
                left: z.string().optional(),
              })
              .prefault({}),
          ])
          .prefault({}),
        width: z.string().optional().default('{{primitives.border.width.md}}'),
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
