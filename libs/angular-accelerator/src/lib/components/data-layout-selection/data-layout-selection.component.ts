import { Component, computed, inject, input } from '@angular/core'
import { PrimeIcons } from 'primeng/api'
import { PrimeIcon } from '../../utils/primeicon.utils'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

interface ViewingLayouts {
  id: string
  icon: PrimeIcon
  layout: 'grid' | 'list' | 'table'
  tooltip?: string
  tooltipKey: string
  label?: string
  labelKey: string
}

const ALL_VIEW_LAYOUTS: ViewingLayouts[] = [
  {
    id: 'ocx-data-layout-selection-list',
    icon: PrimeIcons.LIST,
    layout: 'list',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
  },
  {
    id: 'ocx-data-layout-selection-grid',
    icon: PrimeIcons.TH_LARGE,
    layout: 'grid',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
  },
  {
    id: 'ocx-data-layout-selection-table',
    icon: PrimeIcons.TABLE,
    layout: 'table',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
  },
]

export interface DataLayoutSelectionComponentState {
  layout?: 'grid' | 'list' | 'table'
}
@Component({
  standalone: false,
  selector: 'ocx-data-layout-selection',
  templateUrl: './data-layout-selection.component.html',
  styleUrls: ['./data-layout-selection.component.scss'],
})
export class DataLayoutSelectionComponent {
  private storeService = inject(InteractiveDataViewService)
  supportedViewLayouts = input<Array<string>>([])

  layout = this.storeService.layout

  viewingLayouts = computed(() => ALL_VIEW_LAYOUTS.filter((vl) => this.supportedViewLayouts().includes(vl.layout)))

  readonly selectedViewLayout = computed(() => ALL_VIEW_LAYOUTS.find((v) => v.layout === this.layout()))

  onDataViewLayoutChange(event: { icon: PrimeIcon; layout: 'grid' | 'list' | 'table' }): void {
    this.storeService.setLayout(event.layout)
  }
}
