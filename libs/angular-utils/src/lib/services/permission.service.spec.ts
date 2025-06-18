import { TestBed } from '@angular/core/testing'
import { PermissionService } from './permission.service'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from '../utils/has-permission-checker'
import { of } from 'rxjs'

describe('PermissionService', () => {
  let userServiceMock: any
  let permissionCheckerMock: any

  beforeEach(() => {
    userServiceMock = {
      getPermissions: jest.fn(),
      hasPermission: jest.fn(),
    }
    permissionCheckerMock = {
      hasPermission: jest.fn(),
    }
  })

  function createServiceWithProviders({ userService, checker }: { userService?: any; checker?: any }) {
    TestBed.configureTestingModule({
      providers: [
        userService && { provide: UserService, useValue: userService },
        checker && { provide: HAS_PERMISSION_CHECKER, useValue: checker },
        PermissionService,
      ].filter(Boolean),
    })
    return TestBed.inject(PermissionService)
  }

  it('uses HasPermissionChecker if provided', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(true)
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.hasPermission('perm').subscribe((result) => {
      expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
      expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith('perm')
      expect(result).toBe(true)
    })
  })

  it('uses UserService if HasPermissionChecker is not provided', () => {
    userServiceMock.hasPermission.mockReturnValue(true)
    userServiceMock.getPermissions.mockReturnValue(of(['perm']))
    const service = createServiceWithProviders({ userService: userServiceMock })
    service.hasPermission('perm').subscribe((result) => {
      expect(permissionCheckerMock.hasPermission).not.toHaveBeenCalled()
      expect(userServiceMock.hasPermission).toHaveBeenCalledWith('perm')
      expect(result).toBe(true)
    })
  })

  it('caches permission observables for single permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(true)
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    const obs1 = service.hasPermission('perm')
    const obs2 = service.hasPermission('perm')
    expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith('perm')
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledTimes(1)
    expect(obs1).toBe(obs2)
  })

  it('returns false observable if no checker available', () => {
    // Simulate service with no checker
    const service = Object.create(PermissionService.prototype)
    service.availableHasPermissionChecker = null
    service.falseObservable = of(false)
    expect(service.hasPermission('perm')).toBe(service.falseObservable)
  })

  it('getPermissions returns user permissions if UserService is available', () => {
    userServiceMock.getPermissions.mockReturnValue(of(['perm1', 'perm2']))
    const service = createServiceWithProviders({ userService: userServiceMock })
    service.getPermissions().subscribe((perms) => {
      expect(userServiceMock.getPermissions).toHaveBeenCalled()
      expect(perms).toEqual(['perm1', 'perm2'])
    })
  })

  it('getPermissions returns undefined observable if UserService is not available', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(true)
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.getPermissions().subscribe((perms) => {
      expect(perms).toBeUndefined()
    })
  })

  it('supports array of permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(true)
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    service.hasPermission(['perm1', 'perm2']).subscribe((result) => {
      expect(result).toBe(true)
    })
  })

  it('caches permission observables for arrays of permissions', () => {
    permissionCheckerMock.hasPermission.mockReturnValue(true)
    const service = createServiceWithProviders({ checker: permissionCheckerMock })
    const obs1 = service.hasPermission(['perm1', 'perm2'])
    const obs2 = service.hasPermission(['perm1', 'perm2'])
    expect(userServiceMock.getPermissions).not.toHaveBeenCalled()
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledWith(['perm1', 'perm2'])
    expect(permissionCheckerMock.hasPermission).toHaveBeenCalledTimes(1)
    expect(obs1).toBe(obs2)
  })
})
