import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store'
import { OneCxState } from './onecx-state'
import { LocationState } from './onecx-state'

export function createOneCxSelector<State extends Record<string, any>>(): MemoizedSelector<State, OneCxState> {
  return createFeatureSelector('onecx')
}

export type OneCxSelectors<V> = {
  selectLocation: MemoizedSelector<V, LocationState | undefined>
  selectBackNavigationPossible: MemoizedSelector<V, boolean>
  selectPermissions: MemoizedSelector<V, string[] | undefined>
}

export function getOneCxSelectors<V extends Record<string, any>>(
  selectState: (state: V) => OneCxState = createOneCxSelector<V>()
): OneCxSelectors<V> {
  const selectLocation = createSelector(selectState, (state) => state.location)
  const selectBackNavigationPossible = createSelector(selectLocation, (location) => !!location && !location?.isFirst)
  const selectPermissions = createSelector(selectState, (state) => state.permissions)
  return {
    selectLocation,
    selectBackNavigationPossible,
    selectPermissions,
  }
}
