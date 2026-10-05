import { mapThemeUsageSettings } from './usage-settings.utils'
import { ThemePropertiesV2 } from '@onecx/integration-interface'

describe('usage-settings.utils', () => {
  const properties: ThemePropertiesV2 = {
    primitives: {
      font: {
        family: 'base-font',
      },
    },
    usages: {
      table: {
        settings: {
          actionColumnSticky: false,
          actionColumnPosition: 'end',
        },
      },
      carousel: {
        settings: {
          circular: false,
          showNavigators: true,
        },
      },
    },
    regionOverrides: {
      header: {
        primitives: {
          font: {
            family: 'header-font',
          },
        },
        usages: {
          table: {
            settings: {
              actionColumnSticky: true,
            },
          },
        },
      },
    },
  }

  describe('mapThemeUsageSettings', () => {
    it('should map settings through the provided adapter', () => {
      const result = mapThemeUsageSettings(properties, 'carousel', (settings) => ({
        circular: settings.circular === true,
        showNavigators: settings.showNavigators === true,
      }))

      expect(result).toEqual({
        circular: false,
        showNavigators: true,
      })
    })

    it('should return undefined when settings are missing', () => {
      expect(mapThemeUsageSettings(undefined, 'carousel', () => ({ ok: true }))).toBeUndefined()
    })
  })
})