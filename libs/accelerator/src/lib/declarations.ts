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

window['@onecx/accelerator'] ??= {}
window['@onecx/accelerator'].gatherer ??= {}
window['@onecx/accelerator'].gatherer.promises ??= {}
window['@onecx/accelerator'].topic ??= {}
window['@onecx/accelerator'].topic.useBroadcastChannel ??= "V2"
window['@onecx/accelerator'].topic.initDate ??= Date.now()
window['@onecx/accelerator'].topic.tabId ??= Math.ceil(globalThis.performance.now())

export default globalThis
