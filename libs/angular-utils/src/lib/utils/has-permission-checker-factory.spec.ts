import { TestBed } from '@angular/core/testing'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from './has-permission-checker'
import { hasPermissionCheckerFactory } from './has-permission-checker-factory'
import { Injector } from '@angular/core'

describe('hasPermissionCheckerFactory', () => {
  let injector: Injector
  const mockUserService = {
    hasPermission: jest.fn(),
  }

  const customPermissionChecker = {
    hasPermission: jest.fn(),
    someCustomMethod: jest.fn(),
  }

  describe('withProviders', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: UserService, useValue: mockUserService },
          { provide: HAS_PERMISSION_CHECKER, useValue: customPermissionChecker },
        ],
      })
      injector = TestBed.inject(Injector)
    })
    it('should return the provided hasPermissionChecker when it exists', () => {
      const result = hasPermissionCheckerFactory(injector, customPermissionChecker)
      expect(result).toBe(customPermissionChecker)
    })

    it('should return a UserService instance when hasPermissionChecker is not provided but UserService exists', () => {
      const result = hasPermissionCheckerFactory(injector, null)
      expect(result).toBe(mockUserService)
    })
  })

  describe('withoutProviders', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({})
      injector = TestBed.inject(Injector)
    })
    it('should create a new UserService instance when neither hasPermissionChecker nor UserService exists', () => {
      const result = hasPermissionCheckerFactory(injector, null)
      const newUserService = injector.get(UserService, null)

      expect(result).toBe(newUserService)
      expect(newUserService).toBeTruthy()
    })
  })
})
