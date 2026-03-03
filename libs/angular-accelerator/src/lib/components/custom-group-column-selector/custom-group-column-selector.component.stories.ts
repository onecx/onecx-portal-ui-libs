import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { TranslateModule } from '@ngx-translate/core'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { CheckboxModule } from 'primeng/checkbox'
import { SelectButtonModule } from 'primeng/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { ColumnType } from '../../model/column-type.model'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { TooltipModule } from 'primeng/tooltip'
import { OcxTooltipDirective } from '../../directives/ocx-tooltip.directive'

type CustomGroupColumnSelectorInputs = Pick<
  CustomGroupColumnSelectorComponent,
  | 'columns'
  | 'displayedColumns'
  | 'actionColumnPosition'
  | 'frozenActionColumn'
  | 'dialogTitle'
  | 'saveButtonLabel'
  | 'cancelButtonLabel'
  | 'activeColumnsLabel'
  | 'inactiveColumnsLabel'
>
const CustomGroupColumnSelectorComponentSBConfig: Meta<CustomGroupColumnSelectorComponent> = {
  title: 'Components/CustomGroupColumnSelectorComponent',
  component: CustomGroupColumnSelectorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [CustomGroupColumnSelectorComponent, OcxTooltipDirective],
      imports: [
        SelectModule,
        DialogModule,
        PickListModule,
        ButtonModule,
        CheckboxModule,
        FormsModule,
        SelectButtonModule,
        TooltipModule,
        StorybookTranslateModule,
      ],
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

const defaultComponentArgs: CustomGroupColumnSelectorInputs = {
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
  displayedColumns: [
    {
      id: 'date',
      columnType: ColumnType.DATE,
      nameKey: 'Date',
      sortable: false,
    },
  ],
  frozenActionColumn: true,
  actionColumnPosition: 'right',
  dialogTitle: 'Column configurator',
  saveButtonLabel: 'Save',
  cancelButtonLabel: 'Cancel',
  activeColumnsLabel: 'Active',
  inactiveColumnsLabel: 'Inactive',
}

export const Default = {
  render: Template,
  args: {
    ...defaultComponentArgs,
  },
  argTypes: {
    actionColumnConfigChanged: { action: 'actionColumnConfigChanged' },
  },
}

export default CustomGroupColumnSelectorComponentSBConfig
