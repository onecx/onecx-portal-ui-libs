import { Router, RoutesRecognized } from '@angular/router'
import { RouterNavigatedAction } from '@ngrx/router-store'
import { filter, map, MonoTypeOperatorFunction, withLatestFrom } from 'rxjs'

/**
 * @deprecated use filterOutOnlyQueryParamsChanged
 */
export function filterForOnlyQueryParamsChanged<A extends RouterNavigatedAction>(
  router: Router
): MonoTypeOperatorFunction<A> {
  return filterOutOnlyQueryParamsChanged(router)
}

export function filterOutOnlyQueryParamsChanged<A extends RouterNavigatedAction>(
  router: Router
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
        const previousPath = previousRouterState.snapshot.url.split('?')[0]
        const currentPath = action.payload.event.urlAfterRedirects.split('?')[0]

        return previousPath !== currentPath
      }),
      map(([action]) => action)
    )
  }
}
