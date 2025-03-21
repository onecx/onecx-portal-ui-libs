import { NavigatedEventPayload } from './navigated-event-payload'
// TODO: Write migration that detects usage of EventTopic with type 'navigated' and throws a warning/manual todo
/**
 * @deprecated Use LocationTopic instead of EventsTopic for navigated events
 */
export type NavigatedEvent = {
  type: 'navigated'
  payload: NavigatedEventPayload
}
