import { ensureProperty } from '../utils/ensure-property.utils'

const g = ensureProperty(globalThis, ['onecxMessageId'], 1)

export class Message {
  timestamp: number
  id: number // id can be undefined while used via old implementation

  constructor(public type: string) {
    this.timestamp = globalThis.performance?.now?.() ?? Date.now()
    this.id = g.onecxMessageId++
  }
}
