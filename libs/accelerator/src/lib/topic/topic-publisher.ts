import { TopicDataMessage } from './topic-data-message'
import { TopicMessageType } from './topic-message-type'
import { TopicResolveMessage } from './topic-resolve-message'

export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {}

  constructor(
    public name: string,
    public version: number
  ) {}

  public publish(value: T): Promise<void> {
    const message = new TopicDataMessage<T>(TopicMessageType.TopicNext, this.name, this.version, value)
    const postMessage = (globalThis as any).postMessage
    if (typeof postMessage !== 'function') {
      throw new Error('postMessage is not available in this environment')
    }
    postMessage.call(globalThis, message, '*')
    const resolveMessage = new TopicResolveMessage(TopicMessageType.TopicResolve, this.name, this.version, message.id)
    const promise = new Promise<void>((resolve) => {
      this.publishPromiseResolver[message.id] = resolve
    })
    const postMessageResolve = (globalThis as any).postMessage
    if (typeof postMessageResolve !== 'function') {
      throw new Error('postMessage is not available in this environment')
    }
    postMessageResolve.call(globalThis, resolveMessage, '*')
    return promise
  }
}
