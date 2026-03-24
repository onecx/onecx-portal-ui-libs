import { increaseMessageCount, isStatsEnabled } from '../utils/logs.utils'
import { Message } from './message'
import { TopicMessageType } from './topic-message-type'

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
