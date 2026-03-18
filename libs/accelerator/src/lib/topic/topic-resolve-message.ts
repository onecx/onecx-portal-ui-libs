import { TopicMessage } from './topic-message.js'
import { TopicMessageType } from './topic-message-type.js'

export class TopicResolveMessage extends TopicMessage {
  constructor(
    type: TopicMessageType,
    name: string,
    version: number,
    public resolveId: number
  ) {
    super(type, name, version)
  }
}
