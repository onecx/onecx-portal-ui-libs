import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'
import { TopicResolveMessage } from './topic-resolve-message'

export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {}
  protected publishBroadcastChannel: BroadcastChannel | undefined
  protected publishBroadcastChannelV2: BroadcastChannel | undefined

  constructor(
    public name: string,
    public version: number
  ) {}

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

    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      if (typeof BroadcastChannel === 'undefined') {
        console.log('BroadcastChannel not supported. Disabling BroadcastChannel for topic publisher')
        window['@onecx/accelerator'] ??= {}
        window['@onecx/accelerator'].topic ??= {}
        window['@onecx/accelerator'].topic.useBroadcastChannel = false
      } else {
        this.publishBroadcastChannel = new BroadcastChannel(`Topic-${this.name}|${this.version}`)
        this.publishBroadcastChannelV2 = new BroadcastChannel(`TopicV2-${this.name}|${this.version}-${window['@onecx/accelerator'].topic.tabId}`)
      }
    }
  }

  protected sendMessage(message: TopicMessage): void {
    this.createBroadcastChannel()
    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel === "V2") {
      this.publishBroadcastChannelV2?.postMessage(message)
    } else if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      this.publishBroadcastChannel?.postMessage(message)
    } else {
      window.postMessage(message, '*')
    }
  }
}
