import { TopicMessageType } from '../topic/topic-message-type'
import { ensureProperty } from './ensure-property.utils'
import { increaseInstanceCount, increaseMessageCount, isStatsEnabled } from './logs.utils'

describe('logs.utils', () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, '@onecx/accelerator')
  })

  afterEach(() => {
    Reflect.deleteProperty(globalThis, '@onecx/accelerator')
  })

  describe('isStatsEnabled', () => {
    it('should return false when flag is missing', () => {
      expect(isStatsEnabled()).toBe(false)
    })

    it('should return false when statsEnabled is not true', () => {
      ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'statsEnabled'], false as const)
      expect(isStatsEnabled()).toBe(false)
    })

    it('should return true when statsEnabled is true', () => {
      ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'statsEnabled'], true as const)
      expect(isStatsEnabled()).toBe(true)
    })
  })

  describe('increaseMessageCount', () => {
    it('should not increment counts when stats are disabled', () => {
      increaseMessageCount('topic-a', TopicMessageType.TopicNext)
      increaseMessageCount('topic-a', TopicMessageType.TopicNext)

      const g = ensureProperty(
        globalThis,
        ['@onecx/accelerator', 'topic', 'stats', 'messagesPublished'],
        {} as Record<string, Record<TopicMessageType, number>>
      )
      expect(g['@onecx/accelerator'].topic.stats.messagesPublished).toEqual({})
    })

    it('should initialize and increment per topic and message type when enabled', () => {
      ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'statsEnabled'], true as const)

      increaseMessageCount('topic-a', TopicMessageType.TopicNext)
      increaseMessageCount('topic-a', TopicMessageType.TopicNext)
      increaseMessageCount('topic-a', TopicMessageType.TopicResolve)
      increaseMessageCount('topic-b', TopicMessageType.TopicGet)

      const g = ensureProperty(
        globalThis,
        ['@onecx/accelerator', 'topic', 'stats', 'messagesPublished'],
        {} as Record<string, Record<TopicMessageType, number>>
      )
      const messageStats = g['@onecx/accelerator'].topic.stats.messagesPublished
      expect(messageStats['topic-a']).toEqual({
        TopicNext: 2,
        TopicGet: 0,
        TopicResolve: 1,
      })
      expect(messageStats['topic-b']).toEqual({
        TopicNext: 0,
        TopicGet: 1,
        TopicResolve: 0,
      })
    })
  })

  describe('increaseInstanceCount', () => {
    it('should not increment counts when stats are disabled', () => {
      increaseInstanceCount('topic-a')
      increaseInstanceCount('topic-a')

      const g = ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'stats', 'instancesCreated'], {} as Record<string, number>)
      expect(g['@onecx/accelerator'].topic.stats.instancesCreated).toEqual({})
    })

    it('should initialize and increment per topic when enabled', () => {
      ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'statsEnabled'], true as const)

      increaseInstanceCount('topic-a')
      increaseInstanceCount('topic-a')
      increaseInstanceCount('topic-b')

      const g = ensureProperty(globalThis, ['@onecx/accelerator', 'topic', 'stats', 'instancesCreated'], {} as Record<string, number>)
      const instanceStats = g['@onecx/accelerator'].topic.stats.instancesCreated
      expect(instanceStats).toEqual({
        'topic-a': 2,
        'topic-b': 1,
      })
    })
  })
})
