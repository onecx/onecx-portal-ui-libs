import { EventType } from './event-type'

export type SlotGroupResizedDetails = {
  width: number
  height: number
}

export type SlotGroupResizedEventPayload = {
  slotGroupName: string
  slotGroupDetails: SlotGroupResizedDetails
}

export type SlotGroupResizedEvent = {
  type: EventType.SLOT_GROUP_RESIZED
  payload: SlotGroupResizedEventPayload
}
