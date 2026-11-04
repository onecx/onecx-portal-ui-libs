import * as z from 'zod'
import { rowCellShape, rowDefaultStateTokens } from './data-table-base-tokens'
import { dataTableCellDefaults, dataTableCellShape } from './cell'
import { themeSchemaRegistry } from '../registry'

// A footer row is a stateless box (flat background/color/border tokens, no state keys); it re-roots
// as a child boundary so the nested `cell` opens its own scope.
export const dataTableFooterShape = z
  .object({
    ...rowCellShape.shape,
    cell: dataTableCellShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dataTable.footer', child: true })

/** Footer row defaults. */
export const dataTableFooterDefaults = {
  ...rowDefaultStateTokens,
  cell: dataTableCellDefaults,
}
