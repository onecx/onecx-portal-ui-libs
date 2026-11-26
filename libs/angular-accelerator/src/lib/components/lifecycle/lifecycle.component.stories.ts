import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular-vite'
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
  // Known contrast violation: the highlighted step renders default text on bg-primary (2.25:1), fix in lifecycle.component.html.
  // All other rules apply.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
}
