import { Topic, TopicPublisher } from '@onecx/accelerator'

export class StaticMenuVisiblePublisher extends TopicPublisher<{ isVisible: boolean }> {
  constructor() {
    super('staticMenuVisible', 1)
  }
}

export class StaticMenuVisibleTopic extends Topic<{ isVisible: boolean }> {
  constructor() {
    super('staticMenuVisible', 1)
  }
}
