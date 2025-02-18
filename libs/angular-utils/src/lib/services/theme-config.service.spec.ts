import { TestBed } from '@angular/core/testing'
import { ThemeConfigService } from './theme-config.service'
import { ThemeService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

describe('ThemeConfigService', () => {
  let service: ThemeConfigService

  beforeEach(() => {
    const themeServiceMock = {
      currentTheme$: new FakeTopic(),
    }

    const currentThemeTopicMock = TestBed.configureTestingModule({
      providers: [ThemeConfigService, { provide: ThemeService, useValue: themeServiceMock }],
    })

    service = TestBed.inject(ThemeConfigService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should subscribe to currentThemeTopic$', () => {
    // TODO
  })
  it('should insert the variables into the html tags to be compliant with legacy UIs', () => {
    // TODO
  })

  it('should represent old values in the new theme configuration', () => {
    // TODO
  })

  it('should validate the correct adaption of variables in primeng and the html tag', () => {
    // TODO
  })
})
