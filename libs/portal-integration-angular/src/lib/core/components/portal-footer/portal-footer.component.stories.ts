import { APP_BASE_HREF, CommonModule } from '@angular/common'
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { APP_CONFIG } from '../../../api/injection-tokens'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { ConfigurationService } from '../../../services/configuration.service'
import { PortalFooterComponent } from './portal-footer.component'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { mockedGetMenu } from '../../../../../mocks/menuMapper'
import { AppStateService } from '../../../services/app-state.service'

async function initFactory(appStateService: AppStateService) {
  await appStateService.currentPortal$.publish({
    baseUrl: '/demo',
    portalName: 'Demo',
    id: 'Demo',
    microfrontendRegistrations: [],
  })

  return () => {
    appStateService
  }
}

export default {
  title: 'PortalFooterComponent',
  component: PortalFooterComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule),
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(MockAuthModule),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(HttpClientJsonpModule),
        ConfigurationService,
        {
          provide: APP_INITIALIZER,
          useFactory: initFactory,
          multi: true,
          deps: [ConfigurationService],
        },
      ],
    }),
    moduleMetadata({
      imports: [ButtonModule, MenuModule, SkeletonModule],
      providers: [
        { provide: APP_CONFIG, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }),
  ],
} as Meta<PortalFooterComponent>

const Template: StoryFn<PortalFooterComponent> = (args: PortalFooterComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,
  args: {},
  parameters: {
    msw: {
      handlers: [mockedGetMenu],
    },
  },
}
