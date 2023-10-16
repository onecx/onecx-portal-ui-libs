import { APP_BASE_HREF, CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { APP_CONFIG } from '../../../api/injection-tokens'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { ConfigurationService } from '../../../services/configuration.service'
import { AppInlineProfileComponent } from './inline-profile.component'
import { importProvidersFrom } from '@angular/core'
import { PortalCoreModule } from '../../portal-core.module'
import { mockedGetMenu } from '../../../../../mocks/menuMapper'

export default {
  title: 'AppInlineProfileComponent',
  component: AppInlineProfileComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule),
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(MockAuthModule),
        importProvidersFrom(ButtonModule),
        importProvidersFrom(MenuModule),
        importProvidersFrom(SkeletonModule),
        importProvidersFrom(HttpClientModule),
        ConfigurationService,
        { provide: APP_CONFIG, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }),
    moduleMetadata({
      declarations: [],
      imports: [PortalCoreModule.forRoot('onecx-storybook')],
    }),
  ],
} as Meta<AppInlineProfileComponent>

const Template: StoryFn<AppInlineProfileComponent> = (args: AppInlineProfileComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    inlineMenuActive: false,
  },

  parameters: {
    msw: {
      handlers: [mockedGetMenu],
    },
  },
}
