import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

interface ViewingLayouts {
  icon: string
  layout: 'grid' | 'list' | 'table'
  title?: string
  titleKey: string
}

const ALL_VIEW_LAYOUTS: ViewingLayouts[] = [
  { icon: 'pi pi-list', layout: 'list', titleKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST' },
  { icon: 'pi pi-th-large', layout: 'grid', titleKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID' },
  { icon: 'pi pi-table', layout: 'table', titleKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE' },
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
    this.selectedViewLayout = this.viewingLayouts.find((v) => v.layout === value)
  }
  get layout(): 'grid' | 'list' | 'table' {
    return this.selectedViewLayout?.layout || 'table'
  }

  @Output() dataViewLayoutChange: EventEmitter<'grid' | 'list' | 'table'> = new EventEmitter()

  viewingLayouts: ViewingLayouts[] = []
  selectedViewLayout: ViewingLayouts | undefined

  ngOnInit(): void {
    this.viewingLayouts = ALL_VIEW_LAYOUTS.filter((vl) => this.supportedViewLayouts.includes(vl.layout))
    this.layout = 'table'
  }

  onDataViewLayoutChange(event: { icon: string; layout: 'grid' | 'list' | 'table' }): void {
    this.dataViewLayoutChange.emit(event.layout)
  }
}
