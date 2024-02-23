import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ChartData, ChartOptions } from 'chart.js'
import * as d3 from 'd3-scale-chromatic'
import { ColorUtils } from '../../utils/colorutils'
import { DiagramData } from '../../../model/diagram-data'
import { DiagramType } from '../../../model/diagram-type'
import { PrimeIcons } from 'primeng/api'

interface DiagramLayouts {
  icon: string
  layout: DiagramType
  title?: string
  titleKey: string
}

const allDiagramTypes: DiagramLayouts[] = [
  { icon: PrimeIcons.CHART_PIE, layout: DiagramType.PIE, titleKey: '' },
  { icon: PrimeIcons.BARS, layout: DiagramType.HORIZONTAL_BAR, titleKey: '' },
  { icon: PrimeIcons.CHART_BAR, layout: DiagramType.VERTICAL_BAR, titleKey: '' },
]

@Component({
  selector: 'ocx-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit, OnChanges {
  @Input() data: DiagramData[] | undefined
  @Input() sumKey = 'OCX_DIAGRAM.SUM'
  @Input() supportedDiagramTypes: DiagramType[] = []
  private _diagramType: DiagramType = DiagramType.PIE
  selectedDiagramType: DiagramLayouts | undefined
  public chartType = 'pie'
  @Input()
  get diagramType(): DiagramType {
    return this._diagramType
  }
  set diagramType(value: DiagramType) {
    this._diagramType = value
    this.selectedDiagramType = allDiagramTypes.find((v) => v.layout === value)
    this.chartType = this.diagramTypeToChartType(value)
  }
  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  @Output() diagramTypeChanged: EventEmitter<DiagramType> = new EventEmitter()
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

  constructor(private translateService: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
    if(changes['supportedDiagramTypes']) {
      this.shownDiagramTypes = allDiagramTypes.filter((vl) => this.supportedDiagramTypes.includes(vl.layout))
    }
  }
  ngOnInit(): void {
    this.generateChart(this.colorScale, this.colorRangeInfo)
    this.shownDiagramTypes = allDiagramTypes.filter((vl) => this.supportedDiagramTypes.includes(vl.layout))
  }

  public generateChart(colorScale: any, colorRangeInfo: any) {
    if (this.data) {
      const inputData = this.data.map((diagramData) => diagramData.value)

      this.amountOfData = this.data.reduce((acc, current) => acc + current.value, 0)
      const COLORS = interpolateColors(this.data.length, colorScale, colorRangeInfo)
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

  private diagramTypeToChartType(value: DiagramType): string {
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
  }
}
function interpolateColors(amountOfData: number, colorScale: any, colorRangeInfo: any) {
  return ColorUtils.interpolateColors(amountOfData, colorScale, colorRangeInfo)
}
