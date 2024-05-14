import { CanActivateFn, Route } from '@angular/router'
import { InitializeModuleGuard } from '../../services/initialize-module-guard.service'
import { addInitializeModuleGuard as _addInitializeModuleGuard } from '@onecx/angular-integration-interface'

/**
 * @deprecated
 * Please import from @onecx/angular-integration-interface, because in edge cases permission errors occur,
 * when @onecx/angular-integration-interface is not shared and the version from portal-integration-angular is used.
 */
export function addInitializeModuleGuard(
  routes: Route[],
  initializeModuleGuard: typeof InitializeModuleGuard | CanActivateFn = InitializeModuleGuard
): Route[] {
  return _addInitializeModuleGuard(routes, initializeModuleGuard)
}
