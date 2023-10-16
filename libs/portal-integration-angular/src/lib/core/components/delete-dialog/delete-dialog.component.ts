import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
  selector: 'ocx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  yesDelete = 'Delete'
  cancelDelete = 'Cancel'

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.yesDelete = this.config.data.yesDelete
    this.cancelDelete = this.config.data.cancelDelete
  }

  exitDeleteWindow(deleteConfirmed: boolean) {
    this.ref.close(deleteConfirmed)
  }
}
