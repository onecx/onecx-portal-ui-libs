declare global {
  interface Window {
    '@onecx/accelerator': {
      gatherer?: {
        debug?: string[]
        promises?: { [id: number]: Promise<unknown>[] }
      }
      topic?: {
        debug?: string[]
        useBroadcastChannel?: boolean
        initDate?: number
      }
    }
  }
}

window['@onecx/accelerator'] ??= {}
window['@onecx/accelerator'].gatherer ??= {}
window['@onecx/accelerator'].gatherer.promises ??= {}
window['@onecx/accelerator'].gatherer.debug ??= []
window['@onecx/accelerator'].topic ??= {}
window['@onecx/accelerator'].topic.useBroadcastChannel ??= true
window['@onecx/accelerator'].topic.initDate ??= Date.now()

export default globalThis
