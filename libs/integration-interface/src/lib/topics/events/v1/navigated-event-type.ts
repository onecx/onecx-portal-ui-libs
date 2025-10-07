import { EventType } from './event-type'
import { NavigatedEventPayload } from './navigated-event-payload'
/**
 * @deprecated Use CurrentLocationTopic instead of EventsTopic for navigated events
 */
export type NavigatedEvent = {
  type: EventType.NAVIGATED
  payload: NavigatedEventPayload
}
