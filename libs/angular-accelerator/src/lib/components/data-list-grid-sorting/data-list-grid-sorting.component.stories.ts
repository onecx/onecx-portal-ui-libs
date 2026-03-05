import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Meta, applicationConfig, argsToTemplate, moduleMetadata } from '@storybook/angular'
import { action } from 'storybook/actions'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { FloatLabelModule } from 'primeng/floatlabel'
import { SelectModule } from 'primeng/select'
import { TooltipModule } from 'primeng/tooltip'
import { DataSortDirection } from '../../model/data-sort-direction'
import { ColumnType } from '../../model/column-type.model'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { DataListGridSortingComponent } from './data-list-grid-sorting.component'

const DataListGridSortingComponentSBConfig: Meta<DataListGridSortingComponent> = {
  title: 'Components/DataListGridSortingComponent',
  component: DataListGridSortingComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserModule), importProvidersFrom(StorybookThemeModule)],
    }),
    moduleMetadata({
      declarations: [DataListGridSortingComponent],
      imports: [FormsModule, FloatLabelModule, SelectModule, ButtonModule, TooltipModule, StorybookTranslateModule],
    }),
  ],
}

const defaultComponentArgs = {
  columns: [
    { id: 'name', nameKey: 'Name', columnType: ColumnType.STRING, sortable: true },
    { id: 'status', nameKey: 'Status', columnType: ColumnType.STRING, sortable: true },
    { id: 'updatedAt', nameKey: 'Last updated', columnType: ColumnType.DATE, sortable: false },
  ],
  sortStates: [DataSortDirection.NONE, DataSortDirection.ASCENDING, DataSortDirection.DESCENDING],
  sortField: 'name',
  sortDirection: DataSortDirection.NONE,
}

export const Default = {
  render: (args: DataListGridSortingComponent) => ({
    props: {
      ...args,
      sortChange: action('sortChange'),
      sortDirectionChange: action('sortDirectionChange'),
      componentStateChanged: action('componentStateChanged'),
      columnsChange: action('columnsChange'),
    },
    template: `<ocx-data-list-grid-sorting ${argsToTemplate(args)}
      (sortChange)="sortChange($event)"
      (sortDirectionChange)="sortDirectionChange($event)"
      (componentStateChanged)="componentStateChanged($event)"
      (columnsChange)="columnsChange($event)"
    ></ocx-data-list-grid-sorting>`,
  }),
  args: defaultComponentArgs,
}

export const CustomSortStateCycle = {
  render: (args: DataListGridSortingComponent) => ({
    props: {
      ...args,
      sortChange: action('sortChange'),
      sortDirectionChange: action('sortDirectionChange'),
      componentStateChanged: action('componentStateChanged'),
      columnsChange: action('columnsChange'),
    },
    template: `<ocx-data-list-grid-sorting ${argsToTemplate(args)}
      (sortChange)="sortChange($event)"
      (sortDirectionChange)="sortDirectionChange($event)"
      (componentStateChanged)="componentStateChanged($event)"
      (columnsChange)="columnsChange($event)"
    ></ocx-data-list-grid-sorting>`,
  }),
  args: {
    ...defaultComponentArgs,
    sortStates: [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING],
    sortDirection: DataSortDirection.ASCENDING,
    sortField: 'status',
  },
}

export default DataListGridSortingComponentSBConfig
