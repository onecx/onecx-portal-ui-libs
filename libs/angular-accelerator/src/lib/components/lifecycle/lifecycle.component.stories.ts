import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Meta, StoryFn, applicationConfig, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'
import { TimelineModule } from '@openng/optimus-ui/timeline'
import { CardModule } from '@openng/optimus-ui/card'

export default {
  title: 'Components/LifecycleComponent',
  component: LifecycleComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserModule), importProvidersFrom(StorybookThemeModule)],
    }),
    moduleMetadata({
      declarations: [LifecycleComponent],
      imports: [StorybookTranslateModule, TimelineModule, CardModule],
    }),
  ],
} as Meta<LifecycleComponent>

const Template: StoryFn<LifecycleComponent> = (args) => ({
  props: args,
})

const mockData: LifecycleStep[] = [
  {
    id: 'todo',
    title: 'ToDo',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    details: 'This event is currently in progress',
  },
  {
    id: 'done',
    title: 'Done',
  },
]

export const WithoutHighlightedStep = {
  render: Template,
  args: {
    steps: mockData,
  },
}

export const WithHighlightedStep = {
  render: Template,
  args: {
    steps: mockData,
    activeStepId: 'in_progress',
  },
}

// Custom palettes to check the contrast of the active step (axe color-contrast) with a dark and a light primary colour
const withPrimaryColor = (primaryColor: string) =>
  componentWrapperDecorator((story) => `<div style="--p-primary-color: ${primaryColor}">${story}</div>`)

export const WithHighlightedStepDarkPrimary = {
  render: Template,
  decorators: [withPrimaryColor('#6a1b9a')],
  args: {
    steps: mockData,
    activeStepId: 'in_progress',
  },
}

export const WithHighlightedStepLightPrimary = {
  render: Template,
  decorators: [withPrimaryColor('#ffd54f')],
  args: {
    steps: mockData,
    activeStepId: 'in_progress',
  },
}
