import { mockGetAnnouncement, mockedGetAnnouncements } from '../../../../../mocks/announcementMapper'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { AnnouncementBannerComponent } from './announcement-banner.component'
import { HttpClientModule } from '@angular/common/http'
import { AppStateService } from '../../../services/app-state.service'

export default {
  title: 'AnnouncementBannerComponent',
  component: AnnouncementBannerComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule),
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(HttpClientModule),
        AppStateService,
      ],
    }),
    moduleMetadata({
      imports: [ButtonModule],
      providers: [],
    }),
  ],
} as Meta<AnnouncementBannerComponent>

const Template: StoryFn<AnnouncementBannerComponent> = (args: AnnouncementBannerComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {},
  parameters: {
    msw: {
      handlers: [mockedGetAnnouncements, mockGetAnnouncement],
    },
  },
}
