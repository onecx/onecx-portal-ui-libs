import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PrimeIcons } from 'primeng/api'
import { PrimeIcon } from '../../utils/primeicon.utils'

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
export class DataLayoutSelectionComponent implements OnInit {
  @Input() supportedViewLayouts: Array<string> = []
  @Input()
  set layout(value: 'grid' | 'list' | 'table') {
    this.selectedViewLayout = ALL_VIEW_LAYOUTS.find((v) => v.layout === value)
  }
  get layout(): 'grid' | 'list' | 'table' {
    return this.selectedViewLayout?.layout || 'table'
  }

  @Output() dataViewLayoutChange: EventEmitter<'grid' | 'list' | 'table'> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<DataLayoutSelectionComponentState> = new EventEmitter()

  viewingLayouts: ViewingLayouts[] = []
  selectedViewLayout: ViewingLayouts | undefined

  ngOnInit(): void {
    this.viewingLayouts = ALL_VIEW_LAYOUTS.filter((vl) => this.supportedViewLayouts.includes(vl.layout))
    this.componentStateChanged.emit({
      layout: this.layout,
    })
  }

  onDataViewLayoutChange(event: { icon: PrimeIcon; layout: 'grid' | 'list' | 'table' }): void {
    this.dataViewLayoutChange.emit(event.layout)
    this.componentStateChanged.emit({
      layout: event.layout,
    })
  }
}
