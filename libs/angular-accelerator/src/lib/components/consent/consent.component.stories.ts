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
    url: {
      control: 'text',
      description: 'Target URL that the gated content will contact',
    },
    purpose: {
      control: 'text',
      description: 'Optional purpose scope for consent (e.g. "maps", "analytics")',
    },
    showWithdraw: {
      control: 'boolean',
      description: 'Shows a withdraw button that removes stored consent',
    },
    titleKey: {
      control: 'text',
      description: 'Translation key for the consent dialog title',
    },
    messageKey: {
      control: 'text',
      description: 'Translation key for the consent dialog message',
    },
    agreeKey: {
      control: 'text',
      description: 'Translation key for the agree button',
    },
    withdrawKey: {
      control: 'text',
      description: 'Translation key for the withdraw button',
    },
    consentChanged: { action: 'consentChanged' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'UI component to gate projected content behind explicit user consent. Supports localStorage persistence, purpose-scoped consent, and withdraw actions.',
      },
    },
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

const TemplateWithCustomTranslations: StoryFn<ConsentStoryArgs> = (args: ConsentStoryArgs) => {
  return {
    props: {
      ...args,
      titleKey: 'CUSTOM.CONSENT.TITLE',
      messageKey: 'CUSTOM.CONSENT.MESSAGE',
      agreeKey: 'CUSTOM.CONSENT.AGREE',
      withdrawKey: 'CUSTOM.CONSENT.WITHDRAW',
    },
    template: `
      <ocx-consent
        [url]="url"
        [showWithdraw]="showWithdraw"
        [titleKey]="titleKey"
        [messageKey]="messageKey"
        [agreeKey]="agreeKey"
        [withdrawKey]="withdrawKey"
        (consentChanged)="consentChanged($event)"
      >
        <div style="height: 120px; display: flex; align-items: center; justify-content: center;">
          <span>Content unlocked with custom translations</span>
        </div>
      </ocx-consent>
    `,
  }
}

const TemplateMultiplePurposes: StoryFn<ConsentStoryArgs> = () => {
  return {
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div style="border: 1px solid #ccc; padding: 1rem;">
          <h3>Maps Provider</h3>
          <ocx-consent
            url="https://tile.openstreetmap.org"
            purpose="maps"
            [showWithdraw]="true"
            (consentChanged)="consentChanged($event)"
          >
            <div style="height: 120px; display: flex; align-items: center; justify-content: center; background: #e3f2fd;">
              <span>🗺️ Map content (purpose: maps)</span>
            </div>
          </ocx-consent>
        </div>

        <div style="border: 1px solid #ccc; padding: 1rem;">
          <h3>Analytics Provider</h3>
          <ocx-consent
            url="https://tile.openstreetmap.org"
            purpose="analytics"
            [showWithdraw]="true"
            (consentChanged)="consentChanged($event)"
          >
            <div style="height: 120px; display: flex; align-items: center; justify-content: center; background: #f3e5f5;">
              <span>📊 Analytics content (purpose: analytics)</span>
            </div>
          </ocx-consent>
        </div>
      </div>
    `,
  }
}

const TemplatePostConsent: StoryFn<ConsentStoryArgs> = (args: ConsentStoryArgs) => {
  return {
    props: {
      ...args,
      showWithdraw: true,
    },
    template: `
      <div style="border: 1px solid #ccc; padding: 1rem;">
        <p style="margin-top: 0;">
          <strong>Scenario:</strong> User has already granted consent.
          The projected content is visible, and a withdraw link appears below.
        </p>
        <p style="font-size: 0.875rem; color: #666;">
          Click "Agree" first to see the post-consent state.
        </p>
        <ocx-consent
          [url]="url"
          [showWithdraw]="showWithdraw"
          [purpose]="purpose"
          (consentChanged)="consentChanged($event)"
        >
          <div style="height: 120px; display: flex; align-items: center; justify-content: center; background: #c8e6c9;">
            <div style="text-align: center;">
              <div style="font-size: 2rem;">✅</div>
              <div>Content is now visible</div>
              <div style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">
                Look below for the withdraw link
              </div>
            </div>
          </div>
        </ocx-consent>
      </div>
    `,
  }
}

const TemplateEdgeCases: StoryFn<ConsentStoryArgs> = () => {
  return {
    template: `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div style="border: 1px solid #ccc; padding: 1rem;">
          <h3>URL with Trailing Slash</h3>
          <p style="font-size: 0.875rem; color: #666;">
            URL normalization removes trailing slashes: "https://example.com/" → "https://example.com"
          </p>
          <ocx-consent
            url="https://example.com/"
            (consentChanged)="consentChanged($event)"
          >
            <div style="height: 80px; display: flex; align-items: center; justify-content: center;">
              <span>Normalized URL consent</span>
            </div>
          </ocx-consent>
        </div>

        <div style="border: 1px solid #ccc; padding: 1rem;">
          <h3>URL with Query and Hash</h3>
          <p style="font-size: 0.875rem; color: #666;">
            Normalization removes query params and hash: "https://example.com/path?q=1#hash" → "https://example.com/path"
          </p>
          <ocx-consent
            url="https://example.com/path?query=test#fragment"
            (consentChanged)="consentChanged($event)"
          >
            <div style="height: 80px; display: flex; align-items: center; justify-content: center;">
              <span>Query and hash removed</span>
            </div>
          </ocx-consent>
        </div>

        <div style="border: 1px solid #ccc; padding: 1rem;">
          <h3>Non-URL String</h3>
          <p style="font-size: 0.875rem; color: #666;">
            Non-URL strings are trimmed and trailing slash removed: "not a url/" → "not a url"
          </p>
          <ocx-consent
            url="not a url/"
            (consentChanged)="consentChanged($event)"
          >
            <div style="height: 80px; display: flex; align-items: center; justify-content: center;">
              <span>Non-URL string handling</span>
            </div>
          </ocx-consent>
        </div>
      </div>
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

export const WithCustomTranslations = {
  render: TemplateWithCustomTranslations,
  args: {
    ...defaultArgs,
    showWithdraw: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom translation keys for all text elements.',
      },
    },
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

export const MultiplePurposes = {
  render: TemplateMultiplePurposes,
  args: {
    ...defaultArgs,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates multiple consent components for the same URL with different purposes.',
      },
    },
  },
}

export const PostConsentWithWithdrawal = {
  render: TemplatePostConsent,
  args: {
    ...defaultArgs,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the state after consent is granted with withdrawal enabled.',
      },
    },
  },
}

export const EdgeCases = {
  render: TemplateEdgeCases,
  args: {
    ...defaultArgs,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates URL normalization behavior for edge cases.',
      },
    },
  },
}
