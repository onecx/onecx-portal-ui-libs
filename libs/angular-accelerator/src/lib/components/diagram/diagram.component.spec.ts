import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import 'jest-canvas-mock'
import { PrimeIcons } from 'primeng/api'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DiagramHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { DiagramType } from '../../model/diagram-type'
import { DiagramComponent, DiagramLayouts } from './diagram.component'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ColorUtils } from '../../utils/colorutils'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'

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
    await TestBed.configureTestingModule({
      declarations: [DiagramComponent],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        AngularAcceleratorPrimeNgModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()

    fixture = TestBed.createComponent(DiagramComponent)
    component = fixture.componentInstance
    component.data = diagramData
    component.sumKey = definedSumKey
    translateService = TestBed.inject(TranslateService)
    translateService.setDefaultLang('en')
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
    component.diagramType = DiagramType.HORIZONTAL_BAR
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
  })

  it('should display vertical bar chart', async () => {
    component.diagramType = DiagramType.VERTICAL_BAR
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const chartHarness = await diagram.getChart()
    const chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
  })

  it('should not display a diagramType select button by default', async () => {
    expect(component.supportedDiagramTypes).toEqual([])
    expect(component.shownDiagramTypes).toEqual([])

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBe(null)
  })

  it('should render a diagramType select button if supportedDiagramTypes is specified', async () => {
    const expectedDiagramLayouts: DiagramLayouts[] = [
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
    ]

    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    expect(component.shownDiagramTypes).toEqual(expectedDiagramLayouts)
    expect(diagramTypeSelectButton).toBeTruthy()
    expect(diagramTypeSelectButtonOptions.length).toBe(2)
  })

  it('should change the rendered diagram whenever the select button is used to change the diagramType', async () => {
    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    let diagramTypeChangedEvent: DiagramType | undefined
    component.diagramTypeChanged.subscribe((event) => (diagramTypeChangedEvent = event))

    expect(diagramTypeSelectButton).toBeTruthy()
    expect(component.diagramType).toBe(DiagramType.PIE)
    let chartHarness = await diagram.getChart()
    let chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')

    await diagramTypeSelectButtonOptions[1].click()
    expect(component.diagramType).toBe(DiagramType.HORIZONTAL_BAR)
    chartHarness = await diagram.getChart()
    chartType = await chartHarness.getType()
    expect(chartType).toEqual('bar')
    expect(diagramTypeChangedEvent).toBe(DiagramType.HORIZONTAL_BAR)

    await diagramTypeSelectButtonOptions[0].click()
    expect(component.diagramType).toBe(DiagramType.PIE)
    chartHarness = await diagram.getChart()
    chartType = await chartHarness.getType()
    expect(chartType).toEqual('pie')
    expect(diagramTypeChangedEvent).toBe(DiagramType.PIE)
  })

  it('should dynamically add/remove options to/from the diagramType select button', async () => {
    const allDiagramLayouts: DiagramLayouts[] = [
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

    expect(component.shownDiagramTypes).toEqual([])

    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBeTruthy()
    expect(component.shownDiagramTypes).toEqual(allDiagramLayouts.slice(0, 2))
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()
    expect(diagramTypeSelectButtonOptions.length).toBe(2)

    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR, DiagramType.VERTICAL_BAR]
    const diagramTypeSelectButtonAfterUpdate = await diagram.getDiagramTypeSelectButton()
    const diagramTypeSelectButtonOptionsAfterUpdate = await diagram.getAllSelectionButtons()
    expect(diagramTypeSelectButtonAfterUpdate).toBeTruthy()
    expect(component.shownDiagramTypes).toEqual(allDiagramLayouts)
    expect(diagramTypeSelectButtonOptionsAfterUpdate.length).toBe(3)
  })

  it('should automatically select the button for the currently displayed diagram', async () => {
    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    component.diagramType = DiagramType.HORIZONTAL_BAR

    const diagram = await TestbedHarnessEnvironment.harnessForFixture(fixture, DiagramHarness)
    const diagramTypeSelectButtonOptions = await diagram.getAllSelectionButtons()

    expect(await diagramTypeSelectButtonOptions[0].hasClass('p-togglebutton-checked')).toBe(false)
    expect(await diagramTypeSelectButtonOptions[1].hasClass('p-togglebutton-checked')).toBe(true)
  })

  it('should interpolate colors by default', () => {
    const mockResult = diagramData.map((v, i) => i.toString())
    jest.spyOn(ColorUtils, 'interpolateColors').mockReturnValue(mockResult)

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
      {
        data: diagramData.map((d) => d.value),
        backgroundColor: mockResult,
      },
    ])
  })

  it('should use custom colors', () => {
    component.data = [
      { label: 'test0', value: 1, backgroundColor: 'blue' },
      { label: 'test1', value: 2, backgroundColor: 'red' },
    ]

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
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
    component.fillMissingColors = false

    component.data = mockData

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
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

    component.data = mockData

    component.ngOnChanges()

    expect(component.chartData?.datasets).toEqual([
      {
        data: [1, 2],
        backgroundColor: ['blue', '0'],
      },
    ])
  })
})
