import { Router, ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ActionCreator, Creator } from '@ngrx/store'
import { tap } from 'rxjs';

function getUrlParams(searchParam: Record<string, any>): string {
    return new URLSearchParams(
        Object.entries(searchParam).flatMap(([key, value]) =>
            Array.isArray(value) ? value.map(x => [key, String(x)]) : [[key, String(value ?? '')]]
        )
    ).toString();
}

export function createUriParamsEffect<AC extends ActionCreator<string, Creator>>(
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
                const fragmentPrefix = fragment.split('?')[0] + '?' // sample URL: fragment?sort=asc&filter=active
                const searchParams = new URLSearchParams(fragment)
                const searchParamFromReducer = reducer(searchParams, action)
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