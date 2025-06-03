import { inject, Injectable } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from '../utils/has-permission-checker'
import { firstValueFrom } from 'rxjs'

/**
 * Service to check and list user permissions using an injected custom permission checker or the UserService.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private userService = inject(UserService, { optional: true })
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  constructor() {
    if (!(this.hasPermissionChecker || this.userService)) {
      throw new Error('UserService or HasPermissionChecker have to be provided to check permissions!')
    }
  }

  /**
   * Checks if the current user has the specified permission(s).
   * @param permissionKey A permission key or an array of permission keys to check.
   * @returns A promise that resolves to true if the user has the specified permission(s), false otherwise.
   */
  hasPermission(permissionKey: string | string[]): Promise<boolean> {
    if (this.hasPermissionChecker) {
      return this.hasPermissionChecker.hasPermission(permissionKey)
    } else if (this.userService) {
      return this.userService.hasPermission(permissionKey)
    }
    return Promise.resolve(false);
  }

  /**
   * Lists the permissions of the current user.
   * @returns A promise that resolves to an array of permission strings or undefined if the user service is not available.
   */
  getPermissions(): Promise<string[] | undefined> {
    if (this.userService) {
      return firstValueFrom(this.userService.getPermissions())
    }
    return Promise.resolve(undefined);
  }
}
