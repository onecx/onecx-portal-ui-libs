import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { IS_ADVANCED_THEMING, SLOT_GROUP_PREFIX, THEME_OPTIONS, ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import defaultThemeVariables from '../preset/default-theme-variables'
import { SKIP_STYLE_SCOPING, SLOT_GROUP_NAME } from '@onecx/angular-utils'
import { OverrideType, ThemeOverride } from '@onecx/integration-interface'
import { provideConfigurationServiceMock } from '@onecx/angular-integration-interface/mocks'
import { of } from 'rxjs'

const THEME_V2_MOCK:any = {
  id: 'theme-v2',
  versions: [2],
  properties: {
    v2: {
      primitives: {
        variant: {
          primary: {
            bg: { color: '#1976d2' },
            contrast: '#ffffff',
            color: 'green'
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
describe('ThemeConfigService', () => {

  const theme = {
    id: 'my-test-theme',
    properties: {
      general: {
        'primary-color': '#ababab',
      },
      font: {},
      topbar: {},
      sidebar: {},
    },
  }

  beforeEach(() => {
    const themeServiceMock = {
      currentTheme$: new FakeTopic(),
      currentThemes$: new FakeTopic(),
    }

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        ThemeConfigService,
        provideConfigurationServiceMock(),
        { provide: SLOT_GROUP_NAME, useValue: of(SLOT_GROUP_PREFIX+'header') },
        { provide: IS_ADVANCED_THEMING, useValue: true },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: SKIP_STYLE_SCOPING, useValue: true },
        { provide: THEME_OPTIONS, useValue: { isAdvanced: true, maxVersion: 2 } },
      ],
    })
  })

  it('should be created', () => {
    expect(TestBed.inject(ThemeConfigService)).toBeTruthy()
  })

  it('should subscribe to currentThemeTopic$', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const spy = jest.spyOn(TestBed.inject(ThemeConfigService), 'applyThemeVariablesV1')

    themeService.currentTheme$.publish(theme)
    tick(100)
    expect(spy).toHaveBeenCalledWith(theme)
  }))

  it('should represent old values in the new theme configuration', fakeAsync(() => {
    TestBed.inject(ThemeConfigService)
    const themeService = TestBed.inject(ThemeService)
    const primeng = TestBed.inject(PrimeNG)
    const spy = jest.spyOn(primeng, 'setThemeConfig')

    themeService.currentTheme$.publish(theme)
    tick(100)

    const args = spy.mock.calls.pop()
    expect((args?.[0] as any).theme.preset.semantic.primary['500']).toEqual(theme.properties.general['primary-color'])
    expect((args?.[0] as any).theme.preset.semantic.extend.onecx.topbar.bg.color).toEqual(
      defaultThemeVariables.topbar.topbarBgColor
    )
  }))

  const override: Array<ThemeOverride> = [
    {
      type: OverrideType.PRIMENG,
      value: '{"semantic":{ "primary": {"500": "#3b82f6"},"extend":{"onecx":{"topbar": {"bg":{"color":"#3b82f6"}}}}}}',
    }
  ]

  it('should merge PRIMENG override when IS_ADVANCED_THEMING is true', fakeAsync(() => {
    TestBed.inject(ThemeConfigService)
    const themeService = TestBed.inject(ThemeService);
    const primeng = TestBed.inject(PrimeNG);
    const spy = jest.spyOn(primeng, 'setThemeConfig');

    themeService.currentTheme$.publish(
      {
        ...theme,
        overrides: override,
      }
    );

    tick(100);

    expect(spy).toHaveBeenCalled();
    const callArg = spy.mock.calls.at(-1)?.[0] as any;
    expect(callArg).toBeTruthy();

    const preset = callArg.theme.preset;

    expect(preset.semantic.primary['500']).toEqual('#3b82f6');

    expect(preset.semantic.extend.onecx.topbar.bg.color).toEqual('#3b82f6');
  }))

  it('should not merge override when IS_ADVANCED_THEMING is false', fakeAsync(() => {
    TestBed.overrideProvider(IS_ADVANCED_THEMING, { useValue: false });
    TestBed.inject(ThemeConfigService)

    const themeService = TestBed.inject(ThemeService);
    const primeng = TestBed.inject(PrimeNG);
    const spy = jest.spyOn(primeng, 'setThemeConfig');

    themeService.currentTheme$.publish(
      {
        ...theme,
        overrides: override,
      }
    );

    tick(100);

    expect(spy).toHaveBeenCalled();
    const callArg = spy.mock.calls.at(-1)?.[0] as any;
    expect(callArg).toBeTruthy();

    const preset = callArg.theme.preset;

    expect(preset.semantic.primary['500']).toEqual(theme.properties.general['primary-color']);

    expect(preset.semantic.extend.onecx.topbar.bg.color).not.toEqual('#3b82f6');
  }))

  it('next override value should override previous', fakeAsync(() => {

    const overrides: Array<ThemeOverride> = [
      {
        type: OverrideType.PRIMENG,
        value: '{"semantic": { "primary": {"500": "#ff1e00" },"extend": {"onecx": {"topbar": {"bg": {"color": "#ff1e00" }},"menu": {"text": {"color": "#ff1e00" }}}}}}', //first override round sets colors red
      },
      {
        type: OverrideType.PRIMENG,
        value: '{"semantic": { "primary": {"500": "#ffea00" },"extend": {"onecx": {"topbar": {"bg": {"color": "#ffea00" }}}}}}',  //second round sets colors yellow, should override 1st and 2nd variable
      },
      {
        type: OverrideType.PRIMENG,
        value: '{"semantic":{ "primary": {"500": "#04ff00" }}}', //sets colors green, should overwrite 1st variable
      }
    ]

    TestBed.inject(ThemeConfigService)
    const themeService = TestBed.inject(ThemeService);
    const primeng = TestBed.inject(PrimeNG);
    const spy = jest.spyOn(primeng, 'setThemeConfig');

    themeService.currentTheme$.publish(
      {
        ...theme,
        overrides: overrides,
      }
    );

    tick(100);

    expect(spy).toHaveBeenCalled();
    const callArg = spy.mock.calls.at(-1)?.[0] as any;
    expect(callArg).toBeTruthy();

    const preset = callArg.theme.preset;

    expect(preset.semantic.extend.onecx.menu.text.color).toEqual('#ff1e00');

    expect(preset.semantic.extend.onecx.topbar.bg.color).toEqual('#ffea00');

    expect(preset.semantic.primary['500']).toEqual('#04ff00');
  }))

  describe('getThemeProperties', () => {    

    it('merges base primitives/usages with valid region override', async () => {
      const configService = TestBed.inject(ThemeConfigService)
      const themeParam = { ...THEME_V2_MOCK, properties: THEME_V2_MOCK.properties.v2 ?? {} }

      const properties = await (configService['getThemeProperties'])(themeParam)

      expect(properties.primitives?.font?.family).toEqual('Inter, sans-serif')
      expect(properties.primitives?.font?.size).toEqual('16px')
      expect(properties.primitives?.font?.weight).toEqual('override_600')
      expect(properties.usages?.region?.font?.family).toEqual('override_font_family')
    })

    it('returns base properties when regionOverrides is missing', async () => {
      const themeWithoutOverrides = {
        ...THEME_V2_MOCK,
        properties: {
          ...THEME_V2_MOCK.properties.v2,
          regionOverrides: undefined,
        }
      }
      const configService = TestBed.inject(ThemeConfigService)
      const properties = await (configService['getThemeProperties'])(themeWithoutOverrides)

      expect(properties).toEqual(themeWithoutOverrides.properties)
      expect(properties.primitives?.variant?.primary?.contrast).toEqual('#ffffff')
      expect(properties.usages?.region?.font?.family).toEqual('Existing_font_family')
    })

    it('returns base values when region key is valid but override entry is not set', async () => {
      const configService = TestBed.inject(ThemeConfigService)
      const themeNoHeaderOverrides = {
        ...THEME_V2_MOCK,
        properties: {
          ...THEME_V2_MOCK.properties.v2,
          regionOverrides: {
            subHeader: {
              primitives: {
                font: { weight: 'bold' },
              },
            },
          },
        },
      }

      const properties = await (configService['getThemeProperties'])(themeNoHeaderOverrides)

      expect((properties.primitives?.variant?.primary?.bg as any)?.color).toEqual('#1976d2')
      expect(properties.primitives?.font?.family).toEqual('Inter, sans-serif')
    })
  })
})
