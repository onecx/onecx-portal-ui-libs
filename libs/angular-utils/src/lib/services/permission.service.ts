import { inject, Injectable } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '../utils/has-permission-checker'
import { from, map, Observable, of } from 'rxjs'

/**
 * Service to check and list user permissions using an injected custom permission checker or the UserService.
 */
@Injectable()
export class PermissionService {
  private userService = inject(UserService, { optional: true })
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  /**
   * All observables are cached to avoid infinite re-rendering loops when using the permission service in templates.
   */
  private cachedPermissions = new Map<string, Observable<boolean>>()
  private undefinedObservable = of(undefined)
  private falseObservable = of(false)
  private cachedUserPermissions: Observable<string[]> = of([])

  private availableHasPermissionChecker: HasPermissionChecker | UserService | null =
    this.hasPermissionChecker || this.userService

  constructor() {
    if (!this.availableHasPermissionChecker) {
      throw new Error('UserService or HasPermissionChecker have to be provided to check permissions!')
    }
    if (this.userService) {
      this.cachedUserPermissions = this.userService.getPermissions()
    }
  }

  /**
   * Checks if the current user has the specified permission(s).
   * @param permissionKey A permission key or an array of permission keys to check.
   * @returns An observable that emits true if the user has the permission(s), false otherwise.
   */
  hasPermission(permissionKey: string | string[]): Observable<boolean> {
    return this.lookupPermission(permissionKey)
  }

  private lookupPermission(permissionKey: string | string[]): Observable<boolean> {
    const permissionChecker = this.availableHasPermissionChecker

    if (!permissionChecker) {
      return this.falseObservable
    }

    const cacheKey = JSON.stringify(permissionKey)

    if (!this.cachedPermissions.has(cacheKey)) {
      let hasPermission: Observable<boolean>
      if (this.hasPermissionChecker?.getPermissions) {
        hasPermission = this.hasPermissionChecker.getPermissions().pipe(
          map((permissions) => {
            if (Array.isArray(permissionKey)) {
              return permissionKey.every((key) => permissions?.includes(key))
            }

            return permissions.includes(permissionKey)
          })
        )
      } else {
        hasPermission = from(permissionChecker.hasPermission(permissionKey))
      }

      this.cachedPermissions.set(cacheKey, hasPermission)
    }

    return this.cachedPermissions.get(cacheKey) || this.falseObservable
  }

  /**
   * Lists the permissions of the current user.
   * @returns An observable that emits an array of permission keys or undefined if the UserService is not available.
   */
  getPermissions(): Observable<string[] | undefined> {
    if (this.userService) {
      return this.cachedUserPermissions
    }
    return this.undefinedObservable
  }
}
