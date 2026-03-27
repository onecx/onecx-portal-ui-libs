import '../declarations'
import { TopicMessageType } from '../topic/topic-message-type'

export function isStatsEnabled(): boolean {
  return (globalThis as any)['@onecx/accelerator']?.topic?.statsEnabled === true
}

export function increaseMessageCount(topicName: string, messageType: TopicMessageType): void {
 const accelerator = (globalThis as any)['@onecx/accelerator']
  accelerator.topic ??= {}
  accelerator.topic.stats ??= {}
  accelerator.topic.stats.messagesPublished ??= {}
  if (isStatsEnabled()) {
    const messageStats = accelerator.topic.stats.messagesPublished
    if (!messageStats[topicName]) {
      messageStats[topicName] = {
        TopicNext: 0,
        TopicGet: 0,
        TopicResolve: 0,
      }
    }
    messageStats[topicName][messageType]++
  }
}

export function increaseInstanceCount(topicName: string): void {
  const accelerator = (globalThis as any)['@onecx/accelerator']
  accelerator.topic ??= {}
  accelerator.topic.stats ??= {}
  accelerator.topic.stats.instancesCreated ??= {}
  if (isStatsEnabled()) {
    const instanceStats = accelerator.topic.stats.instancesCreated
    if (!instanceStats[topicName]) {
      instanceStats[topicName] = 0
    }
    instanceStats[topicName]++
  }
}
