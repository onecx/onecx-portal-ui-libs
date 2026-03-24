import '../declarations'
import { TopicMessageType } from '../topic/topic-message-type'

export function isStatsEnabled(): boolean {
  return window['@onecx/accelerator']?.topic?.statsEnabled === true
}

export function increaseMessageCount(topicName: string, messageType: TopicMessageType): void {
  window['@onecx/accelerator'].topic ??= {}
  window['@onecx/accelerator'].topic.stats ??= {}
  window['@onecx/accelerator'].topic.stats.messagesPublished ??= {}
  if (isStatsEnabled()) {
    const messageStats = window['@onecx/accelerator'].topic.stats.messagesPublished
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
  window['@onecx/accelerator'].topic ??= {}
  window['@onecx/accelerator'].topic.stats ??= {}
  window['@onecx/accelerator'].topic.stats.instancesCreated ??= {}
  if (isStatsEnabled()) {
    const instanceStats = window['@onecx/accelerator'].topic.stats.instancesCreated
    if (!instanceStats[topicName]) {
      instanceStats[topicName] = 0
    }
    instanceStats[topicName]++
  }
}
