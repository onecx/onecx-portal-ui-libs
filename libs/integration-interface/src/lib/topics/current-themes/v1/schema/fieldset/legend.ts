import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, font, withRef } from '../primitives'

export class LegendSchema {
  static readonly token = {
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
      width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
      offset: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.offset}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.pick({ weight: true, family: true, size: true }).default({
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      family: '{{primitives.font.family}}',
    }),
    focusRing: z
      .object({
        width: withRef(z.string()).default('{{primitives.focusRing.width}}'),
        style: withRef(z.string()).default('{{primitives.focusRing.style}}'),
        offset: withRef(z.string()).default('{{primitives.focusRing.offset}}'),
        shadow: withRef(z.string()).default('{{primitives.focusRing.shadow}}'),
      })
      .prefault({}),
  }

  static readonly hoverTokens = z.object({
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}'),
      })
      .prefault({}),
  })

  static readonly focusTokens = z.object({
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
    }),
    focusRing: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}'),
      })
      .prefault({}),
  })

  static readonly activeTokens = z.object({
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
    }),
  })

  static readonly disabledTokens = z.object({
    background: bg.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}',
    }),
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: border.pick({ color: true }).default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
    }),
    opacity: withRef(z.number()).default('0.5'),
  })

  static readonly iconTokens = z.object({
    size: withRef(z.string()).default('{{primitives.icon.size}}'),
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    hover: z
      .object({
        color: withRef(z.string()).default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
        rotate: withRef(z.string()).default('0deg'),
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
      active: this.activeTokens.prefault({}),
      disabled: this.disabledTokens.prefault({}),
      toggleIcon: this.iconTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'legend' })
}
