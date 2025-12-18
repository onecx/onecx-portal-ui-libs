import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message';
import { TopicMessageType } from './topic-message-type'
import { TopicResolveMessage } from './topic-resolve-message'

export class TopicPublisher<T> {
  protected publishPromiseResolver: Record<number, () => void> = {}
  protected readonly broadcastChannel: BroadcastChannel | undefined;

  constructor(
    public name: string,
    public version: number
  ) {
    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      if (typeof BroadcastChannel === 'undefined') {
        console.log('BroadcastChannel not supported. Disabling BroadcastChannel for topic');
        window['@onecx/accelerator'] ??= {}
        window['@onecx/accelerator'].topic ??= {}
        window['@onecx/accelerator'].topic.useBroadcastChannel = false
      } else {
        this.broadcastChannel = new BroadcastChannel(`Topic-${this.name}|${this.version}`);
      }
    }
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

  protected sendMessage(message: TopicMessage): void {
    if (window['@onecx/accelerator']?.topic?.useBroadcastChannel) {
      this.broadcastChannel?.postMessage(message);
    } else {
      window.postMessage(message, '*')
    }
  }
}
