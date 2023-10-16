import { APP_BASE_HREF, CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { APP_CONFIG } from '../../../api/injection-tokens'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { ConfigurationService } from '../../../services/configuration.service'
import { MfeDebugComponent } from './mfe-debug.component'
import { importProvidersFrom } from '@angular/core'

export default {
  title: 'MfeDebugComponent',
  component: MfeDebugComponent,
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
      ],
    }),
    moduleMetadata({
      providers: [
        ConfigurationService,
        { provide: APP_CONFIG, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }),
  ],
} as Meta<MfeDebugComponent>

const Template: StoryFn<MfeDebugComponent> = (args: MfeDebugComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,
  args: {},
}
