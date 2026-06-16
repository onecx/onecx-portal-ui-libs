import { Injector } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { CONFIG_KEY, ConfigurationService, ThemeService } from '@onecx/angular-integration-interface'
import { of } from 'rxjs'
import { THEME_MAX_VERSION, themeVersionAvailable } from './theme-version-available.utils'

describe('themeVersionAvailable', () => {
  let configurationServiceMock: { getProperty: jest.Mock }

  function setup(themeVersions: Array<1 | 2> | undefined, extraProviders: any[] = []) {
    const themeServiceMock = {
      currentThemes$: of({ versions: themeVersions }),
    }
    configurationServiceMock = {
      getProperty: jest.fn().mockResolvedValue(undefined),
    }
    TestBed.configureTestingModule({
      providers: [
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: ConfigurationService, useValue: configurationServiceMock },
        ...extraProviders,
      ],
    })
    return TestBed.inject(Injector)
  }

  describe('with explicit injector', () => {
    describe('version 2', () => {
      it('should return true when theme supports v2 and THEME_MAX_VERSION is 2', async () => {
        const injector = setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(2, injector)).resolves.toBe(true)
      })

      it('should return true when THEME_MAX_VERSION is provided as string "2"', async () => {
        const injector = setup([2], [{ provide: THEME_MAX_VERSION, useValue: '2' }])
        await expect(themeVersionAvailable(2, injector)).resolves.toBe(true)
      })

      it('should return false when theme supports v2 but THEME_MAX_VERSION is 1', async () => {
        const injector = setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 1 }])
        await expect(themeVersionAvailable(2, injector)).resolves.toBe(false)
      })

      it('should return false when theme does not include v2', async () => {
        const injector = setup([1], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(2, injector)).resolves.toBe(false)
      })

      it('should return falsy when theme.versions is undefined', async () => {
        const injector = setup(undefined, [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(2, injector)).resolves.toBeFalsy()
      })
    })

    describe('version 1', () => {
      it('should return true when theme supports v1 and THEME_MAX_VERSION is 1', async () => {
        const injector = setup([1], [{ provide: THEME_MAX_VERSION, useValue: 1 }])
        await expect(themeVersionAvailable(1, injector)).resolves.toBe(true)
      })

      it('should return true when theme supports v1 and THEME_MAX_VERSION is 2', async () => {
        const injector = setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(1, injector)).resolves.toBe(true)
      })

      it('should return false when theme does not include v1', async () => {
        const injector = setup([2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(1, injector)).resolves.toBe(false)
      })

      it('should return false when maxVersion is 0', async () => {
        const injector = setup([1], [{ provide: THEME_MAX_VERSION, useValue: 0 }])
        await expect(themeVersionAvailable(1, injector)).resolves.toBe(false)
      })

      it('should return falsy when theme.versions is undefined', async () => {
        const injector = setup(undefined, [{ provide: THEME_MAX_VERSION, useValue: 1 }])
        await expect(themeVersionAvailable(1, injector)).resolves.toBeFalsy()
      })
    })

    describe('config service fallback', () => {
      it('should use ConfigurationService when THEME_MAX_VERSION is not provided', async () => {
        const injector = setup([1, 2])
        configurationServiceMock.getProperty.mockResolvedValue('2')

        await expect(themeVersionAvailable(2, injector)).resolves.toBe(true)
        expect(configurationServiceMock.getProperty).toHaveBeenCalledWith(CONFIG_KEY.DEFAULT_THEME_VERSION)
      })

      it('should default maxVersion to 1 when neither token nor config provides a value', async () => {
        const injector = setup([1, 2])
        configurationServiceMock.getProperty.mockResolvedValue(undefined)

        await expect(themeVersionAvailable(1, injector)).resolves.toBe(true)
        await expect(themeVersionAvailable(2, injector)).resolves.toBe(false)
      })

      it('should prefer THEME_MAX_VERSION token over ConfigurationService value', async () => {
        const injector = setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        configurationServiceMock.getProperty.mockResolvedValue('1')

        await expect(themeVersionAvailable(2, injector)).resolves.toBe(true)
        expect(configurationServiceMock.getProperty).not.toHaveBeenCalled()
      })
    })

    describe('unsupported version', () => {
      it('should throw for version 3', async () => {
        const injector = setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(3, injector)).rejects.toThrow(
          'Unsupported theme version: 3. Supported versions are 1 and 2.'
        )
      })

      it('should throw for version 0', async () => {
        const injector = setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])
        await expect(themeVersionAvailable(0, injector)).rejects.toThrow(
          'Unsupported theme version: 0. Supported versions are 1 and 2.'
        )
      })
    })
  })

  describe('without explicit injector (inject context)', () => {
    it('should resolve dependencies via inject() when no injector is passed', async () => {
      setup([1, 2], [{ provide: THEME_MAX_VERSION, useValue: 2 }])

      const result = await TestBed.runInInjectionContext(() => themeVersionAvailable(2))
      expect(result).toBe(true)
    })

    it('should fall back to ConfigurationService via inject() when THEME_MAX_VERSION is absent', async () => {
      setup([1, 2])
      configurationServiceMock.getProperty.mockResolvedValue('2')

      const result = await TestBed.runInInjectionContext(() => themeVersionAvailable(2))
      expect(result).toBe(true)
      expect(configurationServiceMock.getProperty).toHaveBeenCalledWith(CONFIG_KEY.DEFAULT_THEME_VERSION)
    })

    it('should throw for unsupported version when using inject()', async () => {
      setup([1, 2])

      await expect(TestBed.runInInjectionContext(() => themeVersionAvailable(5))).rejects.toThrow(
        'Unsupported theme version: 5. Supported versions are 1 and 2.'
      )
    })
  })
})
