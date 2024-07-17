import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute } from '@angular/router'
import { UserService } from '@onecx/angular-integration-interface'
import { MockUserService } from '@onecx/angular-integration-interface/mocks'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { ButtonModule } from 'primeng/button'
import { DataViewModule } from 'primeng/dataview'
import { DialogModule } from 'primeng/dialog'
import { DropdownModule } from 'primeng/dropdown'
import { MenuModule } from 'primeng/menu'
import { MultiSelectModule } from 'primeng/multiselect'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { TableModule } from 'primeng/table'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { MockAuthModule } from '../../mock-auth/mock-auth.module'
import { ColumnType } from '../../model/column-type.model'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataListGridSortingComponent } from '../data-list-grid-sorting/data-list-grid-sorting.component'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataTableComponent } from '../data-table/data-table.component'
import { DataViewComponent } from '../data-view/data-view.component'
import { InteractiveDataViewComponent } from './interactive-data-view.component'


type InteractiveDataViewInputTypes = Pick<InteractiveDataViewComponent, 'data' | 'columns' | 'emptyResultsMessage'>
const InteractiveDataViewComponentSBConfig: Meta<InteractiveDataViewComponent> = {
    title: 'InteractiveDataViewComponent',
    component: InteractiveDataViewComponent,
    decorators: [
      applicationConfig({
        providers: [
          importProvidersFrom(BrowserModule),
          importProvidersFrom(BrowserAnimationsModule),
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
        ],
      }),
      moduleMetadata({
        declarations: [InteractiveDataViewComponent, IfPermissionDirective, CustomGroupColumnSelectorComponent, ColumnGroupSelectionComponent, DataViewComponent, DataTableComponent, DataLayoutSelectionComponent, DataListGridComponent, DataListGridSortingComponent],
        imports: [TableModule, ButtonModule, MultiSelectModule, StorybookTranslateModule, MockAuthModule, MenuModule, PickListModule, SelectButtonModule, DialogModule, DataViewModule, DropdownModule],
      }),
    ],
  }
  const Template: StoryFn = (args) => ({
    props: args,
  })

  const defaultComponentArgs: InteractiveDataViewInputTypes = {
    columns: [
      {
        id: 'product',
        columnType: ColumnType.STRING,
        nameKey: 'Product',
        sortable: false,
      },
      {
        id: 'amount',
        columnType: ColumnType.NUMBER,
        nameKey: 'Amount',
        sortable: true,
      },
      {
        id: 'available',
        columnType: ColumnType.STRING,
        nameKey: 'Available',
        sortable: false,
      },
    ],
    data: [
      {
        id: 1,
        product: 'Apples',
        amount: 2,
        available: false,
        imagePath: ''
      },
      {
        id: 2,
        product: 'Bananas',
        amount: 10,
        available: true,
        imagePath: ''
      },
      {
        id: 3,
        product: 'Strawberries',
        amount: 5,
        available: false,
        imagePath: ''
      },
    ],
    emptyResultsMessage: 'No results',
  }
  
  export const WithMockData = {
    render: Template,
    args: defaultComponentArgs,
  }

  export const WithPageSizes = {
    render: Template,
    args: {
      ...defaultComponentArgs,
      pageSizes: [2, 15, 25]
    },
  }

export default InteractiveDataViewComponentSBConfig