import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-accelerator/testing'
import { UserService } from '@onecx/angular-integration-interface'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TranslationConnectionService } from './translation-connection.service'

describe('ConnectionService', () => {
  let service: TranslationConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideUserServiceMock(), provideTranslateTestingService({})],
    })
  })

  it('should create', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      service = new TranslationConnectionService()
    })

    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    expect(service).toBeTruthy()
    expect(translateService.getCurrentLang()).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.getCurrentLang()).toBe('de')
  }))
})
