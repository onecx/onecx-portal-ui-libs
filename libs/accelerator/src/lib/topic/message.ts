import { ensureProperty } from '../utils/ensure-property.utils'

declare global {
  interface Window {
    onecxMessageId: number
  }
}

const g = ensureProperty(globalThis as any, ['onecxMessageId'], 1)

export class Message {
  timestamp: number
  id: number // id can be undefined while used via old implementation

  constructor(public type: string) {
    this.timestamp = globalThis.performance?.now?.() ?? Date.now()
    this.id = g.onecxMessageId++
  }
}
