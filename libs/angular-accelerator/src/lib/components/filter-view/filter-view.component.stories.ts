import { Meta, StoryFn, argsToTemplate } from '@storybook/angular-vite'
import { Filter, FilterType } from '../../model/filter.model'
import {
  InteractiveDataViewComponentSBConfig,
  defaultInteractiveDataViewArgs,
} from '../interactive-data-view/storybook-config'
import { FilterViewComponent } from './filter-view.component'

// Reuses the providers and declarations of the Interactive Data View stories, which
// already render the Filter View (incl. its data table panel and "Add Filter" dialog).
const FilterViewComponentSBConfig: Meta<FilterViewComponent> = {
  title: 'Components/FilterViewComponent',
  component: FilterViewComponent,
  decorators: InteractiveDataViewComponentSBConfig.decorators as Meta['decorators'],
  argTypes: {
    selectDisplayedChips: { type: 'function', control: false },
    displayMode: { control: 'radio', options: ['chips', 'button'] },
    filtered: { action: 'filtered' },
    componentStateChanged: { action: 'componentStateChanged' },
  },
  // A tooltip ("Manage active filters", "no filters") is sometimes still fading in during the check (text contrast 1.08:1),
  // depending on focus timing. Exclude the tooltip overlay, everything else is checked.
  parameters: { a11y: { context: { exclude: ['.p-tooltip'] } } },
}

const Template: StoryFn<FilterViewComponent> = (args) => ({
  props: args,
  template: `<ocx-filter-view ${argsToTemplate(args)}></ocx-filter-view>`,
})

const defaultFilters: Filter[] = [
  { columnId: 'product', value: 'Apples', filterType: FilterType.EQUALS },
  { columnId: 'product', value: 'Bananas', filterType: FilterType.EQUALS },
  { columnId: 'available', value: true, filterType: FilterType.IS_NOT_EMPTY },
  { columnId: 'date', value: new Date(2022, 1, 1, 13, 14, 55, 120), filterType: FilterType.EQUALS },
]

const defaultArgs = {
  columns: defaultInteractiveDataViewArgs.columns,
  filters: defaultFilters,
}

export const ChipsWithFilters = {
  render: Template,
  args: {
    ...defaultArgs,
    displayMode: 'chips',
  },
}

export const ChipsWithoutFilters = {
  render: Template,
  args: {
    ...defaultArgs,
    filters: [],
    displayMode: 'chips',
  },
}

export const ButtonWithFilters = {
  render: Template,
  args: {
    ...defaultArgs,
    displayMode: 'button',
  },
}

export default FilterViewComponentSBConfig
