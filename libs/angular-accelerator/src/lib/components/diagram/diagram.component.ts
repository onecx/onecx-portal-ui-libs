import { Component, computed, effect, input, model, output, signal, OnDestroy, ChangeDetectionStrategy } from '@angular/core'
import { ChartData, ChartOptions } from 'chart.js'
import * as d3 from 'd3-scale-chromatic'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { DiagramData } from '../../model/diagram-data'
import { DiagramType } from '../../model/diagram-type'
import { ColorUtils } from '../../utils/colorutils'
import { OptimusIcon } from '../../utils/optimus-icon.utils'
import {
  addHighContrastListener,
  ensureGraphicsContrast,
  getLabelColor,
  getThemeColor,
  hasHighContrast,
  removeHighContrastListener,
} from '../../utils/diagram-contrast-utils'

export interface DiagramLayouts {
  id: string
  icon: OptimusIcon
  layout: DiagramType
  tooltip?: string
  tooltipKey: string
  label?: string
  labelKey: string
}

export interface DiagramComponentState {
  activeDiagramType?: DiagramType
}

/**
 * Payload of the `dataSelected` output.
 *
 * Emitted when a chart segment is clicked and when a legend entry is activated (click, Enter or Space).
 */
export interface DiagramDataSelectedEvent {
  /** Position of the selected entry in the `data` input. */
  index: number
  /** The selected entry of the `data` input. */
  data: DiagramData
}

export interface DiagramLegendItem {
  label: string
  value: number
  color: string | undefined
}

/**
 * Palette of the colors the diagram generates for data without a `backgroundColor`.
 *
 * - `categorical` (default since v9): distinct hues (d3 Tableau10), so neighbouring segments are told apart by hue rather than by lightness.
 *   Light hues of this palette (e.g. yellow, pink, grey) may be darkened on light themes to reach the contrast below, so they can look different from the reference palette.
 * - `sequential`: the cool gradient used before v9 (opt-out), for data with a natural order.
 *
 * With both palettes every generated color is adjusted to the theme so it reaches at least 3:1 against `--content-bg-color` (WCAG 1.4.11).
 */
export type DiagramColorPalette = 'categorical' | 'sequential'

export type ChartType = 'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar'

const allDiagramTypes: DiagramLayouts[] = [
  {
    id: 'diagram-pie',
    icon: OpenngIcons.CHART_PIE,
    layout: DiagramType.PIE,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.PIE',
  },
  {
    id: 'diagram-horizontal-bar',
    icon: OpenngIcons.BARS,
    layout: DiagramType.HORIZONTAL_BAR,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.HORIZONTAL_BAR',
  },
  {
    id: 'diagram-vertical-bar',
    icon: OpenngIcons.CHART_BAR,
    layout: DiagramType.VERTICAL_BAR,
    tooltipKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
    labelKey: 'OCX_DIAGRAM.SWITCH_DIAGRAM_TYPE.VERTICAL_BAR',
  },
]

@Component({
  standalone: false,
  selector: 'ocx-diagram',
  templateUrl: './diagram.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./diagram.component.scss'],
})
export class DiagramComponent implements OnDestroy {
  data = input<DiagramData[] | undefined>(undefined)
  sumKey = input<string>('OCX_DIAGRAM.SUM')
  fullHeight = input<boolean>(false)
  chartTitleKey = input<string>('')
  chartDescriptionKey = input<string>('')
  /**
   * Level (1-6) of the heading rendered for `chartTitleKey`. Choose it so that the heading fits into the page outline.
   */
  titleHeadingLevel = input<number>(2)
  customLegends = input<boolean>(false)
  /**
   * This property determines if diagram should generate the colors for the data that does not have any set.
   *
   * Setting this property to false will result in using the provided colors only if every data item has one. In the scenario where at least one item does not have a color set, diagram will generate all colors.
   */
  fillMissingColors = input<boolean>(true)
  /**
   * Palette of the generated colors, see {@link DiagramColorPalette}. Defaults to `categorical`; set `sequential` to keep the pre-v9 gradient.
   */
  colorPalette = input<DiagramColorPalette>('categorical')

  diagramType = model<DiagramType>(DiagramType.PIE)

  supportedDiagramTypes = input<DiagramType[]>([])

