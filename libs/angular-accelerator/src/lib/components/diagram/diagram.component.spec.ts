import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import 'jest-canvas-mock'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { DiagramHarness, provideTranslateTestingService, TestbedHarnessEnvironment } from '../../../../testing'
import { AngularAcceleratorOptimusModule } from '../../angular-accelerator-optimus.module'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DiagramType } from '../../model/diagram-type'
import { ColorUtils } from '../../utils/colorutils'
import { contrastRatio, MIN_GRAPHICS_CONTRAST, parseColor, Rgb } from '../../utils/diagram-contrast-utils'
import { DiagramComponent, DiagramDataSelectedEvent, DiagramLayouts } from './diagram.component'
import { By } from '@angular/platform-browser'

declare global {
  interface Window {
    __setForcedColorsActive?: (active: boolean) => void
  }
}

describe('DiagramComponent', () => {
  let translateService: TranslateService
  let component: DiagramComponent
  let fixture: ComponentFixture<DiagramComponent>

  const definedSumKey = 'OCX_DIAGRAM.SUM'

  // Use the power of 2 (2^n) to identify the error of a possibly failed test more quickly
  const diagramData: { label: string; value: number }[] = [
    { label: 'test0', value: 1 },
    { label: 'test1', value: 2 },
    { label: 'test2', value: 4 },
    { label: 'test3', value: 8 },
    { label: 'test4', value: 16 },
    { label: 'test5', value: 32 },
    { label: 'test6', value: 64 },
  ]
  const numberOfResults = Math.pow(2, diagramData.length) - 1

  beforeEach(async () => {
    window.__setForcedColorsActive?.(false)
    await TestBed.configureTestingModule({
      declarations: [DiagramComponent],
      imports: [NoopAnimationsModule, FormsModule, AngularAcceleratorOptimusModule, TranslateModule.forRoot(), OcxTooltipDirective],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DiagramComponent)
    component = fixture.componentInstance
    fixture.componentRef.setInput('data', diagramData)
    fixture.componentRef.setInput('sumKey', definedSumKey)
    fixture.componentRef.setInput('fullHeight', false)
    translateService = TestBed.inject(TranslateService)
    translateService.setFallbackLang('en')
    translateService.use('en')
  })

  it('should create the diagram component', () => {
    expect(component).toBeTruthy()
  })

  it('loads diagramHarness', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    expect(diagram).toBeTruthy()
  })

  it('should display the sumKey on the diagram component', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const displayedText = await diagram.getSumLabel()
    const definedSumKeyTranslation = translateService.instant(definedSumKey)
    expect(displayedText).toEqual(definedSumKeyTranslation)
  })

  it('should be created', () => {
    expect(translateService).toBeTruthy()
  })

  it('should display the amountOfData on the diagram component', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const displayedNumber = await diagram.getTotalNumberOfResults()
    expect(displayedNumber).toEqual(numberOfResults)
  })

  it('should display pie chart by default', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')
  })

  it('should display horizontal bar chart', async () => {
    fixture.componentRef.setInput('diagramType', DiagramType.HORIZONTAL_BAR)
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
  })

  it('should display vertical bar chart', async () => {
    fixture.componentRef.setInput('diagramType', DiagramType.VERTICAL_BAR)
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
  })

  it('should not display a diagramType select button by default', async () => {
    expect(component.supportedDiagramTypes()).toEqual([])
    expect(component.shownDiagramTypes()).toEqual([])

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBe(null)
  })

  it('should render a diagramType select button if supportedDiagramTypes is specified', async () => {
    const expectedDiagramLayouts: DiagramLayouts[] = [
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
    ]

    fixture.componentRef.setInput('supportedDiagramTypes', [DiagramType.PIE, DiagramType.HORIZONTAL_BAR])
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    expect(component.shownDiagramTypes()).toEqual(expectedDiagramLayouts)
    expect(diagramTypeSelectButton).toBeTruthy()
    expect(diagramTypeSelectButtonOptions.length).toBe(2)
  })

  it('should change the rendered diagram whenever the select button is used to change the diagramType', async () => {
    fixture.componentRef.setInput('supportedDiagramTypes', [DiagramType.PIE, DiagramType.HORIZONTAL_BAR])

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    let diagramTypeChangedEvent: DiagramType | undefined
    component.diagramTypeChanged.subscribe((event) => (diagramTypeChangedEvent = event))

    expect(diagramTypeSelectButton).toBeTruthy()
    expect(component.diagramType()).toBe(DiagramType.PIE)
    let chartHarness = await diagram.getChart()
    let chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')

    await diagramTypeSelectButtonOptions[1].click()
    expect(component.diagramType()).toBe(DiagramType.HORIZONTAL_BAR)
    chartHarness = await diagram.getChart()
    chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
    expect(diagramTypeChangedEvent).toBe(DiagramType.HORIZONTAL_BAR)

    await diagramTypeSelectButtonOptions[0].click()
    expect(component.diagramType()).toBe(DiagramType.PIE)
    chartHarness = await diagram.getChart()
    chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')
    expect(diagramTypeChangedEvent).toBe(DiagramType.PIE)
  })

  it('should dynamically add/remove options to/from the diagramType select button', async () => {
    const allDiagramLayouts: DiagramLayouts[] = [
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

    expect(component.shownDiagramTypes()).toEqual([])

    fixture.componentRef.setInput('supportedDiagramTypes', [DiagramType.PIE, DiagramType.HORIZONTAL_BAR])
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBeTruthy()
    expect(component.shownDiagramTypes()).toEqual(allDiagramLayouts.slice(0, 2))
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()
    expect(diagramTypeSelectButtonOptions.length).toBe(2)

    fixture.componentRef.setInput('supportedDiagramTypes', [
      DiagramType.PIE,
      DiagramType.HORIZONTAL_BAR,
      DiagramType.VERTICAL_BAR,
    ])
    const diagramTypeSelectButtonAfterUpdate = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptionsAfterUpdate = await diagram.getAllSelectionButtons()
    expect(diagramTypeSelectButtonAfterUpdate).toBeTruthy()
    expect(component.shownDiagramTypes()).toEqual(allDiagramLayouts)
    expect(diagramTypeSelectButtonOptionsAfterUpdate.length).toBe(3)
  })

  it('should automatically select the button for the currently displayed diagram', async () => {
    fixture.componentRef.setInput('supportedDiagramTypes', [DiagramType.PIE, DiagramType.HORIZONTAL_BAR])
    fixture.componentRef.setInput('diagramType', DiagramType.HORIZONTAL_BAR)

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    expect(await diagramTypeSelectButtonOptions[0].hasClass('p-togglebutton-checked')).toEqual(false)
    expect(await diagramTypeSelectButtonOptions[1].hasClass('p-togglebutton-checked')).toEqual(true)
  })

  it('should interpolate colors by default', () => {
    const mockResult = diagramData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)

    fixture.detectChanges()

    expect(component.chartData()?.datasets).toEqual([
      {
        data: diagramData.map((d) => d.value),
        backgroundColor: mockResult,
      },
    ])
  })

  it('should use custom colors', () => {
    fixture.componentRef.setInput('data', [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2, backgroundColor: 'red' },
    ])
    fixture.detectChanges()

    expect(component.chartData()?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['blue', 'red'],
      },
    ])
  })
  it('should interpolate all colors if not all items have custom colors and filling missing colors is not allowed', () => {
    const mockData = [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2 },
    ]
    const mockResult = mockData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)
    fixture.componentRef.setInput('fillMissingColors', false)

    fixture.componentRef.setInput('data', mockData)
    fixture.detectChanges()

    expect(component.chartData()?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['0', '1'],
      },
    ])
  })
  it('should use custom colors and interpolate undefined ones if custom colors are forced', () => {
    const mockData = [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2 },
    ]
    const mockResult = mockData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)

    fixture.componentRef.setInput('data', mockData)
    fixture.detectChanges()

    expect(component.chartData()?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['blue', '0'],
      },
    ])
  })

  it('should set useFullHeight to true when fullHeight is true and diagramType is PIE', () => {
    fixture.componentRef.setInput('fullHeight', true)
    component.diagramType.set(DiagramType.PIE)
    expect(component.useFullHeight()).toBe(true)
  })

  it('should set useFullHeight to false when fullHeight is true and diagramType is not PIE', () => {
    fixture.componentRef.setInput('fullHeight', true)
    component.diagramType.set(DiagramType.HORIZONTAL_BAR)
    expect(component.useFullHeight()).toBe(false)
  })

  it('should set useFullHeight to false when fullHeight is false and diagramType is not PIE', () => {
    fixture.componentRef.setInput('fullHeight', false)
    component.diagramType.set(DiagramType.HORIZONTAL_BAR)
    expect(component.useFullHeight()).toBe(false)
  })

  it('should set useFullHeight to false when fullHeight is false and diagramType is PIE', () => {
    fixture.componentRef.setInput('fullHeight', false)
    component.diagramType.set(DiagramType.PIE)
    expect(component.useFullHeight()).toBe(false)
  })

  it('should emit the selected entry when a chart segment is clicked', async () => {
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    let dataSelectedEvent: DiagramDataSelectedEvent | undefined

    component.dataSelected.subscribe((event) => (dataSelectedEvent = event))
    fixture.debugElement.query(By.css('p-chart')).triggerEventHandler('onDataSelect', { element: { index: 2 } })

    expect(dataSelectedEvent).toEqual({ index: 2, data: diagramData[2] })
    expect(chartHarness).toBeTruthy()
  })

  it('should not emit when the selected index has no data entry', () => {
    const emitSpy = jest.spyOn(component.dataSelected, 'emit')

    component.selectData(diagramData.length)
    fixture.componentRef.setInput('data', undefined)
    component.selectData(0)

    expect(emitSpy).not.toHaveBeenCalled()
  })

  it('should not set chartOptions and amoutOfData when data is null', () => {
    fixture.componentRef.setInput('data', null)
    fixture.detectChanges()

    expect(component.amountOfData()).toBeUndefined()
    expect(component.chartOptions()).toEqual({})
  })

  it('should not set chartOptions and amoutOfData when data is null', () => {
    fixture.componentRef.setInput('diagramType', null)
    fixture.detectChanges()

    expect(component.chartType()).toEqual('pie')
  })

  describe('High Contrast Mode', () => {
    it('should apply white chart label colors when high contrast mode is enabled', () => {
      window.__setForcedColorsActive?.(true)
      fixture.detectChanges()

      expect(component.chartOptions().plugins?.legend?.labels?.color).toEqual('#ffffff')
    })

    it('should apply text-color variable when high contrast mode is disabled', () => {
      window.__setForcedColorsActive?.(false)
      fixture.detectChanges()

      const expectedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
      expect(component.chartOptions().plugins?.legend?.labels?.color).toEqual(expectedColor)
    })
  })

  describe('Accessibility', () => {
    it('should render a legend button per entry that reads "label: count" without color codes', async () => {
      const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
      const legendItems = await diagram.getLegendItems()

      expect(legendItems.length).toBe(diagramData.length)
      expect(await legendItems[1].getAttribute('type')).toBe('button')
      expect(await legendItems[1].text()).toBe('test1: 2')
      expect(component.chartOptions().plugins?.legend?.display).toBe(false)
    })

    it('should select an entry from the keyboard via the legend', async () => {
      const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
      const legendItems = await diagram.getLegendItems()
      let dataSelectedEvent: DiagramDataSelectedEvent | undefined
      component.dataSelected.subscribe((event) => (dataSelectedEvent = event))

      await legendItems[3].focus()
      expect(await legendItems[3].isFocused()).toBe(true)
      // a native button turns Enter and Space into a click
      await legendItems[3].click()

      expect(dataSelectedEvent).toEqual({ index: 3, data: diagramData[3] })
    })

    it('should not render an empty legend list when there is no data', () => {
      fixture.componentRef.setInput('data', [])
      fixture.detectChanges()

      expect(fixture.nativeElement.querySelector('.diagram-legend')).toBeNull()
      expect(fixture.nativeElement.querySelector('ul[aria-label]')).toBeNull()
    })

    it('should render the two column legend in a scroll container with custom legends', async () => {
      fixture.componentRef.setInput('customLegends', true)
      fixture.detectChanges()

      const container = fixture.debugElement.query(By.css('.diagram-legend')).nativeElement as HTMLElement
      expect(container.classList).toContain('custom-legends-container')
      expect(container.getAttribute('aria-hidden')).toBeNull()
    })

    it('should not add a focus stop on the chart', () => {
      fixture.detectChanges()

      const chart = fixture.debugElement.query(By.css('p-chart')).nativeElement as HTMLElement
      expect(chart.hasAttribute('tabindex')).toBe(false)
      expect(chart.hasAttribute('aria-describedby')).toBe(false)
    })

    it('should render the title as a heading with a configurable level', async () => {
      fixture.componentRef.setInput('chartTitleKey', 'OCX_DIAGRAM.SUM')
      const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)

      expect(await (await diagram.getTitle())?.getAttribute('aria-level')).toBe('2')
      fixture.componentRef.setInput('titleHeadingLevel', 3)
      expect(await (await diagram.getTitle())?.getAttribute('aria-level')).toBe('3')
      expect(fixture.nativeElement.querySelector('caption').textContent).toContain('Total')
    })

    it('should list label and count in the screen reader table without color codes', () => {
      fixture.componentRef.setInput('data', [{ label: 'test0', value: 1, backgroundColor: '#ff0000' }])
      fixture.detectChanges()

      const table = fixture.nativeElement.querySelector('table') as HTMLTableElement
      expect(table.querySelector('caption')).toBeNull()
      expect(table.querySelectorAll('thead th').length).toBe(2)
      const cells = Array.from(table.querySelectorAll('tbody tr:first-child > *'))
      expect(cells.map((cell) => [cell.tagName, cell.textContent?.trim()])).toEqual([
        ['TH', 'test0'],
        ['TD', '1'],
      ])
      expect(table.textContent).not.toContain('#ff0000')
    })

    describe('palette', () => {
      const themes = [
        { name: 'light', background: '#ffffff', text: '#212529' },
        { name: 'dark', background: '#1e1e1e', text: '#f8f9fa' },
      ]

      beforeEach(() => jest.restoreAllMocks())

      afterEach(() => {
        document.documentElement.style.removeProperty('--content-bg-color')
        document.documentElement.style.removeProperty('--text-color')
      })

      it.each(themes)(
        'should give 12 generated segments at least 3:1 against the $name background and separate them by a background border',
        ({ background, text }) => {
          document.documentElement.style.setProperty('--content-bg-color', background)
          document.documentElement.style.setProperty('--text-color', text)
          fixture.componentRef.setInput(
            'data',
            Array.from({ length: 12 }, (_, i) => ({ label: `segment${i}`, value: i + 1 }))
          )
          fixture.detectChanges()

          const dataset = component.chartData()?.datasets[0] as { backgroundColor: string[]; borderColor?: string }
          const bg = parseColor(background) as Rgb
          expect(dataset.backgroundColor.length).toBe(12)
          dataset.backgroundColor.forEach((color) => {
            expect(contrastRatio(parseColor(color) as Rgb, bg)).toBeGreaterThanOrEqual(MIN_GRAPHICS_CONTRAST)
          })
          expect(dataset.borderColor).toBe(background)
        }
      )
    })
  })
})
