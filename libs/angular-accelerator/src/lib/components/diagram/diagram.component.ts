import { Component, computed, effect, input, model, output, signal, OnDestroy } from '@angular/core'
import { ChartData, ChartOptions } from 'chart.js'
import * as d3 from 'd3-scale-chromatic'
import { PrimeIcons } from 'primeng/api'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ColorUtils } from '../../utils/colorutils'
import { PrimeIcon } from '../../utils/primeicon.utils'
import { addHighContrastListener, getLabelColor, hasHighContrast, removeHighContrastListener } from './diagram-contrast-utils'

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

export type ChartType = 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'

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
export class DiagramComponent implements OnDestroy {
  data = input<DiagramData[] | undefined>(undefined)
  sumKey = input<string>('OCX_DIAGRAM.SUM')
  fullHeight = input<boolean>(false)
  chartTitleKey = input<string>('')
  chartDescriptionKey = input<string>('')
  customLegends = input<boolean>(false)
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  fillMissingColors = input<boolean>(true)

  diagramType = model<DiagramType>(DiagramType.PIE)

  supportedDiagramTypes = input<DiagramType[]>([])

  selectedDiagramType = computed(() => allDiagramTypes.find((v) => v.layout === this.diagramType()))
  chartType = computed(() => this.diagramTypeToChartType(this.diagramType()))
  dataSelected = output<any>()
  diagramTypeChanged = output<DiagramType>()
  componentStateChanged = output<DiagramComponentState>()
  chartOptions = signal<ChartOptions>({})
  chartData = signal<ChartData | undefined>(undefined)
  amountOfData = signal<number | undefined | null>(undefined)
  shownDiagramTypes = computed(() => 
    allDiagramTypes.filter((vl) => this.supportedDiagramTypes().includes(vl.layout))
  )
  highContrast = signal(false)
  // enabled for only pie chart as it contains legends which are hidden
  useFullHeight = computed(() =>
    this.diagramType() === DiagramType.PIE && this.fullHeight()
  )
  // Changing the colorRangeInfo, will change the range of the color palette of the diagram.
  private colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
  // Changing the colorScale, will change the thematic color appearance of the diagram.
  private colorScale = d3.interpolateCool

  private static nextUniqueId = 0;
  uniqueInstanceId: number;
  legendItems: { label: string | undefined, color: string | undefined, value?: number }[] = []

  constructor() {
    this.refreshTheme()
    this.uniqueInstanceId = DiagramComponent.nextUniqueId++;
    addHighContrastListener(this.refreshTheme)
    effect(() => {
      this.generateChart(this.colorScale, this.colorRangeInfo)
    })
  }

  ngOnDestroy() {
    removeHighContrastListener(this.refreshTheme)
  }

  refreshTheme = () => {
    this.highContrast.set(hasHighContrast())
    this.generateChart(this.colorScale, this.colorRangeInfo)
  }

  public generateChart(colorScale: any, colorRangeInfo: any) {
    const data = this.data()
    if (!data) return
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

    this.legendItems = data.map((value, index) => ({
      label: value?.label,
      color: COLORS[index],
    }))

    const labelColor = getLabelColor(this.highContrast())
    this.chartOptions.set({
      plugins: {
        legend: {
          display: !this.customLegends(),
          position: 'bottom',                    
          labels: { color: labelColor },
        },
      },
      maintainAspectRatio: false,
      ...(this.diagramType() === DiagramType.VERTICAL_BAR && {
        plugins: { legend: {labels: { color: labelColor } } },
        scales: { y: { ticks: { precision: 0, color: labelColor } }, x: { ticks: { color: labelColor } } },
      }),
      ...(this.diagramType() === DiagramType.HORIZONTAL_BAR && {
        indexAxis: 'y',
        plugins: { legend: {labels: { color: labelColor } } },
        scales: { x: { ticks: { precision: 0, color: labelColor } }, y: { ticks: { color: labelColor } } },
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

  private diagramTypeToChartType(value: DiagramType): ChartType {
    if (value === DiagramType.PIE) return 'pie'
    else if (value === DiagramType.HORIZONTAL_BAR || value === DiagramType.VERTICAL_BAR) return 'bar'
    else return 'pie'
  }

  dataClicked(event: []) {
    this.dataSelected.emit(event.length)
  }

  onDiagramTypeChanged(event: any) {
    this.diagramType.set(event.value.layout)
    this.diagramTypeChanged.emit(event.value.layout)
    this.componentStateChanged.emit({
      activeDiagramType: event.value.layout,
    })
  }
}
function interpolateColors(amountOfData: number, colorScale: any, colorRangeInfo: any) {
  return ColorUtils.interpolateColors(amountOfData, colorScale, colorRangeInfo)
}