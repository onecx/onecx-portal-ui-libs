import * as z from 'zod'
import { focusRingShape, focusRingTokens, rowCellShape, rowDefaultStateTokens, stateBoxTokens, stateTokensShape } from './data-table-base-tokens'
import { dataTableCellDefaults, dataTableCellShape } from './cell'
import { themeSchemaRegistry } from '../registry'

// An alternating (odd/even) body row: its own box states (defaultState/hover/active/selected) + a
// nested cell. The keys are state members; the cell re-roots as a child scope.
export const dataTableAlternatingRowShape = z
  .object({
    defaultState: rowCellShape.prefault({}),
    hover: stateTokensShape.prefault({}),
    active: stateTokensShape.prefault({}),
    selected: stateTokensShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dataTable.row.alternating', axis: 'state', child: true })

// A body row: its own box states, a nested cell, odd/even alternation, and a static focusRing (a
// sibling of the states, opted out). The cell/odd/even re-root as child scopes.
export const dataTableRowShape = z
  .object({
    defaultState: rowCellShape.prefault({}),
    cell: dataTableCellShape.prefault({}),
    odd: dataTableAlternatingRowShape.prefault({}),
    even: dataTableAlternatingRowShape.prefault({}),
    hover: stateTokensShape.prefault({}),
    active: stateTokensShape.prefault({}),
    selected: stateTokensShape.prefault({}),
    focusRing: focusRingShape
      .extend({})
      .register(themeSchemaRegistry, { id: 'dataTable.row.focusRing', axis: 'none' })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dataTable.row', axis: 'state', child: true })

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
