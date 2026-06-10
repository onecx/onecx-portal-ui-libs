import { Meta, StoryFn } from '@storybook/angular'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import {
  InteractiveDataViewComponentSBConfig,
  defaultInteractiveDataViewArgs,
  InteractiveDataViewTemplate,
  defaultInteractiveDataViewArgTypes,
} from './storybook-config'
import { ColumnType } from '../../model/column-type.model'

const InteractiveDataViewComponentDefaultSBConfig: Meta<InteractiveDataViewComponent> = {
  ...InteractiveDataViewComponentSBConfig,
  title: 'Components/InteractiveDataViewComponent',
}
type InteractiveDataViewInputTypes = Pick<InteractiveDataViewComponent, 'data' | 'columns' | 'emptyResultsMessage'>

const defaultComponentArgs: InteractiveDataViewInputTypes = {
  ...defaultInteractiveDataViewArgs,
}

const defaultComponentArgTypes = {
  ...defaultInteractiveDataViewArgTypes,
}

export const WithMockData = {
  argTypes: {
    ...defaultComponentArgTypes,
    componentStateChanged: { action: 'componentStateChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    selectedRows: [],
  },
}

function generateColumns(count: number) {
  const data = []
  for (let i = 0; i < count; i++) {
    const row = {
      id: `${i + 1}`,
      columnType: ColumnType.STRING,
      nameKey: `Product${i + 1}`,
      sortable: false,
      filterable: true,
      predefinedGroupKeys: ['test'],
    }
    data.push(row)
  }
  return data
}

function generateRows(rowCount: number, columnCount: number) {
  const data = []
  for (let i = 0; i < rowCount; i++) {
    const row = {} as any
    for (let j = 0; j < columnCount; j++) {
      row[j + 1] = `Test value for ${j + 1}`
    }
    data.push(row)
  }
  return data
}

function generateColumnTemplates(columnCount: number) {
  let templates = ''
  for (let i = 0; i < columnCount; i++) {
    templates += `
    <ng-template pTemplate="${i + 1}IdListValue" let-rowObject="rowObject" let-column="column">
      <ng-container>${i + 1} {{ rowObject[${i + 1}] }} </ng-container>
    </ng-template>`
  }
  return templates
}

const columnCount = 30
const rowCount = 500

const HugeMockDataTemplate: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
    ${generateColumnTemplates(Math.ceil(columnCount / 3))}
  </ocx-interactive-data-view>`,
})

export const WithHugeMockData = {
  argTypes: {
    ...defaultComponentArgTypes,
    componentStateChanged: { action: 'componentStateChanged' },
    selectionChanged: { action: 'selectionChanged' },
  },
  render: HugeMockDataTemplate,
  args: {
    ...defaultComponentArgs,
    columns: generateColumns(columnCount),
    data: generateRows(rowCount, columnCount),
    emptyResultsMessage: 'No results',
    selectedRows: [],
    pageSize: 50,
  },
}

export const WithPageSizes = {
  argTypes: {
    ...defaultComponentArgTypes,
    componentStateChanged: { action: 'componentStateChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    pageSizes: [2, 15, 25],
    showAllOption: false,
  },
}

export const WithCustomStyleClasses = {
  argTypes: {
    componentStateChanged: { action: 'componentStateChanged' },
  },
  render: InteractiveDataViewTemplate,
  args: {
    ...defaultComponentArgs,
    headerStyleClass: 'py-2',
    contentStyleClass: 'py-4',
  },
}

const CustomContentInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
    <ng-template #list let-item>
      <div class="w-full px-4 py-2 card mb-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" />
      </div>
    </ng-template>
    <ng-template #grid let-item>
      <div class="w-3 px-4 py-2 card m-0 mr-4">
        <p>{{item.product}}</p>
        <p-progressBar [value]="item.amount" showValue="false"/>
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
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
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
  },
}

const CustomTableFilterCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
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
  },
}

const CustomTableColumnCellsInteractiveDataView: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
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
  },
}

const ExampleTemplate: StoryFn<InteractiveDataViewComponent & { content: any }> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
    ${args.content}
  </ocx-interactive-data-view>`,
})

export const ExampleWithTemplateControl = {
  render: ExampleTemplate,
  args: {
    ...defaultComponentArgs,
    content: `<ng-template pTemplate="stringTableCell" let-rowObject="rowObject" let-column="column">
  <ng-container>MY STRING TEMPLATE PROVIDED VIA CONTENT CONTROL: {{ rowObject[column.id] }} </ng-container>
</ng-template>`,
  },
}

