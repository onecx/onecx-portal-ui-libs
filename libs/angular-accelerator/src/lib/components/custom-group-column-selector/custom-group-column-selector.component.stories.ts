import { Meta, moduleMetadata, applicationConfig, StoryFn } from '@storybook/angular'
import { TranslateModule } from '@ngx-translate/core'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from '@openng/optimus-ui/button'
import { SelectModule } from '@openng/optimus-ui/select'
import { DialogModule } from '@openng/optimus-ui/dialog'
import { PickListModule } from '@openng/optimus-ui/picklist'
import { CheckboxModule } from '@openng/optimus-ui/checkbox'
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { ColumnType } from '../../model/column-type.model'
import { CustomGroupColumnSelectorComponent } from './custom-group-column-selector.component'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DataViewStateService } from '../../services/data-view-state.service'

const CustomGroupColumnSelectorComponentSBConfig: Meta<CustomGroupColumnSelectorComponent> = {
  title: 'Components/CustomGroupColumnSelectorComponent',
  component: CustomGroupColumnSelectorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [CustomGroupColumnSelectorComponent],
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
        OcxTooltipDirective
      ],
      providers: [DataViewStateService]
    }),
  ],
}
const Template: StoryFn = (args) => ({
  props: args,
})

const defaultComponentArgs = {
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
  draggableColumnGroupSelectorDialog: true,
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
