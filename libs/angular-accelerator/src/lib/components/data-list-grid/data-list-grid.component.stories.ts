import { Meta, moduleMetadata, applicationConfig, argsToTemplate } from '@storybook/angular'
import { RouterModule } from '@angular/router'
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { DataViewModule } from 'primeng/dataview'
import { MenuModule } from 'primeng/menu'
import { UserServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { DataListGridComponent } from './data-list-grid.component'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { UserService } from '@onecx/angular-integration-interface'
import { action } from 'storybook/actions'

const DataListGridComponentSBConfig: Meta<DataListGridComponent> = {
  title: 'Components/DataListGridComponent',
  component: DataListGridComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        provideUserServiceMock(),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserServiceMock },
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
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
      declarations: [DataListGridComponent, IfPermissionDirective, TooltipOnOverflowDirective],
      imports: [DataViewModule, MenuModule, ButtonModule, MultiSelectModule, TooltipModule, StorybookTranslateModule],
    }),
  ],
}

const defaultComponentArgs = {
  data: [
    {
      id: 'Test',
      imagePath:
        'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      property1: 'Card 1',
      available: true,
    },
    {
      id: 'Test2',
      imagePath:
        'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      property1: 'Card 2',
      available: false,
    },
  ],
  emptyResultsMessage: 'No results',
  titleLineId: 'property1',
  layout: 'list',
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
}

const defaultActionsArgs = {
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

const notObservedEditAction = {
  observed: () => false,
  emit: action('Edit action clicked'),
}

const notObservedDeleteAction = {
  observed: () => false,
  emit: action('Delete action clicked'),
}

const notObservedViewAction = {
  observed: () => false,
  emit: action('View action clicked'),
}

const extendedMockData = [
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
  {
    id: 'Test',
    imagePath:
      'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 1',
    available: true,
  },
  {
    id: 'Test2',
    imagePath:
      'https://images.unsplash.com/photo-1710092662335-065cdbfb9781?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    property1: 'Card 2',
    available: false,
  },
]

export const ListWithMockData = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: defaultComponentArgs,
}

export const ListWithNoData = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    data: [],
  },
}

export const ListWithConditionallyDisabledActionButtons = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
  },
}

export const ListWithConditionallyHiddenActionButtons = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
  },
}

export const ListWithAdditionalActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        callback: () => console.log('Additional action clicked'),
      },
    ],
  },
}

export const ListWithConditionallyEnabledAdditionalActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
        callback: () => console.log('Additional action clicked'),
      },
    ],
  },
}

export const ListWithConditionallyVisibleAdditionalActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
        callback: () => console.log('Additional action clicked'),
      },
    ],
  },
}

export const ListWithAdditionalOverflowActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
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
        callback: () => console.log('Additional action clicked'),
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
        callback: () => console.log('Conditionally Hidden action clicked'),
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
        callback: () => console.log('Conditionally Enabled action clicked'),
      },
    ],
  },
}

export const ListWithOnlyAdditionalOverflowActions = {
  render: (args: any) => ({
    props: {
      ...args,
      deleteItem: notObservedDeleteAction,
      editItem: notObservedEditAction,
      viewItem: notObservedViewAction,
    },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    deletePermission: null,
    editPermission: null,
    viewPermission: null,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        callback: () => console.log('Additional action clicked'),
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
        callback: () => console.log('Conditionally Hidden action clicked'),
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
        callback: () => console.log('Conditionally Enabled action clicked'),
      },
    ],
  },
}

export const ListWithPageSizes = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)} (deleteItem)="deleteItem($event)" (editItem)="editItem($event)" (viewItem)="viewItem($event)"></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
    data: extendedMockData,
  },
}

export const GridWithMockData = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
  },
}

export const GridWithNoData = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    data: [],
    layout: 'grid',
  },
}

export const GridWithConditionallyDisabledActionButtons = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
    layout: 'grid',
  },
}

export const GridWithConditionallyHiddenActionButtons = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    layout: 'grid',
  },
}

export const GridWithAdditionalActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        callback: () => console.log('Additional action clicked'),
      },
    ],
  },
}

export const GridWithConditionallyEnabledAdditionalActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
        callback: () => console.log('Additional action clicked'),
      },
    ],
  },
}

export const GridWithConditionallyVisibleAdditionalActions = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
        callback: () => console.log('Additional action clicked'),
      },
    ],
  },
}

export const GridWithPageSizes = {
  render: (args: any) => ({
    props: { ...args, ...defaultActionsArgs },
    template: `<ocx-data-list-grid ${argsToTemplate(args)}></ocx-data-list-grid>`,
  }),
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    pageSizes: [2, 15, 25],
    data: extendedMockData,
  },
}

export default DataListGridComponentSBConfig
