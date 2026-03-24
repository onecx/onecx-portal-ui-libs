declare global {
  interface Window {
    onecxMessageId: number
  }
}

const g = globalThis as any
g.onecxMessageId ??= 1

export class Message {
  timestamp: number
  id: number // id can be undefined while used via old implementation

  constructor(public type: string) {
    this.timestamp = globalThis.performance?.now?.() ?? Date.now()
    this.id = g.onecxMessageId++
  }
}
