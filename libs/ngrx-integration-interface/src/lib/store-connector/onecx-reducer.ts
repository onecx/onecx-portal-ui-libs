import { createReducer, on } from '@ngrx/store'
import { OneCxActions } from './onecx-actions'
import { OneCxState } from './onecx-state'
import { NavigatedEventPayload } from '@onecx/integration-interface'

export const oneCxReducer = createReducer<OneCxState>(
  {},
  on(
    OneCxActions.navigated,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      location: action.event as NavigatedEventPayload,
    })
  ),
  on(
    OneCxActions.permissionsChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      permissions: action.permissions,
    })
  ),
  on(
    OneCxActions.configChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      config: action.config,
    })
  ),
  on(
    OneCxActions.currentMfeChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentMfe: action.currentMfe,
    })
  ),
  on(
    OneCxActions.currentPageChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentPage: action.currentPage,
    })
  ),
  on(
    OneCxActions.currentThemeChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentTheme: action.currentTheme,
    })
  ),
  on(
    OneCxActions.currentWorkspaceChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      currentWorkspace: action.currentWorkspace,
    })
  ),
  on(
    OneCxActions.appConfigChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      appConfig: action.appConfig,
    })
  ),
  on(
    OneCxActions.userProfileChanged,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      userProfile: action.userProfile,
    })
  )
)
