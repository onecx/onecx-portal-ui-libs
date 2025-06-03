import { inject, Injectable } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from '../utils/has-permission-checker'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private userService = inject(UserService, { optional: true })
  private hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  constructor() {
    if (!(this.hasPermissionChecker || this.userService)) {
      throw 'UserService or HasPermissionChecker have to be provided to check permissions!'
    }
  }

  hasPermission(permissionKey: string | string[]): Promise<boolean> {
    if (this.hasPermissionChecker) {
      return Promise.resolve(this.hasPermissionChecker.hasPermission(permissionKey))
    } else if (this.userService) {
      return Promise.resolve(this.userService.hasPermission(permissionKey))
    }
    return Promise.resolve(false);
  }

  getPermissions(): Observable<string[]> | undefined {
    if (this.userService) {
      return this.userService.getPermissions()
    }
    return undefined;
  }
}
