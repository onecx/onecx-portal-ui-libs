import { Route } from '@angular/router'
import { GuardWrapper } from './guard-wrapper'

export function wrapGuards(route: Route, guardWrapper: GuardWrapper) {
  console.log('wrapGuards', route, route.canActivate, route.canDeactivate)
  wrapActivateGuards(route, guardWrapper)
  wrapDeactivateGuards(route, guardWrapper)

  forceGuardRun(route)
}

function wrapActivateGuards(route: Route, guardWrapper: GuardWrapper): void {
  if (!isGuardWrapperForActivate(route)) {
    console.log('Wrapping activate guard for route', route)
    guardWrapper.setActivateGuards(route, route.canActivate ?? [])
    route.canActivate = [GuardWrapper]
  } else if (route.canActivate && route.canActivate?.length > 1) {
    console.log('Adding new guards to existing activate guard wrapper for route', route)
    console.log('Wrapper found', guardWrapper)
    addActivateGuards(
      route,
      guardWrapper,
      route.canActivate.filter((guard) => !(guard instanceof GuardWrapper))
    )
    route.canActivate = [GuardWrapper]
  }
}

function wrapDeactivateGuards(route: Route, guardWrapper: GuardWrapper): void {
  if (!isGuardWrapperForDeactivate(route)) {
    console.log('Wrapping deactivate guard for route', route)
    guardWrapper.setDeactivateGuards(route, route.canDeactivate ?? [])
    route.canDeactivate = [GuardWrapper]
  } else if (route.canDeactivate && route.canDeactivate?.length > 1) {
    console.log('Adding new guards to existing deactivate guard wrapper for route', route)
    console.log('Wrapper found', guardWrapper)
    addDeactivateGuards(
      route,
      guardWrapper,
      route.canDeactivate.filter((guard) => !(guard instanceof GuardWrapper))
    )
    route.canDeactivate = [GuardWrapper]
  }
}

function forceGuardRun(route: Route) {
  route.runGuardsAndResolvers = 'always'
}

function addActivateGuards(route: Route, wrapper: GuardWrapper, guards: Array<any>) {
  console.log('Adding new activate guards to wrapper', wrapper, guards)
  wrapper.setActivateGuards(route, [...wrapper.getActivateGuards(route), ...guards])
}

function addDeactivateGuards(route: Route, wrapper: GuardWrapper, guards: Array<any>) {
  console.log('Adding new deactivate guards to wrapper', wrapper, guards)
  wrapper.setDeactivateGuards(route, [...wrapper.getDeactivateGuards(route), ...guards])
}

function isGuardWrapperForActivate(route: Route): boolean {
  return !!route.canActivate && getGuardWrapper(route) !== undefined
}

function isGuardWrapperForDeactivate(route: Route): boolean {
  return !!route.canDeactivate && getGuardWrapper(route) !== undefined
}

function getGuardWrapper(route: Route): GuardWrapper | undefined {
  return route.canActivate?.find((guard) => guard instanceof GuardWrapper) as GuardWrapper | undefined
}
