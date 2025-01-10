import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ConnectionService, provideConnectionService } from './connection.service'
import { UserService } from './user.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { TranslateService } from '@ngx-translate/core'

describe('ConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations('en', {})],
      providers: [UserService, provideConnectionService()],
    })
  })

  it('should create', fakeAsync(() => {
    const userService = TestBed.inject(UserService)
    const translateService = TestBed.inject(TranslateService)
    const service = TestBed.inject(ConnectionService)
    expect(service).toBeTruthy()
    expect(translateService.currentLang).toBe('en')

    userService.lang$.next('de')
    tick(100)
    expect(translateService.currentLang).toBe('de')
  }))
})
