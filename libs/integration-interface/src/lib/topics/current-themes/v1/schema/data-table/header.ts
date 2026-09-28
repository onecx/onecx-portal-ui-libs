import * as z from 'zod'
import { bg, border, color, font, withRef } from '../primitives'
import { focusRingShape, focusRingTokens, rowDefaultStateTokens, stateBoxTokens, stateTokensShape } from './data-table-base-tokens'
import { dataTableFilterIconsDefaults, dataTableFilterIconsShape, dataTableSortIconsDefaults, dataTableSortIconsShape } from './icons'

/** A header cell (the column-header box). Carries the sort/filter icon trees. */
const headerCellShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  font: font.optional(),
  textAlign: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  sortIcons: dataTableSortIconsShape.prefault({}),
  filterIcons: dataTableFilterIconsShape.prefault({}),
})

/** A header row. `defaultState` nests the cell; named states restyle the box. */
export const dataTableHeaderShape = z.object({
  defaultState: headerCellShape.prefault({}),
  hover: stateTokensShape.prefault({}),
  active: stateTokensShape.prefault({}),
  selected: stateTokensShape.prefault({}),
  focus: stateTokensShape.prefault({}),
  focusRing: focusRingShape.prefault({}),
})

/** Header row defaults. */
export const dataTableHeaderDefaults = {
  defaultState: {
    ...rowDefaultStateTokens,
    sortIcons: dataTableSortIconsDefaults,
    filterIcons: dataTableFilterIconsDefaults,
  },
  hover: stateBoxTokens('hover'),
  active: stateBoxTokens('active'),
  selected: stateBoxTokens('selected'),
  focus: stateBoxTokens('focus'),
  focusRing: focusRingTokens,
}
