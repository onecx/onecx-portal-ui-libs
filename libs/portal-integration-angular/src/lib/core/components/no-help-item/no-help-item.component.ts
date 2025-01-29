import { Component, inject } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
  standalone: false,
  selector: 'ocx-no-help-item',
  templateUrl: './no-help-item.component.html',
  styleUrls: ['./no-help-item.component.scss'],
})
export class NoHelpItemComponent {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  public helpArticleId: string

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const config = this.config;

    this.helpArticleId = config.data.helpArticleId
  }

  close() {
    this.ref.close()
  }
}
