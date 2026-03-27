declare global {
  interface Window {
    '@onecx/accelerator': {
      topic?: {
        debug?: string[]
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

const g = globalThis as any
g['@onecx/accelerator'] ??= {}
g['@onecx/accelerator'].topic ??= {}
g['@onecx/accelerator'].topic.useBroadcastChannel ??= "V2"
g['@onecx/accelerator'].topic.initDate ??= Date.now()
g['@onecx/accelerator'].topic.tabId ??= Math.ceil(globalThis.performance?.now?.() ?? 0)

export default globalThis
