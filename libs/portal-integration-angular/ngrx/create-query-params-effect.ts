import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { ActionCreator, Creator } from '@ngrx/store'
import { tap } from 'rxjs'

/**
 * @deprecated Please import from \@onecx/ngrx-accelerator
 */
export function createQueryParamsEffect<AC extends ActionCreator<string, Creator>>(
  actions$: Actions,
  actionType: AC,
  router: Router,
  activatedRoute: ActivatedRoute,
  reducer: (state: Record<string, any>, action: ReturnType<AC>) => Record<string, any>
) {
  return createEffect(
    () => {
      return actions$.pipe(
        ofType(actionType),
        concatLatestFrom(() => activatedRoute.queryParams),
        tap(([action, queryParams]) => {
          const params = reducer(queryParams, action)
          router.navigate([], {
            relativeTo: activatedRoute,
            queryParams: params,
            replaceUrl: true,
            onSameUrlNavigation: 'reload',
          })
        })
      )
    },
    { dispatch: false }
  )
}
