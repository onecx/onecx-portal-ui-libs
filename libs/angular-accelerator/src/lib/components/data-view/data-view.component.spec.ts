import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { DataViewModule } from 'primeng/dataview'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { DataListGridHarness, DataTableHarness, DataViewHarness } from '../../../../testing'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import {
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { TooltipStyle } from 'primeng/tooltip'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataTableComponent, Row } from '../data-table/data-table.component'
import { DataViewComponent } from './data-view.component'
import { InteractiveDataViewService } from '../../services/interactive-data-view.service'

describe('DataViewComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  globalThis.MutationObserver = mutationObserverMock

  let component: DataViewComponent
  let fixture: ComponentFixture<DataViewComponent>
  let dataViewHarness: DataViewHarness
  let stateService: InteractiveDataViewService

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
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
      imports: [DataViewModule, AngularAcceleratorModule, RouterModule],
      providers: [
        provideTranslateTestingService(TRANSLATIONS),
        provideUserServiceMock(),
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
        TooltipStyle,
        InteractiveDataViewService,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataViewComponent)
    component = fixture.componentInstance
    stateService = TestBed.inject(InteractiveDataViewService)
    fixture.componentRef.setInput('data', mockData)
    fixture.componentRef.setInput('columns', mockColumns)
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
    fixture.detectChanges()
    dataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataViewHarness)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('InteractiveDataViewService provider factory', () => {
    it('should reuse parent InteractiveDataViewService when it exists', () => {
      const componentService = fixture.debugElement.injector.get(InteractiveDataViewService)
      expect(componentService).toBe(stateService)
    })

    it('should create a local InteractiveDataViewService when parent service does not exist', async () => {
      TestBed.resetTestingModule()
      await TestBed.configureTestingModule({
        declarations: [DataViewComponent, DataListGridComponent, DataTableComponent],
        imports: [DataViewModule, AngularAcceleratorModule, RouterModule],
        providers: [
          provideTranslateTestingService(TRANSLATIONS),
          provideUserServiceMock(),
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideAppStateServiceMock(),
          TooltipStyle,
        ],
      }).compileComponents()

      const localFixture = TestBed.createComponent(DataViewComponent)
      const localComponent = localFixture.componentInstance
      const localService = localFixture.debugElement.injector.get(InteractiveDataViewService)

      expect(TestBed.inject(InteractiveDataViewService, null)).toBeNull()
      localComponent.page = 2
      localComponent.pageSize = 25

      expect(localService.activePage()).toBe(2)
      expect(localService.pageSize()).toBe(25)
    })
  })

  describe('state service delegation', () => {
    it('should return true from paginator getter when both paginators are enabled', () => {
      stateService.setListGridPaginator(true)
      stateService.setTablePaginator(true)

      expect(component.paginator).toBe(true)
    })

    it('should return false from paginator getter when list grid paginator is disabled', () => {
      stateService.setListGridPaginator(false)
      stateService.setTablePaginator(true)

      expect(component.paginator).toBe(false)
    })

    it('should return false from paginator getter when table paginator is disabled', () => {
      stateService.setListGridPaginator(true)
      stateService.setTablePaginator(false)

      expect(component.paginator).toBe(false)
    })

    it('should return false from paginator getter when both paginators are disabled', () => {
      stateService.setListGridPaginator(false)
      stateService.setTablePaginator(false)

      expect(component.paginator).toBe(false)
    })

    it('should delegate paginator setter to both paginator states', () => {
      const setListGridPaginatorSpy = jest.spyOn(stateService, 'setListGridPaginator')
      const setTablePaginatorSpy = jest.spyOn(stateService, 'setTablePaginator')

      component.paginator = false

      expect(setListGridPaginatorSpy).toHaveBeenCalledWith(false)
      expect(setTablePaginatorSpy).toHaveBeenCalledWith(false)
    })

    it('should delegate filtering to state service', () => {
      const setFiltersSpy = jest.spyOn(stateService, 'setFilters')
      const filters = [{ field: 'name', value: 'abc', matchMode: 'contains' }]

      component.filtering({ filters })

      expect(setFiltersSpy).toHaveBeenCalledWith(filters)
    })

    it('should delegate sorting to state service', () => {
      const setSortDirectionSpy = jest.spyOn(stateService, 'setSortDirection')
      const setSortColumnSpy = jest.spyOn(stateService, 'setSortColumn')

      component.sorting({ sortDirection: DataSortDirection.ASCENDING, sortColumn: 'name' })

      expect(setSortDirectionSpy).toHaveBeenCalledWith(DataSortDirection.ASCENDING)
      expect(setSortColumnSpy).toHaveBeenCalledWith('name')
    })

    it('should delegate row selection change to state service', () => {
      const setSelectedRowsSpy = jest.spyOn(stateService, 'setSelectedRows')
      const selectedRows = [{ id: 'row-1' } as Row]

      component.onRowSelectionChange(selectedRows)

      expect(setSelectedRowsSpy).toHaveBeenCalledWith(selectedRows)
    })

    it('should delegate page change to state service', () => {
      const setActivePageSpy = jest.spyOn(stateService, 'setActivePage')

      component.onPageChange(2)

      expect(setActivePageSpy).toHaveBeenCalledWith(2)
    })

    it('should delegate page size change to state service', () => {
      const setPageSizeSpy = jest.spyOn(stateService, 'setPageSize')

      component.onPageSizeChange(25)

      expect(setPageSizeSpy).toHaveBeenCalledWith(25)
    })

    it('should delegate expandedRows setter to state service', () => {
      const setExpandedRowsSpy = jest.spyOn(stateService, 'setExpandedRows')
      const expandedRows = ['row-1', 'row-2']

      component.expandedRows = expandedRows

      expect(setExpandedRowsSpy).toHaveBeenCalledWith(expandedRows)
    })
  })

  describe('Table row selection ', () => {
    let dataTable: DataTableHarness | null

    beforeEach(async () => {
      fixture.componentRef.setInput('layout', 'table')
      fixture.detectChanges()
      await fixture.whenStable()
      dataTable = await dataViewHarness?.getDataTable()
    })

    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
      component.selectionChanged.subscribe(() => undefined)
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(true)
    })

    it('should render an unpinnend action column on the right side of the table by default', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      expect(component.frozenActionColumn()).toBe(false)
      expect(component.actionColumnPosition()).toBe('right')
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

      fixture.componentRef.setInput('frozenActionColumn', true)
      fixture.componentRef.setInput('actionColumnPosition', 'left')
      fixture.detectChanges()
      await fixture.whenStable()

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
    fixture.componentRef.setInput('layout', 'grid')
    fixture.componentRef.setInput('data', [
      ...component.data(),
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
    ])
    fixture.detectChanges()
    await fixture.whenStable()

    const dataList = await dataViewHarness.getHarness(DataListGridHarness)
    const dataListPaginator = await dataList.getPaginator()
    let dataListRaport = await dataListPaginator.getCurrentPageReportText()
    expect(dataListRaport).toEqual('1 - 10 of 11')
    await dataListPaginator.clickNextPage()
    dataListRaport = await dataListPaginator.getCurrentPageReportText()
    expect(dataListRaport).toEqual('11 - 11 of 11')

    fixture.componentRef.setInput('layout', 'table')
    fixture.detectChanges()
    await fixture.whenStable()
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
      fixture.componentRef.setInput('viewPermission', 'VIEW')
      fixture.componentRef.setInput('editPermission', 'EDIT')
      fixture.componentRef.setInput('deletePermission', 'DELETE')
      fixture.componentRef.setInput('layout', viewType)
      fixture.componentRef.setInput('columns', [
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
      ])
      fixture.componentRef.setInput('data', [
        {
          id: 'Test',
          imagePath:
            'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          name: 'Card 1',
          ready: false,
        },
      ])
      fixture.componentRef.setInput('titleLineId', 'name')

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
        fixture.componentRef.setInput('viewActionEnabledField', 'ready')
        fixture.detectChanges()
        await fixture.whenStable()
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 1)).toBe(true)
      })
    })

    describe('Disable grid action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getGridMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('grid')
        fixture.componentRef.setInput('viewActionEnabledField', 'ready')
        fixture.detectChanges()
        await fixture.whenStable()
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getGridMenuButton())?.click()
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
        fixture.componentRef.setInput('viewActionEnabledField', 'ready')
        fixture.detectChanges()
        await fixture.whenStable()
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
        fixture.componentRef.setInput('viewActionVisibleField', 'ready')
        fixture.detectChanges()
        await fixture.whenStable()
        const dataView = await dataViewHarness.getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })
    })

    describe('Hide grid action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getGridMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('grid')
        const dataView = await dataViewHarness.getDataListGrid()
        await (await dataView?.getGridMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        await (await dataView?.getGridMenuButton())?.click()

        fixture.componentRef.setInput('viewActionVisibleField', 'ready')
        fixture.detectChanges()
        await fixture.whenStable()
        await (await dataView?.getGridMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 2)).toBe(true)
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
        fixture.componentRef.setInput('viewActionVisibleField', 'ready')
        fixture.detectChanges()
        await fixture.whenStable()
        const dataTable = await dataViewHarness.getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(2)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })
    })
  })
})
