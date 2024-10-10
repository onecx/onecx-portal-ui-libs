import { PayloadNavigatedEvent } from '@onecx/integration-interface'

export type LocationState = PayloadNavigatedEvent
export interface OneCxState {
  location?: LocationState | undefined
}
