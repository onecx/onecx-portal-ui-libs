import z from 'zod';
import { bg, border, color, font, withRef } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { DataTableCellWithStatesSchema } from './data-table-cell-with-states';

export class DataTableRowSchema {
  private static readonly defaultBorderTokens = {
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly defaultFontTokens = {
    family: "{{primitives.font.family}}",
    size: "{{primitives.font.size}}",
    weight: "{{primitives.font.weight}}",
    lineHeight: "{{primitives.font.lineHeight}}",
    letterSpacing: "{{primitives.font.letterSpacing}}",
    style: "{{primitives.font.style}}",
  }

  private static readonly hoverBorderTokens = {
    color: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly selectedBorderTokens = {
    color: "{{primitives.defaultVariant.state.selected.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.selected.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
  }

  private static readonly focusRingTokens = {
    color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}"),
    style: withRef(z.string()).default("{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}"),
    width: withRef(z.string()).default("{{primitives.focusRing.width.none}}"),
    radius: withRef(z.string()).default("{{primitives.focusRing.radius.none}}"),
    offset: withRef(z.string()).default("{{primitives.focusRing.offset.none}}"),
    shadow: withRef(z.string()).default("{{primitives.focusRing.shadow.none}}"),
  }

  private static readonly defaultTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.surface.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'),
    border: border.default(this.defaultBorderTokens),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.default(this.defaultFontTokens),
    textAlign: withRef(z.string()).default('left'),
    height: withRef(z.string()).default('2.5rem'),
  }

  private static readonly hoverTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.default(this.hoverBorderTokens),
  }

  private static readonly selectedTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}'),
    border: border.default(this.selectedBorderTokens),
  }

  private static readonly oddTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.surface.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'),
    border: border.default(this.defaultBorderTokens),
    cell: (DataTableCellWithStatesSchema.schema as typeof DataTableCellWithStatesSchema.schema).prefault({}),
    hover: z.object({...this.hoverTokens}).prefault({}),
    selected: z.object({...this.selectedTokens}).prefault({}),
  }

  private static readonly evenTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.surface.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.surface.defaultState.defaultSeverity.contrast}}'),
    border: border.default(this.defaultBorderTokens),
    cell: (DataTableCellWithStatesSchema.schema as typeof DataTableCellWithStatesSchema.schema).prefault({}),
    hover: z.object({...this.hoverTokens}).prefault({}),
    selected: z.object({...this.selectedTokens}).prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.defaultTokens,
      cell: (
        DataTableCellWithStatesSchema.schema as typeof DataTableCellWithStatesSchema.schema
      ).prefault({}),
      odd: z.object({...this.oddTokens}).prefault({}),
      even: z.object({...this.evenTokens}).prefault({}),
      hover: z.object({...this.hoverTokens}).prefault({}),
      selected: z.object({...this.selectedTokens}).prefault({}),
      focusRing: z.object({...this.focusRingTokens}).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataTableRow' });
}

export const dataTableRow = DataTableRowSchema.schema;
