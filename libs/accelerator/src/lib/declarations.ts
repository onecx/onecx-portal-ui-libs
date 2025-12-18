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
      }
    }
  }
}

window['@onecx/accelerator'] ??= {}
window['@onecx/accelerator'].topic ??= {}

export default globalThis
