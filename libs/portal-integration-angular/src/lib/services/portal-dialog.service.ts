import { EventEmitter, Injectable, Type } from '@angular/core'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Observable } from 'rxjs'
import { ButtonDialogComponent } from '../core/components/button-dialog/button-dialog.component'
import { ButtonDialogButtonDetails, ButtonDialogData } from '../model/button-dialog'
import { DialogHostComponent } from '../core/components/button-dialog/dialog-host/dialog-host.component'
import { TranslateService } from '@ngx-translate/core'

type TranslationKeyWithParameters = { key: string; parameters: Record<string, unknown> }
type TranslationKey = string | TranslationKeyWithParameters
type DialogMessage = { message: TranslationKey; icon: string }
export interface DialogResult<T> {
  dialogResult: T
}
export interface DialogPrimaryButtonDisabled {
  primaryButtonEnabled: EventEmitter<boolean>
}
export interface DialogSecondaryButtonDisabled {
  secondaryButtonEnabled: EventEmitter<boolean>
}
export interface DialogButtonClicked {
  ocxDialogButtonClicked(state: DialogState<any>): Observable<boolean> | Promise<boolean> | boolean | undefined
}

type Component<T> = {
  type: Type<any> | DialogResult<T>
  inputs?: Record<string, unknown>
}

export type DialogState<T> = {
  button: 'primary' | 'secondary'
  result: T | undefined
}

@Injectable({ providedIn: 'any' })
export class PortalDialogService {
  constructor(private dialogService: DialogService, private translateService: TranslateService) {}

  /**
   * @deprecated
   */
  open(componentType: Type<any>, config: DynamicDialogConfig): DynamicDialogRef {
    return this.dialogService.open(componentType, config)
  }

  openDialog<T = unknown>(
    title: TranslationKey | null,
    componentOrMessage: Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    showCloseButton: boolean = true
  ): Observable<DialogState<T>> {
    let dialogTitle = ''
    const translateParams = this.prepareTitleForTranslation(title)
    this.translateService.get(translateParams.key, translateParams.parameters).subscribe((translation: string) => {
      dialogTitle = translation
    })

    const componentToRender: Component<any> = this.getComponentToRender(componentOrMessage)
    const dynamicDialogDataConfig: ButtonDialogData = {
      component: componentToRender.type as Type<any>,
      config: {
        primaryButtonDetails: this.getButtonDetails(primaryButtonTranslationKeyOrDetails),
        secondaryButtonIncluded: secondaryButtonTranslationKeyOrDetails !== undefined,
        secondaryButtonDetails: this.getButtonDetails(secondaryButtonTranslationKeyOrDetails),
      },
      componentData: componentToRender.inputs,
    }
    return this.dialogService.open(ButtonDialogComponent, {
      header: dialogTitle,
      data: dynamicDialogDataConfig,
      closable: showCloseButton && secondaryButtonTranslationKeyOrDetails !== undefined,
    }).onClose
  }

  private prepareTitleForTranslation(title: TranslationKey | null) {
    if (!title) return { key: '' }
    if (this.isString(title)) return { key: title }
    return { key: title.key, parameters: title.parameters }
  }

  private getButtonDetails(
    buttonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails | undefined
  ): ButtonDialogButtonDetails | undefined {
    if (buttonTranslationKeyOrDetails === undefined) {
      return undefined
    }

    let buttonDetails

    if (this.isString(buttonTranslationKeyOrDetails)) {
      buttonDetails = {
        key: buttonTranslationKeyOrDetails,
      }
    } else {
      buttonDetails = buttonTranslationKeyOrDetails
    }

    return buttonDetails
  }

  private getComponentToRender(componentOrMessage: Component<any> | TranslationKey | DialogMessage): Component<any> {
    if (this.isTranslationKey(componentOrMessage)) {
      return {
        type: DialogHostComponent,
        inputs: {
          message: this.isString(componentOrMessage) ? componentOrMessage : componentOrMessage.key,
          messageParameters: this.isString(componentOrMessage) ? {} : componentOrMessage.parameters,
        },
      }
    } else if (this.isDialogMessage(componentOrMessage)) {
      return {
        type: DialogHostComponent,
        inputs: {
          message: this.isString(componentOrMessage.message)
            ? componentOrMessage.message
            : componentOrMessage.message.key,
          icon: componentOrMessage.icon,
          messageParameters: this.isString(componentOrMessage.message) ? {} : componentOrMessage.message.parameters,
        },
      }
    }
    return componentOrMessage
  }

  private isTranslationKey(obj: any): obj is TranslationKey {
    return this.isString(obj) || ('key' in obj && 'parameters' in obj)
  }

  private isString(obj: any): obj is string {
    return typeof obj === 'string' || obj instanceof String
  }

  private isDialogMessage(obj: any): obj is DialogMessage {
    return 'message' in obj && 'icon' in obj
  }
}
