import * as z from 'zod'
import { rowCellShape, rowDefaultStateTokens } from './data-table-base-tokens'
import { dataTableCellDefaults, dataTableCellShape } from './cell'

/** A footer row: its own box + a nested cell */
export const dataTableFooterShape = z.object({
  ...rowCellShape.shape,
  cell: dataTableCellShape.prefault({}),
})

/** Footer row defaults. */
export const dataTableFooterDefaults = {
  ...rowDefaultStateTokens,
  cell: dataTableCellDefaults,
}
