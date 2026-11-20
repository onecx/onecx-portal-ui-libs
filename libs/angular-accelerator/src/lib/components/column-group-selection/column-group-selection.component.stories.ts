import { Meta, moduleMetadata, applicationConfig, argsToTemplate, StoryFn } from '@storybook/angular-vite'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { SelectModule } from '@openng/optimus-ui/select'
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { ColumnType } from '../../model/column-type.model'
import { DataViewStateService } from '../../services/data-view-state.service'
import { ColumnGroupSelectionComponent } from './column-group-selection.component'

const ColumnGroupSelectionComponentSBConfig: Meta<ColumnGroupSelectionComponent> = {
  title: 'Components/ColumnGroupSelectionComponent',
  component: ColumnGroupSelectionComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [ColumnGroupSelectionComponent],
      imports: [SelectModule, FloatLabelModule, FormsModule, StorybookTranslateModule],
      providers: [DataViewStateService],
    }),
  ],
  argTypes: {
    groupSelectionChanged: { action: 'groupSelectionChanged' },
    componentStateChanged: { action: 'componentStateChanged' },
  },
}

const Template: StoryFn = (args) => ({
  props: args,
  template: `<ocx-column-group-selection ${argsToTemplate(args)}></ocx-column-group-selection>`,
})

const defaultComponentArgs = {
  columns: [
    {
      id: 'product',
      columnType: ColumnType.STRING,
      nameKey: 'Product',
      predefinedGroupKeys: ['Default', 'Extended'],
    },
    {
      id: 'amount',
      columnType: ColumnType.NUMBER,
      nameKey: 'Amount',
      predefinedGroupKeys: ['Default', 'Extended'],
    },
    {
      id: 'available',
      columnType: ColumnType.STRING,
      nameKey: 'Available',
      predefinedGroupKeys: ['Extended'],
    },
    {
      id: 'expiration',
      columnType: ColumnType.DATE,
      nameKey: 'Expiration Date',
      predefinedGroupKeys: ['Extended', 'Dates'],
    },
  ],
  selectedGroupKey: 'Default',
  defaultGroupKey: 'Default',
  customGroupKey: 'Custom',
  placeholderKey: 'Select a column group',
}

export const Default = {
  render: Template,
  args: {
    ...defaultComponentArgs,
  },
}

export const WithNonDefaultGroupSelected = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectedGroupKey: 'Extended',
  },
}

export const WithCustomGroupSelected = {
  render: Template,
  args: {
    ...defaultComponentArgs,
    selectedGroupKey: 'Custom',
  },
}

export default ColumnGroupSelectionComponentSBConfig
