import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PrimeIcons } from 'primeng/api'
import { PrimeIcon } from '../../utils/primeicon.utils'

interface ViewingLayouts {
  icon: PrimeIcon
  layout: 'grid' | 'list' | 'table'
  title?: string
  titleKey: string
}

const ALL_VIEW_LAYOUTS: ViewingLayouts[] = [
  { icon: PrimeIcons.LIST, layout: 'list', titleKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST' },
  { icon: PrimeIcons.TH_LARGE, layout: 'grid', titleKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID' },
  { icon: PrimeIcons.TABLE, layout: 'table', titleKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE' },
]

@Component({
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

  viewingLayouts: ViewingLayouts[] = []
  selectedViewLayout: ViewingLayouts | undefined

  ngOnInit(): void {
    this.viewingLayouts = ALL_VIEW_LAYOUTS.filter((vl) => this.supportedViewLayouts.includes(vl.layout))
  }

  onDataViewLayoutChange(event: { icon: PrimeIcon; layout: 'grid' | 'list' | 'table' }): void {
    this.dataViewLayoutChange.emit(event.layout)
  }
}
