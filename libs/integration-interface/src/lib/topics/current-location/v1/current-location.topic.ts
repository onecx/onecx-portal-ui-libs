import { Topic } from '@onecx/accelerator'
import { CurrentLocationTopicPayload } from './current-location.model'

export class CurrentLocationTopic extends Topic<CurrentLocationTopicPayload> {
  constructor() {
    super('currentLocation', 1)
  }
}
