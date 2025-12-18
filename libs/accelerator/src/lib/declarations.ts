declare global {
  interface Window {
    '@onecx/accelerator': {
      topic?: {
        debug?: string[]
        useBroadcastChannel?: boolean
        initDate?: number
      }
    }
  }
}

window['@onecx/accelerator'] ??= {}
window['@onecx/accelerator'].topic ??= {}
window['@onecx/accelerator'].topic.useBroadcastChannel ??= true
window['@onecx/accelerator'].topic.initDate ??= Date.now()

export default globalThis
