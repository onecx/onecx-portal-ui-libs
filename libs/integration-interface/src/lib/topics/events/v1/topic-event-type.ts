import { EventType } from './event-type'
import { NavigatedEvent } from './navigated-event-type'

export type TopicEventType = NavigatedEvent | { type: EventType | string; payload?: unknown | undefined }
