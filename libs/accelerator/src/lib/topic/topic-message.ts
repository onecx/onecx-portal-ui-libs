import { increaseMessageCount, isStatsEnabled } from '../utils/logs.utils.js'
import { Message } from './message.js'
import { TopicMessageType } from './topic-message-type.js'

export class TopicMessage extends Message {
  constructor(
    type: TopicMessageType,
    public name: string,
    public version: number
  ) {
    super(type)
    if (isStatsEnabled()) {
      increaseMessageCount(this.name, type)
    }
  }
}
