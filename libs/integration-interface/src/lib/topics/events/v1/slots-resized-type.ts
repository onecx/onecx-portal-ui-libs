import { EventType } from './event-type'

export type SlotResizedDetails = {
  width: number
  height: number
}

export type SlotResizedEventPayload = {
  slotName: string
  slotDetails: SlotResizedDetails
}

export type SlotResizedEvent = {
  type: EventType.SLOT_RESIZED
  payload: SlotResizedEventPayload
}
