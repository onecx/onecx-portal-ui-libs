import { RouterNavigatedAction } from '@ngrx/router-store'
import { ZodType } from 'zod'
import { MonoTypeOperatorFunction, filter, withLatestFrom, map } from 'rxjs'
import equal from 'fast-deep-equal'
import { Router, RoutesRecognized } from '@angular/router'

/**
 * @deprecated use filterOutQueryParamsHaveNotChanged
 */
export function filterForQueryParamsChanged<A extends RouterNavigatedAction>(
  router: Router,
  queryParamsTypeDef: ZodType,
  allowEmptyQueryParamsList = false
): MonoTypeOperatorFunction<A> {
  return filterOutQueryParamsHaveNotChanged(router, queryParamsTypeDef, allowEmptyQueryParamsList)
}

export function filterOutQueryParamsHaveNotChanged<A extends RouterNavigatedAction>(
  router: Router,
  queryParamsTypeDef: ZodType,
  allowEmptyQueryParamsList = false
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
        if (
          !allowEmptyQueryParamsList &&
          Object.keys(action?.payload?.routerState?.root?.queryParams || {}).length === 0
        ) {
          return false
        }
        const currentQueryParams = previousRouterState.snapshot.root.queryParams
        const actionResult = queryParamsTypeDef.safeParse(action?.payload?.routerState?.root?.queryParams)
        const currentResult = queryParamsTypeDef.safeParse(currentQueryParams)

        if (actionResult.success && currentResult.success) {
          const actionParams = actionResult.data
          const currentParams = currentResult.data
          if (
            allowEmptyQueryParamsList &&
            Object.keys(actionParams).length === 0 &&
            Object.keys(currentParams).length === 0
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
