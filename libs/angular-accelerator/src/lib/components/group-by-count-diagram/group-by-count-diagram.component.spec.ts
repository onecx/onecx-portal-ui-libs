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

  const diagramData: { label: string; value: number }[] = [
    { label: 'test0', value: 1 },
    { label: 'test1', value: 2 },
    { label: 'test2', value: 4 },
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

    translateService = TestBed.inject(TranslateService)
    translateService.setFallbackLang('en')
    translateService.use('en')

    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create the group-by-count-diagram component', () => {
    expect(component).toBeTruthy()
  })

  it('should convert the data properly to diagramData', async () => {
    const result = await firstValueFrom(component.diagramData$ ?? of())
    expect(result).toEqual(diagramData)
  })

  it('should load diagram harness', async () => {
    const diagram = await loader.getHarness(DiagramHarness)
    expect(diagram).toBeTruthy()
  })

  it('should display the sumKey on the diagram component', async () => {
    const diagram = await loader.getHarness(DiagramHarness)
    const displayedText = await diagram.getSumLabel()
    const definedSumKeyTranslation = translateService.instant(definedSumKey)
    expect(displayedText).toEqual(definedSumKeyTranslation)
  })

  it('should not display a selectButton on the diagram by default', async () => {
    expect(component.supportedDiagramTypes()).toEqual([])

    const diagram = await loader.getHarness(DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBe(null)
  })

  it('should display a selectButton on the diagram if supportedDiagramTypes is specified', async () => {
    fixture.componentRef.setInput('supportedDiagramTypes', [DiagramType.PIE, DiagramType.HORIZONTAL_BAR])

    const diagram = await loader.getHarness(DiagramHarness)
    const diagramTypeSelectButton = await diagram.getDiagramTypeSelectButton()

    expect(diagramTypeSelectButton).toBeTruthy()
  })
})
