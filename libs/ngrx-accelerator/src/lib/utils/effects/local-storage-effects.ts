import { Type } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { routerNavigatedAction } from '@ngrx/router-store'
import {
  Action,
  ActionCreator,
  ActionCreatorProps,
  Creator,
  FunctionWithParametersType,
  NotAllowedCheck,
} from '@ngrx/store'
import { map, tap } from 'rxjs'
import { filterForNavigatedTo } from './filter-for-navigated-to'
import { filterOutOnlyQueryParamsChanged } from './filter-for-only-query-params-changed'

type EventCreator<PropsCreator extends ActionCreatorProps<unknown> | Creator, Type extends string> =
  PropsCreator extends ActionCreatorProps<infer Props>
    ? void extends Props
      ? ActionCreator<Type, () => Action<Type>>
      : ActionCreator<Type, (props: Props & NotAllowedCheck<Props & object>) => Props & Action<Type>>
    : PropsCreator extends Creator<infer Props, infer Result>
      ? FunctionWithParametersType<Props, Result & NotAllowedCheck<Result> & Action<Type>> & Action<Type>
      : never

export function createStateRehydrationEffect<
  PropsCreator extends ActionCreatorProps<unknown> | Creator,
  T extends string,
>(
  actions$: Actions,
  router: Router,
  navigationToComponent: Type<any>,
  actionToDispatch: EventCreator<PropsCreator, T>,
  localStorageItemKey: string
) {
  return createEffect(() => {
    return actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(router, navigationToComponent),
      filterOutOnlyQueryParamsChanged(router),
      map(() => {
        const item = localStorage.getItem(localStorageItemKey)
        return actionToDispatch(JSON.parse(item ?? 'undefined'))
      })
    )
  })
}

export function createSaveStateEffect<PropsCreator extends ActionCreatorProps<unknown> | Creator, T extends string>(
  actions$: Actions,
  listenForAction: EventCreator<PropsCreator, T>,
  localStorageItemKey: string
) {
  return createEffect(
    () => {
      return actions$.pipe(
        ofType(listenForAction),
        tap((value) => {
          localStorage.setItem(localStorageItemKey, JSON.stringify(value))
        })
      )
    },
    { dispatch: false }
  )
}
