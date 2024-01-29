import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { DataTableComponent, Row } from './data-table.component'
import { PrimeNgModule } from '../../primeng.module';
import { ColumnType } from '../../../model/column-type.model';
import { PortalCoreModule } from '../../portal-core.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { PTableCheckboxHarness } from '../../../../../testing';

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>
  let component: DataTableComponent
  let loader: HarnessLoader
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
      declarations: [DataTableComponent],
      imports: [PrimeNgModule, BrowserAnimationsModule, TranslateModule.forRoot(), PortalCoreModule],
    }).compileComponents()

    fixture = TestBed.createComponent(DataTableComponent)
    component = fixture.componentInstance
    component.rows = mockData
    component.columns = mockColumns
    TestBed.inject(TranslateService).use('en')
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  it('should create', () => {
    expect(component).toBeDefined()
  })

  describe('Table row selection', () => {
    it('should initially show a table without selection checkboxes', async () => {
      try {
        await loader.getHarness(PTableCheckboxHarness)
      } catch (error) {
        expect(error).toBeTruthy()
      }
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter',async () => {      
      component.selectionChanged.subscribe()
      const checkBoxes = await loader.getHarness(PTableCheckboxHarness)
      expect(checkBoxes).toBeTruthy()
    })

    it('should pre-select rows given through selectedRows input', async () => {
      let unselectedCheckBoxes: PTableCheckboxHarness[];
      let selectedCheckBoxes: PTableCheckboxHarness[];
      component.selectionChanged.subscribe()

      unselectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: false}))
      selectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: true}))
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
      component.selectedRows = mockData.slice(0,2)

      unselectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: false}))
      selectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: true}))
      expect(selectedCheckBoxes.length).toBe(2)
      expect(unselectedCheckBoxes.length).toBe(3)
    })
  })

  it('should emit all selected elements when checkbox is clicked', async () => {
    let selectionChangedEvent: Row[] | undefined;
    let unselectedCheckBoxes: PTableCheckboxHarness[];
    let selectedCheckBoxes: PTableCheckboxHarness[];

    component.selectionChanged.subscribe((event) => (selectionChangedEvent = event))
    unselectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: false}))
    selectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: true}))
    expect(unselectedCheckBoxes.length).toBe(5)
    expect(selectedCheckBoxes.length).toBe(0)
    expect(selectionChangedEvent).toBeUndefined()

    const firstRowCheckBox = unselectedCheckBoxes[0]
    await firstRowCheckBox.checkBox()
    unselectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: false}))
    selectedCheckBoxes = await loader.getAllHarnesses(PTableCheckboxHarness.with({isSelected: true}))
    expect(unselectedCheckBoxes.length).toBe(4)
    expect(selectedCheckBoxes.length).toBe(1)
    expect(selectionChangedEvent).toEqual([mockData[0]])
  })
})
