export class BroadcastChannelMock {
  public static listeners: Record<string, ((m: any) => any)[]> = {} // NOSONAR
  public static asyncCalls = false // NOSONAR
  listener: ((m: any) => any) | undefined

  constructor(public name: string) {}

  postMessage(m: any) {
    if (BroadcastChannelMock.asyncCalls) {
      setTimeout(() => {
        BroadcastChannelMock.listeners[this.name]?.forEach((l) =>
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} })
        )
      }, 0)
    } else {
      BroadcastChannelMock.listeners[this.name]?.forEach((l) =>
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} })
      )
    }
  }

  addEventListener(event: string, listener: (m: any) => any) {
    this.listener = listener
    BroadcastChannelMock.listeners[this.name] ??= []
    BroadcastChannelMock.listeners[this.name].push(listener)
  }

  close() {
    BroadcastChannelMock.listeners[this.name] = BroadcastChannelMock.listeners[this.name].filter(
      (l) => l !== this.listener
    )
  }
}
