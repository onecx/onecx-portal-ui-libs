import { computed, signal, Signal } from '@angular/core'
import { ThemeTableSettingsService } from '../services/theme-v2-settings-table.service'

export type TableColumnPosition = 'left' | 'right'

export interface ThemeTableSettings {
  checkboxColumnPosition: Signal<TableColumnPosition>
  frozenActionColumn: Signal<boolean>
  actionColumnPosition: Signal<TableColumnPosition>
  setCheckboxColumnPosition: (value: TableColumnPosition) => void
  setFrozenActionColumn: (value: boolean) => void
  setActionColumnPosition: (value: TableColumnPosition) => void
  setActionColumnConfig: (value: { frozenActionColumn: boolean; actionColumnPosition: TableColumnPosition }) => void
}

/**
 * Creates reusable theme settings state with explicit-input precedence over themed defaults.
 *
 * @param themeTableSettings Shared theme settings source for accelerator table usages.
 * @returns Signals and setters used by components that expose action-column configuration.
 */
export function createThemeTableSettings(
  themeTableSettings: ThemeTableSettingsService
): ThemeTableSettings {
  const explicitCheckboxColumnPosition = signal(false)
  const explicitFrozenActionColumn = signal(false)
  const explicitActionColumnPosition = signal(false)
  const checkboxColumnPositionValue = signal<TableColumnPosition | undefined>(undefined)
  const frozenActionColumnValue = signal<boolean | undefined>(undefined)
  const actionColumnPositionValue = signal<TableColumnPosition | undefined>(undefined)

  return {
    setCheckboxColumnPosition(value) {
      explicitCheckboxColumnPosition.set(true)
      checkboxColumnPositionValue.set(value)
    },
    setFrozenActionColumn(value) {
      explicitFrozenActionColumn.set(true)
      frozenActionColumnValue.set(value)
    },
    checkboxColumnPosition: computed<TableColumnPosition>(() => {
      if (explicitCheckboxColumnPosition()) {
        return checkboxColumnPositionValue() ?? 'left'
      }

      return themeTableSettings.table().checkboxColumnPosition ?? 'left'
    }),
    setActionColumnPosition(value) {
      explicitActionColumnPosition.set(true)
      actionColumnPositionValue.set(value)
    },
    setActionColumnConfig(value) {
      explicitFrozenActionColumn.set(true)
      explicitActionColumnPosition.set(true)
      frozenActionColumnValue.set(value.frozenActionColumn)
      actionColumnPositionValue.set(value.actionColumnPosition)
    },
    frozenActionColumn: computed(() => {
      if (explicitFrozenActionColumn()) {
        return frozenActionColumnValue() ?? false
      }

      return themeTableSettings.table().frozenActionColumn ?? false
    }),
    actionColumnPosition: computed<TableColumnPosition>(() => {
      if (explicitActionColumnPosition()) {
        return actionColumnPositionValue() ?? 'right'
      }

      return themeTableSettings.table().actionColumnPosition ?? 'right'
    }),
  }
}