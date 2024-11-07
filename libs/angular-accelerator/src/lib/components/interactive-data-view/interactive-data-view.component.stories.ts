import { Meta, StoryFn } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import {
  InteractiveDataViewComponentSBConfig,
  defaultInteractiveDataViewArgs,
  InteractiveDataViewTemplate,
} from './storybook-config'

const InteractiveDataViewComponentDefaultSBConfig: Meta<InteractiveDataViewComponent> = {
  ...InteractiveDataViewComponentSBConfig,
  title: 'Components/InteractiveDataViewComponent',
}
type InteractiveDataViewInputTypes = Pick<InteractiveDataViewComponent, 'data' | 'columns' | 'emptyResultsMessage'>

const defaultComponentArgs: InteractiveDataViewInputTypes = {
  ...defaultInteractiveDataViewArgs,
}

export const WithMockData = {
  argTypes: {
    componentStateChanged: { action: 'componentStateChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    selectedRows: [],
  },
}

export const WithPageSizes = {
  argTypes: {
    componentStateChanged: { action: 'componentStateChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
  },
}

const CustomContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data">
    <ng-template #listItem let-item>
      <div class="w-full px-4 py-2 card mb-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" />
      </div>
    </ng-template>
    <ng-template #gridItem let-item>
      <div class="w-3 px-4 py-2 card m-0 mr-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" />
      </div>
  </ng-template>
  <ng-template #topCenter>
    <input pInputText placeholder="Custom input injected via template" class="border-round w-18rem p-2" />
  </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomContentTemplates = {
  render: CustomContentInteractiveDataView,
  args: defaultComponentArgs,
}

const CustomTableCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableCellTemplates = {
  render: CustomTableCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomTableFilterCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE FILTER: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableFilterCellTemplates = {
  render: CustomTableFilterCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

const CustomTableColumnCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [filterViewDisplayMode]="filterViewDisplayMode" [disableFilterView]="disableFilterView" [columns]="columns" [data]="data">
    <ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="stringTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>STRING FILTER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container> PRODUCT (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="productIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container> PRODUCT FILTER (ID): {{ rowObject[column.id] }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container>DATE FILTER: {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateIdTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container> DATE (ID): {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="dateIdTableFilterCell" let-rowObject="rowObject" let-column="column">
      <ng-container> DATE FILTER (ID): {{ rowObject[column.id] | date }} </ng-container>
    </ng-template>
    <ng-template pTemplate="numberTableCell" let-rowObject="rowObject" let-column="column">
      <ng-container>NUMBER: {{ rowObject[column.id] }} </ng-container>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomTableColumnTemplates = {
  render: CustomTableColumnCellsInteractiveDataView,
  args: {
    ...defaultComponentArgs,
    disableFilterView: false,
    filterViewDisplayMode: 'button',
  },
}

export default InteractiveDataViewComponentDefaultSBConfig
