import { createActionGroup, props } from '@ngrx/store'

export const OneCxActions = createActionGroup({
  source: 'OneCX',
  events: {
    navigated: props<{
      event: undefined | unknown
    }>(),
    permissionsChanged: props<{
      permissions: string[]
    }>(),
  },
})
