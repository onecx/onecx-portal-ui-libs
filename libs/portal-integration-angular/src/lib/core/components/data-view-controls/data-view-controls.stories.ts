import { Meta, StoryFn, moduleMetadata, componentWrapperDecorator, applicationConfig } from '@storybook/angular'
import { DataViewControlTranslations, DataViewControlsComponent } from './data-view-controls.component'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { InputTextModule } from 'primeng/inputtext'
import { BrowserModule } from '@angular/platform-browser'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { PickListModule } from 'primeng/picklist'
import { ColumnTogglerComponent } from './column-toggler-component/column-toggler.component'
import { DialogService } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'
import { ViewTemplatePickerComponent } from './view-template-picker/view-template-picker.component'
import { importProvidersFrom } from '@angular/core'

export default {
  title: 'DataViewControlsComponent',
  component: DataViewControlsComponent,
  decorators: [
    componentWrapperDecorator((story) => `<div style="margin: 3em;" class="demo-border">${story}</div>`),
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(DialogService),
      ],
    }),
    moduleMetadata({
      declarations: [DataViewControlsComponent, ColumnTogglerComponent, ViewTemplatePickerComponent],
      imports: [
        DropdownModule,
        FormsModule,
        ToggleButtonModule,
        InputTextModule,
        ButtonModule,
        SelectButtonModule,
        PickListModule,
        TranslateModule,
      ],
    }),
  ],
} as Meta

const Template: StoryFn = (args) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    sortingOptions: [
      { label: 'Sort 1', value: 'up' },
      { label: 'Sort 2', value: 'down' },
      { label: 'Sort 3', value: 'equals' },
    ],
    supportedViews: ['list', 'grid', 'table'],
    enableSorting: true,
    enableFiltering: true,
  },
}

export const ListOnly = {
  render: Template,

  args: {
    supportedViews: ['list'],
    checkedList: true,
  },
}

export const GridOnly = {
  render: Template,

  args: {
    supportedViews: ['grid'],
    checkedGrid: true,
  },
}

export const WithoutFilterAndSort = {
  render: Template,

  args: {
    supportedViews: ['list', 'grid'],
    enableSorting: false,
    enableFiltering: false,
  },
}

export const WithColumnToggleFilterAndSort = {
  render: Template,

  args: {
    supportedViews: ['table'],
    enableSorting: true,
    enableFiltering: true,

    columnDefinitions: [
      { field: 'id 1', header: 'label 1', active: true, translationPrefix: 'STORY' },
      { field: 'id 2', header: 'label 2', active: true, translationPrefix: 'STORY' },
      { field: 'id 3', header: 'label 3', active: false, translationPrefix: 'STORY' },
      { field: 'id 4', header: 'label 4', active: false, translationPrefix: 'STORY' },
      { field: 'id 5', header: 'label 5', active: false, translationPrefix: 'STORY' },
      { field: 'id 6', header: 'label 6', active: true, translationPrefix: 'STORY' },
      { field: 'id 7', header: 'label 7', active: false, translationPrefix: 'STORY' },
      { field: 'id 8', header: 'label 8', active: true, translationPrefix: 'STORY' },
      { field: 'id 9', header: 'label 9', active: false, translationPrefix: 'STORY' },
      { field: 'id 10', header: 'label 10', active: true, translationPrefix: 'STORY' },
    ],
  },
}

export const WithTemplatePicker = {
  render: Template,

  args: {
    dropdownPlaceholderText: 'Table View',
    sortingOptions: [
      { label: 'Sort 1', value: 'up' },
      { label: 'Sort 2', value: 'down' },
      { label: 'Sort 3', value: 'equals' },
    ],
    supportedViews: ['list', 'grid', 'table'],
    enableSorting: true,
    enableFiltering: true,
    columnDefinitions: [
      { field: 'id 1', header: 'label 1', active: true, translationPrefix: 'STORY' },
      { field: 'id 2', header: 'label 2', active: true, translationPrefix: 'STORY' },
      { field: 'id 3', header: 'label 3', active: false, translationPrefix: 'STORY' },
      { field: 'id 4', header: 'label 4', active: false, translationPrefix: 'STORY' },
      { field: 'id 5', header: 'label 5', active: false, translationPrefix: 'STORY' },
      { field: 'id 6', header: 'label 6', active: true, translationPrefix: 'STORY' },
      { field: 'id 7', header: 'label 7', active: false, translationPrefix: 'STORY' },
      { field: 'id 8', header: 'label 8', active: true, translationPrefix: 'STORY' },
      { field: 'id 9', header: 'label 9', active: false, translationPrefix: 'STORY' },
      { field: 'id 10', header: 'label 10', active: true, translationPrefix: 'STORY' },
    ],
    columnTemplates: [
      {
        label: 'Default',
        template: [
          { field: 'id 1', active: true },
          { field: 'id 2', active: true },
          { field: 'id 3', active: true },
          { field: 'id 4', active: true },
          { field: 'id 5', active: true },
          { field: 'id 6', active: true },
          { field: 'id 7', active: true },
          { field: 'id 8', active: true },
          { field: 'id 9', active: true },
          { field: 'id 10', active: true },
        ],
      },
      {
        label: 'Compact',
        template: [
          { field: 'id 1', active: true },
          { field: 'id 2', active: true },
          { field: 'id 3', active: true },
          { field: 'id 4', active: true },
          { field: 'id 5', active: true },
          { field: 'id 6', active: false },
          { field: 'id 7', active: false },
          { field: 'id 8', active: false },
          { field: 'id 9', active: false },
          { field: 'id 10', active: false },
        ],
      },
    ],
  },
}

