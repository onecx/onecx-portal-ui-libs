import { Component, computed, inject, Input, input, OnInit, output, ChangeDetectionStrategy } from '@angular/core'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { OptimusIcon } from '../../utils/optimus-icon.utils'
import { DataViewStateService } from '../../services/data-view-state.service'
import { ViewLayout } from '../../model/view-layout.model'

interface ViewingLayouts {
  id: string
  icon: OptimusIcon
  layout: ViewLayout
  tooltip?: string
  tooltipKey: string
  label?: string
  labelKey: string
}

const ALL_VIEW_LAYOUTS: ViewingLayouts[] = [
  {
    id: 'ocx-data-layout-selection-list',
    icon: OpenngIcons.LIST,
    layout: 'list',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.LIST',
  },
  {
    id: 'ocx-data-layout-selection-grid',
    icon: OpenngIcons.TH_LARGE,
    layout: 'grid',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.GRID',
  },
  {
    id: 'ocx-data-layout-selection-table',
    icon: OpenngIcons.TABLE,
    layout: 'table',
    tooltipKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
    labelKey: 'OCX_DATA_LAYOUT_SELECTION.LAYOUT.TABLE',
  },
]

export interface DataLayoutSelectionComponentState {
  layout?: ViewLayout
}
@Component({
  standalone: false,
  selector: 'ocx-data-layout-selection',
  templateUrl: './data-layout-selection.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./data-layout-selection.component.scss'],
})
export class DataLayoutSelectionComponent implements OnInit {
  readonly stateService = inject(DataViewStateService)
  supportedViewLayouts = input<Array<string>>([])

  @Input()
  set layout(value: ViewLayout) {
    this.stateService.layout.set(value)
  }

  readonly dataViewLayoutChange = output<ViewLayout>()
  readonly componentStateChanged = output<DataLayoutSelectionComponentState>()

  viewingLayouts = computed(() => ALL_VIEW_LAYOUTS.filter((vl) => this.supportedViewLayouts().includes(vl.layout)))

  readonly selectedViewLayout = computed(() => ALL_VIEW_LAYOUTS.find((v) => v.layout === this.stateService.layout()))
  
  ngOnInit(): void {
    this.componentStateChanged.emit({
      layout: this.stateService.layout(),
    })
  }

  onDataViewLayoutChange(event: { icon: OptimusIcon; layout: ViewLayout }): void {
    this.stateService.layout.set(event.layout)
    this.dataViewLayoutChange.emit(event.layout)
    this.componentStateChanged.emit({ layout: event.layout })
  }
}
