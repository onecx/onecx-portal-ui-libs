import { RouterNavigatedAction } from '@ngrx/router-store'
import { Router, RoutesRecognized } from '@angular/router'
import { ZodType } from 'zod'
import { MonoTypeOperatorFunction, filter, withLatestFrom, map } from 'rxjs'
import equal from 'fast-deep-equal'

export function filterOutFragmentParamsHaveNotChanged<A extends RouterNavigatedAction>(
  router: Router,
  fragmentParamsTypeDef: ZodType,
  allowEmptyFragmentParamsList = false
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
        const currentFragmentParams = getFragmentParams(previousRouterState.snapshot.root.fragment || '');
        const actionFragmentParams = getFragmentParams(action.payload.routerState.root.fragment || '');
        if (!allowEmptyFragmentParamsList && Object.keys(actionFragmentParams).length === 0) {
          return false
        }
        const currentResult = fragmentParamsTypeDef.safeParse(currentFragmentParams)
        const actionResult = fragmentParamsTypeDef.safeParse(actionFragmentParams)
        if (actionResult.success && currentResult.success) {
          const actionParams = actionResult.data
          const currentParams = currentResult.data
          if (
            allowEmptyFragmentParamsList &&
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

function getFragmentParams(fragment: string): Record<string, string> {
  if (!fragment) return {};
  const queryString = fragment.split('?')[1];
  if (!queryString) return {};
  const params = Object.fromEntries(
    new URLSearchParams(queryString)
  );

  return params;
}