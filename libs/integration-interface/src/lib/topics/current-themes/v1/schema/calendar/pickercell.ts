import { themeSchemaRegistry } from '../registry'
import { bg, color, font, border, withRef } from '../primitives'
import z from 'zod'

/**
 * Shared schema for calendar picker cells (dateCell, monthCell, yearCell)
 */
export class CalendarPickerCellSchema {
  private static readonly commonTokens = {
    width: withRef(z.string()).default('2.5rem'),
    height: withRef(z.string()).default('2.5rem'),
    padding: withRef(z.string()).default('{{primitives.space.xs}}'),
    font: font.pick({ weight: true, size: true }).default({
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    }),
  }

  private static readonly commonBorder = {
    width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width.sm}}',
    offset: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.offset.none}}',
    radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius.md}}',
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
  private static readonly selectedTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.selected.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.selected.defaultSeverity.border.style}}',
    }),
    inRangeBackground: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.variant.primary.defaultState.defaultVariant.bg}}'),
    rangeSelectedBackground: color.default('{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}'),
  })

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
  })

  private static readonly hoverTokens = z.object({
    ...this.commonTokens,
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    }),
  })

  static readonly schema = z
    .object({
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      selected: this.selectedTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'calendarPickerCell' })
}
