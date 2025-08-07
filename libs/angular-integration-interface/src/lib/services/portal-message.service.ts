import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MessageTopic } from '@onecx/integration-interface'
import { combineLatest, first, of } from 'rxjs'

export type Message = {
  summaryKey?: string
  summaryParameters?: object
  detailKey?: string
  detailParameters?: object
  id?: any
  key?: string
  life?: number
  sticky?: boolean
  closable?: boolean
  data?: any
  icon?: string
  contentStyleClass?: string
  styleClass?: string
}

@Injectable({ providedIn: 'any' })
export class PortalMessageService implements OnDestroy {
  private translateService = inject(TranslateService)

  message$ = new MessageTopic()

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
    combineLatest([
      msg.summaryKey ? this.translateService.get(msg.summaryKey || '', msg.summaryParameters) : of(undefined),
      msg.detailKey ? this.translateService.get(msg.detailKey, msg.detailParameters) : of(undefined),
    ])
      .pipe(first())
      .subscribe(([summaryTranslation, detailTranslation]: string[]) => {
        this.message$.publish({
          ...msg,
          severity: severity,
          summary: summaryTranslation,
          detail: detailTranslation,
        })
      })
  }

  ngOnDestroy(): void {
    this.message$.destroy()
  }
}
