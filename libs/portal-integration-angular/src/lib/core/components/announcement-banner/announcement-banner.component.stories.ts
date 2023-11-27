import { mockGetAnnouncement, mockedGetAnnouncements } from '../../../../../mocks/announcementMapper'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { AnnouncementBannerComponent } from './announcement-banner.component'
import { HttpClientModule } from '@angular/common/http'
import { AppStateService } from '../../../services/app-state.service'

async function initFactory(appStateService: AppStateService) {
  appStateService.currentPortal$.publish({
    baseUrl: '/demo',
    portalName: 'Demo',
    id: 'Demo',
    microfrontendRegistrations: [],
  })
  await appStateService.currentPortal$.isInitialized

  return () => {
    appStateService
  }
}

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
        {
          provide: APP_INITIALIZER,
          useFactory: initFactory,
          multi: true,
          deps: [AppStateService],
        },
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
