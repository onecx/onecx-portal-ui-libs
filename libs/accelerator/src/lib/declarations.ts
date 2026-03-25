import { ensureProperty } from './utils/ensure-property.utils'

declare global {
  interface Window {
    '@onecx/accelerator': {
      gatherer?: {
        promises?: { [id: number]: Promise<unknown>[] }
      }
      topic?: {
        statsEnabled?: boolean
        stats?: {
          messagesPublished?: {
            [topicName: string]: {
              TopicNext: number
              TopicGet: number
              TopicResolve: number
            }
          }
          instancesCreated?: { [topicName: string]: number }
        }
        useBroadcastChannel?: boolean | "V2",
        initDate?: number,
        tabId?: number
      }
    }
  }
}

ensureProperty(globalThis as any, ['@onecx/accelerator', 'gatherer', 'promises'], {})
ensureProperty(globalThis as any, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], 'V2')
ensureProperty(globalThis as any, ['@onecx/accelerator', 'topic', 'initDate'], Date.now())
ensureProperty(globalThis as any, ['@onecx/accelerator', 'topic', 'tabId'], Math.ceil(globalThis.performance?.now?.() ?? 0))

export default globalThis
