import { DynamicLocaleId } from './dynamic-locale-id.utils'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { TestBed } from '@angular/core/testing'
import { LOCALE_ID } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'

describe('DynamicLocaleId', () => {
  let dynamicLocaleId: DynamicLocaleId
  let userServiceMock: UserServiceMock

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideUserServiceMock(),
        {
          provide: LOCALE_ID,
          useClass: DynamicLocaleId,
          deps: [UserService],
        },
      ],
    })

    userServiceMock = TestBed.inject(UserServiceMock)
    dynamicLocaleId = new DynamicLocaleId(userServiceMock as any)
  })

  it('should return the current language from userService.lang$', () => {
    userServiceMock.lang$.next('fr')
    expect(dynamicLocaleId.valueOf()).toBe('fr')
  })

  it('should return the correct length of the current language', () => {
    userServiceMock.lang$.next('es')
    expect(dynamicLocaleId.length).toBe(2)
  })

  it('should proxy string methods to the current language', () => {
    userServiceMock.lang$.next('en-US')
    const dynamicLocaleId = TestBed.inject(LOCALE_ID)
    expect(dynamicLocaleId.toLowerCase()).toBe('en-us')
    expect(dynamicLocaleId.toUpperCase()).toBe('EN-US')
  })
})
