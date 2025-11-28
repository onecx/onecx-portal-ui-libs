import { ResizedEventType } from './resized-event-type'

export type RequestedEventsChangedEventPayload = {
  type: ResizedEventType.SLOT_GROUP_RESIZED | ResizedEventType.SLOT_RESIZED
  name: string
}

export type RequestedEventsChangedEvent = {
  type: ResizedEventType.REQUESTED_EVENTS_CHANGED
  payload: RequestedEventsChangedEventPayload
}
