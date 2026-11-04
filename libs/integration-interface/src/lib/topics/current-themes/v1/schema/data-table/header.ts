import * as z from 'zod'
import { bg, border, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { rowDefaultStateTokens } from './data-table-base-tokens'
import { dataTableCellDefaults, dataTableCellShape } from './cell'
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

// A header row is a stateless box (its background/color/border tokens sit flat, no state keys);
// it re-roots as a child boundary so the nested `cell` and the `sortIcons`/`filterIcons` trees open
// their own scopes.
export const dataTableHeaderShape = z
  .object({
    ...headerCellShape.shape,
    cell: dataTableCellShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dataTable.header', child: true })

/** Header row defaults. */
export const dataTableHeaderDefaults = {
  ...rowDefaultStateTokens,
  sortIcons: dataTableSortIconsDefaults,
  filterIcons: dataTableFilterIconsDefaults,
  cell: dataTableCellDefaults,
}
