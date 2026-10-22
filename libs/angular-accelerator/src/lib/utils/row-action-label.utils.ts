import { isDevMode } from '@angular/core'
import { ColumnType } from '../model/column-type.model'
import { DataAction } from '../model/data-action'
import { DataTableColumn } from '../model/data-table-column.model'
import { ObjectUtils } from './objectutils'

function toLabel(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim()
  }
  return ''
}

/**
 * Determines a human readable label for a row, used to build unique accessible names for
 * row-level buttons (e.g. "Edit: Product A").
 * The first candidate field that yields a non-empty primitive value wins; the row `id` is the last resort.
 *
 * @param row the row object
 * @param candidateFields field ids in order of preference (undefined/empty entries are skipped)
 * @returns the row label or an empty string if none could be determined
 */
export function getRowLabel(row: any, candidateFields: (string | undefined | null)[]): string {
  if (!row) return ''
  for (const field of candidateFields) {
    if (!field) continue
    const label = toLabel(ObjectUtils.resolveFieldData(row, field))
    if (label) return label
  }
  return toLabel(row['id'])
}

/**
 * Logs a warning (dev mode only) for every action that has no (non-empty) `labelKey`.
 * Such actions would otherwise render a button without an accessible name.
 *
 * @param actions the actions to check
 */
export function warnOnActionsWithoutLabelKey(actions: DataAction[]): void {
  if (!isDevMode()) return
  actions
    .filter((action) => !action.labelKey)
    .forEach((action) =>
      console.warn(
        `Row action${action.id ? ` "${action.id}"` : ''} has no labelKey. A generic fallback label is used for its accessible name; please provide a labelKey.`
      )
    )
}

/**
 * Returns the ids of the columns whose values are suitable as a row label
 * (plain text or numbers; no translation keys, dates or relative dates).
 */
export function getLabelColumnIds(columns: DataTableColumn[]): string[] {
  return columns
    .filter((c) => !c.columnType || c.columnType === ColumnType.STRING || c.columnType === ColumnType.NUMBER)
    .map((c) => c.id)
}
