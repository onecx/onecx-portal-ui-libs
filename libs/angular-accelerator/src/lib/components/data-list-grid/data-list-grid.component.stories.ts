import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { RouterModule } from '@angular/router'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { DataViewModule } from 'primeng/dataview'
import { MenuModule } from 'primeng/menu'
import { UserService } from '@onecx/angular-integration-interface'
import { MockUserService } from '@onecx/angular-integration-interface/mocks'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { DataListGridComponent } from './data-list-grid.component'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { TooltipOnOverflowDirective } from '../../directives/tooltipOnOverflow.directive'
import { MockAuthModule } from '../../mock-auth/mock-auth.module'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'

const DataListGridComponentSBConfig: Meta<DataListGridComponent> = {
  title: 'Components/DataListGridComponent',
  component: DataListGridComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        { provide: UserService, useClass: MockUserService },
        { provide: HAS_PERMISSION_CHECKER, useClass: MockUserService },
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
      ],
    }),
    moduleMetadata({
      declarations: [DataListGridComponent, IfPermissionDirective, TooltipOnOverflowDirective],
      imports: [DataViewModule, MenuModule, ButtonModule, MultiSelectModule, StorybookTranslateModule, MockAuthModule],
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

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
const defaultArgTypes = {
  deleteItem: { action: 'deleteItem' },
  editItem: { action: 'editItem' },
  viewItem: { action: 'viewItem' },
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
  render: Template,
  argTypes: defaultArgTypes,
  args: defaultComponentArgs,
}

export const ListWithNoData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultComponentArgs,
    data: [],
  },
}

export const ListWithConditionallyDisabledActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
  },
}

export const ListWithConditionallyHiddenActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
  },
}

export const ListWithAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
      },
    ],
  },
}

export const ListWithConditionallyEnabledAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionEnabledField: 'available',
      },
    ],
  },
}

export const ListWithConditionallyVisibleAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        actionVisibleField: 'available',
      },
    ],
  },
}

export const ListWithAdditionalOverflowActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional Action',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
      },
    ],
  },
}

export const ListWithOnlyAdditionalOverflowActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteItem: null,
    editItem: null,
    viewItem: null,
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
      },
      {
        id: '2',
        labelKey: 'Conditionally Hidden',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionVisibleField: 'available',
      },
      {
        id: '3',
        labelKey: 'Conditionally Enabled',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
        showAsOverflow: true,
        actionEnabledField: 'available',
      },
    ],
  },
}

export const ListWithPageSizes = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
    data: extendedMockData,
    showAllOption: false,
  },
}

export const GridWithMockData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
  },
}

export const GridWithNoData = {
  render: Template,
  argTypes: defaultArgTypes,
  args: {
    ...defaultComponentArgs,
    data: [],
    layout: 'grid',
  },
}

export const GridWithConditionallyDisabledActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionEnabledField: 'available',
    editActionEnabledField: 'available',
    layout: 'grid',
  },
}

export const GridWithConditionallyHiddenActionButtons = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    deleteActionVisibleField: 'available',
    editActionVisibleField: 'available',
    layout: 'grid',
  },
}

export const GridWithAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    additionalActions: [
      {
        id: '1',
        labelKey: 'Additional 1',
        icon: 'pi pi-plus',
        permission: 'TEST_MGMT#TEST_VIEW',
      },
    ],
  },
}

export const GridWithConditionallyEnabledAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
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
      },
    ],
  },
}

export const GridWithConditionallyVisibleAdditionalActions = {
  argTypes: defaultArgTypes,
  render: Template,
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
      },
    ],
  },
}

export const GridWithPageSizes = {
  argTypes: defaultArgTypes,
  render: Template,
  args: {
    ...defaultComponentArgs,
    layout: 'grid',
    pageSizes: [2, 15, 25],
    data: extendedMockData,
    showAllOption: false,
  },
}

export default DataListGridComponentSBConfig
