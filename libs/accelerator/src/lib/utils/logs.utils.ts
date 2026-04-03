import { acceleratorState } from '../declarations'
import { TopicMessageType } from '../topic/topic-message-type'
import { ensureProperty } from './ensure-property.utils'

export function isStatsEnabled(): boolean {
  const g = ensureProperty(acceleratorState, ['@onecx/accelerator','topic','statsEnabled'], false)
  return g['@onecx/accelerator'].topic.statsEnabled === true
}

export function increaseMessageCount(topicName: string, messageType: TopicMessageType): void {
  const g = ensureProperty(acceleratorState, ['@onecx/accelerator', 'topic', 'stats','messagesPublished'], {} as Record<string, Record<TopicMessageType, number>>)
  if (isStatsEnabled()) {
    const messageStats = g['@onecx/accelerator'].topic.stats.messagesPublished
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
  const g = ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'stats','instancesCreated'], {} as Record<string, number>)
  if (isStatsEnabled()) {
    const instanceStats = g['@onecx/accelerator'].topic.stats.instancesCreated
    if (!instanceStats[topicName]) {
      instanceStats[topicName] = 0
    }
    instanceStats[topicName]++
  }
}
