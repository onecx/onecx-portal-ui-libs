import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectCheckboxSchema } from './checkbox'
import { border, font, withRef } from '../primitives'

/**
 * Single selectable item in list of multiselect overlay.
 */
export class MultiselectListItemSchema {
  private static readonly commonTokens = {
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    gap: withRef(z.string()).default('{{primitives.space.sm}}'),
    font: font.pick({ weight: true, size: true }).default({
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    }),
    border: border.default({
      width: '{{primitives.border.width.none}}',
      offset: '{{primitives.border.offset.none}}',
      color: '{{primitives.border.color.none}}',
      style: '{{primitives.border.style.none}}',
      radius: '{{primitives.border.radius.sm}}',
    }),
  }

  private static readonly defaultStateTokens = {
    ...this.commonTokens,
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
  }

  static readonly hoverTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
  })

  static readonly selectedTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}'),
  })

  static readonly schema = z
    .object({
      checkbox: (MultiselectCheckboxSchema.schema as typeof MultiselectCheckboxSchema.schema).prefault({}),
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      selected: this.selectedTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectListItem' })
}
