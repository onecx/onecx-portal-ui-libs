import { Topic, TopicPublisher } from '@onecx/accelerator'
import { CurrentLocationTopicPayload } from './current-location.model'

export class CurrentLocationPublisher extends TopicPublisher<CurrentLocationTopicPayload> {
  constructor() {
    super('currentLocation', 1)
  }
}

export class CurrentLocationTopic extends Topic<CurrentLocationTopicPayload> {
  constructor() {
    super('currentLocation', 1)
  }
}
