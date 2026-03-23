import { Injectable, OnDestroy, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MessageTopic, buildTranslatedMessage, type PortalMessage } from '@onecx/integration-interface'
import { combineLatest, first, of } from 'rxjs'

export type Message = PortalMessage

@Injectable({ providedIn: 'any' })
export class PortalMessageService implements OnDestroy {
  private translateService = inject(TranslateService)

  _message$: MessageTopic | undefined
  get message$() {
    this._message$ ??= new MessageTopic()
    return this._message$
  }
  set message$(source: MessageTopic) {
    this._message$ = source
  }

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
        buildTranslatedMessage(severity, msg, async (key, params) =>
          key ? this.translateService.get(key, params).toPromise() : undefined
        ).then((message) => this.message$.publish(message))
      })
  }

  ngOnDestroy(): void {
    this._message$?.destroy()
  }
}
