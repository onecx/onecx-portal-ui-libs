import { CanActivateFn, Route } from '@angular/router'
import { InitializeModuleGuard } from '../../services/initialize-module-guard.service'

export function addInitializeModuleGuard(
  routes: Route[],
  initializeModuleGuard?: typeof InitializeModuleGuard | CanActivateFn
): Route[] {
  routes
    .filter((r) => !r.redirectTo)
    .map((r) =>
      initializeModuleGuard ? (r.canActivate = [initializeModuleGuard]) : (r.canActivate = [InitializeModuleGuard])
    )
  return routes
}
