import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { bg, border, color, withRef } from '../primitives'

/**
 * Individual item within the picklist panel schema.
 */
export class PicklistPanelItemSchema {
  private static readonly commonTokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.none}}',
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
  }

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.hover.defaultSeverity.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.defaultVariant.hover.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.hover.defaultSeverity.border.style}}',
    }),
  })

  private static readonly selectedTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.primary.selected.defaultSeverity.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.primary.selected.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.primary.selected.defaultSeverity.border.color}}',
      style: '{{primitives.primary.selected.defaultSeverity.border.style}}',
    }),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.focused.defaultSeverity.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.defaultVariant.focused.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.focused.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.focused.defaultSeverity.border.style}}',
    }),
  })

  private static readonly disabledTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.disabled.defaultSeverity.contrast}}'),
    background: z.union([bg, withRef(z.string())]).default('{{primitives.defaultVariant.disabled.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.disabled.defaultSeverity.border.style}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      selected: this.selectedTokens.prefault({}),
      focused: this.focusTokens.prefault({}),
      disabled: this.disabledTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'picklistPanelItem' })
}
