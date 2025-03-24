import { Injectable } from '@angular/core'
import { FakeTopic } from './fake-topic'
import { Message as PortalMessage, PortalMessageService } from '../src/lib/services/portal-message.service'
import { Message } from '@onecx/integration-interface'

export function providePortalMessageServiceMock() {
  return [PortalMessageServiceMock, { provide: PortalMessageService, useExisting: PortalMessageServiceMock }]
}
@Injectable({ providedIn: 'any' })
export class PortalMessageServiceMock {
  message$ = new FakeTopic<Message | PortalMessage>()

  success(msg: Message | PortalMessage) {
    this.addTranslated('success', msg)
  }

  info(msg: Message | PortalMessage) {
    this.addTranslated('info', msg)
  }

  error(msg: Message | PortalMessage) {
    this.addTranslated('error', msg)
  }

  warning(msg: Message | PortalMessage) {
    this.addTranslated('warning', msg)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addTranslated(severity: string, msg: Message | PortalMessage) {
    this.message$.publish({
      ...msg,
      severity: severity,
    })
  }
}
