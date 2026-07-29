import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { borderWithShadow, withRef } from '../primitives'

export class MultiselectChipRemoveIconSchema {
  private static readonly commonTokens = {
    size: withRef(z.string()).default('{{primitives.icon.size}}'),
  }

  private static readonly defaultStateTokens = {
    color: withRef(z.string()).default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  }

  static readonly focusTokens = z.object({
    color: withRef(z.string()).default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    focusRing: borderWithShadow.default({
      width: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.width}}',
      offset: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.offset}}',
      radius: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.radius}}',
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
      shadow: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.shadow}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectChip' })
}
