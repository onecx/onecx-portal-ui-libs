import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, argsToTemplate, moduleMetadata } from '@storybook/angular-vite'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { FilterType } from '../../../model/filter.model'
import { defaultInteractiveDataViewArgs } from '../../interactive-data-view/storybook-config'
import { AddFilterDialogComponent } from './add-filter-dialog.component'

const AddFilterDialogComponentSBConfig: Meta<AddFilterDialogComponent> = {
  title: 'Components/AddFilterDialogComponent',
  component: AddFilterDialogComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      imports: [AddFilterDialogComponent, StorybookTranslateModule],
    }),
  ],
}

// The component is the content of the Filter View "Add filter" dialog; it is rendered
// here at the dialog's width without the PortalDialogService shell.
const Template: StoryFn<AddFilterDialogComponent> = (args) => ({
  props: args,
  template: `
    <div style="width: min(350px, 90vw)">
      <ocx-add-filter-dialog ${argsToTemplate(args)}></ocx-add-filter-dialog>
    </div>`,
})

// Only the filterable columns are offered by the Filter View
const filterableColumns = defaultInteractiveDataViewArgs.columns.filter((column) => column.filterable)

const defaultArgs = {
  columns: filterableColumns,
  data: defaultInteractiveDataViewArgs.data,
  existingFilters: [],
}

export const Default = {
  render: Template,
  args: {
    ...defaultArgs,
  },
}

export const WithExistingFilters = {
  render: Template,
  args: {
    ...defaultArgs,
    existingFilters: [
      { columnId: 'product', value: 'Apples', filterType: FilterType.EQUALS },
      { columnId: 'product', value: 'Bananas', filterType: FilterType.EQUALS },
    ],
    preselectColumnId: 'product',
  },
}

export const YesNoColumnPreselected = {
  render: Template,
  args: {
    ...defaultArgs,
    preselectColumnId: 'available',
  },
}

export default AddFilterDialogComponentSBConfig
