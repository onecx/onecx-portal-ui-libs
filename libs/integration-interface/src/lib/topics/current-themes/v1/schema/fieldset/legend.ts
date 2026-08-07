import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class LegendSchema {
  static readonly token = {
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: z
      .object({
        radius: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}'),
        width: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}'),
        color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
      })
      .prefault({}),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: z
      .object({
        size: withRef(z.string()).default('{{primitives.font.size}}'),
        weight: withRef(z.string()).default('{{primitives.font.weight}}'),
      })
      .prefault({}),
    focusRing: z
      .object({
        width: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.width}}'),
        style: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}'),
        offset: withRef(z.string()).default(
          '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.offset}}'
        ),
        shadow: withRef(z.string()).default(
          '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}'
        ),
      })
      .prefault({}),
  }

  static readonly hoverTokens = z.object({
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}'),
      })
      .prefault({}),
  })

  static readonly focusTokens = z.object({
    backgroundColor: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}'),
      })
      .prefault({}),
    focusRing: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}'),
      })
      .prefault({}),
  })

  static readonly iconTokens = z.object({
    size: withRef(z.string()).default('{{primitives.icon.size}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    hover: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
      })
      .prefault({}),
    width: withRef(z.string()).default('{{primitives.icon.size}}'),
    height: withRef(z.string()).default('{{primitives.icon.size}}'),
  })

  static schema = z
    .object({
      ...this.token,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      toggleIcon: this.iconTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'legend' })
}
