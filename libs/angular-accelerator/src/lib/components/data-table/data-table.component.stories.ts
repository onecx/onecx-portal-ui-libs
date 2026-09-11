import { BrowserModule } from '@angular/platform-browser'
import { LOCALE_ID, importProvidersFrom, inject, provideAppInitializer, TemplateRef } from '@angular/core'
import { Meta, moduleMetadata, applicationConfig, argsToTemplate, StoryFn } from '@storybook/angular'
import { RouterModule } from '@angular/router'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { UserService } from '@onecx/angular-integration-interface'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DataTableComponent } from './data-table.component'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { ColumnType } from '../../model/column-type.model'
import { DataTableGroupingConfig } from './model/data-table-grouping.model'
import { Row } from './data-table.component'
import { MenuModule } from 'primeng/menu'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { DynamicLocaleId, HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { SkeletonModule } from 'primeng/skeleton'
import { action } from 'storybook/actions'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { CommonModule } from '@angular/common'

const DataTableComponentSBConfig: Meta<DataTableComponent> = {
  title: 'Components/DataTableComponent',
  component: DataTableComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
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
        RouterModule,
        MenuModule,
        CheckboxModule,
        FormsModule,
        TooltipModule,
        SkeletonModule,
        OcxTooltipDirective
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
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
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
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
  },
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)" (selectionChanged)="selectionChanged.emit($event)" (componentStateChanged)="componentStateChanged($event)">
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)" (selectionChanged)="selectionChanged.emit($event)" (componentStateChanged)="componentStateChanged($event)">
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)" (selectionChanged)="selectionChanged.emit($event)" (componentStateChanged)="componentStateChanged($event)">
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
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
}

export const ResponsiveWithScroll = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...extendedComponentArgs,
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
  },
}

export const WithConditionallyHiddenActionButtons = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
  },
}

export const WithAdditionalActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
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

export const WithRouterLinkOverflowActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Overflow RouterLink Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        routerLink: '/data-table-overflow-link',
      },
    ],
  },
}

export const WithRouterLinkInlineActions = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Inline RouterLink Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: false,
        routerLink: '/data-table-inline-link',
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
      <ocx-data-table ${argsToTemplate(args)} (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
  },
}

const RowExpansionTemplate: StoryFn<DataTableComponent> = (args) => ({
  props: args,
  template: `
    <ocx-data-table
      [expandable]="expandable"
      [frozenExpandColumn]="frozenExpandColumn"
      [expandedRows]="expandedRows"
      [rows]="rows"
      [columns]="columns"
      [paginator]="paginator"
      (rowExpanded)="rowExpanded($event)"
      (rowCollapsed)="rowCollapsed($event)"
    >
      <ng-template pTemplate="expansion" let-rowObject="rowObject">
        <div class="p-3 surface-50 border-round">
          <p class="m-0 mb-2"><strong>Product:</strong> {{ rowObject.product }}</p>
          <p class="m-0 mb-2"><strong>Amount:</strong> {{ rowObject.amount }}</p>
          <p class="m-0"><strong>Available:</strong> {{ rowObject.available }}</p>
        </div>
      </ng-template>
    </ocx-data-table>
  `,
})

const dataTableExpansionArgTypes = {
  rowExpanded: { action: 'rowExpanded' },
  rowCollapsed: { action: 'rowCollapsed' },
}

export const WithRowExpansion = {
  argTypes: dataTableExpansionArgTypes,
  render: RowExpansionTemplate,
  args: {
    ...defaultComponentArgs,
    expandable: true,
  },
}

export const WithFrozenExpansionColumn = {
  argTypes: dataTableExpansionArgTypes,
  render: RowExpansionTemplate,
  args: {
    ...defaultComponentArgs,
    expandable: true,
    frozenExpandColumn: true,
  },
}

export const WithPreExpandedRows = {
  argTypes: dataTableExpansionArgTypes,
  render: RowExpansionTemplate,
  args: {
    ...defaultComponentArgs,
    expandable: true,
    expandedRows: [1],
  },
}

