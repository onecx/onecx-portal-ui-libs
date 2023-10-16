import { Injectable, Optional, SkipSelf } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { combineLatest, of } from 'rxjs'

type Message = {
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

@Injectable({ providedIn: 'root' })
class PortalRootMessageService {
  constructor(public messageService: MessageService) {}

  add(msg: Message & { severity?: string; summary?: string; detail?: string }) {
    this.messageService.add(msg)
  }

  addAll(messages: Message[]) {
    this.messageService.addAll(messages)
  }

  clear(key: string | undefined) {
    this.messageService.clear(key)
  }
}

/**
 * This is a bit of a hack. For some reason, providing MessageService does not work correctly across federated modules
 */
@Injectable({ providedIn: 'any' })
export class PortalMessageService extends MessageService {
  constructor(
    private translateService: TranslateService,
    @Optional() @SkipSelf() private messageService: PortalRootMessageService
  ) {
    super()
  }

  override add(msg: Message & { severity?: string; summary?: string; detail?: string }) {
    if (this.messageService) {
      this.messageService.add(msg)
    } else {
      super.add(msg)
    }
  }

  override addAll(messages: Message[]): void {
    if (this.messageService) {
      this.messageService.addAll(messages)
    } else {
      super.addAll(messages)
    }
  }

  override clear(key?: string | undefined): void {
    if (this.messageService) {
      this.messageService.clear(key)
    } else {
      super.clear(key)
    }
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
    ]).subscribe(([summaryTranslation, detailTranslation]: string[]) => {
      if (this.messageService) {
        this.messageService.add({ ...msg, severity: severity, summary: summaryTranslation, detail: detailTranslation })
      } else {
        this.add({ ...msg, severity: severity, summary: summaryTranslation, detail: detailTranslation })
      }
    })
  }
}
