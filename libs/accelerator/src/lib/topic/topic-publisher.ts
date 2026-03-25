import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'
import { TopicResolveMessage } from './topic-resolve-message'
import { createLogger } from '../utils/logger.utils'
import { ComponentLogger } from '../utils/create-logger.utils'
import { ensureProperty } from '../utils/ensure-property.utils'


export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {}
  protected publishBroadcastChannel: BroadcastChannel | undefined
  protected publishBroadcastChannelV2: BroadcastChannel | undefined
  protected readonly baseLogger: ComponentLogger

  constructor(
    public name: string,
    public version: number
  ) {
    this.baseLogger = createLogger(`TopicPublisher:${this.name}`)
  }

  public publish(value: T): Promise<void> {
    const message = new TopicDataMessage<T>(TopicMessageType.TopicNext, this.name, this.version, value)
    this.sendMessage(message)
    const resolveMessage = new TopicResolveMessage(TopicMessageType.TopicResolve, this.name, this.version, message.id)
    const promise = new Promise<void>((resolve) => {
      this.publishPromiseResolver[message.id] = resolve
    })
    this.sendMessage(resolveMessage)
    return promise
  }

  protected createBroadcastChannel(): void {
    if (this.publishBroadcastChannel && this.publishBroadcastChannelV2) {
      return
    }

    const accelerator = ensureProperty(globalThis as any, ['@onecx/accelerator'], {})['@onecx/accelerator']
    if (accelerator.topic?.useBroadcastChannel) {
      if (typeof BroadcastChannel === 'undefined') {
        this.baseLogger.info('BroadcastChannel not supported. Disabling BroadcastChannel for topic publisher')
        ensureProperty(accelerator, ['topic'], {})
        accelerator.topic.useBroadcastChannel = false
      } else {
        this.publishBroadcastChannel = new BroadcastChannel(`Topic-${this.name}|${this.version}`)
        this.publishBroadcastChannelV2 = new BroadcastChannel(`TopicV2-${this.name}|${this.version}-${accelerator.topic.tabId}`)
      }
    }
  }

  protected sendMessage(message: TopicMessage): void {
    this.createBroadcastChannel()
    const accelerator = ensureProperty(globalThis as any, ['@onecx/accelerator'], {})['@onecx/accelerator']
    if (accelerator.topic?.useBroadcastChannel === "V2") {
      this.publishBroadcastChannelV2?.postMessage(message)
    } else if (accelerator.topic?.useBroadcastChannel) {
      this.publishBroadcastChannel?.postMessage(message)
    } else {
      const postMessage = (globalThis as any).postMessage
      if (typeof postMessage !== 'function') {
        throw new Error('postMessage is not available in this environment')
      }
      postMessage.call(globalThis, message, '*')
    }
  }
}
