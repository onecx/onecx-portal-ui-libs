import { BrowserModule } from '@angular/platform-browser'
import { LOCALE_ID, importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { Meta, moduleMetadata, applicationConfig, argsToTemplate } from '@storybook/angular'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { UserService } from '@onecx/angular-integration-interface'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DataTableComponent } from './data-table.component'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { ColumnType } from '../../model/column-type.model'
import { MenuModule } from 'primeng/menu'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { DynamicLocaleId, HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { SkeletonModule } from 'primeng/skeleton'
import { action } from 'storybook/actions'

const DataTableComponentSBConfig: Meta<DataTableComponent> = {
  title: 'Components/DataTableComponent',
  component: DataTableComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
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
          userServiceMock.permissionsTopic$.publish([
            'TEST_MGMT#TEST_DELETE',
            'TEST_MGMT#TEST_EDIT',
            'TEST_MGMT#TEST_VIEW',
          ])
        }),
      ],
    }),
    moduleMetadata({
      declarations: [DataTableComponent, IfPermissionDirective],
      imports: [
        TableModule,
        ButtonModule,
        MultiSelectModule,
        StorybookTranslateModule,
        MenuModule,
        CheckboxModule,
        FormsModule,
        TooltipModule,
        SkeletonModule,
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
      sortable: false,
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      sortable: true,
      filterable: true,
    },
    {
      id: 'available',
      columnType: ColumnType.STRING,
      nameKey: 'Available',
      sortable: false,
      filterable: true,
    },
    {
      id: 'expiration',
      columnType: ColumnType.DATE,
      nameKey: 'Expiration Date',
      sortable: true,
    },
  ],
  rows: [
    {
      id: 1,
      product: 'Apples',
      amount: 2,
      available: false,
      expiration: new Date(2021, 5, 4),
    },
    {
      id: 2,
      product: 'Bananas',
      amount: 10,
      available: true,
      expiration: new Date(2021, 6, 4),
    },
    {
      id: 3,
      product: 'Strawberries',
      amount: 5,
      available: false,
      expiration: new Date(2021, 7, 4),
    },
  ],
  emptyResultsMessage: 'No results',
  selectedRows: [],
}

const dataTableSelectionArgs = {
  selectionChanged: {
    observed: () => true,
    emit: action('Selection changed'),
  },
  componentStateChanged: action('Component state changed'),
}

const dataTableActionsArgs = {
  editTableRow: {
    observed: () => true,
    emit: action('Edit action clicked'),
  },
  deleteTableRow: {
    observed: () => true,
    emit: action('Delete action clicked'),
  },
  viewTableRow: {
    observed: () => true,
    emit: action('View action clicked'),
  },
}

// Using render instead of template to pass output handlers with action logger
export const WithMockData = {
  args: {
    ...defaultComponentArgs,
  },
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)}>
      </ocx-data-table>
    `,
  }),
}

export const NoData = {
  args: {
    ...defaultComponentArgs,
    rows: [],
  },
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)}>
      </ocx-data-table>
    `,
  }),
}

export const WithRowSelection = {
  args: {
    ...defaultComponentArgs,
  },
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableSelectionArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (selectionChanged)="selectionChanged.emit($event)" (componentStateChanged)="componentStateChanged($event)">
      </ocx-data-table>
    `,
  }),
}

export const WithRowSelectionAndDefaultSelection = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableSelectionArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (selectionChanged)="selectionChanged.emit($event)" (componentStateChanged)="componentStateChanged($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    selectedRows: [
      {
        id: 1,
      },
    ],
  },
}

export const WithRowSelectionAndDisabledDefaultSelection = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableSelectionArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (selectionChanged)="selectionChanged.emit($event)" (componentStateChanged)="componentStateChanged($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    selectedRows: [1],
    selectionEnabledField: 'available',
  },
}

const extendedComponentArgs = {
  columns: [
    {
      id: '1',
      columnType: ColumnType.STRING,
      nameKey: 'Column 1',
    },
    {
      id: '2',
      columnType: ColumnType.STRING,
      nameKey: 'Column 2',
    },
    {
      id: '3',
      columnType: ColumnType.STRING,
      nameKey: 'Column 3',
    },
    {
      id: '4',
      columnType: ColumnType.STRING,
      nameKey: 'Column 4',
    },
    {
      id: '5',
      columnType: ColumnType.STRING,
      nameKey: 'Column 5',
    },
    {
      id: '6',
      columnType: ColumnType.STRING,
      nameKey: 'Column 6',
    },
    {
      id: '7',
      columnType: ColumnType.STRING,
      nameKey: 'Column 7',
    },
    {
      id: '8',
      columnType: ColumnType.STRING,
      nameKey: 'Column 8',
    },
    {
      id: '9',
      columnType: ColumnType.STRING,
      nameKey: 'Column 9',
    },
    {
      id: '10',
      columnType: ColumnType.STRING,
      nameKey: 'Column 10',
    },
    {
      id: '11',
      columnType: ColumnType.STRING,
      nameKey: 'Column 11',
    },
    {
      id: '12',
      columnType: ColumnType.STRING,
      nameKey: 'Column 12',
    },
  ],
  rows: [
    {
      id: 1,
      1: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      2: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      3: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      4: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      5: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      6: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      7: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      8: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      9: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      10: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      11: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
      12: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
    },
  ],
  emptyResultsMessage: 'No results',
  selectedRows: [],
}

export const ResponsiveWithScroll = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)}>
      </ocx-data-table>
    `,
  }),
  args: extendedComponentArgs,
}

export const ResponsiveWithScrollAndFrozenActionsColumn = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...extendedComponentArgs,
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    frozenActionColumn: true,
    actionColumnPosition: 'left',
  },
}

export const WithConditionallyDisabledActionButtons = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
  },
}

export const WithConditionallyHiddenActionButtons = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
  },
}

export const WithAdditionalActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        callback: () => {
          console.log('Additional action 1 clicked')
        },
      },
    ],
  },
}

export const WithConditionallyEnabledAdditionalActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
        callback: () => {
          console.log('Additional action 1 clicked')
        },
      },
    ],
  },
}

export const WithConditionallyVisibleAdditionalActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
        callback: () => {
          console.log('Additional action 1 clicked')
        },
      },
    ],
  },
}

export const WithAdditionalOverflowActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (editActionClicked)="editActionClicked($event)" (deleteActionClicked)="deleteActionClicked($event)" (viewActionClicked)="viewActionClicked($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deletePermission: 'TEST_MGMT#TEST_DELETE',
    editPermission: 'TEST_MGMT#TEST_EDIT',
    viewPermission: 'TEST_MGMT#TEST_VIEW',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        callback: () => {
          console.log('Additional action clicked')
        },
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
        callback: () => {
          console.log('Conditionally Hidden action clicked')
        },
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
        callback: () => {
          console.log('Conditionally Enabled action clicked')
        },
      },
    ],
  },
}

export const WithOnlyOverflowActions = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)}>
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        callback: () => {
          console.log('Additional action clicked')
        },
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
        callback: () => {
          console.log('Conditionally Hidden action clicked')
        },
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
        callback: () => {
          console.log('Conditionally Enabled action clicked')
        },
      },
    ],
  },
}

export const WithPageSizes = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)}>
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
  },
}

export default DataTableComponentSBConfig
