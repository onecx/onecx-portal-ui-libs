import { Component } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
  selector: 'ocx-no-help-item',
  templateUrl: './no-help-item.component.html',
  styleUrls: ['./no-help-item.component.scss'],
})
export class NoHelpItemComponent {
  public helpArticleId: string

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {
    this.helpArticleId = config.data.helpArticleId
  }

  close() {
    this.ref.close()
  }
}
