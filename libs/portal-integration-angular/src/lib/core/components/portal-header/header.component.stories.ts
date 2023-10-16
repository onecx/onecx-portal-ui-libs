import { APP_BASE_HREF, CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular'
import { APP_CONFIG } from '../../../api/injection-tokens'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { ConfigurationService } from '../../../services/configuration.service'
import { HeaderComponent } from './header.component'
import { importProvidersFrom } from '@angular/core'
import { PortalCoreModule } from '../../portal-core.module'
import { mockedGetMenu } from '../../../../../mocks/menuMapper'
export default {
  title: 'HeaderComponent',
  component: HeaderComponent,
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
      imports: [PortalCoreModule.forRoot('onecx-storybook')],
      providers: [
        { provide: APP_CONFIG, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }),
  ],
} as Meta<HeaderComponent>

const Template: StoryFn<HeaderComponent> = (args: HeaderComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    menuButtonTitle: '',
    disableBreadcrumbs: false,
    fullPortalLayout: false,
    homeNavUrl: '/',
    homeNavTitle: 'Home',
  },
  parameters: {
    msw: {
      handlers: [mockedGetMenu],
    },
  },
}
