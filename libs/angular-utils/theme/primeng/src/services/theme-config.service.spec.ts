jest.mock('@onecx/angular-utils', () => {
  const actual = jest.requireActual('@onecx/angular-utils')
  return {
    ...actual,
    themeVersionAvailable: jest.fn(),
  }
})

jest.mock('@onecx/angular-utils/style', () => ({
  ensureStyles: jest.fn(),
  useStyleForMfe: jest.fn(),
  useStyleForRc: jest.fn(),
  removeMfeUsageFromStyle: jest.fn(),
  removeRcUsageFromStyle: jest.fn(),
}))

jest.mock('../utils/mapper/mapper', () => ({
  mapThemeToPreset: jest.fn(),
}))

import { Component } from '@angular/core'
import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import {
  IS_ADVANCED_THEMING,
  SLOT_GROUP_PREFIX,
  THEME_OPTIONS,
  ThemeConfigService,
  provideThemeConfigService,
} from './theme-config.service'
import { AppStateService, ConfigurationService, ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import {
  REMOTE_COMPONENT_CONFIG,
  REMOTE_COMPONENT_CONTEXT,
  THEME_MAX_VERSION,
  themeVersionAvailable,
} from '@onecx/angular-utils'
import {
  ensureStyles,
  removeMfeUsageFromStyle,
  removeRcUsageFromStyle,
  useStyleForMfe,
  useStyleForRc,
} from '@onecx/angular-utils/style'
import { mapThemeToPreset } from '../utils/mapper/mapper'
import {
  CurrentThemes,
  MfeInfo,
  OverrideType,
  ThemeOverride,
} from '@onecx/integration-interface'
import { Carousel, CarouselModule } from 'primeng/carousel'
import { UseStyle } from 'primeng/usestyle'
import { ReplaySubject } from 'rxjs'

const themeVersionAvailableMock = themeVersionAvailable as jest.MockedFunction<typeof themeVersionAvailable>
const mapThemeToPresetMock = mapThemeToPreset as jest.MockedFunction<typeof mapThemeToPreset>
const ensureStylesMock = ensureStyles as jest.MockedFunction<typeof ensureStyles>
const useStyleForMfeMock = useStyleForMfe as jest.MockedFunction<typeof useStyleForMfe>
const useStyleForRcMock = useStyleForRc as jest.MockedFunction<typeof useStyleForRc>
const removeMfeUsageFromStyleMock = removeMfeUsageFromStyle as jest.MockedFunction<typeof removeMfeUsageFromStyle>
const removeRcUsageFromStyleMock = removeRcUsageFromStyle as jest.MockedFunction<typeof removeRcUsageFromStyle>

type ThemeConfigServiceTestOptions = {
  isAdvanced?: boolean
  optionsIsAdvanced?: boolean
  maxVersion?: number
  cssOverrides?: unknown
  overrides?: unknown
}

const flushAsync = async () => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve()
  }
}

const THEME_V2_MOCK: CurrentThemes = {
  id: 'theme-v2',
  versions: [2],
  properties: {
    v2: {
      primitives: {
        variant: {
          primary: {
            bg: { color: '#1976d2' },
            contrast: '#ffffff'
          },
        },
        font: {
          family: 'Inter, sans-serif',
          size: '16px',
          weight: '400',
        },
      },
      usages: {
        region: {
          font: {
            family: 'Existing_font_family'
          },
        },
      },
      regionOverrides: {
        header: {
          primitives: {
            variant: {
              primary: {
                bg: { color: 'override_#0d47a1' },
              },
            },
            font: {
              weight: 'override_600',
            },
          },
          usages: {
            region: {
              font: {
                family: 'override_font_family',
              }
            }
          }
        }
      }
    }
  }
}

@Component({
  standalone: true,
  imports: [CarouselModule],
  template: '<p-carousel [value]="items"></p-carousel>',
})
class CarouselHostComponent {
  items = [{ id: 1 }, { id: 2 }]
}

