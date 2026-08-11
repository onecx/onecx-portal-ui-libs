import z from 'zod';
import { bg, border, color, font, withRef } from '../primitives';
import { themeSchemaRegistry } from '../registry';
import { DataTableCellWithStatesSchema } from './data-table-cell-with-states';

export class DataTableRowWithStatesSchema {
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

  private static readonly activeBorderTokens = {
    color: "{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}",
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

  private static readonly focusBorderTokens = {
    color: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}",
    style: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}",
    width: "{{primitives.border.width.none}}",
    radius: "{{primitives.border.radius.none}}",
    offset: "{{primitives.border.offset.none}}",
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

  private static readonly activeTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}'),
    border: border.default(this.activeBorderTokens),
  }

  private static readonly selectedTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}'),
    border: border.default(this.selectedBorderTokens),
  }

  private static readonly focusTokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default(this.focusBorderTokens),
  }

  static readonly schema = z
    .object({
      ...this.defaultTokens,
      cell: (
        DataTableCellWithStatesSchema.schema as typeof DataTableCellWithStatesSchema.schema
      ).prefault({}),
      hover: z.object({...this.hoverTokens}).prefault({}),
      active: z.object({...this.activeTokens}).prefault({}),
      selected: z.object({...this.selectedTokens}).prefault({}),
      focus: z.object({...this.focusTokens}).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataTableRowWithStates' });
}

export const dataTableRowWithStates = DataTableRowWithStatesSchema.schema;
