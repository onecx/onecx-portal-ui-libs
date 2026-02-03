import { RouterNavigatedAction } from '@ngrx/router-store'
import { Router, RoutesRecognized } from '@angular/router'
import { ZodType } from 'zod'
import { MonoTypeOperatorFunction, filter, withLatestFrom, map } from 'rxjs'
import equal from 'fast-deep-equal'

export function filterOutUriParamsHaveNotChanged<A extends RouterNavigatedAction>(
  router: Router,
  uriParamsTypeDef: ZodType,
  allowEmptyUriParamsList = false
): MonoTypeOperatorFunction<A> {
  return (source) => {
    return source.pipe(
      withLatestFrom(
        router.events.pipe(
          filter((e) => e instanceof RoutesRecognized),
          map(() => router.routerState)
        )
      ),
      filter(([action, previousRouterState]) => {
        const currentUriParams = getUriParams(previousRouterState.snapshot.root.fragment || '');
        const actionUriParams = getUriParams(action.payload.routerState.root.fragment || '');
        if (!allowEmptyUriParamsList && Object.keys(actionUriParams).length === 0) {
          return false
        }
        const currentResult = uriParamsTypeDef.safeParse(currentUriParams)
        const actionResult = uriParamsTypeDef.safeParse(actionUriParams)
        if (actionResult.success && currentResult.success) {
          const actionParams = actionResult.data
          const currentParams = currentResult.data
          if (
            allowEmptyUriParamsList &&
            Object.keys(actionParams as Record<string, unknown>).length === 0 &&
            Object.keys(currentParams as Record<string, unknown>).length === 0
          ) {
            return true
          }
          return !equal(actionParams, currentParams)
        }
        return false
      }),
      map(([action]) => action)
    )
  }
}

function getUriParams(fragment: string): Record<string, string> {
  if (!fragment) return {};
  const queryString = fragment.split('?')[1];
  if (!queryString) return {};
  const params = Object.fromEntries(
    new URLSearchParams(queryString)
  );

  return params;
}