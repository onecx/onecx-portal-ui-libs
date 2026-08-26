import z from 'zod';
import { border, withRef, bg, color } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { FilterViewSchema } from './filter-view';
import { DataListGridSortingSchema } from '../data-list-grid-sorting/data-list-grid-sorting';
import { DataViewSchema } from './data-view';
import { CustomGroupColumnSelectorSchema } from './custom-group-column-selector';

export class InteractiveDataViewSchema {
  private static readonly settings = z.object({
    emptyResultsMessage: withRef(z.string()).default(""),
    sortDirection: withRef(z.enum(["NONE","ASCENDING","DESCENDING"])).default("NONE"),
    layout: withRef(z.enum(["grid","table","list"])).default("table"),
    paginator: withRef(z.boolean()).default(true),
    pageSizes: withRef(z.array(z.number())).default([10, 25, 50]),
    allowSelectAll: withRef(z.boolean()).default(true),
    checkboxColumnPosition: withRef(z.enum(['start', 'end'])).default('start'),
  })

  private static readonly tokens = {
    settings: this.settings.prefault({}),
    border: border.pick({ color: true, width: true }).default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      width: '{{primitives.border.width.none}}',
    }),
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      filterView: (FilterViewSchema.schema as typeof FilterViewSchema.schema).prefault({}),
      dataListGridSorting: (DataListGridSortingSchema.schema as typeof DataListGridSortingSchema.schema).prefault({}),
      dataView: (DataViewSchema.schema as typeof DataViewSchema.schema).prefault({}),
      customGroupColumnSelector: (
        CustomGroupColumnSelectorSchema.schema as typeof CustomGroupColumnSelectorSchema.schema
      ).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'interactiveDataView' });
}

export const interactiveDataView = InteractiveDataViewSchema.schema;
