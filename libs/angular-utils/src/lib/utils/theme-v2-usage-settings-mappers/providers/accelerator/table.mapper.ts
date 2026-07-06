import { ThemeUsageSettings } from '@onecx/integration-interface'
import { defineUsageSettingsMapper, asBoolean, mapValues } from '../../helpers'

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

export const acceleratorTableSettingsMapper = mapAcceleratorTableSettings