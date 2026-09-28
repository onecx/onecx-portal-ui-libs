import * as z from 'zod'
import { focusRingShape, focusRingTokens, rowCellShape, rowDefaultStateTokens, stateBoxTokens, stateTokensShape } from './data-table-base-tokens'
import { dataTableCellDefaults, dataTableCellShape } from './cell'

/** A footer row: its own box + a nested cell + focusRing. */
export const dataTableFooterShape = z.object({
  defaultState: rowCellShape.prefault({}),
  cell: dataTableCellShape.prefault({}),
  hover: stateTokensShape.prefault({}),
  active: stateTokensShape.prefault({}),
  selected: stateTokensShape.prefault({}),
  focus: stateTokensShape.prefault({}),
  focusRing: focusRingShape.prefault({}),
})

/** Footer row defaults. */
export const dataTableFooterDefaults = {
  defaultState: rowDefaultStateTokens,
  cell: dataTableCellDefaults,
  hover: stateBoxTokens('hover'),
  active: stateBoxTokens('active'),
  selected: stateBoxTokens('selected'),
  focus: stateBoxTokens('focus'),
  focusRing: focusRingTokens,
}
