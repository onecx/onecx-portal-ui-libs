import { border, borderWithShadow, font } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { z } from 'zod'
import { MultiselectChipRemoveIconSchema } from './chipremoveicon'

/**
 * Multiselect chip schema for selected items in multiselect container.
 */
export class MultiselectChipSchema {
  private static readonly commonTokens = {
    paddingX: z.string().default('{{primitives.space.sm}}'),
    paddingY: z.string().default('{{primitives.space.sm}}'),
    gap: z.string().default('{{primitives.space.xs}}'),
    transitionDuration: z.string().default('{{primitives.transition.duration}}'),
    font: font.pick({ weight: true, size: true }).default({
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    }),
  }

  private static readonly commonBorder = {
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.none}}',
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    background: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    }),
  }

  private static readonly focusTokens = z.object({
    ...this.commonTokens,
    background: z.string().default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: z.string().default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      ...this.commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    }),
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
      chipRemoveIcon: (
        MultiselectChipRemoveIconSchema.schema as typeof MultiselectChipRemoveIconSchema.schema
      ).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectChip' })
}
