import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ChartData, ChartOptions } from 'chart.js'
import * as d3 from 'd3-scale-chromatic'
import { ColorUtils } from '../../utils/colorutils'
import { DiagramData } from '../../../model/diagram-data'

@Component({
  selector: 'ocx-diagram',
  templateUrl: './diagram.component.html',
})
export class DiagramComponent implements OnInit, OnChanges {
  @Input() data: DiagramData[] | undefined
  @Input() sumKey = 'OCX_DIAGRAM.SUM'
  @Output() dataSelected: EventEmitter<any> = new EventEmitter()
  chartOptions: ChartOptions | undefined
  chartData: ChartData | undefined
  amountOfData: number | undefined | null
  // Changing the colorRangeInfo, will change the range of the color palette of the diagram.
  private colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
  // Changing the colorScale, will change the thematic color appearance of the diagram.
  private colorScale = d3.interpolateCool

  constructor(private translateService: TranslateService) {}

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
    }
  }

  dataClicked(event: []) {
    this.dataSelected.emit(event.length)
  }
}
function interpolateColors(amountOfData: number, colorScale: any, colorRangeInfo: any) {
  return ColorUtils.interpolateColors(amountOfData, colorScale, colorRangeInfo)
}
