import { Meta, moduleMetadata, applicationConfig, argsToTemplate } from '@storybook/angular-vite'
import { LOCALE_ID, importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { TableModule } from '@openng/optimus-ui/table'
import { ButtonModule } from '@openng/optimus-ui/button'
import { MultiSelectModule } from '@openng/optimus-ui/multiselect'
import { DataViewModule } from '@openng/optimus-ui/dataview'
import { MenuModule } from '@openng/optimus-ui/menu'
import { CheckboxModule } from '@openng/optimus-ui/checkbox'
import { SkeletonModule } from '@openng/optimus-ui/skeleton'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { UserService } from '@onecx/angular-integration-interface'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DynamicLocaleId, HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { action } from 'storybook/actions'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { ColumnType } from '../../model/column-type.model'
import { DataTableComponent } from '../data-table/data-table.component'
import { DataListGridComponent } from '../data-list-grid/data-list-grid.component'
import { DataViewComponent } from './data-view.component'

const DataViewComponentSBConfig: Meta<DataViewComponent> = {
  title: 'Components/DataViewComponent',
  component: DataViewComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        provideUserServiceMock(),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserServiceMock },
        {
          provide: LOCALE_ID,
          useClass: DynamicLocaleId,
          deps: [UserService],
        },
        importProvidersFrom(StorybookThemeModule),
        provideAppInitializer(() => {
          const userServiceMock = inject(UserService) as unknown as UserServiceMock
          // Angular waits for the returned promise, the permissions are set before the first render
          return userServiceMock.permissionsTopic$.publish([
            'TEST_MGMT#TEST_DELETE',
            'TEST_MGMT#TEST_EDIT',
            'TEST_MGMT#TEST_VIEW',
          ])
        }),
      ],
    }),
    moduleMetadata({
      declarations: [
        DataViewComponent,
        DataTableComponent,
        DataListGridComponent,
        IfPermissionDirective,
        TooltipOnOverflowDirective,
      ],
      imports: [
        TableModule,
        DataViewModule,
        ButtonModule,
        MultiSelectModule,
        MenuModule,
        CheckboxModule,
        SkeletonModule,
        FormsModule,
        TooltipModule,
        RouterModule,
        StorybookTranslateModule,
        OcxTooltipDirective,
      ],
    }),
  ],
}

const defaultComponentArgs = {
  columns: [
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      sortable: true,
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
    {
      id: 'expiration',
      columnType: ColumnType.DATE,
      nameKey: 'Expiration Date',
      sortable: true,
    },
  ],
  data: [
    {
      id: 1,
      imagePath:
        'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      product: 'Apples',
      amount: 2,
      available: 'No',
      expiration: new Date(2021, 5, 4),
    },
    {
      id: 2,
      imagePath:
        'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      product: 'Bananas',
      amount: 10,
      available: 'Yes',
      expiration: new Date(2021, 6, 4),
    },
    {
      id: 3,
      imagePath:
        'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      product: 'Strawberries',
      amount: 5,
      available: 'No',
      expiration: new Date(2021, 7, 4),
    },
  ],
  titleLineId: 'product',
  subtitleLineIds: ['amount', 'available'],
  emptyResultsMessage: 'No results',
  tableAriaLabel: 'Products',
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
}

const dataViewActionsArgs = {
  editItem: {
    observed: () => true,
    emit: action('Edit action clicked'),
  },
  deleteItem: {
    observed: () => true,
    emit: action('Delete action clicked'),
  },
  viewItem: {
    observed: () => true,
    emit: action('View action clicked'),
  },
}

const dataViewArgTypes = {
  layout: { control: 'select', options: ['list', 'grid', 'table'] },
}

// Using render instead of template to pass output handlers with action logger
const render = (args: any) => ({
  props: {
    ...args,
    ...dataViewActionsArgs,
  },
  template: `
    <ocx-data-view ${argsToTemplate(args)} (deleteItem)="deleteItem.emit($event)" (editItem)="editItem.emit($event)" (viewItem)="viewItem.emit($event)">
    </ocx-data-view>
  `,
})

export const TableLayout = {
  render,
  args: {
    ...defaultComponentArgs,
    layout: 'table',
  },
  argTypes: dataViewArgTypes,
}

export const ListLayout = {
  render,
  args: {
    ...defaultComponentArgs,
    layout: 'list',
  },
  argTypes: dataViewArgTypes,
}

export const GridLayout = {
  render,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
  },
  argTypes: dataViewArgTypes,
}

export default DataViewComponentSBConfig
