import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectCheckboxSchema } from './checkbox'
import { border, borderWithShadow, font, withRef } from '../primitives'

/**
 * Single selectable item in list of multiselect overlay.
 */
export class MultiselectListItemSchema {
  private static readonly commonTokens = {
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
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
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.width}}',
      offset: '{{primitives.focusRing.offset.none}}',
      shadow: '{{primitives.focus.shadow.none}}',
    }),
  }

  static readonly hoverTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
  })

  static readonly focusTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
  })

  static readonly selectedTokens = z.object({
    ...this.commonTokens,
    background: z
      .union([z.string(), withRef(z.string())])
      .default('{{primitives.primary.state.selected.defaultSeverity.bg}}'),
  })

  static readonly schema = z
    .object({
      checkbox: (MultiselectCheckboxSchema.schema as typeof MultiselectCheckboxSchema.schema).prefault({}),
      ...this.defaultStateTokens,
      hover: this.hoverTokens.prefault({}),
      focus: this.focusTokens.prefault({}),
      selected: this.selectedTokens.prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectListItem' })
}
