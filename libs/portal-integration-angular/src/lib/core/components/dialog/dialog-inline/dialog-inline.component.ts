import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ButtonDialogConfig } from 'libs/portal-integration-angular/src/lib/model/button-dialog'
import { DialogState } from 'libs/portal-integration-angular/src/lib/services/portal-dialog.service'

@Component({
  selector: 'ocx-dialog-inline',
  templateUrl: './dialog-inline.component.html',
  styleUrls: ['./dialog-inline.component.scss'],
})
export class DialogInlineComponent {
  @Input() config: ButtonDialogConfig = {}

  @Output() resultEmitter = new EventEmitter()

  constructor() {}

  buttonClicked(event: DialogState<unknown>) {
    this.resultEmitter.emit(event.button)
  }
}
