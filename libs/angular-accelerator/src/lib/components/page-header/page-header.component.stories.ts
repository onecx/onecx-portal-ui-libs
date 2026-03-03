import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { action } from 'storybook/actions'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { Action, ObjectDetailItem, PageHeaderComponent } from './page-header.component'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'
import { OcxTooltipDirective } from '../../directives/ocx-tooltip.directive'

export default {
  title: 'Components/PageHeaderComponent',
  component: PageHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(StorybookThemeModule),
        provideUserServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }),
    moduleMetadata({
      declarations: [PageHeaderComponent, DynamicPipe, OcxTooltipDirective],
      imports: [
        MenuModule,
        BreadcrumbModule,
        ButtonModule,
        SkeletonModule,
        StorybookTranslateModule,
        StorybookBreadcrumbModule.init([
          { labelKey: 'Level 1', routerLink: ['/something'] },
          { labelKey: 'Level 2', url: '/' },
        ]),
        TooltipModule,
      ],
    }),
  ],
} as Meta<PageHeaderComponent>

const Template: StoryFn<PageHeaderComponent> = (args) => ({
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
    icon: PrimeIcons.REFRESH,
  },
  {
    label: 'Delete',
    actionCallback: () => {
      console.log(`you clicked 'Delete'`)
      action('actionButtonClick')({ button: 'Delete' })
    },
    title: 'Tooltip for Delete',
    show: 'always',
    icon: PrimeIcons.TRASH,
  },
  {
    label: 'Some action that has a long text',
    actionCallback: () => {
      console.log(`you clicked 'Some action'`)
    },
    show: 'asOverflow',
    icon: PrimeIcons.ADDRESS_BOOK,
    title: 'Tooltip for some action',
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
  {
    label: 'Loading',
    actionCallback: () => {
      console.log(`you clicked 'Loading'`)
    },
    title: 'This action is currently loading',
    loading: true,
    icon: PrimeIcons.SPINNER,
    show: 'always',
  },
  {
    icon: PrimeIcons.BOOK,
    actionCallback: () => {
      console.log(`you clicked 'BOOK'`)
    },
    show: 'always',
    ariaLabel: 'Aria label for BOOK action',
  },
]

const demoFields: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
    labelTooltipKey: 'Label Tooltip',
    actionItemIcon: PrimeIcons.COPY,
    actionItemTooltipKey: 'Copy to clipboard',
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
  {
    label: 'Status',
    value: 'Confirmed',
    icon: PrimeIcons.CHECK_CIRCLE,
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
    icon: PrimeIcons.CALENDAR,
    actionItemIcon: PrimeIcons.COPY,
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
    actionItemAriaLabel: 'Copy to clipboard',
  },
  {
    label: 'End Date',
    value: '19.06.2024',
    icon: PrimeIcons.CALENDAR,
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

const TemplateWithProjection: StoryFn<PageHeaderComponent> = (args) => ({
  props: args,
  template: `
  <ocx-page-header [header]="header" [subheader]="subheader" [actions]="actions">
    <div>
      <span>My dynamic content</span>
      <ul>
        <li>Can be anything you want</li>
        <li>Will be rendered under title bar</li>
      </ul>
    </div>
  </ocx-page-header>`,
})

const TemplateWithFigureProjection: StoryFn<PageHeaderComponent> = (args) => ({
  props: args,
  template: `
  <ocx-page-header [header]="header" [subheader]="subheader" [actions]="actions" [figureBackground]="false">
    <div figureImage [ngStyle]="{backgroundColor:'var(--p-orange-500)'}" class="text-white w-full h-full">
      <div><i class="pi pi-user"></i></div>
    </div>
    <div>
      The figure is an html with the following content:
      <textarea readonly class="block w-full"><div [ngStyle]="{backgroundColor:'var(--p-orange-500)'}" class="text-white"><i class="pi pi-user"></i></div></textarea>
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

const objectDetailsWithoutIcons: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
  },
  {
    label: 'Status',
    value: 'Confirmed',
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
  },
]

export const WithObjectDetails = {
  render: Template,

  args: {
    header: 'Test Page',
    subheader: 'Page header with text based objectDetails and no icons',
    loading: false,
    objectDetails: objectDetailsWithoutIcons,
    showBreadcrumbs: false,
  },
}

const objectDetailsWithIcons: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich ',
  },
  {
    label: 'Event Completed',
    icon: PrimeIcons.CHECK_CIRCLE,
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
    icon: PrimeIcons.CLOCK,
  },
  {
    label: 'I have no value',
  },
  {
    label: 'Status with style',
    value: 'Completed',
    icon: PrimeIcons.CHECK_SQUARE,
    valueCssClass: 'bg-green-400 text-white border-round-sm p-1',
  },
]

export const WithObjectDetailsAndIcons = {
  render: Template,

  args: {
    header: 'Test Page',
    subheader: 'Page header with text and icon based objectDetails',
    loading: false,
    objectDetails: objectDetailsWithIcons,
    showBreadcrumbs: false,
  },
}

export const WithObjectDetailsAndStyledIcons = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: [
      ...demoFields,
      {
        label: 'Styled Icon',
        value: 'Confirmed',
        icon: PrimeIcons.CHECK_CIRCLE,
        iconStyleClass: 'text-red-400 fadein animation-duration-1000 animation-iteration-infinite',
      },
    ],
    showBreadcrumbs: false,
  },
}

export const DefaultLayout = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
  },
}

export const ForcedColumnLayout = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
    enableGridView: false,
  },
}

export const ForcedGridLayout = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
    enableGridView: true,
  },
}

export const ForcedGridLayoutWithColumnAmount = {
  render: Template,

  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    objectDetails: demoFields,
    showBreadcrumbs: false,
    enableGridView: true,
    gridLayoutDesktopColumns: 4,
  },
}

const demoFieldsWithTranslationKeys: ObjectDetailItem[] = [
  {
    label: 'Venue',
    value: 'AIE Munich 11',
    valueTooltipKey: 'pageheader.valueTooltip',
    labelTooltipKey: 'pageheader.labelTooltip',
    actionItemTooltipKey: 'pageheader.actionItemTooltip',
    actionItemAriaLabelKey: 'pageheader.actionItemAriaLabel',
    actionItemIcon: PrimeIcons.COPY,
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
  {
    label: 'Start Date',
    value: '14.3.2022',
    icon: PrimeIcons.CALENDAR,
    labelTooltipKey: 'Simple string tooltip for label',
    valueTooltipKey: 'Simple string tooltip for value',
  },
  {
    label: 'End Date',
    value: '19.06.2024',
    icon: PrimeIcons.CALENDAR,
    actionItemIcon: PrimeIcons.COPY,
    actionItemTooltipKey: 'Simple string tooltip for action',
    actionItemAriaLabel: 'Simple string aria label for action',
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
  {
    label: 'Status',
    value: 'Confirmed',
    icon: PrimeIcons.CHECK_CIRCLE,
    labelTooltipKey: { key: 'pageheader.statusLabelTooltip', parameters: { status: 'confirmed' } },
    valueTooltipKey: { key: 'pageheader.statusValueTooltip', parameters: { value: 'Confirmed' } },
  },
  {
    label: 'Fallback Test',
    value: 'No tooltips provided',
    icon: PrimeIcons.INFO_CIRCLE,
    actionItemIcon: PrimeIcons.COPY,
    actionItemCallback: () => {
      console.log('Copy to clipboard')
    },
  },
]

export const TranslationKeysAndParams = {
  render: Template,
  args: {
    header: 'My title',
    subheader: 'My subtitle',
    loading: false,
    actions: demoActions,
    objectDetails: demoFieldsWithTranslationKeys,
    showBreadcrumbs: false,
  }
}