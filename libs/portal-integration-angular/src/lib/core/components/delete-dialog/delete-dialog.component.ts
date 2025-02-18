import { Component, OnInit, inject } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
  standalone: false,
  selector: 'ocx-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  ref = inject(DynamicDialogRef)
  config = inject(DynamicDialogConfig)

  yesDelete = 'Delete'
  cancelDelete = 'Cancel'

  ngOnInit() {
    this.yesDelete = this.config.data.yesDelete
    this.cancelDelete = this.config.data.cancelDelete
  }

  exitDeleteWindow(deleteConfirmed: boolean) {
    this.ref.close(deleteConfirmed)
  }
}
