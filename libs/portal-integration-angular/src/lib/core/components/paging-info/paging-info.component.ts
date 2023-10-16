import { Component, Input } from '@angular/core'
import { PortalUIService } from '../../../services/portal-ui.service'

@Component({
  selector: 'ocx-paging-info',
  template: `
    <span *ngIf="resultsCount > 0 && state.totalRecords > 0; else noResults">
      {{ textShowing }} {{ state.first + 1 }} -
      {{ state.rows * (state.page + 1) < state.totalRecords ? state.rows * (state.page + 1) : state.totalRecords }}
      {{ textOf }} {{ state.totalRecords }}
    </span>
    <ng-template #noResults>
      {{ textNoResults }}
    </ng-template>
  `,
})
export class PagingInfoComponent {
  @Input() resultsCount = 0
  @Input() state!: CustomTableState

  textShowing?: string
  textRows?: string
  textTotal?: string
  textOf?: string
  textNoResults?: string

  constructor(private api: PortalUIService) {
    this.textShowing = this.api.getTranslation('pagingShowing')
    this.textRows = this.api.getTranslation('pagingRows')
    this.textTotal = this.api.getTranslation('pagingTotal')
    this.textOf = this.api.getTranslation('pagingOf')
    this.textNoResults = this.api.getTranslation('pagingNoResults')
  }
}

interface CustomTableState {
  page: number
  pageCount: number
  rows: number
  first: number
  totalRecords: number
}
