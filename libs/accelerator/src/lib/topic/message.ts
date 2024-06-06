declare global {
  interface Window {
    onecxMessageId: number
  }
}

window['onecxMessageId'] = 1

export class Message {
  timestamp: number
  id: number // id can be undefined while used via old implementation

  constructor(public type: string) {
    this.timestamp = window.performance.now()
    this.id = window['onecxMessageId']++
  }
}
