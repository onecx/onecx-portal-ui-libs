import { CommonModule, APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
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
import { PortalMenuComponent } from './portal-menu.component'
import { importProvidersFrom } from '@angular/core'
import { mockedGetMenu } from '../../../../../mocks/menuMapper'

export default {
  title: 'PortalMenuComponent',
  component: PortalMenuComponent,
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
        ConfigurationService,
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
} as Meta<PortalMenuComponent>

const Template: StoryFn<PortalMenuComponent> = (args: PortalMenuComponent) => ({
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
