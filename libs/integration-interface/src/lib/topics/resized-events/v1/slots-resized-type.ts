import { ResizedEventType } from './resized-event-type'

export type SlotResizedDetails = {
  width: number
  height: number
}

export type SlotResizedEventPayload = {
  slotName: string
  slotDetails: SlotResizedDetails
}

export type SlotResizedEvent = {
  type: ResizedEventType.SLOT_RESIZED
  payload: SlotResizedEventPayload
}
