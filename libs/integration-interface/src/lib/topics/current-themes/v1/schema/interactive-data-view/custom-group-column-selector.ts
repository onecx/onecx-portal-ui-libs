import z from 'zod';
import { border, withRef, bg, color, font } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { CustomGroupColumnSelectorSkeletonSchema } from './custom-group-column-selector-skeleton';
import { picklist } from '../picklist';

export class CustomGroupColumnSelectorSchema {
  private static readonly borderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly tokens = {
    border: border.default(this.borderTokens),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.pick({ size: true, weight: true }).default({
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      picklist: (picklist as typeof picklist).prefault({}),
      skeleton: (
        CustomGroupColumnSelectorSkeletonSchema.schema as typeof CustomGroupColumnSelectorSkeletonSchema.schema
      ).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'customGroupColumnSelector' });
}

export const customGroupColumnSelector = CustomGroupColumnSelectorSchema.schema;
