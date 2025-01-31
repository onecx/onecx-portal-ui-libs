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
    OneCxActions.permissionsReceived,
    (state: OneCxState, action): OneCxState => ({
      ...state,
      permissions: action.permissions,
    })
  )
)
