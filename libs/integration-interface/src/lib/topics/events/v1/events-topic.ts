import { Topic, TopicPublisher } from '@onecx/accelerator'
import { TopicEventType } from './topic-event-type'

export class EventsPublisher extends TopicPublisher<TopicEventType> {
  constructor() {
    super('events', 1)
  }
}

export class EventsTopic extends Topic<TopicEventType> {
  constructor() {
    super('events', 1, false)
  }
}
