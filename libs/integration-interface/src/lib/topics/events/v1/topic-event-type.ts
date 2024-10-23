import { NavigatedEvent } from './navigated-event-type'

export type TopicEventType = NavigatedEvent | { type: string; payload?: unknown | undefined }