const CustomHeaderLabelOnly: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
    <ng-template pTemplate="columnHeader" let-column="column">
      <span style="font-weight: bold; color: darkgreen">★ {{ column?.nameKey }}</span>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomHeaderTemplate = {
  name: 'Custom Header – Label Only',
  render: CustomHeaderLabelOnly,
  args: defaultComponentArgs,
}


const CustomHeaderFullControl: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
    <ng-template pTemplate="columnHeader"
      let-column="column"
      let-labelTemplate="labelTemplate"
      let-sortTemplate="sortTemplate"
      let-filterTemplate="filterTemplate">
      <div style="display: flex; align-items: center; gap: 4px;">
        <ng-container [ngTemplateOutlet]="filterTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
        <ng-container [ngTemplateOutlet]="labelTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
        <ng-container [ngTemplateOutlet]="sortTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
      </div>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomHeaderFullControl = {
  name: 'Custom Header with Layout Control',
  render: CustomHeaderFullControl,
  args: defaultComponentArgs,
}

const CustomHeaderPerColumnLayouts: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">

    <ng-template pTemplate="productIdTableHeader" let-column="column" let-filterTemplate="filterTemplate">
      <div style="display:flex; align-items:center; gap:6px;">
        <ng-container [ngTemplateOutlet]="filterTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
        <span style="font-weight:600;">{{ column?.nameKey }}</span>
      </div>
    </ng-template>

    <ng-template pTemplate="amountIdTableHeader" let-column="column" let-sortTemplate="sortTemplate" let-filterTemplate="filterTemplate" let-labelTemplate="labelTemplate">
      <div style="display: flex-direction:column; flex; align-items: center; gap: 4px; color: crimson; font-weight: bold">
        <ng-container [ngTemplateOutlet]="sortTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
        💰 Amount
      </div>
    </ng-template>

    <ng-template pTemplate="availableIdTableHeader" let-column="column" let-filterTemplate="filterTemplate">
      <div style="display:flex; flex-direction:column; align-items:flex-start; gap:3px;">
        <span style="font-size:0.65rem; text-transform:uppercase; letter-spacing:1px; color:#888;">{{ column?.nameKey }}</span>
        <ng-container [ngTemplateOutlet]="filterTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
      </div>
    </ng-template>

    <ng-template pTemplate="dateIdTableHeader" let-column="column" let-filterTemplate="filterTemplate">
      <div style="display:flex; align-items:center; justify-content:flex-end; gap:4px; width:100%;">
        <ng-container [ngTemplateOutlet]="filterTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
        <span style="font-style:italic; color:#555;">{{ column?.nameKey }}</span>
      </div>
    </ng-template>

  </ocx-interactive-data-view>`,
})

export const WithCustomHeaderPerColumnLayouts = {
  name: 'Custom Header Distict Layouts Per Column',
  render: CustomHeaderPerColumnLayouts,
  args: defaultComponentArgs,
}


const CustomHeaderStyledTheme: StoryFn<InteractiveDataViewComponent> = (args) => ({
  props: args,
  template: `
  <ocx-interactive-data-view [emptyResultsMessage]="emptyResultsMessage" [columns]="columns" [data]="data" [defaultGroupKey]="defaultGroupKey">
    <ng-template pTemplate="columnHeader"
      let-column="column"
      let-labelTemplate="labelTemplate"
      let-sortTemplate="sortTemplate"
      let-filterTemplate="filterTemplate">
      <div style="
        display:flex; flex-direction:column; gap:4px;
        padding: 4px 2px 6px 8px;
        border-left: 3px solid #4a90d9;
        min-width: 60px;
      ">
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="
            font-size:0.73rem; font-weight:700;
            text-transform:uppercase; letter-spacing:0.8px; color:#1a5f9e;
          ">
            <ng-container [ngTemplateOutlet]="labelTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
          </span>
          <ng-container [ngTemplateOutlet]="sortTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
        </div>
        <ng-container [ngTemplateOutlet]="filterTemplate" [ngTemplateOutletContext]="{ column: column }"></ng-container>
      </div>
    </ng-template>
  </ocx-interactive-data-view>`,
})

export const WithCustomHeaderStyledTheme = {
  name: 'Custom Header Styled Theme',
  render: CustomHeaderStyledTheme,
  args: defaultComponentArgs,
}

export default InteractiveDataViewComponentDefaultSBConfig
