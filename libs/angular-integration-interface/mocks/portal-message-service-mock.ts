import { Injectable } from '@angular/core'
import { FakeTopic } from './fake-topic'
import { Message, PortalMessageService } from '../src/lib/services/portal-message.service'

export function providePortalMessageServiceMock() {
  return [PortalMessageServiceMock, { provide: PortalMessageService, useExisting: PortalMessageServiceMock }]
}
@Injectable({ providedIn: 'any' })
export class PortalMessageServiceMock {
  message$ = new FakeTopic<Message>()

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addTranslated(severity: string, msg: Message) {
    this.message$.publish({
      ...msg,
    })
  }
}
