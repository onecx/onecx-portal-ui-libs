export type SlotsResizedDetails = {
  width: number
  height: number
}

export type SlotsResizedEventPayload = {
  slotName: string
  slotDetails: SlotsResizedDetails
}

export type SlotsResizedEvent = {
  type: 'slotsResized'
  payload: SlotsResizedEventPayload
}
