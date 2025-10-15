import { createActionGroup, props } from '@ngrx/store'

/**
 * @deprecated moved to `@onecx/ngrx-integration-interface`
 */
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
