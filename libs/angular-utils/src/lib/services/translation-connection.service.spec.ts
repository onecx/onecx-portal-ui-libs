import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { TranslationConnectionService } from './translation-connection.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('ConnectionService', () => {
  let service: TranslationConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [provideUserServiceMock()],
    })
  })

  it('should create', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      service = new TranslationConnectionService()
    })

    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    expect(service).toBeTruthy()
    expect(translateService.currentLang).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.currentLang).toBe('de')
  }))
})
