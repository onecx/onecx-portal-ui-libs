import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DataViewModule } from 'primeng/dataview'

import { DataListGridHarness, DataTableHarness, DataViewHarness } from '@onecx/angular-accelerator/testing'
import { UserService } from '@onecx/angular-integration-interface'
import { MockUserService, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DataViewComponent } from './data-view.component'
import { MockAuthModule } from '../../mock-auth/mock-auth.module'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataTableComponent } from '../data-table/data-table.component'
import { ColumnType } from '../../model/column-type.model'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('DataViewComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock
  
  let component: DataViewComponent
  let fixture: ComponentFixture<DataViewComponent>
  let dataViewHarness: DataViewHarness

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
      ALL: 'All',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
  }

  const mockData = [
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
      testNumber: '1',
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
      testNumber: '3.141',
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
      testNumber: '123456789',
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
      testNumber: '12345.6789',
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
      testNumber: '7.1',
    },
  ]
  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataViewComponent, DataListGridComponent, DataTableComponent],
      imports: [
        DataViewModule,
        MockAuthModule,
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        AngularAcceleratorModule,
        RouterModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataViewComponent)
    component = fixture.componentInstance
    component.data = mockData
    component.columns = mockColumns
    fixture.detectChanges()
    dataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataViewHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Table row selection ', () => {
    let dataTable: DataTableHarness | null

    beforeEach(async () => {
      component.layout = 'table'
      dataTable = await dataViewHarness?.getDataTable()
    })

    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
      component.selectionChanged.subscribe()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(true)
    })

    it('should render an unpinnend action column on the right side of the table by default', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      expect(component.frozenActionColumn).toBe(false)
      expect(component.actionColumnPosition).toBe('right')
      expect(await dataTable?.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable?.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable?.getActionColumnHeader('right')
      const rightActionColumn = await dataTable?.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(rightActionColumnHeader)).toBe(false)
      expect(await dataTable?.columnIsFrozen(rightActionColumn)).toBe(false)
    })

    it('should render an pinned action column on the specified side of the table', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      component.frozenActionColumn = true
      component.actionColumnPosition = 'left'

      expect(await dataTable?.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable?.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable?.getActionColumnHeader('left')
      const leftActionColumn = await dataTable?.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(leftActionColumnHeader)).toBe(true)
      expect(await dataTable?.columnIsFrozen(leftActionColumn)).toBe(true)
    })
  })

  it('should stay on the same page after layout change', async () => {
    component.data = [
      ...component.data,
      {
        id: 'mock1',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock2',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock3',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock4',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock5',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
      {
        id: 'mock6',
        imagePath: '/path/to/image',
        modificationDate: '2023-09-12T09:34:27.184086Z',
      },
    ]

    dataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataViewHarness)
    const dataList = await dataViewHarness.getHarness(DataListGridHarness)
    const dataListPaginator = await dataList.getPaginator()
    let dataListRaport = await dataListPaginator.getCurrentPageReportText()
    expect(dataListRaport).toEqual('1 - 10 of 11')
    await dataListPaginator.clickNextPage()
    dataListRaport = await dataListPaginator.getCurrentPageReportText()
    expect(dataListRaport).toEqual('11 - 11 of 11')

    component.layout = 'table'
    const dataTable = await dataViewHarness.getHarness(DataTableHarness)
    const dataTablePaginator = await dataTable.getPaginator()
    const dataTableRaport = await dataTablePaginator.getCurrentPageReportText()
    expect(dataTableRaport).toEqual('11 - 11 of 11')
  })

  describe('Dynamically disable/hide based on field path in data view', () => {
    const setUpMockData = async (viewType: 'grid' | 'list' | 'table') => {
      component.viewItem.subscribe(() => console.log())
      component.editItem.subscribe(() => console.log())
      component.deleteItem.subscribe(() => console.log())
      component.viewPermission = 'VIEW'
      component.editPermission = 'EDIT'
      component.deletePermission = 'DELETE'
      component.layout = viewType
      component.columns = [
        {
          columnType: ColumnType.STRING,
          id: 'name',
          nameKey: 'COLUMN_HEADER_NAME.NAME',
        },
        {
          columnType: ColumnType.STRING,
          id: 'ready',
          nameKey: 'Ready',
        },
      ]
      component.data = [
        {
          id: 'Test',
          imagePath:
            'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          name: 'Card 1',
          ready: false,
        },
      ]
      component.titleLineId = 'name'

      fixture.detectChanges()
      await fixture.whenStable()
    }

    describe('Disable list action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionEnabledField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 1)).toBe(true)
      })
    })

    describe('Disable grid action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('grid')
        component.viewActionEnabledField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 1)).toBe(true)
      })
    })

    describe('Disable table action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionEnabledField = 'ready'
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(1)).toBe(true)
      })
    })

    describe('Hide list action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionVisibleField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })
    })

    describe('Hide grid action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfActionButtons('grid-hidden', 0)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('grid')
        component.viewActionVisibleField = 'ready'
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 2)).toBe(true)
        expect(await dataView?.hasAmountOfActionButtons('grid-hidden', 1)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })
    })

    describe('Hide table action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionVisibleField = 'ready'
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(2)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })
    })
  })
})
