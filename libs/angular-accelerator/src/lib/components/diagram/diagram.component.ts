import { Component, EventEmitter, OnInit, Output, effect, input, output, signal } from '@angular/core'
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
export class DiagramComponent implements OnInit {
  data = input<DiagramData[] | undefined>(undefined)
  sumKey = input<string>('OCX_DIAGRAM.SUM')
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  fillMissingColors = input<boolean>(true)

  selectedDiagramType = signal<DiagramLayouts | undefined>(undefined)
  public chartType = signal<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'>('pie')

  _effectiveDiagramType = signal<DiagramType>(DiagramType.PIE)
  diagramType = input<DiagramType>(DiagramType.PIE)

  supportedDiagramTypes = input<DiagramType[]>([])

  dataSelected = output<any>()
  diagramTypeChanged = output<DiagramType>()
  componentStateChanged = output<DiagramComponentState>()
  chartOptions = signal<ChartOptions>('' as any)
  chartData = signal<ChartData | undefined>(undefined)
  amountOfData = signal<number | undefined | null>(undefined)
  shownDiagramTypes = signal<DiagramLayouts[]>([])
  // Changing the colorRangeInfo, will change the range of the color palette of the diagram.
  private colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
  // Changing the colorScale, will change the thematic color appearance of the diagram.
  private colorScale = d3.interpolateCool

  constructor() {
    effect(() => {
      const value = this.diagramType()
      this._effectiveDiagramType.set(value)
    })

    effect(() => {
      const value = this._effectiveDiagramType()
      this.selectedDiagramType.set(allDiagramTypes.find((v) => v.layout === value))
      this.chartType.set(this.diagramTypeToChartType(value))
    })

    effect(() => {
      const value = this.supportedDiagramTypes()
      this.shownDiagramTypes.set(allDiagramTypes.filter((vl) => value.includes(vl.layout)))
    })

    effect(() => {
      this.generateChart(this.colorScale, this.colorRangeInfo)
    })
  }

  ngOnInit(): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
  }

  public generateChart(colorScale: any, colorRangeInfo: any) {
    const data = this.data()
    if (data) {
      const inputData = data.map((diagramData) => diagramData.value)

      this.amountOfData.set(data.reduce((acc, current) => acc + current.value, 0))
      const COLORS = this.generateColors(data, colorScale, colorRangeInfo)
      this.chartData.set({
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: inputData,
            backgroundColor: COLORS,
          },
        ],
      })
    }

    this.chartOptions.set({
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      maintainAspectRatio: false,
      ...(this._effectiveDiagramType() === DiagramType.VERTICAL_BAR && {
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { precision: 0 } } },
      }),
      ...(this._effectiveDiagramType() === DiagramType.HORIZONTAL_BAR && {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { ticks: { precision: 0 } } },
      }),
    })
  }

  generateColors(data: DiagramData[], colorScale: any, colorRangeInfo: any) {
    const dataColors = data.map((diagramData) => diagramData.backgroundColor)
    if (dataColors.filter((v) => v !== undefined).length === data.length) {
      return dataColors
    } else if (this.fillMissingColors()) {
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
    this._effectiveDiagramType.set(event.value.layout)
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
