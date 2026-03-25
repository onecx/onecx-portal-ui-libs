import '../declarations'
import { TopicMessageType } from '../topic/topic-message-type'
import { ensureProperty } from './ensure-property.utils'

export function isStatsEnabled(): boolean {
  const accelerator = ensureProperty(globalThis as any, ['@onecx/accelerator'], {})['@onecx/accelerator']
  return accelerator?.topic?.statsEnabled === true
}

export function increaseMessageCount(topicName: string, messageType: TopicMessageType): void {
  const accelerator = ensureProperty(globalThis as any, ['@onecx/accelerator'], {})['@onecx/accelerator']
  ensureProperty(accelerator, ['topic', 'stats', 'messagesPublished'], {})
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
  const accelerator = ensureProperty(globalThis as any, ['@onecx/accelerator'], {})['@onecx/accelerator']
  ensureProperty(accelerator, ['topic', 'stats', 'instancesCreated'], {})
  if (isStatsEnabled()) {
    const instanceStats = accelerator.topic.stats.instancesCreated
    if (!instanceStats[topicName]) {
      instanceStats[topicName] = 0
    }
    instanceStats[topicName]++
  }
}
