import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { borderWithShadow, color, withRef } from '../primitives'

export class MultiselectChipRemoveIconButtonSchema {
  private static readonly commonTokens = {
    size: withRef(z.string()).default('{{primitives.icon.size}}'),
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.border.shadow.none}}',
    }),
  }

  static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectChipRemoveIconButton' })
}
