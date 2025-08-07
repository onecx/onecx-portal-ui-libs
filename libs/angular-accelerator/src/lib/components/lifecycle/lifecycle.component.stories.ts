import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { LifecycleComponent, LifecycleStep } from './lifecycle.component'
import { TimelineModule } from 'primeng/timeline'
import { CardModule } from 'primeng/card'

export default {
  title: 'Components/LifecycleComponent',
  component: LifecycleComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserModule), importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      declarations: [LifecycleComponent],
      imports: [StorybookTranslateModule, TimelineModule, CardModule],
    }),
  ],
} as Meta<LifecycleComponent>

const Template: StoryFn<LifecycleComponent> = (args: LifecycleComponent) => ({
  props: args,
})

const mockData: LifecycleStep[] = [
    {
        id: "todo",
        title: "ToDo"
    },
    {
        id: "in_progress",
        title: "In Progress",
        details: "This event is currently in progress"
    },
    {
        id: "done",
        title: "Done"
    }
]

export const WithoutHighlightedStep = {
  render: Template,
  args: {
    steps: mockData
  }
}

export const WithHighlightedStep = {
    render: Template,
    args: {
      steps: mockData,
      activeStepId: 'in_progress'
    }
  }