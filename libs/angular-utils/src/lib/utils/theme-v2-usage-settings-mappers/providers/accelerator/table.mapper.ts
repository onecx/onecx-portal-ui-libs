import { ThemeUsageSettings } from '@onecx/integration-interface'
import { defineUsageSettingsMapper, asBoolean, mapValues } from '../../helpers'

/**
 * Component input defaults derived from the `table` theme usage settings, applied by
 * DataTableComponent/DataViewComponent/InteractiveDataViewComponent when the corresponding
 * input isn't explicitly set.
 *
 * This shape mirrors the three table-family components' input declarations, which live in
 * `@onecx/angular-accelerator`. Since `angular-accelerator` depends on `angular-utils` (not the
 * reverse), the two shapes cannot be structurally derived from one another without a circular
 * library dependency, so they are kept in sync by convention. A spec in `angular-accelerator`
 * asserts these keys stay a subset of the components' declared inputs to catch drift early.
 */
export interface AcceleratorTableInputDefaults {
  checkboxColumnPosition?: 'left' | 'right'
  frozenActionColumn?: boolean
  actionColumnPosition?: 'left' | 'right'
}

export const mapAcceleratorTableSettings = defineUsageSettingsMapper<
  ThemeUsageSettings<'table'>,
  AcceleratorTableInputDefaults
>({
  checkboxColumnPosition: {
    from: 'checkboxColumnPosition',
    transform: mapValues({
      start: 'left',
      end: 'right',
    } as const),
  },
  frozenActionColumn: {
    from: 'actionColumnSticky',
    transform: asBoolean,
  },
  actionColumnPosition: {
    from: 'actionColumnPosition',
    transform: mapValues({
      start: 'left',
      end: 'right',
    } as const),
  },
})