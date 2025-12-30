import { RequestedEventsChangedEvent } from './resized-update-requested-type'
import { SlotGroupResizedEvent } from './slot-groups-resized-type'
import { SlotResizedEvent } from './slots-resized-type'

export type TopicResizedEventType = SlotGroupResizedEvent | SlotResizedEvent | RequestedEventsChangedEvent
