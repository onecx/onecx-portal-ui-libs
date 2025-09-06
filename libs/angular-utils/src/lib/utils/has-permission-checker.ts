import { InjectionToken, Injector, Optional, SkipSelf } from '@angular/core'
import { hasPermissionCheckerFactory } from './has-permission-checker-factory'
import { Observable } from 'rxjs'

export interface HasPermissionChecker {
  hasPermission(permissionKey: string | string[]): Promise<boolean>
  getPermissions?(): Observable<string[]>
}

/**
 * This checker always returns true, basically disabling the permission system on the UI side
 */
export class AlwaysGrantPermissionChecker implements HasPermissionChecker {
  async hasPermission(_permissionKey: string | string[]): Promise<boolean> {
    return true
  }
}

export const HAS_PERMISSION_CHECKER = new InjectionToken<HasPermissionChecker>('hasPermission')

export function providePermissionChecker() {
  return [
    {
      provide: HAS_PERMISSION_CHECKER,
      useFactory: hasPermissionCheckerFactory,
      deps: [Injector, [new Optional(), new SkipSelf(), HAS_PERMISSION_CHECKER]],
    },
  ]
}

export function provideAlwaysGrantPermissionChecker() {
  return [
    {
      provide: HAS_PERMISSION_CHECKER,
      useClass: AlwaysGrantPermissionChecker,
    },
  ]
}