const mockTranslations: DataViewControlTranslations = {
  sortOrderTooltips: {
    ascending: 'Sort ascending',
    descending: 'Sort descending',
  },
  toggleColumnButtonTooltip: 'Adjust shown columns',
  sortDropdownPlaceholder: 'Sort by property',
  sortDropdownTooltip: 'Sort by property',
  filterInputPlaceholder: 'Search by name',
  filterInputTooltip: 'Filter by properties',
  templatePickerDropdownPlaceholder: 'Table View Template',
  viewModeToggleTooltips: {
    list: 'List View',
    table: 'Table View',
    grid: 'Grid View',
  },
  columnDialogHeaderText: 'Adjust shown columns',
  columnDialogActiveHeader: 'Shown columns',
  columnDialogInactiveHeader: 'Hidden columns',
  columnDialogSaveButtonLabel: 'Confirm',
}

export const WithTranslations = {
  render: Template,

  args: {
    dropdownPlaceholderText: 'Table View',
    sortingOptions: [
      { label: 'Sort 1', value: 'up' },
      { label: 'Sort 2', value: 'down' },
      { label: 'Sort 3', value: 'equals' },
    ],
    supportedViews: ['list', 'grid', 'table'],
    enableSorting: true,
    enableFiltering: true,
    columnDefinitions: [
      { field: 'id 1', header: 'label 1', active: true, translationPrefix: 'STORY' },
      { field: 'id 2', header: 'label 2', active: true, translationPrefix: 'STORY' },
      { field: 'id 3', header: 'label 3', active: false, translationPrefix: 'STORY' },
      { field: 'id 4', header: 'label 4', active: false, translationPrefix: 'STORY' },
      { field: 'id 5', header: 'label 5', active: false, translationPrefix: 'STORY' },
      { field: 'id 6', header: 'label 6', active: true, translationPrefix: 'STORY' },
      { field: 'id 7', header: 'label 7', active: false, translationPrefix: 'STORY' },
      { field: 'id 8', header: 'label 8', active: true, translationPrefix: 'STORY' },
      { field: 'id 9', header: 'label 9', active: false, translationPrefix: 'STORY' },
      { field: 'id 10', header: 'label 10', active: true, translationPrefix: 'STORY' },
    ],
    columnTemplates: [
      {
        label: 'Default',
        template: [
          { field: 'id 1', active: true },
          { field: 'id 2', active: true },
          { field: 'id 3', active: true },
          { field: 'id 4', active: true },
          { field: 'id 5', active: true },
          { field: 'id 6', active: true },
          { field: 'id 7', active: true },
          { field: 'id 8', active: true },
          { field: 'id 9', active: true },
          { field: 'id 10', active: true },
        ],
      },
      {
        label: 'Compact',
        template: [
          { field: 'id 1', active: true },
          { field: 'id 2', active: true },
          { field: 'id 3', active: true },
          { field: 'id 4', active: true },
          { field: 'id 5', active: true },
          { field: 'id 6', active: false },
          { field: 'id 7', active: false },
          { field: 'id 8', active: false },
          { field: 'id 9', active: false },
          { field: 'id 10', active: false },
        ],
      },
    ],
    translations: mockTranslations,
  },
}

const BasicTempalte: StoryFn<DataViewControlsComponent> = (args: DataViewControlsComponent) => ({
  props: args,
  template: `
  <ocx-data-view-controls class="block" [supportedViews]="['list', 'grid']">
  </ocx-data-view-controls>
  `,
})

export const TestWithHtmlTemplate = {
  render: BasicTempalte,
}
