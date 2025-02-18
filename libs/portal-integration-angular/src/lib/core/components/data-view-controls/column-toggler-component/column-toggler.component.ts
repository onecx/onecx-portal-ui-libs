import { Component, OnInit, inject } from '@angular/core'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
  standalone: false,
  templateUrl: './column-toggler.component.html',
  providers: [DialogService],
})
export class ColumnTogglerComponent implements OnInit {
  private ref = inject(DynamicDialogRef)
  private config = inject(DynamicDialogConfig)

  sourceLabel = 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.ACTIVE_COLUMNS_LABEL'
  targetLabel = 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.INACTIVE_COLUMNS_LABEL'
  saveButtonLabel = 'OCX_CUSTOM_GROUP_COLUMN_SELECTOR.SAVE_BUTTON_LABEL'

  allColumns: { field: string; header: string; active: boolean; translationPrefix?: string }[] = []
  activeColumns: { field: string; header: string; active: boolean; translationPrefix?: string }[] = []
  inactiveColumns: { field: string; header: string; active: boolean; translationPrefix?: string }[] = []

  activeCols: string[] = []
  inactiveCols: string[] = []

  submitResults(
    colActive: { field: string; header: string; active: boolean; translationPrefix?: string }[],
    colInactive: { field: string; header: string; active: boolean; translationPrefix?: string }[]
  ) {
    this.allColumns = colActive.concat(colInactive)
    this.ref.close(this.allColumns)
  }

  ngOnInit(): void {
    this.allColumns = this.config.data.colDef
    this.activeCols = this.config.data.activeColIds
    this.inactiveCols = this.config.data.inactiveColIds

    if (this.activeCols.length > 0) {
      this.loadColumns()
    } else {
      this.initColumns()
    }

    if (this.config.data.inactiveColumnHeader) {
      this.targetLabel = this.config.data.inactiveColumnHeader
    }
    if (this.config.data.activeColumnHeader) {
      this.sourceLabel = this.config.data.activeColumnHeader
    }
    if (this.config.data.saveButtonLabel) {
      this.saveButtonLabel = this.config.data.saveButtonLabel
    }
  }

  loadColumns(): void {
    if (this.activeCols.length > 0) {
      this.activeColumns = this.activeCols.map((active) => this.allColumns.find((col) => col.field === active)) as {
        field: string
        header: string
        active: boolean
        translationPrefix?: string
      }[]

      this.inactiveColumns = this.inactiveCols.map((active) => this.allColumns.find((col) => col.field === active)) as {
        field: string
        header: string
        active: boolean
        translationPrefix?: string
      }[]
    }
  }

  initColumns(): void {
    this.activeColumns = this.allColumns.filter((a: { active: boolean }) => {
      return a.active === true
    })
    this.inactiveColumns = this.allColumns.filter((a: { active: boolean }) => {
      return a.active === false
    })
  }

  setActive(event: { field: string; header: string; active: boolean; translationPrefix?: string }[]): void {
    event.forEach((element) => {
      element.active = true
    })
  }

  setInactive(event: { field: string; header: string; active: boolean; translationPrefix?: string }[]): void {
    event.forEach((element) => {
      element.active = false
    })
  }
  sanitizeToggleTranslation(header: string, prefix?: string) {
    if (prefix) {
      return (prefix + '.' + header).replace('..', '.')
    } else {
      return ('PORTAL_ITEM.' + header).replace('..', '.')
    }
  }
}
