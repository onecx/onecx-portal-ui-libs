import { createActionGroup, props } from '@ngrx/store'
import { LocationState } from './onecx-state'

export const OneCxActions = createActionGroup({
  source: 'OneCX',
  events: {
    navigated: props<{
      location: LocationState
    }>(),
  },
})
