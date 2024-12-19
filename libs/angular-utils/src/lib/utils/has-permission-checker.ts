import {InjectionToken} from '@angular/core'

export interface HasPermissionChecker {
    hasPermission(permissionKey: string): boolean
  }
  
  /**
   * This checker always returns true, basically disabling the permission system on the UI side
   */
  export class AlwaysGrantPermissionChecker implements HasPermissionChecker {
    hasPermission(_permissionKey: string): boolean {
      return true
    }
  }
  
  export const HAS_PERMISSION_CHECKER = new InjectionToken<HasPermissionChecker>('hasPermission')