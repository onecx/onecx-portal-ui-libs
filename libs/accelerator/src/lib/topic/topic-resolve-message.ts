import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'

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
