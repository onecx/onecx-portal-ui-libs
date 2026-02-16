import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import 'jest-canvas-mock'
import { firstValueFrom, of } from 'rxjs'
import { DiagramHarness, provideTranslateTestingService } from '../../../../testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DiagramType } from '../../model/diagram-type'
import { DiagramComponent } from '../diagram/diagram.component'
import { GroupByCountDiagramComponent } from './group-by-count-diagram.component'

describe('GroupByCountDiagramComponent', () => {
  let translateService: TranslateService
  let component: GroupByCountDiagramComponent
  let fixture: ComponentFixture<GroupByCountDiagramComponent>
  let loader: HarnessLoader

  const definedSumKey = 'Total'

  const diagramData: { label: string; value: number; backgroundColor?: string }[] = [
    { label: 'test0', value: 1, backgroundColor: 'green' },
    { label: 'test1', value: 2, backgroundColor: 'darkgreen' },
    { label: 'test2', value: 4, backgroundColor: undefined },
  ]

  const originalData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'some status',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: 'test0',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'status example',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: 'test1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'status name 1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test1',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'status name 2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 4',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 5',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: 'test2',
    },
  ]

  const inputColumn = { columnType: ColumnType.STRING, id: 'testNumber' }

  const labelsMock = ['test0', 'test1', 'test2', 'testNone']

  async function getHarness() {
    return loader.getHarness(DiagramHarness)
  }

  async function getCanvasAriaLabel() {
    const harness = await getHarness()
    const canvas = await harness.getCanvasElement()
    return canvas?.getAttribute('aria-label')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupByCountDiagramComponent, DiagramComponent],
      imports: [AngularAcceleratorModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(GroupByCountDiagramComponent)
    component = fixture.componentInstance

    fixture.componentRef.setInput('data', originalData)
    fixture.componentRef.setInput('column', inputColumn)
    fixture.componentRef.setInput('sumKey', definedSumKey)
    component.colors.set({ test0: 'green', test1: 'darkgreen' })

    translateService = TestBed.inject(TranslateService)
    translateService.setFallbackLang('en')
    translateService.use('en')

    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create the group-by-count-diagram component', () => {
    expect(component).toBeTruthy()
    expect(component.data).toEqual(originalData)
    expect(component.column).toEqual(inputColumn)
    expect(component.columnType).toBe(ColumnType.STRING)
    expect(component.columnField).toBe('testNumber')
  })

  it('should convert the data properly to diagramData', async () => {
    const result = await firstValueFrom(component.diagramData$ ?? of())
    expect(result).toEqual(diagramData)
  })

  it('should load diagram harness', async () => {
    const diagram = await getHarness()
    expect(diagram).toBeTruthy()
  })

  it('should display the sumKey on the diagram component', async () => {
    const diagram = await getHarness()
    const displayedText = await diagram.getSumLabel()
    const definedSumKeyTranslation = translateService.instant(definedSumKey)
    expect(displayedText).toEqual(definedSumKeyTranslation)
  })

  it('should not display a selectButton on the diagram by default', async () => {
    expect(component.supportedDiagramTypes()).toEqual([])

    const diagramTypeSelectButton = await (await getHarness()).getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBe(null)
  })

  it('should display a selectButton on the diagram if supportedDiagramTypes is specified', async () => {
    fixture.componentRef.setInput('supportedDiagramTypes', [DiagramType.PIE, DiagramType.HORIZONTAL_BAR])

    const diagramTypeSelectButton = await (await getHarness()).getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBeTruthy()
  })

  it('should verify if all labels appear', async () => {
    component.allLabelKeys = labelsMock
    component.showAllLabels = true

    fixture.detectChanges()
    const ariaLabel = await getCanvasAriaLabel()

    expect(ariaLabel).toContain('test0:1')
    expect(ariaLabel).toContain('test1:2')
    expect(ariaLabel).toContain('test2:4')
    expect(ariaLabel).toContain('testNone:0')
    expect(ariaLabel).toContain('Total amount: 7')
    expect(component.allLabelKeys).toEqual(labelsMock)
    expect(component.showAllLabels).toBe(true)
    expect(component.colors).toEqual({ test0: 'green', test1: 'darkgreen' })
  })

  it('should verify if label with zero count will not appear', async () => {
    component.allLabelKeys = labelsMock

    fixture.detectChanges()
    const ariaLabel = await getCanvasAriaLabel()

    expect(ariaLabel).not.toContain('testNone:0')
    expect(ariaLabel).toContain('Total amount: 7')
    expect(component.allLabelKeys).toEqual(labelsMock)
    expect(component.showAllLabels).toBe(false)
  })

  it('should emit dataSelected event when dataClicked is called', () => {
    const emitSpy = jest.spyOn(component.dataSelected, 'emit')
    const clickEvent = { label: 'test0', value: 1 }

    component.dataClicked(clickEvent)

    expect(emitSpy).toHaveBeenCalledWith(clickEvent)
    expect(emitSpy).toHaveBeenCalledTimes(1)
  })

  it('should emit diagramTypeChanged event when diagram type is changed', async () => {
    component.supportedDiagramTypes = [DiagramType.PIE, DiagramType.HORIZONTAL_BAR]
    const emitDiagramTypeChangedSpy = jest.spyOn(component.diagramTypeChanged, 'emit')
    const emitComponentStateChangedSpy = jest.spyOn(component.componentStateChanged, 'emit')
    fixture.detectChanges()

    const harness = await getHarness()
    const buttons = await harness.getAllSelectionButtons()

    await buttons[1]?.click()
    fixture.detectChanges()

    expect(emitDiagramTypeChangedSpy).toHaveBeenCalledWith(DiagramType.HORIZONTAL_BAR)
    expect(component.diagramType).toBe(DiagramType.HORIZONTAL_BAR)
    expect(emitComponentStateChangedSpy).toHaveBeenCalledWith({
      activeDiagramType: DiagramType.HORIZONTAL_BAR,
    })
  })

  it('should return translated keys when columnType is TranslationKey', async () => {
    const translationsMock = {
      test0: 'test0_en',
      test1: 'test1_en',
      test2: 'test2_en',
    }
    jest.spyOn(translateService, 'get').mockReturnValue(of(translationsMock))
    component.columnType = ColumnType.TRANSLATION_KEY
    component.columnField = 'testNumber'
    fixture.detectChanges()

    const result = await firstValueFrom(component.diagramData$ ?? of([]))

    expect(result).toBeDefined()
    expect(result.length).toBe(3)
    expect(result[0].label).toBe('test0_en')
    expect(result[0].value).toBe(1)
  })

  it('should include missing labels with configured color when all labels are shown', async () => {
    component.colors = { ...component.colors, test3: 'blue' }
    component.data = [...originalData, { ...originalData[0], testNumber: 'test3' }]
    component.allLabelKeys = labelsMock
    component.showAllLabels = true
    fixture.detectChanges()

    const result = await firstValueFrom(component.diagramData$ ?? of([]))
    const extraLabel = result.find((entry) => entry.label === 'test3')

    expect(result.length).toBe(5)
    expect(extraLabel?.value).toBe(1)
    expect(extraLabel?.backgroundColor).toBe('blue')
  })
})
