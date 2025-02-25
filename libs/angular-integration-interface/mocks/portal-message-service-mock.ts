import { Injectable } from '@angular/core'
import { FakeTopic } from './fake-topic'
import { Message } from '../src/lib/services/portal-message.service'

@Injectable({ providedIn: 'any' })
export class PortalMessageServiceMock {
  message$ = new FakeTopic() // or FakeTopic<Message>() ?

  success(msg: Message) {
    this.addTranslated('success', msg)
  }

  info(msg: Message) {
    this.addTranslated('info', msg)
  }

  error(msg: Message) {
    this.addTranslated('error', msg)
  }

  warning(msg: Message) {
    this.addTranslated('warning', msg)
  }

  private addTranslated(severity: string, msg: Message) {
    const summaryTranslation = msg.summaryKey ? `Translated: ${msg.summaryKey}` : undefined
    const detailTranslation = msg.detailKey ? `Translated: ${msg.detailKey}` : undefined

    this.message$.publish({
      ...msg,
      severity,
      summary: summaryTranslation,
      detail: detailTranslation,
    })
  }
}
