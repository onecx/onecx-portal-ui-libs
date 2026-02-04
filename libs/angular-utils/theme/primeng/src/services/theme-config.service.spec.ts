import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { IS_ADVANCED_THEMING, ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import defaultThemeVariables from '../preset/default-theme-variables'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'
import { OverrideType, ThemeOverride } from '@onecx/integration-interface'

describe('ThemeConfigService', () => {
  let service: ThemeConfigService

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
    }

    TestBed.configureTestingModule({
      providers: [
        ThemeConfigService,
        { provide: IS_ADVANCED_THEMING, useValue: true },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: SKIP_STYLE_SCOPING, useValue: true },
      ],
    })
  })

  it('should be created', () => {
    expect(TestBed.inject(ThemeConfigService)).toBeTruthy()
  })

  it('should subscribe to currentThemeTopic$', fakeAsync(() => {
    const themeService = TestBed.inject(ThemeService)
    const spy = jest.spyOn(TestBed.inject(ThemeConfigService), 'applyThemeVariables')

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
})
