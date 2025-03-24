import { Injectable } from '@angular/core'
import { FakeTopic } from './fake-topic'
import { Message as PortalMessage, PortalMessageService } from '@onecx/angular-integration-interface'
import { Message } from '@onecx/integration-interface'

export function providePortalMessageServiceMock() {
  return [PortalMessageServiceMock, { provide: PortalMessageService, useExisting: PortalMessageServiceMock }]
}
@Injectable({ providedIn: 'any' })
export class PortalMessageServiceMock {
  message$ = new FakeTopic<Message>()

  success(msg: PortalMessage) {
    this.addTranslated('success', msg)
  }

  info(msg: PortalMessage) {
    this.addTranslated('info', msg)
  }

  error(msg: PortalMessage) {
    this.addTranslated('error', msg)
  }

  warning(msg: PortalMessage) {
    this.addTranslated('warning', msg)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addTranslated(severity: string, msg: PortalMessage) {
    this.message$.publish({
      ...msg,
      severity: severity,
    })
  }
}
