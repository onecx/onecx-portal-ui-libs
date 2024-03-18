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
import { MockAuthModule } from '../../mock-auth/mock-auth.module'

const DataListGridComponentSBConfig: Meta<DataListGridComponent> = {
  title: 'DataListGridComponent',
  component: DataListGridComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        { provide: UserService, useClass: MockUserService },
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
      ],
    }),
    moduleMetadata({
      declarations: [DataListGridComponent, IfPermissionDirective],
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
  deleteItem: ($event: any) => console.log('Delete table row ', $event),
  editItem: ($event: any) => console.log('Edit table row ', $event),
  viewItem: ($event: any) => console.log('View table row ', $event),
  deletePermission: 'TEST_MGMT#TEST_DELETE',
  editPermission: 'TEST_MGMT#TEST_EDIT',
  viewPermission: 'TEST_MGMT#TEST_VIEW',
}
const defaultArgTypes = {
  deleteItem: { action: 'deleteItem' },
  editItem: { action: 'deleteItem' },
  viewItem: { action: 'deleteItem' },
}

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

export default DataListGridComponentSBConfig