const CaptionTemplateStory: StoryFn<DataTableComponent> = (args) => ({
  props: {
    ...args,
  },
  template: `
    <ng-template #captionTpl>
      <div class="flex justify-content-between align-items-center w-full">
        <div>
          <p class="text-xl font-bold">{{ 'OCX_DATA_TABLE_CAPTION.TITLE' | translate }}</p>
          <p class="text-md">{{ 'OCX_DATA_TABLE_CAPTION.DESCRIPTION' | translate }}</p>
        </div>
      </div>
    </ng-template>
    <ocx-data-table
      [captionTemplate]="captionTpl"
      [columns]="columns"
      [rows]="rows"
      [paginator]="paginator"
      [emptyResultsMessage]="emptyResultsMessage"
    >
    </ocx-data-table>
  `,
})

export const WithCaptionTemplate = {
  render: CaptionTemplateStory,
  args: {
    ...defaultComponentArgs,
  },
}

// Grouping feature stories
const groupingColumns = [
  {
    id: 'category',
    columnType: ColumnType.STRING,
    nameKey: 'Category',
    sortable: true,
  },
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
    columnType: ColumnType.BOOLEAN,
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
]

const groupingRows = [
  { id: 1, category: 'Fruits', product: 'Apples', amount: 10, available: true, expiration: new Date(2025, 0, 15) },
  { id: 2, category: 'Fruits', product: 'Bananas', amount: 20, available: true, expiration: new Date(2025, 1, 10) },
  { id: 3, category: 'Fruits', product: 'Oranges', amount: 15, available: false, expiration: new Date(2025, 2, 5) },
  { id: 4, category: 'Vegetables', product: 'Carrots', amount: 30, available: true, expiration: new Date(2025, 3, 20) },
  { id: 5, category: 'Vegetables', product: 'Broccoli', amount: 12, available: true, expiration: new Date(2025, 4, 15) },
  { id: 6, category: 'Vegetables', product: 'Spinach', amount: 8, available: false, expiration: new Date(2025, 5, 10) },
  { id: 7, category: 'Dairy', product: 'Milk', amount: 25, available: true, expiration: new Date(2025, 1, 5) },
  { id: 8, category: 'Dairy', product: 'Cheese', amount: 18, available: true, expiration: new Date(2025, 2, 20) },
  { id: 9, category: 'Dairy', product: 'Yogurt', amount: 30, available: false, expiration: new Date(2025, 0, 28) },
]

const groupingDefaultArgs = {
  ...defaultComponentArgs,
  columns: groupingColumns,
  rows: groupingRows,
  paginator: false,
}

const groupingConfig: DataTableGroupingConfig = {
  groupByColumnId: 'category',
}

export const WithBasicGrouping = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} [groupingConfig]="groupingConfig" (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...groupingDefaultArgs,
    groupingConfig,
  },
}

const nestedGroupingRows = [
  { id: 1, department: { name: 'Engineering', code: 'ENG' }, team: 'Frontend', member: 'Alice', role: 'Developer', experience: 5 },
  { id: 2, department: { name: 'Engineering', code: 'ENG' }, team: 'Frontend', member: 'Bob', role: 'Developer', experience: 3 },
  { id: 3, department: { name: 'Engineering', code: 'ENG' }, team: 'Backend', member: 'Charlie', role: 'Developer', experience: 7 },
  { id: 4, department: { name: 'Engineering', code: 'ENG' }, team: 'Backend', member: 'Diana', role: 'Lead', experience: 10 },
  { id: 5, department: { name: 'Marketing', code: 'MKT' }, team: 'Content', member: 'Eve', role: 'Writer', experience: 4 },
  { id: 6, department: { name: 'Marketing', code: 'MKT' }, team: 'SEO', member: 'Frank', role: 'Specialist', experience: 2 },
  { id: 7, department: { name: 'Sales', code: 'SAL' }, team: 'Enterprise', member: 'Grace', role: 'Manager', experience: 8 },
  { id: 8, department: { name: 'Sales', code: 'SAL' }, team: 'SMB', member: 'Henry', role: 'Rep', experience: 3 },
]

