import { APP_BASE_HREF, CommonModule, DatePipe } from '@angular/common'
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { TranslateModule, TranslatePipe } from '@ngx-translate/core'
import { action } from '@storybook/addon-actions'
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular'
import { ConfigurationService } from '../../../services/configuration.service'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { APP_CONFIG } from '../../../api/injection-tokens'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { BreadcrumbService } from '../../../services/breadcrumb.service'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { HttpClientModule } from '@angular/common/http'
import { AppStateService } from '../../../services/app-state.service'

function initFactory(breadcrumbService: BreadcrumbService, appStateService: AppStateService) {
  return async () => {
    breadcrumbService.setItems([
      { label: 'Level 1', routerLink: 'something' },
      { label: 'Level 2', url: '/' },
    ])
    await appStateService.currentPortal$.publish({
      baseUrl: '/demo',
      portalName: 'Demo',
      id: 'Demo',
      microfrontendRegistrations: [],
    })
  }
}

export default {
  title: 'Page Header Component',
  component: PageHeaderComponent,
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
        { provide: APP_CONFIG, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: APP_INITIALIZER,
          useFactory: initFactory,
          multi: true,
          deps: [BreadcrumbService, ConfigurationService],
        },
      ],
    }),
    moduleMetadata({
      declarations: [PageHeaderComponent, DynamicPipe],
      imports: [MenuModule, BreadcrumbModule, ButtonModule, SkeletonModule],
      providers: [],
    }),
  ],
} as Meta<PageHeaderComponent>

const Template: StoryFn<PageHeaderComponent> = (args: PageHeaderComponent) => ({
  props: args,
})

const demoActions: Action[] = [
  {
    label: 'Save',
    actionCallback: () => {
      console.log(`you clicked 'Save'`)
      action('actionButtonClick')({ button: 'Save' })
    },
    title: 'Tooltip for Save',
  },
  {
    label: 'Reload',
    actionCallback: () => {
      console.log(`you clicked 'Reload'`)
      action('actionButtonClick')({ button: 'Reload' })
    },
    title: 'Tooltip for Reload',
    show: 'always',
    icon: 'pi pi-refresh',
  },
  {
    label: 'Delete',
    actionCallback: () => {
      console.log(`you clicked 'Delete'`)
      action('actionButtonClick')({ button: 'Delete' })
    },
    title: 'Tooltip for Delete',
    show: 'always',
    icon: 'pi pi-trash',
  },
  {
    label: 'Some action',
    actionCallback: () => {
      console.log(`you clicked 'Some action'`)
    },
    show: 'asOverflow',
  },
  {
    label: 'Other action',
    actionCallback: () => {
      console.log(`you clicked 'Other Action'`)
    },
    show: 'asOverflow',
  },
  {
    label: 'Disabled',
    actionCallback: () => {
      console.log(`you clicked 'Disabled'`)
    },
    title: 'Tooltip for Disabled',
    disabled: true,
  },
]

const demoFields: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
  },
  {
    label: 'Status',
    labelPipe: TranslatePipe,
    value: 'Confirmed',
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
  },
  {
    label: 'End Date',
    value: new Date().toISOString(),
    valuePipe: DatePipe,
  },
]

export const Primary = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
  },
}

export const TitleBarOnly = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    showBreadcrumbs: false,
  },
}

export const WithCustomButtons = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: false,
  },
}

export const WithBreadcrumbs = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    manualBreadcrumbs: true,
  },
}

export const WithImageUrl = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    manualBreadcrumbs: true,
  },
}

export const WithImageWithoutBG = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'Figure/image is shown without colored background',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    figureBackground: false,
    manualBreadcrumbs: true,
  },
}

export const WithoutFigure = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'No figure/image is shown to the left',
    actions: demoActions,
    objectDetails: demoFields,
    disableDefaultActions: true,
    showBreadcrumbs: true,
    showFigure: false,
    manualBreadcrumbs: true,
  },
}

export const WithLoadingState = {
  render: Template,

  args: {
    loading: true,
    header: 'My title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
    showBreadcrumbs: false,
  },
}

const TemplateWithProjection: StoryFn<PageHeaderComponent> = (args: PageHeaderComponent) => ({
  props: args,
  template: `
  <ocx-page-header [header]="title" [subheader]="subTitle" [actions]="actions">
    <div>
      <span>My dynamic content</span>
      <ul>
        <li>Can be anything you want</li>
        <li>Will be rendered under title bar</li>
      </ul>
    </div>
  </ocx-page-header>`,
})

const TemplateWithFigureProjection: StoryFn<PageHeaderComponent> = (args: PageHeaderComponent) => ({
  props: args,
  template: `
  <ocx-page-header [header]="header" [subheader]="subheader" [actions]="actions" [figureBackground]="false">
    <div figureImage  class="bg-orange-500 text-white w-full h-full">
      <div><i class="pi pi-user"></i></div>
    </div>
    <div>
      The figure is an html with the following content:
      <textarea readonly class="block w-full"><div class="bg-orange-500 text-white"><i class="pi pi-user"></i></div></textarea>
    </div>
  </ocx-page-header>`,
})

export const WithCustomFigureContent = {
  render: TemplateWithFigureProjection,

  args: {
    header: 'My header title',
    subheader: 'Figure to the left is completely controlled by the host',
    actions: demoActions,
    figureBackground: false,
    objectDetails: demoFields,
  },
}

export const WithCustomContent = {
  render: TemplateWithProjection,

  args: {
    header: 'My header title',
    subheader: 'My subtitle',
    actions: demoActions,
    objectDetails: demoFields,
  },
}