  selectedDiagramType = computed(() => allDiagramTypes.find((v) => v.layout === this.diagramType()))
  chartType = computed(() => this.diagramTypeToChartType(this.diagramType()))
  /**
   * Emits the selected entry when a chart segment is clicked or a legend entry is activated with mouse or keyboard.
   */
  dataSelected = output<DiagramDataSelectedEvent>()
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
  legendItems: DiagramLegendItem[] = []

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
    // Segments are separated by a border in the background color, so adjacent segments stay distinguishable
    const segmentBorderColor = getThemeColor('--content-bg-color')
    this.chartData.set({
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: inputData,
          backgroundColor: COLORS,
          ...(segmentBorderColor && { borderColor: segmentBorderColor }),
        },
      ],
    })

    this.legendItems = data.map((value, index) => ({
      label: value.label,
      value: value.value,
      color: COLORS[index],
    }))

    const labelColor = getLabelColor(this.highContrast())
    this.chartOptions.set({
      plugins: {
        // the legend is rendered as keyboard accessible HTML below the chart
        legend: {
          display: false,
          labels: { color: labelColor },
        },
      },
      maintainAspectRatio: false,
      ...(this.diagramType() === DiagramType.VERTICAL_BAR && {
        scales: { y: { ticks: { precision: 0, color: labelColor } }, x: { ticks: { color: labelColor } } },
      }),
      ...(this.diagramType() === DiagramType.HORIZONTAL_BAR && {
        indexAxis: 'y',
        scales: { x: { ticks: { precision: 0, color: labelColor } }, y: { ticks: { color: labelColor } } },
      })
    })
  }

  generateColors(data: DiagramData[], colorScale: any, colorRangeInfo: any) {
    const dataColors = data.map((diagramData) => diagramData.backgroundColor)
    if (dataColors.filter((v) => v !== undefined).length === data.length) {
      return dataColors
    } else if (this.fillMissingColors()) {
      // it is intended to generate more colors than needed, so interval for generated colors is same as amount of items on the diagram
      const interpolatedColors = this.paletteColors(dataColors.length, colorScale, colorRangeInfo)
      let interpolatedIndex = 0
      return dataColors.map((color) => (color === undefined ? interpolatedColors[interpolatedIndex++] : color))
    } else {
      return this.paletteColors(data.length, colorScale, colorRangeInfo)
    }
  }

  private paletteColors(
    amountOfData: number,
    colorScale: (point: number) => string,
    colorRangeInfo: { colorStart: number; colorEnd: number; useEndAsStart: boolean }
  ): string[] {
    const colors =
      this.colorPalette() === 'sequential'
        ? ColorUtils.interpolateColors(amountOfData, colorScale, colorRangeInfo)
        : categoricalColors(amountOfData)
    return withThemeContrast(colors)
  }

  generateTotal(data: DiagramData[]): number {
    return data.reduce((acc, current) => acc + current.value, 0)
  }

  generateDiagramValueString(data: DiagramData[]): string {
    return data.map((item) => `${item.label}: ${item.value}`).join(', ')
  }

  private diagramTypeToChartType(value: DiagramType): ChartType {
    if (value === DiagramType.PIE) return 'pie'
    else if (value === DiagramType.HORIZONTAL_BAR || value === DiagramType.VERTICAL_BAR) return 'bar'
    else return 'pie'
  }

  dataClicked(event: { element: { index: number } }) {
    this.selectData(event.element.index)
  }

  selectData(index: number) {
    const selected = this.data()?.[index]
    if (selected) {
      this.dataSelected.emit({ index, data: selected })
    }
  }

  onDiagramTypeChanged(event: any) {
    this.diagramType.set(event.value.layout)
    this.diagramTypeChanged.emit(event.value.layout)
    this.componentStateChanged.emit({
      activeDiagramType: event.value.layout,
    })
  }
}
// Distinct hues, repeated when there are more entries than hues (segments stay separated by a background border)
function categoricalColors(amountOfData: number): string[] {
  const scheme = d3.schemeTableau10
  return Array.from({ length: amountOfData }, (_, index) => scheme[index % scheme.length])
}

// Generated colors are adjusted to the theme so every segment reaches 3:1 against the background (WCAG 1.4.11)
function withThemeContrast(colors: string[]): string[] {
  const background = getThemeColor('--content-bg-color')
  const towards = getThemeColor('--text-color')
  return colors.map((color) => ensureGraphicsContrast(color, background, towards))
}
