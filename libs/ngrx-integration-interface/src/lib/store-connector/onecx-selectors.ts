import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store'
import { OneCxState } from './onecx-state'
import { LocationState } from './onecx-state'
import { MfeInfo, PageInfo, Theme, Workspace, UserProfile } from '@onecx/integration-interface'

export function createOneCxSelector<State extends Record<string, any>>(): MemoizedSelector<State, OneCxState> {
  return createFeatureSelector('onecx')
}

export type OneCxSelectors<V> = {
  selectLocation: MemoizedSelector<V, LocationState | undefined>
  selectBackNavigationPossible: MemoizedSelector<V, boolean>
  selectPermissions: MemoizedSelector<V, string[] | undefined>
  selectConfig: MemoizedSelector<V, { [key: string]: string } | undefined>
  selectCurrentMfe: MemoizedSelector<V, MfeInfo | undefined>
  selectCurrentPage: MemoizedSelector<V, PageInfo | undefined>
  selectCurrentTheme: MemoizedSelector<V, Theme | undefined>
  selectCurrentWorkspace: MemoizedSelector<V, Workspace | undefined>
  selectAppConfig: MemoizedSelector<V, { [key: string]: string } | undefined>
  selectUserProfile: MemoizedSelector<V, UserProfile | undefined>
}

export function getOneCxSelectors<V extends Record<string, any>>(
  selectState: (state: V) => OneCxState = createOneCxSelector<V>()
): OneCxSelectors<V> {
  const selectLocation = createSelector(selectState, (state) => state.location)
  const selectBackNavigationPossible = createSelector(selectLocation, (location) => !!location && !location?.isFirst)
  const selectPermissions = createSelector(selectState, (state) => state.permissions)
  const selectConfig = createSelector(selectState, (state) => state.config)
  const selectCurrentMfe = createSelector(selectState, (state) => state.currentMfe)
  const selectCurrentPage = createSelector(selectState, (state) => state.currentPage)
  const selectCurrentTheme = createSelector(selectState, (state) => state.currentTheme)
  const selectCurrentWorkspace = createSelector(selectState, (state) => state.currentWorkspace)
  const selectAppConfig = createSelector(selectState, (state) => state.appConfig)
  const selectUserProfile = createSelector(selectState, (state) => state.userProfile)
  return {
    selectLocation,
    selectBackNavigationPossible,
    selectPermissions,
    selectConfig,
    selectCurrentMfe,
    selectCurrentPage,
    selectCurrentTheme,
    selectCurrentWorkspace,
    selectAppConfig,
    selectUserProfile,
  }
}
