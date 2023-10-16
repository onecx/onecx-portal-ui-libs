import { APP_BASE_HREF, CommonModule } from '@angular/common'
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
import { SubMenuComponent } from './submenu.component'
import { importProvidersFrom } from '@angular/core'
import { ConfigurationService } from '../../../services/configuration.service'
import { MenuItem } from 'primeng/api'

export default {
  title: 'SubMenuComponent',
  component: SubMenuComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule),
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(MockAuthModule),
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
} as Meta<SubMenuComponent>

const Template: StoryFn<SubMenuComponent> = (args: SubMenuComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    index: 0,
    root: false,
    item: { label: 'label', url: 'testUrl', id: 'test id' } as MenuItem,
  },
}
