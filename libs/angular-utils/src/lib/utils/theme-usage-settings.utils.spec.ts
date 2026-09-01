import {
  getThemeUsageSettings,
  mapThemeUsageSettings,
  resolveThemePropertiesV2,
} from './theme-usage-settings.utils'
import { ThemePropertiesV2 } from '@onecx/integration-interface'

describe('theme-usage-settings.utils', () => {
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

  describe('resolveThemePropertiesV2', () => {
    it('should return the original properties when no region is provided', () => {
      expect(resolveThemePropertiesV2(properties)).toBe(properties)
    })

    it('should merge region overrides into primitives and usages', () => {
      const result = resolveThemePropertiesV2(properties, { regionName: 'header' })

      expect(result?.primitives?.font?.family).toBe('header-font')
      expect(result?.usages?.table?.settings).toEqual({
        actionColumnSticky: true,
        actionColumnPosition: 'end',
      })
    })

    it('should throw for an invalid region name', () => {
      expect(() => resolveThemePropertiesV2(properties, { regionName: 'invalid' as never })).toThrow(
        'Invalid region name: invalid. Expected one of: header, subHeader, bodyStart, bodyHeader, bodyFooter, bodyEnd, footer'
      )
    })
  })

  describe('getThemeUsageSettings', () => {
    it('should return typed settings for a usage', () => {
      expect(getThemeUsageSettings(properties, 'table')).toEqual({
        actionColumnSticky: false,
        actionColumnPosition: 'end',
      })
    })

    it('should return undefined when a usage has no settings', () => {
      expect(getThemeUsageSettings(undefined, 'table')).toBeUndefined()
    })
  })

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