import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { themeSchemaRegistry } from '../registry'
import { dataTableBaseDefaults, dataTableBaseShape, dataTableColumnTitleDefaults, dataTableColumnTitleShape } from './base'
import { dataTableFooterDefaults, dataTableFooterShape } from './footer'
import { dataTableHeaderDefaults, dataTableHeaderShape } from './header'
import { dataTableAlternatingRowDefaults, dataTableAlternatingRowShape, dataTableRowDefaults, dataTableRowShape } from './row'
import { dataTableSettingsDefaults, dataTableSettingsShape } from './settings'

// ---------------------------------------------------------------------------
// SHAPE — the root is a pure aggregator; each child is its own subcomponent.
// ---------------------------------------------------------------------------

export const dataTableShape = z.object({
  settings: dataTableSettingsShape.prefault({}),
  base: dataTableBaseShape.prefault({}),
  columnTitle: dataTableColumnTitleShape.prefault({}),
  header: dataTableHeaderShape.prefault({}),
  row: dataTableRowShape.prefault({}),
  footer: dataTableFooterShape.prefault({}),
})

// ---------------------------------------------------------------------------
// DEFAULTS
// ---------------------------------------------------------------------------

/**
 * Default tokens for the DataTable usage.
 *
 * Exported so tests can assert the resolved schema output against this exact
 * source object instead of duplicating literal token values.
 */
export const dataTableDefaults = {
  settings: dataTableSettingsDefaults,
  base: dataTableBaseDefaults,
  columnTitle: dataTableColumnTitleDefaults,
  header: dataTableHeaderDefaults,
  row: dataTableRowDefaults,
  footer: dataTableFooterDefaults,
}

// ---------------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ---------------------------------------------------------------------------

export const dataTable = applyDefaultsRecursive(dataTableShape, dataTableDefaults).register(themeSchemaRegistry, {
  id: 'dataTable',
})

/** Backward-compatible facade for consumers that import `DataTableSchema.schema`. */
export class DataTableSchema {
  static readonly schema = dataTable
}

// Re-export the per-subcomponent shapes/defaults so the top-level public API
// keeps exposing the flat token tree (consumers import from here).
export { dataTableBaseDefaults, dataTableBaseShape, dataTableColumnTitleDefaults, dataTableColumnTitleShape } from './base'
export { dataTableCellDefaults, dataTableCellShape } from './cell'
export { dataTableFilterIconsDefaults, dataTableFilterIconsShape, dataTableSortIconsDefaults, dataTableSortIconsShape } from './icons'
export { dataTableFooterDefaults, dataTableFooterShape } from './footer'
export { dataTableHeaderDefaults, dataTableHeaderShape } from './header'
export { dataTableAlternatingRowDefaults, dataTableAlternatingRowShape, dataTableRowDefaults, dataTableRowShape } from './row'
export { dataTableSettingsDefaults, dataTableSettingsShape } from './settings'
