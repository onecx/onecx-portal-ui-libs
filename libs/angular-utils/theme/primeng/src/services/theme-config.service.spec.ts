import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { PrimeNG } from 'primeng/config'
import defaultThemeVariables from '../preset/default-theme-variables'
import { SKIP_STYLE_SCOPING } from '@onecx/angular-utils'

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
})
