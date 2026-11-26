import { Meta, moduleMetadata, applicationConfig, argsToTemplate, StoryFn } from '@storybook/angular-vite'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { DataViewStateService } from '../../services/data-view-state.service'
import { DataLayoutSelectionComponent } from './data-layout-selection.component'

const DataLayoutSelectionComponentSBConfig: Meta<DataLayoutSelectionComponent> = {
  title: 'Components/DataLayoutSelectionComponent',
  component: DataLayoutSelectionComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [DataLayoutSelectionComponent],
      imports: [SelectButtonModule, FormsModule, TooltipModule, StorybookTranslateModule, OcxTooltipDirective],
      providers: [DataViewStateService],
    }),
  ],
  args: {
    supportedViewLayouts: ['list', 'grid', 'table'],
  },
  argTypes: {
    layout: { control: 'select', options: ['list', 'grid', 'table'] },
    dataViewLayoutChange: { action: 'dataViewLayoutChange' },
    componentStateChanged: { action: 'componentStateChanged' },
  },
}

const Template: StoryFn = (args) => ({
  props: args,
  template: `<ocx-data-layout-selection ${argsToTemplate(args)}></ocx-data-layout-selection>`,
})

export const Default = {
  render: Template,
  args: {
    layout: 'table',
  },
}

export const GridLayoutSelected = {
  render: Template,
  args: {
    layout: 'grid',
  },
}

export const ListAndGridOnly = {
  render: Template,
  args: {
    supportedViewLayouts: ['list', 'grid'],
    layout: 'list',
  },
}

export default DataLayoutSelectionComponentSBConfig
