import { Component, EventEmitter, Output, input, output } from '@angular/core'
import { ButtonDialogConfig } from '../../../model/button-dialog'
import { DialogState } from '../../../services/portal-dialog.service'

@Component({
  standalone: false,
  selector: 'ocx-dialog-inline',
  templateUrl: './dialog-inline.component.html',
  styleUrls: ['./dialog-inline.component.scss'],
})
export class DialogInlineComponent {
  config = input<ButtonDialogConfig>({})

  resultEmitter = output<unknown>()

  buttonClicked(event: DialogState<unknown>) {
    this.resultEmitter.emit(event.button)
  }
}
