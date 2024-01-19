import { Topic } from '@onecx/accelerator'
import { Message } from './message.model'

export class MessageTopic extends Topic<Message> {
  constructor() {
    super('message', 1)
  }
}