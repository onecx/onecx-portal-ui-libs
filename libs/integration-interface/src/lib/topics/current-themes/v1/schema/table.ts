/**
 * This file defines the schema for table theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from 'zod'
import { bg, bgContrast, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const blockStyles = bgContrast
  .extend({
    border: border.default({
      color: '{{primitives.border.defaultVariant.color}}',
      width: '{{primitives.border.defaultVariant.width}}',
      style: '{{primitives.border.defaultVariant.style}}',
      radius: '{{primitives.radius.md}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    textAlign: withRef(z.string()).default('left'),
  })
  .register(themeSchemaRegistry, { id: 'blockStyles' })

export const tableStyles = blockStyles
  .extend({
    // Override bg/contrast from blockStyles with defaults pointing to the surface area primitive
    bg: z.union([bg, withRef(z.string())]).default('{{primitives.area.surface.defaultState.defaultVariant.bg}}'),
    contrast: color.default('{{primitives.area.surface.defaultState.defaultVariant.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    borderCollapse: withRef(z.enum(['collapse', 'separate'])).default('separate'),
    // Controls the box-shadow of the table container element, e.g. for elevation or
    // visual separation from the surrounding page surface.
    shadow: withRef(z.string()).default('{{primitives.shadow.none}}'),
  })
  .register(themeSchemaRegistry, { id: 'tableStyles' })

export const tableSettings = z
  .object({
    checkboxColumnPosition: withRef(z.enum(['start', 'end'])).default('start'),
    actionColumnPosition: withRef(z.enum(['start', 'end'])).default('end'),
    actionColumnSticky: withRef(z.boolean()).default(false),
  })
  .register(themeSchemaRegistry, { id: 'tableSettings' })

export const tableCellStyles = blockStyles
  .extend({
    // Controls vertical alignment within a cell (e.g. 'top', 'middle', 'bottom').
    // Needed when rows can vary in height due to multi-line content.
    verticalAlign: withRef(z.string()).default('middle'),
    // When true, overflowing text is truncated with an ellipsis instead of wrapping.
    // Useful for cells with constrained width (e.g. description or name columns).
    truncate: withRef(z.boolean()).default(false),
  })
  .register(themeSchemaRegistry, { id: 'tableCellStyles' })

export const cellWithStates = z
  .object({
    defaultState: (tableCellStyles as typeof tableCellStyles).optional(),
    state: z
      .object({
        hover: (tableCellStyles as typeof tableCellStyles).optional(),
        active: (tableCellStyles as typeof tableCellStyles).optional(),
        selected: (tableCellStyles as typeof tableCellStyles).optional(),
        focus: (tableCellStyles as typeof tableCellStyles).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'cellWithStates' })

export const tableRowStyles = blockStyles
  .extend({
    // Allows setting a fixed row height (e.g. '48px') for consistent row sizing
    // regardless of cell content, typically used in dense/compact table layouts.
    height: withRef(z.string()).optional(),
    cell: (cellWithStates as typeof cellWithStates).optional(),
  })
  .register(themeSchemaRegistry, { id: 'tableRowStyles' })

export const rowWithStates = z
  .object({
    defaultState: (tableRowStyles as typeof tableRowStyles).optional(),
    state: z
      .object({
        hover: (tableRowStyles as typeof tableRowStyles).optional(),
        active: (tableRowStyles as typeof tableRowStyles).optional(),
        selected: (tableRowStyles as typeof tableRowStyles).optional(),
        focus: (tableRowStyles as typeof tableRowStyles).optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'rowWithStates' })

export const iconBaseStyles = z
  .object({
    size: withRef(
      z.union([
        z.string(),
        z.object({ width: z.string().optional(), height: z.string().optional() }),
      ])
    ).default('16px'),
    color: color.default('{{primitives.icon.defaultVariant.color}}'),
    backgroundColor: color.default('{{primitives.icon.defaultVariant.bg}}'),
  })
  .register(themeSchemaRegistry, { id: 'iconBaseStyles' })

export const sortAscendingIconStyles = iconBaseStyles
  .extend({
    icon: withRef(z.string()).default('onecx:sort-ascending'),
  })
  .register(themeSchemaRegistry, { id: 'sortAscendingIconStyles' })

export const sortDescendingIconStyles = iconBaseStyles
  .extend({
    icon: withRef(z.string()).default('onecx:sort-descending'),
  })
  .register(themeSchemaRegistry, { id: 'sortDescendingIconStyles' })

export const sortDefaultIconStyles = iconBaseStyles
  .extend({
    icon: withRef(z.string()).default('onecx:sort-default'),
  })
  .register(themeSchemaRegistry, { id: 'sortDefaultIconStyles' })

export const sortIconStyles = z
  .object({
    ascending: sortAscendingIconStyles.optional(),
    descending: sortDescendingIconStyles.optional(),
    default: sortDefaultIconStyles.optional(),
  })
  .register(themeSchemaRegistry, { id: 'sortIconStyles' })

export const filterOnIconStyles = iconBaseStyles
  .extend({
    icon: withRef(z.string()).default('onecx:filter-on'),
  })
  .register(themeSchemaRegistry, { id: 'filterOnIconStyles' })

export const filterOffIconStyles = iconBaseStyles
  .extend({
    icon: withRef(z.string()).default('onecx:filter-off'),
  })
  .register(themeSchemaRegistry, { id: 'filterOffIconStyles' })

export const filterIconStyles = z
  .object({
    on: filterOnIconStyles.optional(),
    off: filterOffIconStyles.optional(),
  })
  .register(themeSchemaRegistry, { id: 'filterIconStyles' })

export const headerRowWithStates = rowWithStates
  .extend({
    sort: z
      .object({
        defaultState: (sortIconStyles as typeof sortIconStyles).optional(),
        state: z
          .object({
            hover: (sortIconStyles as typeof sortIconStyles).optional(),
            active: (sortIconStyles as typeof sortIconStyles).optional(),
            selected: (sortIconStyles as typeof sortIconStyles).optional(),
            focus: (sortIconStyles as typeof sortIconStyles).optional(),
          })
          .optional(),
      })
      .optional(),
    filter: z
      .object({
        defaultState: (filterIconStyles as typeof filterIconStyles).optional(),
        state: z
          .object({
            hover: (filterIconStyles as typeof filterIconStyles).optional(),
            active: (filterIconStyles as typeof filterIconStyles).optional(),
            selected: (filterIconStyles as typeof filterIconStyles).optional(),
            focus: (filterIconStyles as typeof filterIconStyles).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'headerRowWithStates' })

export const alternatingRowStyles = z
  .object({
    odd: (rowWithStates as typeof rowWithStates).optional(),
    even: (rowWithStates as typeof rowWithStates).optional(),
  })
  .register(themeSchemaRegistry, { id: 'alternatingRowStyles' })

export const tableRow = z.object({
  defaultState: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
  state: z
    .object({
      hover: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
      active: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
      selected: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
      focus: (alternatingRowStyles as typeof alternatingRowStyles).optional(),
    })
    .optional(),
})

export const table = z
  .object({
    settings: (tableSettings as typeof tableSettings).optional(),
    base: (tableStyles as typeof tableStyles).optional(),
    header: (rowWithStates as typeof rowWithStates).optional(),
    footer: (rowWithStates as typeof rowWithStates).optional(),
    row: (tableRow as typeof tableRow).optional(),
  })
  .register(themeSchemaRegistry, { id: 'table' })
