import { ComponentFixture, TestBed } from '@angular/core/testing'
import { GroupByCountDiagramComponent } from './group-by-count-diagram.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { MFE_INFO } from '../../../api/injection-tokens'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { ColumnType } from '../../../model/column-type.model'
import { MessageModule } from 'primeng/message'
import { ChartModule } from 'primeng/chart'
import { DiagramComponent } from '../diagram/diagram.component'
import { firstValueFrom, of } from 'rxjs'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DiagramHarness } from 'libs/portal-integration-angular/testing'

describe('GroupByCountDiagramComponent', () => {
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
      imports: [
        ChartModule,
        MessageModule,
        MockAuthModule,
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: MFE_INFO,
          useValue: {
            baseHref: '/base/path',
            mountPath: '/base/path',
            remoteBaseUrl: 'http://localhost:4200',
            shellName: 'shell',
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(GroupByCountDiagramComponent)
    component = fixture.componentInstance

    component.data = originalData
    component.column = inputColumn
    component.sumKey = definedSumKey

    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create the group-by-count-diagram component', async () => {
    expect(component).toBeTruthy()
  })

  it('should load diagram harness', async () => {
    const diagram = await loader.getHarness(DiagramHarness)
    expect(diagram).toBeTruthy()
  })

  fit('should convert the data properly to diagramData', async () => {
    const result = await firstValueFrom(component.diagramData$ ?? of())
    expect(diagramData).toEqual(result)
  })

  it('should select the right column', async () => {
    expect(inputColumn).toEqual(component.column)
  })
})
