import { importProvidersFrom } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { ButtonModule } from '@openng/optimus-ui/button'
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel'
import { InputTextModule } from '@openng/optimus-ui/inputtext'
import { MessageModule } from '@openng/optimus-ui/message'
import { SelectModule } from '@openng/optimus-ui/select'
import { SkeletonModule } from '@openng/optimus-ui/skeleton'
import { TextareaModule } from '@openng/optimus-ui/textarea'
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
      imports: [
        StorybookTranslateModule,
        FormsModule,
        ButtonModule,
        FloatLabelModule,
        InputTextModule,
        MessageModule,
        SelectModule,
        SkeletonModule,
        TextareaModule,
      ],
    }),
  ],
} as Meta<AiAssistComponent>

const Template: StoryFn<AiAssistComponent> = (args) => ({
  props: args,
})

/** Agents come from AI providers; without a provider in Storybook the empty state is shown. Open the panel with the toggle icon. */
export const Default = {
  render: Template,
  args: {
    inputText: 'Hello, welcome to OneCX.',
  },
}

export const WithAdditionalActions = {
  render: Template,
  args: {
    inputText: 'Hello, welcome to OneCX.',
    defaultActions: DEFAULT_AI_ASSIST_ACTIONS.filter((action) => action.id !== 'generate'),
    additionalActions: [
      {
        id: 'extractKeywords',
        labelKey: 'Extract keywords',
        buildInstruction: () => 'Extract the most relevant keywords from the user text.',
        outputDescription: '{"keywords": string[]}',
        outputSchema: z.object({ keywords: z.array(z.string()) }),
        toSuggestion: (result: { keywords: string[] }) => result.keywords.join(', '),
      },
    ],
  },
}
