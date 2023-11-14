export class Message {
  timestamp: number

  constructor(public type: string) {
    this.timestamp = window.performance.now()
  }
}