const nestedGroupingColumns = [
  { id: 'department.name', columnType: ColumnType.STRING, nameKey: 'Department', sortable: true },
  { id: 'team', columnType: ColumnType.STRING, nameKey: 'Team', sortable: true },
  { id: 'member', columnType: ColumnType.STRING, nameKey: 'Member', sortable: true },
  { id: 'role', columnType: ColumnType.STRING, nameKey: 'Role', sortable: false },
  { id: 'experience', columnType: ColumnType.NUMBER, nameKey: 'Experience (years)', sortable: true },
]

const nestedGroupingConfig: DataTableGroupingConfig = {
  groupByColumnId: 'department.name',
  groupLabel: (key: string | number, rows: any[]) => `Department: ${key} (${rows.length} members)`,
}

const nestedGroupingDefaultArgs = {
  ...defaultComponentArgs,
  columns: nestedGroupingColumns,
  rows: nestedGroupingRows,
  paginator: false,
}

export const WithNestedFieldGrouping = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} [groupingConfig]="groupingConfig" (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...nestedGroupingDefaultArgs,
    groupingConfig: nestedGroupingConfig,
  },
}

const customGroupCellTemplate = `
  <ng-template #customGroupCell let-context>
    <div class="flex align-items-center gap-2 p-2 bg-blue-50 border-round">
      <i class="pi pi-folder text-blue-500"></i>
      <span class="font-bold text-blue-700">{{ context.label }}</span>
      <span class="bg-blue-100 text-blue-700 px-2 py-1 border-round text-sm">{{ context.rowspan }} items</span>
      <span class="text-sm text-blue-500">Keys: {{ context.rows.map(r => r.id).join(', ') }}</span>
    </div>
  </ng-template>
`

const customGroupingConfig: DataTableGroupingConfig = {
  groupByColumnId: 'category',
}

export const WithCustomGroupCellTemplate = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
      customGroupCellTemplate: customGroupCellTemplate,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} [groupingConfig]="groupingConfig" [groupCellTemplate]="customGroupCellTemplate" (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...groupingDefaultArgs,
    groupingConfig: customGroupingConfig,
  },
}

const groupBySelectorConfig: DataTableGroupingConfig = {
  groupByColumnId: 'available',
  groupLabel: (key: string | number, rows: Row[]) => key ? 'Available Items' : 'Unavailable Items',
}

const groupBySelectorRows = [
  { id: 1, name: 'Item A', available: true, category: 'Tools' },
  { id: 2, name: 'Item B', available: false, category: 'Tools' },
  { id: 3, name: 'Item C', available: true, category: 'Parts' },
  { id: 4, name: 'Item D', available: true, category: 'Parts' },
  { id: 5, name: 'Item E', available: false, category: 'Parts' },
  { id: 6, name: 'Item F', available: true, category: 'Supplies' },
]

const groupBySelectorColumns = [
  { id: 'name', columnType: ColumnType.STRING, nameKey: 'Name', sortable: true },
  { id: 'category', columnType: ColumnType.STRING, nameKey: 'Category', sortable: true },
  { id: 'available', columnType: ColumnType.BOOLEAN, nameKey: 'Available', sortable: true, filterable: true },
]

export const WithBooleanGrouping = {
  render: (args: any) => ({
    props: {
      ...args,
      ...dataTableActionsArgs,
    },
    template: `
      <ocx-data-table ${argsToTemplate(args)} [groupingConfig]="groupingConfig" (deleteTableRow)="deleteTableRow($event)" (editTableRow)="editTableRow($event)" (viewTableRow)="viewTableRow($event)">
      </ocx-data-table>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    columns: groupBySelectorColumns,
    rows: groupBySelectorRows,
    paginator: false,
    groupingConfig: groupBySelectorConfig,
  },
}

export default DataTableComponentSBConfig