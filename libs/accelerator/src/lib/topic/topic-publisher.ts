import { TopicDataMessage } from './topic-data-message'
import { TopicMessageType } from './topic-message-type'

export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {}

  constructor(public name: string, public version: number) {}

  public publish(value: T): Promise<void> {
    const message = new TopicDataMessage<T>(TopicMessageType.TopicNext, this.name, this.version, value)
    const promise = new Promise<void>((resolve) => {
      this.publishPromiseResolver[message.timestamp] = resolve
    })
    window.postMessage(message, '*')
    return promise
  }
}
