import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { ConsentComponent } from './consent.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

type ConsentStoryArgs = {
  url: string
  purpose?: string
  titleKey?: string
  messageKey?: string
  agreeKey?: string
  withdrawKey?: string
  showWithdraw?: boolean
}

export default {
  title: 'Components/ConsentComponent',
  component: ConsentComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
        importProvidersFrom(StorybookTranslateModule),
      ],
    }),
    moduleMetadata({
      declarations: [ConsentComponent],
      imports: [StorybookTranslateModule, ButtonModule, RippleModule],
    }),
  ],
  argTypes: {
    consentChanged: { action: 'consentChanged' },
  },
} as Meta<ConsentStoryArgs>

const Template: StoryFn<ConsentStoryArgs> = (args: ConsentStoryArgs) => {
  return {
    props: {
      ...args,
    },
    template: `
      <ocx-consent
        [url]="url"
        [showWithdraw]="showWithdraw"
        [purpose]="purpose"
        (consentChanged)="consentChanged($event)"
      >
        <div style="height: 120px; display: flex; align-items: center; justify-content: center;">
          <span>I consented</span>
        </div>
      </ocx-consent>
    `,
  }
}

const TemplateWithInfo: StoryFn<ConsentStoryArgs> = (args: ConsentStoryArgs) => {
  return {
    props: {
      ...args,
    },
    template: `
      <ocx-consent
        [url]="url"
        [showWithdraw]="showWithdraw"
        [purpose]="purpose"
        (consentChanged)="consentChanged($event)"
      >
        <a ocx-consent-info href="https://example.com/privacy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        <div style="height: 120px; display: flex; align-items: center; justify-content: center;">
            <span>I consented</span>
        </div>
      </ocx-consent>
    `,
  }
}



const defaultArgs: ConsentStoryArgs = {
  url: 'https://example.com',
}

export const Default = {
  render: Template,
  args: {
    ...defaultArgs,
  },
}

export const WithInfoSlot = {
  render: TemplateWithInfo,
  args: {
    ...defaultArgs,
  },
}

export const WithWithdrawAction = {
  render: Template,
  args: {
    ...defaultArgs,
    showWithdraw: true,
  },
}

export const WithPurposeScope = {
  render: Template,
  args: {
    ...defaultArgs,
    purpose: 'maps',
  },
}
