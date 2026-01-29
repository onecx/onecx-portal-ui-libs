import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'
import { TimelineModule } from 'primeng/timeline'
import { CardModule } from 'primeng/card'

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
  render: (args: LifecycleComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-lifecycle steps="${args.steps}"></ocx-lifecycle>
    `,
  }),
  args: {
    steps: mockData,
  },
}

export const WithHighlightedStep = {
  render: (args: LifecycleComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-lifecycle steps="${args.steps}" activeStepId="${args.activeStepId}"></ocx-lifecycle>
    `,
  }),
  args: {
    steps: mockData,
    activeStepId: 'in_progress',
  },
}
