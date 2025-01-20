import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ConnectionService } from './connection.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'

describe('ConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [UserService],
    })
  })

  it('should create', fakeAsync(() => {
    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    const service = new ConnectionService(userService, translateService)
    expect(service).toBeTruthy()
    expect(translateService.currentLang).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.currentLang).toBe('de')
  }))
})
