import { createActionGroup, props } from '@ngrx/store'
import { LocationState } from './onecx-state'

export const OneCxActions = createActionGroup({
  source: 'OneCX store connector',
  events: {
    ' onecx navigated': props<{
      location: LocationState
    }>(),
  },
})
