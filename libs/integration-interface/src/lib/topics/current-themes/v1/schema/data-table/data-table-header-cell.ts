import z from 'zod';
import { bg, color, withRef } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataTableHeaderCellSchema {
  private static readonly defaultTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
  }

  private static readonly hoverTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
  }

  private static readonly selectedTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}'),
  }

  static readonly schema = z
    .object({
      ...this.defaultTokens,
      hover: z.object({...this.hoverTokens}).prefault({}),
      selected: z.object({...this.selectedTokens}).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataTableHeaderCell' });
}

export const dataTableHeaderCell = DataTableHeaderCellSchema.schema;
