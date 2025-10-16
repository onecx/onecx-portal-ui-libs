import { NavigatedEventPayload } from '@onecx/integration-interface'

export type LocationState = NavigatedEventPayload
export interface OneCxState {
  location?: LocationState | undefined
  permissions?: string[] | undefined
}
