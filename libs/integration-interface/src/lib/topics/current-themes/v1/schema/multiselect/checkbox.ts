import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'

/**
 * Checkbox inside multiselect filter and list schema.
 */
export class MultiselectCheckboxSchema {
  private static readonly commonBorder = {
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.none}}',
  }

  private static readonly defaultStateTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      ...this.commonBorder,
    }),
  }

  static readonly hoverTokens = z.object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
      ...this.commonBorder,
    }),
  })

  static readonly focusTokens = z.object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      ...this.commonBorder,
    }),
  })

  static readonly selectedTokens = z.object({
    background: z.union([bg, withRef(z.string())]).default('{{primitives.primary.state.selected.defaultSeverity.bg}}'),
    iconColor: color.default('{{primitives.primary.state.selected.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.primary.state.selected.defaultSeverity.border.color}}',
      style: '{{primitives.primary.state.selected.defaultSeverity.border.style}}',
      ...this.commonBorder,
    }),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      selected: this.selectedTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectCheckbox' })
}