describe('ThemeConfigService', () => {
  let currentThemes$: FakeTopic<CurrentThemes>
  let currentMfe$: FakeTopic<MfeInfo>
  let setThemeConfigSpy: jest.SpyInstance

  const useStyleNoop = { use: jest.fn() }

  const themeV2: CurrentThemes = {
    id: 'theme-v2-id',
    properties: {
      v2: { primitives: {} },
    },
    versions: [1, 2],
  } as unknown as CurrentThemes

  const themeV1: CurrentThemes = {
    id: 'theme-v1-id',
    properties: {
      v1: { general: { 'primary-color': '#ababab' } },
    },
    versions: [1],
  } as unknown as CurrentThemes

  const presetFromMapper = {
    semantic: { primary: { 500: '#mapped' } },
  }

  const configure = (options: ThemeConfigServiceTestOptions = {}, extraProviders: any[] = [], imports: any[] = []) => {
    currentThemes$ = new FakeTopic<CurrentThemes>()
    currentMfe$ = new FakeTopic<MfeInfo>({
      appId: 'app-id',
      productName: 'product-name',
    } as MfeInfo)
    const themeServiceMock = { currentThemes$ }
    const appStateMock = { currentMfe$ }
    const configServiceMock = { getProperty: jest.fn() }

    TestBed.configureTestingModule({
      imports,
      providers: [
        ThemeConfigService,
        { provide: IS_ADVANCED_THEMING, useValue: options.isAdvanced ?? false },
        {
          provide: THEME_OPTIONS,
          useValue: {
            isAdvanced: options.optionsIsAdvanced ?? options.isAdvanced,
            maxVersion: options.maxVersion,
            cssOverrides: options.cssOverrides,
            overrides: options.overrides,
          },
        },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: AppStateService, useValue: appStateMock },
        { provide: ConfigurationService, useValue: configServiceMock },
        { provide: UseStyle, useValue: useStyleNoop },
        ...extraProviders,
      ],
    })

    const primeng = TestBed.inject(PrimeNG)
    setThemeConfigSpy = jest.spyOn(primeng, 'setThemeConfig').mockImplementation(() => undefined)
  }

  beforeEach(() => {
    themeVersionAvailableMock.mockReset()
    mapThemeToPresetMock.mockReset()
    ensureStylesMock.mockReset()
    useStyleForMfeMock.mockReset()
    useStyleForRcMock.mockReset()
    removeMfeUsageFromStyleMock.mockReset()
    removeRcUsageFromStyleMock.mockReset()
    useStyleNoop.use.mockReset()

    mapThemeToPresetMock.mockReturnValue({
      variables: presetFromMapper,
      css: 'mapped-css;',
    } as any)
  })

  describe('creation', () => {
    it('should be created', () => {
      configure()
      expect(TestBed.inject(ThemeConfigService)).toBeTruthy()
    })
  })

  describe('currentThemes$ subscription', () => {
    it('should invoke applyThemeVariablesV2 when v2 is available', fakeAsync(() => {
      themeVersionAvailableMock.mockImplementation(async (version: number) => version === 2)
      configure()
      const service = TestBed.inject(ThemeConfigService)
      const spy = jest.spyOn(service, 'applyThemeVariablesV2')

      currentThemes$.publish(themeV2)
      tick(100)

      expect(spy).toHaveBeenCalledTimes(1)
      const arg = spy.mock.calls[0][0]
      expect(arg.properties).toEqual(themeV2.properties.v2)
    }))

    it('should invoke applyThemeVariablesV1 when v1 is available but v2 is not', fakeAsync(() => {
      themeVersionAvailableMock.mockImplementation(async (version: number) => version === 1)
      configure()
      const service = TestBed.inject(ThemeConfigService)
      const spy = jest.spyOn(service, 'applyThemeVariablesV1')

      currentThemes$.publish(themeV1)
      tick(100)

      expect(spy).toHaveBeenCalledTimes(1)
      const arg = spy.mock.calls[0][0]
      expect(arg.properties).toEqual(themeV1.properties.v1)
    }))

    it('should reach the error branch when no theme version is available', async () => {
      themeVersionAvailableMock.mockResolvedValue(false)

      const subscribers: Array<(value: CurrentThemes) => Promise<void> | void> = []
      const topicMock = {
        subscribe(cb: (value: CurrentThemes) => Promise<void> | void) {
          subscribers.push(cb)
          return { unsubscribe: () => undefined }
        },
      }
      currentMfe$ = new FakeTopic<MfeInfo>({ appId: 'a', productName: 'p' } as MfeInfo)
      TestBed.configureTestingModule({
        providers: [
          ThemeConfigService,
          { provide: IS_ADVANCED_THEMING, useValue: false },
          { provide: THEME_OPTIONS, useValue: { maxVersion: 3 } },
          { provide: ThemeService, useValue: { currentThemes$: topicMock } },
          { provide: AppStateService, useValue: { currentMfe$ } },
          { provide: ConfigurationService, useValue: { getProperty: jest.fn() } },
          { provide: UseStyle, useValue: useStyleNoop },
        ],
      })
      TestBed.inject(ThemeConfigService)
      expect(subscribers.length).toBe(1)

      await expect(
        Promise.resolve(subscribers[0]({ ...themeV2, versions: [] } as unknown as CurrentThemes))
      ).rejects.toThrow(/App is requesting a non-existing theme version/)
    })
  })

  describe('applyThemeVariablesV2', () => {
    beforeEach(() => {
      themeVersionAvailableMock.mockImplementation(async (version: number) => version === 2)
    })

    it('should pass mapped preset to PrimeNG and apply css via ensureStyles for MFE', fakeAsync(() => {
      configure()
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV2)
      tick(100)

      expect(setThemeConfigSpy).toHaveBeenCalledTimes(1)
      const config = setThemeConfigSpy.mock.calls[0][0] as any
      expect(config.theme.preset).toEqual(presetFromMapper)
      expect(config.theme.options).toEqual({ darkModeSelector: 'system' })

      expect(ensureStylesMock).toHaveBeenCalledTimes(1)
      const [productName, appId, options] = ensureStylesMock.mock.calls[0]
      expect(productName).toBe('product-name')
      expect(appId).toBe('app-id')
      expect(options).toEqual({ type: 'mfe' })
    }))

    it('should apply carousel settings to real PrimeNG carousel instances', async () => {
      configure({}, [], [CarouselHostComponent])
      TestBed.inject(ThemeConfigService)

      const fixture = TestBed.createComponent(CarouselHostComponent)
      fixture.detectChanges()

      currentThemes$.publish({
        ...themeV2,
        properties: {
          v2: {
            primitives: {},
            usages: {
              carousel: {
                settings: {
                  orientation: 'vertical',
                  showIndicators: false,
                  showNavigators: false,
                  circular: true,
                  autoplayInterval: 2500,
                },
              },
            },
          },
        },
      } as unknown as CurrentThemes)

      await flushAsync()
      fixture.detectChanges()

      const carousel = fixture.debugElement.query(By.directive(Carousel)).componentInstance as Carousel
      expect(carousel.orientation).toBe('vertical')
      expect(carousel.showIndicators).toBe(false)
      expect(carousel.showNavigators).toBe(false)
      expect(carousel.circular).toBe(true)
      expect(carousel.autoplayInterval).toBe(2500)
    })

    it('should merge PRIMENG overrides when advanced theming is enabled via token', fakeAsync(() => {
      const overrides: ThemeOverride[] = [
        {
          type: OverrideType.PRIMENG,
          value: '{"semantic":{"primary":{"500":"#advanced"}}}',
        },
        // override with no value -> filtered out
        { type: OverrideType.PRIMENG },
        // non-primeng override -> filtered out
        { type: OverrideType.CSS, value: '.x{}' },
      ]
      configure({ isAdvanced: true })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish({ ...themeV2, overrides })
      tick(100)

      const preset = setThemeConfigSpy.mock.calls[0][0].theme.preset
      expect(preset.semantic.primary['500']).toBe('#advanced')
    }))

    it('should merge PRIMENG overrides when advanced theming is enabled via options', fakeAsync(() => {
      const overrides: ThemeOverride[] = [
        { type: OverrideType.PRIMENG, value: '{"semantic":{"primary":{"500":"#opt"}}}' },
      ]
      configure({ isAdvanced: false, optionsIsAdvanced: true })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish({ ...themeV2, overrides })
      tick(100)

      const preset = setThemeConfigSpy.mock.calls[0][0].theme.preset
      expect(preset.semantic.primary['500']).toBe('#opt')
    }))

    it('should ignore overrides when advanced theming is disabled', fakeAsync(() => {
      const overrides: ThemeOverride[] = [
        { type: OverrideType.PRIMENG, value: '{"semantic":{"primary":{"500":"#ignored"}}}' },
      ]
      configure({ isAdvanced: false })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish({ ...themeV2, overrides })
      tick(100)

      const preset = setThemeConfigSpy.mock.calls[0][0].theme.preset
      expect(preset).toEqual(presetFromMapper)
    }))

    it('should skip override parsing when overrides array is empty', fakeAsync(() => {
      configure({ isAdvanced: true })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish({ ...themeV2, overrides: [] })
      tick(100)

      const preset = setThemeConfigSpy.mock.calls[0][0].theme.preset
      expect(preset).toEqual(presetFromMapper)
    }))

    it('should append cssOverrides string to theme css', fakeAsync(() => {
      configure({ cssOverrides: '.extra{color:red}' })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV2)
      tick(100)

      const cssCallback = ensureStylesMock.mock.calls[0][5]
      return cssCallback().then((css) => {
        expect(css).toBe('mapped-css;.extra{color:red}')
      })
    }))

    it('should evaluate cssOverrides function in injection context', fakeAsync(() => {
      const cssFn = jest.fn(() => '.fn{color:blue}')
      configure({ cssOverrides: cssFn })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV2)
      tick(100)

      expect(cssFn).toHaveBeenCalledTimes(1)
      const cssCallback = ensureStylesMock.mock.calls[0][5]
      return cssCallback().then((css) => {
        expect(css).toBe('mapped-css;.fn{color:blue}')
      })
    }))

    it('should treat undefined cssOverrides as empty string', fakeAsync(() => {
      configure()
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV2)
      tick(100)

      const cssCallback = ensureStylesMock.mock.calls[0][5]
      return cssCallback().then((css) => {
        expect(css).toBe('mapped-css;')
      })
    }))

    it('should use RC style helpers when remote component context is provided', fakeAsync(() => {
      const rcContext = new ReplaySubject<{ slotName: string }>(1)
      rcContext.next({ slotName: 'my-slot' })

      const rcConfig = new ReplaySubject<{ appId: string; productName: string; permissions: string[]; baseUrl: string }>(1)
      rcConfig.next({ appId: 'rc-app', productName: 'rc-product', permissions: [], baseUrl: '/' })

      configure({}, [
        { provide: REMOTE_COMPONENT_CONTEXT, useValue: rcContext },
        { provide: REMOTE_COMPONENT_CONFIG, useValue: rcConfig },
      ])
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV2)
      tick(100)

      expect(ensureStylesMock).toHaveBeenCalledTimes(1)
      const [productName, appId, options, useStyleCb, removeUsageCb] = ensureStylesMock.mock.calls[0]
      expect(productName).toBe('rc-product')
      expect(appId).toBe('rc-app')
      expect(options).toEqual({ type: 'rc', slotName: 'my-slot' })

      const styleElement = {} as HTMLStyleElement
      useStyleCb(styleElement)
      expect(useStyleForRcMock).toHaveBeenCalledWith(styleElement, 'my-slot')

      removeUsageCb(styleElement)
      expect(removeRcUsageFromStyleMock).toHaveBeenCalledWith(styleElement, 'my-slot')
    }))

    it('should use MFE style helpers when no remote component context is provided', fakeAsync(() => {
      configure()
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV2)
      tick(100)

      const [, , , useStyleCb, removeUsageCb] = ensureStylesMock.mock.calls[0]
      const styleElement = {} as HTMLStyleElement

      useStyleCb(styleElement)
      expect(useStyleForMfeMock).toHaveBeenCalledWith(styleElement)

      removeUsageCb(styleElement)
      expect(removeMfeUsageFromStyleMock).toHaveBeenCalledWith(styleElement)
    }))
  })

  describe('applyThemeVariablesV1', () => {
    beforeEach(() => {
      themeVersionAvailableMock.mockImplementation(async (version: number) => version === 1)
    })

    it('should build the legacy preset and apply it via PrimeNG', fakeAsync(() => {
      configure()
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish(themeV1)
      tick(100)

      expect(setThemeConfigSpy).toHaveBeenCalledTimes(1)
      const config = setThemeConfigSpy.mock.calls[0][0] as any
      expect(config.theme.options).toEqual({ darkModeSelector: false })
      expect(config.theme.preset.semantic.primary['500']).toBe('#ababab')
    }))

    it('should merge PRIMENG overrides for v1 when advanced theming is enabled', fakeAsync(() => {
      const overrides: ThemeOverride[] = [
        { type: OverrideType.PRIMENG, value: '{"semantic":{"primary":{"500":"#v1-adv"}}}' },
      ]
      configure({ isAdvanced: true })
      TestBed.inject(ThemeConfigService)

      currentThemes$.publish({ ...themeV1, overrides })
      tick(100)

      const config = setThemeConfigSpy.mock.calls[0][0] as any
      expect(config.theme.preset.semantic.primary['500']).toBe('#v1-adv')
    }))
  })

  describe('provideThemeConfigService factory', () => {
    it('should default to non-advanced theming when called without arguments', () => {
      const providers = provideThemeConfigService()
      const isAdvancedProvider = providers.find((p: any) => p.provide === IS_ADVANCED_THEMING)
      const optionsProvider = providers.find((p: any) => p.provide === THEME_OPTIONS)
      expect(isAdvancedProvider.useValue).toBe(false)
      expect(optionsProvider.useValue).toEqual({})
    })

    it('should accept a boolean to toggle advanced theming', () => {
      const providers = provideThemeConfigService(true)
      const isAdvancedProvider = providers.find((p: any) => p.provide === IS_ADVANCED_THEMING)
      const optionsProvider = providers.find((p: any) => p.provide === THEME_OPTIONS)
      expect(isAdvancedProvider.useValue).toBe(true)
      expect(optionsProvider.useValue).toEqual({ isAdvanced: true })
    })

    it('should accept an options object', () => {
      const options = { isAdvanced: true, maxVersion: 2 }
      const providers = provideThemeConfigService(options)
      const isAdvancedProvider = providers.find((p: any) => p.provide === IS_ADVANCED_THEMING)
      const optionsProvider = providers.find((p: any) => p.provide === THEME_OPTIONS)
      expect(isAdvancedProvider.useValue).toBe(true)
      expect(optionsProvider.useValue).toBe(options)
    })

    it('should expose the THEME_MAX_VERSION value from the options object', () => {
      const providers = provideThemeConfigService({ maxVersion: 2 })
      const maxVersionProvider = providers.find((p: any) => p?.provide === THEME_MAX_VERSION)
      expect(maxVersionProvider.useValue).toBe(2)
    })

    it('should set THEME_MAX_VERSION to undefined when boolean overload is used', () => {
      const providers = provideThemeConfigService(false)
      const maxVersionProvider = providers.find((p: any) => p?.provide === THEME_MAX_VERSION)
      expect(maxVersionProvider.useValue).toBeUndefined()
    })

    it('should register an environment initializer that injects ThemeConfigService', async () => {
      themeVersionAvailableMock.mockResolvedValue(true)
      mapThemeToPresetMock.mockReturnValue({ variables: {}, css: '' } as any)

      currentThemes$ = new FakeTopic<CurrentThemes>()
      currentMfe$ = new FakeTopic<MfeInfo>({ appId: 'a', productName: 'p' } as MfeInfo)

      TestBed.configureTestingModule({
        providers: [
          ...provideThemeConfigService({ isAdvanced: false, maxVersion: 2 }),
          { provide: ThemeService, useValue: { currentThemes$ } },
          { provide: AppStateService, useValue: { currentMfe$ } },
          { provide: ConfigurationService, useValue: { getProperty: jest.fn() } },
          { provide: UseStyle, useValue: useStyleNoop },
        ],
      })

      const service = TestBed.inject(ThemeConfigService)
      expect(service).toBeTruthy()
      await flushAsync()
    })
  })

  describe('subscribe block edge cases', () => {
    it('should fall back to empty properties when v2 is missing on the theme payload', fakeAsync(() => {
      themeVersionAvailableMock.mockImplementation(async (version: number) => version === 2)
      configure()
      const service = TestBed.inject(ThemeConfigService)
      const spy = jest.spyOn(service, 'applyThemeVariablesV2').mockResolvedValue(undefined)

      currentThemes$.publish({
        id: 'no-v2',
        properties: undefined,
        versions: [2],
      } as unknown as CurrentThemes)
      tick(100)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0].properties).toEqual({})
    }))

    it('should render the error message with undefined when versions is missing', async () => {
      themeVersionAvailableMock.mockResolvedValue(false)

      const subscribers: Array<(value: CurrentThemes) => Promise<void> | void> = []
      const topicMock = {
        subscribe(cb: (value: CurrentThemes) => Promise<void> | void) {
          subscribers.push(cb)
          return { unsubscribe: () => undefined }
        },
      }
      currentMfe$ = new FakeTopic<MfeInfo>({ appId: 'a', productName: 'p' } as MfeInfo)
      TestBed.configureTestingModule({
        providers: [
          ThemeConfigService,
          { provide: IS_ADVANCED_THEMING, useValue: false },
          { provide: THEME_OPTIONS, useValue: { maxVersion: 3 } },
          { provide: ThemeService, useValue: { currentThemes$: topicMock } },
          { provide: AppStateService, useValue: { currentMfe$ } },
          { provide: ConfigurationService, useValue: { getProperty: jest.fn() } },
          { provide: UseStyle, useValue: useStyleNoop },
        ],
      })
      TestBed.inject(ThemeConfigService)

      await expect(
        Promise.resolve(
          subscribers[0]({
            id: 'no-versions',
            properties: { v2: {} },
          } as unknown as CurrentThemes)
        )
      ).rejects.toThrow(/Available versions: undefined, requested maximum version: 3/)
    })
  })

  describe('private helper edge cases', () => {
    it('foldOverrides returns an empty object when overrides is missing or empty', () => {
      configure()
      const service = TestBed.inject(ThemeConfigService) as any
      expect(service.foldOverrides(undefined)).toEqual({})
      expect(service.foldOverrides([])).toEqual({})
    })

    it('foldOverrides skips entries without a value and merges the rest', () => {
      configure()
      const service = TestBed.inject(ThemeConfigService) as any
      const result = service.foldOverrides([
        { value: null },
        { value: { a: 1 } },
        { value: { b: 2 } },
      ])
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('parsePrimeNGOverridesValue returns an empty object when overrides is missing or empty', () => {
      configure()
      const service = TestBed.inject(ThemeConfigService) as any
      expect(service.parsePrimeNGOverridesValue(undefined)).toEqual({})
      expect(service.parsePrimeNGOverridesValue([])).toEqual({})
    })
  })

  describe('getThemeProperties', () => {
    const configureWithSlotGroupName = () => {
      const rcContext = new ReplaySubject<{ slotGroupName: string }>(1)
      rcContext.next({ slotGroupName: SLOT_GROUP_PREFIX + 'header' })

       configure({}, [
        { provide: REMOTE_COMPONENT_CONTEXT, useValue: rcContext }
      ])
    }

    it('merges base primitives/usages with valid region override', async () => {
      configureWithSlotGroupName()      
      const themeConfigService = TestBed.inject(ThemeConfigService)
      const themeParam = { ...THEME_V2_MOCK, properties: THEME_V2_MOCK.properties.v2 ?? {} }

      const properties = await (themeConfigService['getThemeProperties'])(themeParam)

      expect(properties.primitives?.font?.family).toEqual('Inter, sans-serif')
      expect(properties.primitives?.font?.size).toEqual('16px')
      //expect(properties.primitives?.font?.weight).toEqual('override_600')
      expect(properties.usages?.region?.font?.family).toEqual('override_font_family')
    })

    it('returns base properties when regionOverrides is missing', async () => {
      configureWithSlotGroupName()
      const themeWithoutOverrides = {
        ...THEME_V2_MOCK,
        properties: {
          ...THEME_V2_MOCK.properties.v2,
          regionOverrides: undefined,
        }
      }
      const themeConfigService = TestBed.inject(ThemeConfigService)
      const properties = await (themeConfigService['getThemeProperties'])(themeWithoutOverrides)

      expect(properties).toEqual(themeWithoutOverrides.properties)
      expect(properties.primitives?.variant?.primary?.contrast).toEqual('#ffffff')
      expect(properties.usages?.region?.font?.family).toEqual('Existing_font_family')
    })

    it('returns base values when region key is valid but override entry is not set', async () => {
      configureWithSlotGroupName()
      const themeConfigService = TestBed.inject(ThemeConfigService)
      const themeNoHeaderOverrides = {
        ...THEME_V2_MOCK,
        properties: {
          ...THEME_V2_MOCK.properties.v2,
          regionOverrides: {
            subHeader: {
              primitives: {
                variant: {
                  primary: {
                    bg: { color: 'override_#0d47a1' },
                  },
                },
                font: { weight: 'bold' },
              }
            }
          }
        }
      }

      const properties = await (themeConfigService['getThemeProperties'])(themeNoHeaderOverrides)

      expect((properties.primitives?.variant?.primary?.bg as any)?.color).toEqual('#1976d2')
      expect(properties.primitives?.font?.family).toEqual('Inter, sans-serif')
    })
  })
})
