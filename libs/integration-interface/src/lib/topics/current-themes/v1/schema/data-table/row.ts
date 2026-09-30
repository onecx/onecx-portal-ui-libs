import * as z from 'zod'
import { focusRingShape, focusRingTokens, rowCellShape, rowDefaultStateTokens, stateBoxTokens, stateTokensShape } from './data-table-base-tokens'
import { dataTableCellDefaults, dataTableCellShape } from './cell'

/** An alternating (odd/even) body row: its own box + a nested cell. */
export const dataTableAlternatingRowShape = z.object({
  defaultState: rowCellShape.prefault({}),
  hover: stateTokensShape.prefault({}),
  active: stateTokensShape.prefault({}),
  selected: stateTokensShape.prefault({}),
})

/** A body row: its own box, a nested cell, and odd/even alternation. */
export const dataTableRowShape = z.object({
  defaultState: rowCellShape.prefault({}),
  cell: dataTableCellShape.prefault({}),
  odd: dataTableAlternatingRowShape.prefault({}),
  even: dataTableAlternatingRowShape.prefault({}),
  hover: stateTokensShape.prefault({}),
  active: stateTokensShape.prefault({}),
  selected: stateTokensShape.prefault({}),
  focusRing: focusRingShape.prefault({}),
})

/** A single alternating (odd/even) row: box + cell, hover/active/selected. */
export const dataTableAlternatingRowDefaults = {
  defaultState: rowDefaultStateTokens,
  cell: dataTableCellDefaults,
  hover: stateBoxTokens('hover'),
  active: stateBoxTokens('active'),
  selected: stateBoxTokens('selected'),
}

/** Body row defaults. */
export const dataTableRowDefaults = {
  defaultState: rowDefaultStateTokens,
  cell: dataTableCellDefaults,
  odd: dataTableAlternatingRowDefaults,
  even: dataTableAlternatingRowDefaults,
  hover: stateBoxTokens('hover'),
  active: stateBoxTokens('active'),
  selected: stateBoxTokens('selected'),
  focusRing: focusRingTokens,
}
