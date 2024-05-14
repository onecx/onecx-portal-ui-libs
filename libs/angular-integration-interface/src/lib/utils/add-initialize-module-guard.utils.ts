import { CanActivateFn, Route } from '@angular/router'
import { InitializeModuleGuard } from '../services/initialize-module-guard.service'

export function addInitializeModuleGuard(
  routes: Route[],
  initializeModuleGuard: typeof InitializeModuleGuard | CanActivateFn = InitializeModuleGuard
): Route[] {
  return routes.map((r) => {
    if (r.redirectTo) {
      return r
    }
    const route = {
      canActivate: [],
      ...r,
    }
    if (!route.canActivate.includes(initializeModuleGuard)) {
      route.canActivate.push(initializeModuleGuard)
    }
    return route
  })
}