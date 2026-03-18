import { TopicMessage } from './topic-message.js'
import { TopicMessageType } from './topic-message-type.js'

export class TopicDataMessage<T> extends TopicMessage {
  constructor(type: TopicMessageType, name: string, version: number, public data: T) {
    super(type, name, version)
  }
}
