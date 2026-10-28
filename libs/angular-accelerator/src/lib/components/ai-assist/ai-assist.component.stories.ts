import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { z } from 'zod'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { AiAssistComponent } from './ai-assist.component'
import { DEFAULT_AI_ASSIST_ACTIONS } from './ai-assist.model'

export default {
  title: 'Components/AiAssistComponent',
  component: AiAssistComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [AiAssistComponent],
      imports: [StorybookTranslateModule],
    }),
  ],
} as Meta<AiAssistComponent>

const Template: StoryFn<AiAssistComponent> = (args) => ({
  props: args,
})

/** Agents come from AI providers; without a provider in Storybook the empty state is shown. */
export const Default = {
  render: Template,
  args: {},
}

export const WithAdditionalActions = {
  render: Template,
  args: {
    defaultActions: DEFAULT_AI_ASSIST_ACTIONS.filter((action) => action.id !== 'generate'),
    additionalActions: [
      {
        id: 'extractKeywords',
        labelKey: 'Extract keywords',
        buildInstruction: () => 'Extract the most relevant keywords from the user text.',
        outputDescription: '{"keywords": string[]}',
        outputSchema: z.object({ keywords: z.array(z.string()) }),
      },
    ],
  },
}
