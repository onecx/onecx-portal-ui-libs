import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { IS_ADVANCED_THEMING, ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import { SKIP_STYLE_SCOPING } from './custom-use-style.service'
import defaultThemeVariables from '../theme/preset/default-theme-variables'
import { OverrideType, ThemeOverride } from '@onecx/integration-interface'

describe('ThemeConfigService', () => {
  let service: ThemeConfigService
  const overrides: Array<ThemeOverride> = [
    {
      type: OverrideType.PRIMENG,
      value: '{"semantic":{ "primary": {"500": "#3b82f6"},"extend":{"onecx":{"topbar": {"bg":{"color":"#3b82f6"}}}}}}',
    },
    {
      type: OverrideType.PRIMENG,
      value: '{"semantic":{ "primary": {"500": "#b23bff"}, "extend":{"onecx":{"menu": {"text":{"color":"#3b82f6"}}}}}}',
    },
  ]
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
  const themeWithOverrides = {
    ...theme,
    overrides: overrides,
  }
  beforeEach(() => {
    const themeServiceMock = {
      currentTheme$: new FakeTopic(),
    }

    TestBed.configureTestingModule({
      providers: [
        ThemeConfigService,
        { provide: IS_ADVANCED_THEMING, useValue: true },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: SKIP_STYLE_SCOPING, useValue: true },
      ],
    })

    service = TestBed.inject(ThemeConfigService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should subscribe to currentThemeTopic$', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const spy = jest.spyOn(service, 'applyThemeVariables')

    themeService.currentTheme$.publish(theme)
    tick(100)
    expect(spy).toHaveBeenCalledWith(theme)
  }))

  it('should represent old values in the new theme configuration', fakeAsync(() => {
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
   it('should merge PRIMENG overrides', fakeAsync(() => {
      const themeService = TestBed.inject(ThemeService);
      const primeng = TestBed.inject(PrimeNG);
      const spy = jest.spyOn(primeng, 'setThemeConfig');

      themeService.currentTheme$.publish(themeWithOverrides);
      tick(100);

      expect(spy).toHaveBeenCalled();
      const callArg = spy.mock.calls.at(-1)?.[0] as any;
      expect(callArg).toBeTruthy();

      const preset = callArg.theme.preset;

      expect(preset.semantic.primary['500']).toEqual('#b23bff');

      expect(preset.semantic.extend.onecx.topbar.bg.color).toEqual('#3b82f6');

      expect(preset.semantic.extend.onecx.menu.text.color).toEqual('#3b82f6');
  }))
})
