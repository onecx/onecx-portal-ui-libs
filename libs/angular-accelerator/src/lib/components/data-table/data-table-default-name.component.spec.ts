import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { provideUserServiceMock, UserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'
import { Component, ChangeDetectionStrategy } from '@angular/core'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { DataTableComponent } from './data-table.component'
import { AngularAcceleratorOptimusModule } from '../../angular-accelerator-optimus.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { DataTableHarness, provideTranslateTestingService } from '../../../../testing'
import { ColumnType } from '../../model/column-type.model'

@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, template: '' })
class TestRouteComponent {}

describe('DataTableComponent default name', () => {
  let fixture: ComponentFixture<DataTableComponent>
  let router: Router

  const TRANSLATIONS = {
    en: {
      OCX_DATA_TABLE: {
        TABLE_ARIA_LABEL: 'Data table',
        SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
        SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
        ALL: 'All',
        SEARCH_RESULTS_FOUND: '{{results}} Results Found',
        NO_SEARCH_RESULTS_FOUND: 'No Results Found',
      },
    },
  }

  async function createTable(name?: string): Promise<DataTableComponent> {
    fixture = TestBed.createComponent(DataTableComponent)
    const component = fixture.componentInstance
    component.rows.set([{ id: '1', name: 'row' }])
    component.columns = [
      {
        columnType: ColumnType.STRING,
        nameKey: 'COLUMN_HEADER_NAME.NAME',
        id: 'name',
        filterable: false,
        sortable: false,
      },
    ]
    if (name !== undefined) {
      fixture.componentRef.setInput('name', name)
    }
    fixture.detectChanges()
    await fixture.whenStable()
    await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    return component
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTableComponent, TestRouteComponent],
      imports: [AngularAcceleratorOptimusModule, BrowserAnimationsModule, AngularAcceleratorModule],
      providers: [
        provideTranslateTestingService(TRANSLATIONS),
        provideUserServiceMock(),
        provideRouter([{ path: '**', component: TestRouteComponent }]),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserService },
      ],
    }).compileComponents()

    router = TestBed.inject(Router)
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
  })

  it('given a table without a name and the router at /admin/users/list, when the table is created, then the id replaces every non-alphanumeric character with an underscore', async () => {
    await router.navigate(['/admin/users/list'])

    const component = await createTable()

    expect(component.name()).toBe('_admin_users_list')
    const table: HTMLElement | null = fixture.nativeElement.querySelector('p-table')
    expect(table?.getAttribute('id')).toBe('dataTable__admin_users_list')
  })

  it('given a table with an explicit name, when the table is created, then the explicit name is used unchanged', async () => {
    await router.navigate(['/admin/users/list'])

    const component = await createTable('myExplicitName')

    expect(component.name()).toBe('myExplicitName')
    const table: HTMLElement | null = fixture.nativeElement.querySelector('p-table')
    expect(table?.getAttribute('id')).toBe('dataTable_myExplicitName')
  })
})
