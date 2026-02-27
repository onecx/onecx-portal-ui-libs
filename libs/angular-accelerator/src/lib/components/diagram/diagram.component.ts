import { Component, EventEmitter, Input, OnChanges, OnInit, Output, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ChartData, ChartOptions } from 'chart.js'
import * as d3 from 'd3-scale-chromatic'
import { PrimeIcons } from 'primeng/api'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ColorUtils } from '../../utils/colorutils'
import { PrimeIcon } from '../../utils/primeicon.utils'

export interface DiagramLayouts {
  id: string
  icon: PrimeIcon
  layout: DiagramType
  tooltip?: string
  tooltipKey: string
  label?: string
  labelKey: string
}

export interface DiagramComponentState {
  activeDiagramType?: DiagramType
}

const allDiagramTypes: DiagramLayouts[] = [
  {
    id: 'diagram-pie',
    icon: PrimeIcons.CHART_PIE,
    layout: DiagramType.PIE,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
  },
  {
    id: 'diagram-horizontal-bar',
    icon: PrimeIcons.BARS,
    layout: DiagramType.HORIZONTAL_BAR,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
  },
  {
    id: 'diagram-vertical-bar',
    icon: PrimeIcons.CHART_BAR,
    layout: DiagramType.VERTICAL_BAR,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
  },
]

@Component({
  standalone: false,
  selector: 'ocx-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements OnInit, OnChanges {
  private translateService = inject(TranslateService)

  @Input() data: DiagramData[] | undefined
  @Input() sumKey = 'OCX_DIAGRAM.SUM'
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  @Input() fillMissingColors = true
  @Input() fullHeight = false
  private _diagramType: DiagramType = DiagramType.PIE
  selectedDiagramType: DiagramLayouts | undefined
  public chartType: 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' = 'pie'
  @Input()
  get diagramType(): DiagramType {
    return this._diagramType
  }
  set diagramType(value: DiagramType) {
    this._diagramType = value
    this.selectedDiagramType = allDiagramTypes.find((v) => v.layout === value)
    this.chartType = this.diagramTypeToChartType(value)
  }
  private _supportedDiagramTypes: DiagramType[] = []
  @Input()
  get supportedDiagramTypes(): DiagramType[] {
    return this._supportedDiagramTypes
  }
  set supportedDiagramTypes(value: DiagramType[]) {
    this._supportedDiagramTypes = value
    this.shownDiagramTypes = allDiagramTypes.filter((vl) => this.supportedDiagramTypes.includes(vl.layout))
  }
  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  @Output() diagramTypeChanged: EventEmitter<DiagramType> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<DiagramComponentState> = new EventEmitter()

  // enabled for only pie chart as it contains legends which are clipped
  get useFullHeight(): boolean {
    return this._diagramType === DiagramType.PIE && this.fullHeight 
  }

  chartOptions: ChartOptions | undefined
  chartData: ChartData | undefined
  amountOfData: number | undefined | null
  shownDiagramTypes: DiagramLayouts[] = []
  // Changing the colorRangeInfo, will change the range of the color palette of the diagram.
  private colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
  // Changing the colorScale, will change the thematic color appearance of the diagram.
  private colorScale = d3.interpolateCool

  ngOnChanges(): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
  }
  ngOnInit(): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
  }

  public generateChart(colorScale: any, colorRangeInfo: any) {
    if (this.data) {
      const inputData = this.data.map((diagramData) => diagramData.value)

      this.amountOfData = this.data.reduce((acc, current) => acc + current.value, 0)
      const COLORS = this.generateColors(this.data, colorScale, colorRangeInfo)
      this.chartData = {
        labels: this.data.map((data) => data.label),
        datasets: [
          {
            data: inputData,
            backgroundColor: COLORS,
          },
        ],
      }
    }

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      maintainAspectRatio: false,
      ...(this._diagramType === DiagramType.VERTICAL_BAR && {
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { precision: 0 } } },
      }),
      ...(this._diagramType === DiagramType.HORIZONTAL_BAR && {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { precision: 0 } } },
      }),
    }
  }

  generateColors(data: DiagramData[], colorScale: any, colorRangeInfo: any) {
    const dataColors = data.map((diagramData) => diagramData.backgroundColor)
    if (dataColors.filter((v) => v !== undefined).length === data.length) {
      return dataColors
    } else if (this.fillMissingColors) {
      // it is intended to generate more colors than needed, so interval for generated colors is same as amount of items on the diagram
      const interpolatedColors = interpolateColors(dataColors.length, colorScale, colorRangeInfo)
      let interpolatedIndex = 0
      return dataColors.map((color) => (color === undefined ? interpolatedColors[interpolatedIndex++] : color))
    } else {
      return interpolateColors(data.length, colorScale, colorRangeInfo)
    }
  }

  generateTotal(data: DiagramData[]): number {
    return data.reduce((acc, current) => acc + current.value, 0)
  }

  generateDiagramValueString(data: DiagramData[]): string {
    return data.map((item) => `${item.label}:${item.value}`).join(', ')
  }

  private diagramTypeToChartType(
    value: DiagramType
  ): 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' {
    if (value === DiagramType.PIE) return 'pie'
    else if (value === DiagramType.HORIZONTAL_BAR || value === DiagramType.VERTICAL_BAR) return 'bar'
    return 'pie'
  }

  dataClicked(event: []) {
    this.dataSelected.emit(event.length)
  }

  onDiagramTypeChanged(event: any) {
    this.diagramType = event.value.layout
    this.generateChart(this.colorScale, this.colorRangeInfo)
    this.diagramTypeChanged.emit(event.value.layout)
    this.componentStateChanged.emit({
      activeDiagramType: event.value.layout,
    })
  }
}
function interpolateColors(amountOfData: number, colorScale: any, colorRangeInfo: any) {
  return ColorUtils.interpolateColors(amountOfData, colorScale, colorRangeInfo)
}
