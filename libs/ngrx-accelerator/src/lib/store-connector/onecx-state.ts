import { NavigatedEventPayload } from '@onecx/integration-interface'

/**
 * @deprecated moved to `@onecx/ngrx-integration-interface`
 */
export type LocationState = NavigatedEventPayload
export interface OneCxState {
  location?: LocationState | undefined
  permissions?: string[] | undefined
}
