import { CanActivateFn, Route } from '@angular/router'
import { InitializeModuleGuard } from '../../services/initialize-module-guard.service'
import { addInitializeModuleGuard as _addInitializeModuleGuard } from '@onecx/angular-integration-interface'

/**
 * @deprecated
 * Please import from @onecx/angular-integration-interface, because in edge cases permission errors occur,
 * when @onecx/angular-integration-interface is not shared.
 */
export function addInitializeModuleGuard(
  routes: Route[],
  initializeModuleGuard: typeof InitializeModuleGuard | CanActivateFn = InitializeModuleGuard
): Route[] {
  return _addInitializeModuleGuard(routes, initializeModuleGuard)
}
