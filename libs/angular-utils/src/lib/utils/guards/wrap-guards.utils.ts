import { CanActivate, CanActivateFn, CanDeactivate, CanDeactivateFn, Route } from '@angular/router'
import { inject, Type } from '@angular/core'
import { ActivateGuardsWrapper } from './activate-guards-wrapper'
import { DeactivateGuardsWrapper } from './deactivate-guards-wrapper'

export function wrapGuards(route: Route) {
  console.log('wrapGuards', route)
  wrapActivateGuards(route)
  wrapDeactivateGuards(route)

  forceGuardRun(route)
}

function wrapActivateGuards(route: Route): void {
  // if (!isGuardWrapperForActivate(route)) {
  //   console.log('Wrapping activate guard for route', route)
  //   guardWrapper.setActivateGuards(route, route.canActivate ?? [])
  //   route.canActivate = [GuardWrapper]
  // } else if (route.canActivate && route.canActivate?.length > 1) {
  //   console.log('Adding new guards to existing activate guard wrapper for route', route)
  //   console.log('Wrapper found', guardWrapper)
  //   addActivateGuards(
  //     route,
  //     guardWrapper,
  //     route.canActivate.filter((guard) => !(guard instanceof GuardWrapper))
  //   )
  //   route.canActivate = [GuardWrapper]
  // }
  route.canActivate = [createActivateWrapper(route.canActivate ?? [])]
}

function wrapDeactivateGuards(route: Route): void {
  // if (!isGuardWrapperForDeactivate(route)) {
  //   console.log('Wrapping deactivate guard for route', route)
  //   guardWrapper.setDeactivateGuards(route, route.canDeactivate ?? [])
  //   route.canDeactivate = [GuardWrapper]
  // } else if (route.canDeactivate && route.canDeactivate?.length > 1) {
  //   console.log('Adding new guards to existing deactivate guard wrapper for route', route)
  //   console.log('Wrapper found', guardWrapper)
  //   addDeactivateGuards(
  //     route,
  //     guardWrapper,
  //     route.canDeactivate.filter((guard) => !(guard instanceof GuardWrapper))
  //   )
  //   route.canDeactivate = [GuardWrapper]
  // }
  route.canDeactivate = [createDeactivateWrapper(route.canDeactivate ?? [])]
}

function forceGuardRun(route: Route) {
  route.runGuardsAndResolvers = 'always'
}

function createActivateWrapper(guards: Array<CanActivateFn | Type<CanActivate>>): CanActivateFn {
  return (route, state) => {
    return inject(ActivateGuardsWrapper).canActivate(route, state, guards)
  }
}

function createDeactivateWrapper(guards: Array<CanDeactivateFn<any> | Type<CanDeactivate<any>>>): CanDeactivateFn<any> {
  return (component, currentRoute, currentState, nextState) => {
    return inject(DeactivateGuardsWrapper).canDeactivate(component, currentRoute, currentState, nextState, guards)
  }
}

// function addActivateGuards(route: Route, wrapper: GuardWrapper, guards: Array<any>) {
//   console.log('Adding new activate guards to wrapper', wrapper, guards)
//   wrapper.setActivateGuards(route, [...wrapper.getActivateGuards(route), ...guards])
// }

// function addDeactivateGuards(route: Route, wrapper: GuardWrapper, guards: Array<any>) {
//   console.log('Adding new deactivate guards to wrapper', wrapper, guards)
//   wrapper.setDeactivateGuards(route, [...wrapper.getDeactivateGuards(route), ...guards])
// }

// function isGuardWrapperForActivate(route: Route): boolean {
//   return !!route.canActivate && getGuardWrapper(route) !== undefined
// }

// function isGuardWrapperForDeactivate(route: Route): boolean {
//   return !!route.canDeactivate && getGuardWrapper(route) !== undefined
// }

// function getGuardWrapper(route: Route): GuardWrapper | undefined {
//   return route.canActivate?.find((guard) => guard instanceof GuardWrapper) as GuardWrapper | undefined
// }
