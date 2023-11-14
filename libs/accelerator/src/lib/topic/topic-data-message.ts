import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'

export class TopicDataMessage<T> extends TopicMessage {
  constructor(type: TopicMessageType, name: string, version: number, public data: T) {
    super(type, name, version)
  }
}
