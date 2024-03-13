import { Injectable, Optional } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, of } from 'rxjs'
// eslint-disable-next-line
import { Message, PortalMessageService } from '@onecx/angular-integration-interface'
import { Message as TopicMessage } from '@onecx/integration-interface'
import { FakeTopic } from './fake-topic'

export function providePortalMessageServiceMock() {
  return [
    { provide: PortalMessageServiceMock, useClass: PortalMessageServiceMock },
    { provide: PortalMessageService, useExisting: PortalMessageServiceMock },
  ]
}

@Injectable()
export class PortalMessageServiceMock {
  constructor(@Optional() private translateService?: TranslateService) {}
  lastMessages: { type: 'success' | 'info' | 'error' | 'warning'; value: Message }[] = []
  message$ = new FakeTopic<TopicMessage>()

  success(msg: Message) {
    this.lastMessages.push({ type: 'success', value: msg })
    this.addTranslated('success', msg)
  }

  info(msg: Message) {
    this.lastMessages.push({ type: 'info', value: msg })
    this.addTranslated('info', msg)
  }

  error(msg: Message) {
    this.lastMessages.push({ type: 'error', value: msg })
    this.addTranslated('error', msg)
  }

  warning(msg: Message) {
    this.lastMessages.push({ type: 'warning', value: msg })
    this.addTranslated('warning', msg)
  }

  private addTranslated(severity: string, msg: Message) {
    if (this.translateService) {
      combineLatest([
        msg.summaryKey ? this.translateService.get(msg.summaryKey || '', msg.summaryParameters) : of(undefined),
        msg.detailKey ? this.translateService.get(msg.detailKey, msg.detailParameters) : of(undefined),
      ]).subscribe(([summaryTranslation, detailTranslation]: string[]) => {
        this.message$.publish({
          ...msg,
          severity: severity,
          summary: summaryTranslation,
          detail: detailTranslation,
        })
      })
    } else {
      console.log('TranslationModule not imported in TestBed. Therefore message$ is not updated.')
    }
  }
}
