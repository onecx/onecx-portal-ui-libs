import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular'
import { APP_BASE_HREF } from '@angular/common'
import { PortalPageComponent } from './portal-page.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule } from '@angular/router'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'

export default {
  title: 'PortalPageComponent',
  component: PortalPageComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(MockAuthModule),
        importProvidersFrom(HttpClientModule),
      ],
    }),
    moduleMetadata({
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }),
  ],
} as Meta<PortalPageComponent>

const Template: StoryFn<PortalPageComponent> = (args: PortalPageComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    permission: '',
    helpArticleId: '',
  },
}
