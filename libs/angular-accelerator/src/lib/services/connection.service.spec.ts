import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ConnectionService } from './connection.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import { MockUserService } from '@onecx/angular-integration-interface/mocks'

describe('ConnectionService', () => {
  let service: ConnectionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [{ provide: UserService, useClass: MockUserService }],
    })
  })

  it('should create', fakeAsync(() => {
    TestBed.runInInjectionContext(() => {
      service = new ConnectionService()
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
