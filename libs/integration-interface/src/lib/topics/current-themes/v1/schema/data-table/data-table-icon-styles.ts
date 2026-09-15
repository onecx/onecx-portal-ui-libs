import z from 'zod';
import { icon, withRef } from '../primitives';
import { themeSchemaRegistry } from '../registry';

export class DataTableSortIconStylesSchema {
  private static readonly defaultIconTokens = {
    size: "{{primitives.icon.sm}}",
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
    content: "",
    url: "",
  }

  private static readonly tokens = {
    icon: icon.default(this.defaultIconTokens),
    ascendingIcon: withRef(z.string()).default('onecx:sort-ascending'),
    descendingIcon: withRef(z.string()).default('onecx:sort-descending'),
    defaultIcon: withRef(z.string()).default('onecx:sort-default'),
  }

  private static readonly hoverTokens = {
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}",
    }),
  }

  private static readonly activeTokens = {
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}",
    }),
  }

  private static readonly focusTokens = {
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}",
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      hover: z.object({...this.hoverTokens}).prefault({}),
      active: z.object({...this.activeTokens}).prefault({}),
      focus: z.object({...this.focusTokens}).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataTableSortIconStyles' });
}

export const dataTableSortIconStyles = DataTableSortIconStylesSchema.schema;

export class DataTableFilterIconStylesSchema {
  private static readonly defaultIconTokens = {
    size: "{{primitives.icon.sm}}",
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
    content: "",
    url: "",
  }

  private static readonly tokens = {
    icon: icon.default(this.defaultIconTokens),
    onIcon: withRef(z.string()).default('onecx:filter-on'),
    offIcon: withRef(z.string()).default('onecx:filter-off'),
  }

  private static readonly hoverTokens = {
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}",
    }),
  }

  private static readonly activeTokens = {
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}",
    }),
  }

  private static readonly focusTokens = {
    icon: icon.pick({ color: true }).default({
      color: "{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}",
    }),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
      hover: z.object({...this.hoverTokens}).prefault({}),
      active: z.object({...this.activeTokens}).prefault({}),
      focus: z.object({...this.focusTokens}).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'dataTableFilterIconStyles' });
}

export const dataTableFilterIconStyles = DataTableFilterIconStylesSchema.schema;
