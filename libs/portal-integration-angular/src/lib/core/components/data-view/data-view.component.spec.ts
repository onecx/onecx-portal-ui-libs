import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DataViewComponent } from './data-view.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataViewModule } from 'primeng/dataview'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DataTableComponent } from '../data-table/data-table.component'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { DataTableHarness, DataViewHarness } from '../../../../../testing'
import { ColumnType } from '../../../model/column-type.model'
import { PortalCoreModule } from '../../portal-core.module'

describe('DataViewComponent', () => {
  let component: DataViewComponent
  let fixture: ComponentFixture<DataViewComponent>
  let dataViewHarness: DataViewHarness

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
      imports: [DataViewModule, MockAuthModule, TranslateTestingModule.withTranslations({}), HttpClientTestingModule, PortalCoreModule],
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
    let dataTable: DataTableHarness

    beforeEach(async () => {
      component.layout = 'table'
      dataTable = await dataViewHarness.getDataTable()
    })

    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter',async () => {      
      expect(dataTable).toBeTruthy()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(false)
      component.selectionChanged.subscribe()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(true);
    })
  })
})
