export type SlotResizedDetails = {
  width: number
  height: number
}

export type SlotResizedEventPayload = {
  slotName: string
  slotDetails: SlotResizedDetails
}

export type SlotResizedEvent = {
  type: 'slotResized'
  payload: SlotResizedEventPayload
}
