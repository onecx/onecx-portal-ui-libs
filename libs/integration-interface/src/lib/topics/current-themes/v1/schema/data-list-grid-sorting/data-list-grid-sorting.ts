import z from 'zod';
import { border, withRef, bg, color } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { DataListGridSortingFloatLabelSchema } from './data-list-grid-sorting-float-label';
import { DataListGridSortingButtonSchema } from './data-list-grid-sorting-button';
import { dropdown } from '../dropdown';

export class DataListGridSortingSchema {
  private static readonly tokens = {
    border: border.pick({ color: true, width: true, radius: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      width: '{{primitives.border.width.none}}',
      radius: '{{primitives.radius.sm}}',
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    space: withRef(z.string()).default('{{primitives.space.md}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      floatLabel: (
        DataListGridSortingFloatLabelSchema.schema as typeof DataListGridSortingFloatLabelSchema.schema
      ).prefault({}),
      dropdown: (dropdown as typeof dropdown).prefault({}),
      button: (
        DataListGridSortingButtonSchema.schema as typeof DataListGridSortingButtonSchema.schema
      ).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataListGridSorting' });
}

export const dataListGridSorting = DataListGridSortingSchema.schema;
