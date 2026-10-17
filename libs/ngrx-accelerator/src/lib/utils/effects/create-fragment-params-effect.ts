import { Router, ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ActionCreator, Creator } from '@ngrx/store'
import { tap } from 'rxjs';

function getUrlParams(searchParam: Record<string, any>): string {
    return new URLSearchParams(
        Object.entries(searchParam)
            .filter(([, value]) => value !== null && value !== undefined)
            .flatMap(([key, value]) =>
                Array.isArray(value) ? value.map(x => [key, String(x)]) : [[key, String(value)]]
            )
    ).toString();
}

export function createFragmentParamsEffect<AC extends ActionCreator<string, Creator>>(
    actions$: Actions,
    actionType: AC,
    router: Router,
    activatedRoute: ActivatedRoute,
    reducer: (state: Record<string, any>, action: ReturnType<AC>) => Record<string, any>
) {
    return createEffect(() => {
        return actions$.pipe(
            ofType(actionType),
            concatLatestFrom(() => activatedRoute.fragment),
            tap(([action, fragment]) => {
                if (!fragment) return;
                // sample fragment: search?sort=asc&filter=active
                // split at the first '?' only, so values containing '?' are kept intact
                const separatorIndex = fragment.indexOf('?')
                const prefix = separatorIndex === -1 ? fragment : fragment.slice(0, separatorIndex)
                const query = separatorIndex === -1 ? '' : fragment.slice(separatorIndex + 1)
                const fragmentPrefix = prefix + '?'
                const fragmentParams = Object.fromEntries(new URLSearchParams(query))
                const searchParamFromReducer = reducer(fragmentParams, action)
                const formattedFragmentParams = getUrlParams(searchParamFromReducer)

                router.navigate([], {
                    relativeTo: activatedRoute,
                    fragment: fragmentPrefix + formattedFragmentParams,
                    replaceUrl: true,
                    onSameUrlNavigation: 'reload',
                })
            })
        )
    }, { dispatch: false })
}