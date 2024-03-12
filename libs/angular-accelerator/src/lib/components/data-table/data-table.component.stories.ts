import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { StorybookTranslateModule } from './../../storybook-translate.module'
import { DataTableComponent } from './data-table.component'
import { ColumnType } from '../../model/column-type.model'
type DataTableInputTypes = Pick<DataTableComponent, 'rows' | 'columns' | 'emptyResultsMessage' | 'selectedRows'>
const DataTableComponentSBConfig: Meta<DataTableComponent> = {
  title: 'DataTableComponent',
  component: DataTableComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserModule), importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      declarations: [DataTableComponent],
      imports: [TableModule, ButtonModule, MultiSelectModule, StorybookTranslateModule],
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

const defaultComponentArgs: DataTableInputTypes = {
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
  ],
  rows: [
    {
      id: 1,
      product: 'Apples',
      amount: 2,
    },
    {
      id: 2,
      product: 'Bananas',
      amount: 10,
    },
    {
      id: 3,
      product: 'Strawberries',
      amount: 5,
    },
  ],
  emptyResultsMessage: 'No results',
  selectedRows: [],
}

export const WithMockData = {
  render: Template,
  args: defaultComponentArgs,
}

export const NoData = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    rows: [],
  },
}

export const WithRowSelection = {
  argTypes: {
    selectionChanged: { action: 'selectionChanged' },
  },
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectionChanged: ($event: any) => console.log('Selection changed ', $event),
  },
}

export const WithRowSelectionAndDefaultSelection = {
  argTypes: {
    selectionChanged: { action: 'selectionChanged' },
  },
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectionChanged: ($event: any) => console.log('Selection changed ', $event),
    selectedRows: [
      {
        id: 1,
      },
    ],
  },
}

const extendedComponentArgs: DataTableInputTypes = {
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
  render: Template,
  args: extendedComponentArgs,
}

export const ResponsiveWithScrollAndFrozenActionsColumn = {
  argTypes: {
    deleteTableRow: { action: 'deleteTableRow' },
  },
  render: Template,
  args: {
    ...extendedComponentArgs,
    deleteTableRow: ($event: any) => console.log('Delete table row ', $event),
    frozenActionColumn: true,
    actionColumnPosition: 'left',
  },
}

export default DataTableComponentSBConfig
