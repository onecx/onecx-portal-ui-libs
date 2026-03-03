import { importProvidersFrom } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { Action, PageHeaderComponent } from '../page-header/page-header.component'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { SearchHeaderComponent } from './search-header.component'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { provideHttpClient } from '@angular/common/http'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { FloatLabelModule } from 'primeng/floatlabel'
import { PrimeIcons } from 'primeng/api'
import { action } from 'storybook/actions'
import { OcxTooltipDirective } from '../../directives/ocx-tooltip.directive'

export default {
  title: 'Components/SearchHeaderComponent',
  component: SearchHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        {
          provide: ConfigurationService,
          useValue: {
            getProperty: () => Promise.resolve('false')
          }
        },
        provideHttpClient(),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [SearchHeaderComponent, DynamicPipe, PageHeaderComponent, OcxTooltipDirective],
      imports: [
        MenuModule,
        InputTextModule,
        BreadcrumbModule,
        ButtonModule,
        SelectModule,
        ReactiveFormsModule,
        SkeletonModule,
        StorybookTranslateModule,
        StorybookBreadcrumbModule.init([
          { labelKey: 'Level 1', routerLink: ['/something'] },
          { labelKey: 'Level 2', url: '/' },
        ]),
        TooltipModule,
        FloatLabelModule,
      ],
    }),
  ],
} as Meta<SearchHeaderComponent>

const Template: StoryFn<SearchHeaderComponent> = (args) => ({
  props: args,
})

export const Basic = {
  render: Template,

  args: {
    header: 'My title',
  },
}

const BasicSearchHeader: StoryFn<SearchHeaderComponent> = (args) => ({
  props: args,
  template: `
    <ocx-search-header [header]="header" (resetted)="resetted">
        <form>
          <div class="flex flex-wrap gap-3">
            <p-floatlabel variant="on">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [ocxTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </p-floatlabel>
            <p-floatlabel variant="on">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [ocxTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </p-floatlabel>
            <p-floatlabel variant="on">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [ocxTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </p-floatlabel>
          </div>
        </form>
    </ocx-search-header>
    `,
})

export const WithCustomTemplates = {
  render: BasicSearchHeader,
  argTypes: {
    resetted: { action: 'resetted' },
  },
  args: {
    header: 'My title',
  },
}

const advancedSearchHeader: StoryFn<SearchHeaderComponent> = (args) => ({
  props: {
    ...args,
    searched: action('searched'),
    resetted: action('resetted'),
    exportClicked: action('exportClicked'),
  },
  template: `<ocx-search-header 
  [header]="header"
  [manualBreadcrumbs]="manualBreadcrumbs"
  (searched)="searched($event)"
  (resetted)="resetted($event)"
>
  <!-- 1. Main search fields -->
  <form>
    <div class="flex flex-wrap gap-3">
      <p-floatlabel variant="on">
        <input
          id="name"
          pInputText
          type="text"
          class="w-18rem"
          [ocxTooltip]="'Name'"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="name" style="white-space: nowrap">
          Name
        </label>
      </p-floatlabel>
      <p-floatlabel variant="on">
        <input
          id="name2"
          pInputText
          type="text"
          class="w-18rem"
          [ocxTooltip]="'Name2'"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="name2" style="white-space: nowrap">
          Name2
        </label>
      </p-floatlabel>
      <p-floatlabel variant="on">
        <input
          id="name1"
          pInputText
          type="text"
          class="w-18rem"
          [ocxTooltip]="'Name1'"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="name1" style="white-space: nowrap">
          Name1
        </label>
      </p-floatlabel>
    </div>
    <div class="flex flex-wrap gap-3 mt-3">
      <p-floatlabel variant="on">
        <input
          id="name4"
          pInputText
          type="text"
          class="w-18rem"
          [ocxTooltip]="'Name4'"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="name4" style="white-space: nowrap">
          Name4
        </label>
      </p-floatlabel>
      <p-floatlabel variant="on">
        <input
          id="name5"
          pInputText
          type="text"
          class="w-18rem"
          [ocxTooltip]="'Name5'"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="name5" style="white-space: nowrap">
          Name5
        </label>
      </p-floatlabel>
      <p-floatlabel variant="on">
        <input
          id="name6"
          pInputText
          type="text"
          class="w-18rem"
          [ocxTooltip]="'Name6'"
          tooltipPosition="top"
          tooltipEvent="hover"
        />
        <label for="name6" style="white-space: nowrap">
          Name6
        </label>
      </p-floatlabel>
    </div>
  </form>
  
  <!-- 2. Left toolbar content -->
  <ng-template #additionalToolbarContentLeft>
    <span class="p-text-secondary">Status: Active</span>
  </ng-template>
  
  <!-- 3. Right toolbar content -->
  <ng-template #additionalToolbarContent>
    <p-button label="Export" icon="pi pi-download" (onClick)="exportClicked()"></p-button>
    <button
            id="pageHeaderMenuButton"
            type="button"
            pButton
            icon="pi pi-ellipsis-v"
            class="more-actions-menu-button action-button ml-2"
            (click)="menu.toggle($event)"
            name="ocx-page-header-overflow-action-button"
            [attr.aria-label]="'OCX_PAGE_HEADER.MORE_ACTIONS' | translate"
            [ocxTooltip]="'OCX_PAGE_HEADER.MORE_ACTIONS' | translate"
            tooltipEvent="hover"
            tooltipPosition="top"
          ></button>
  </ng-template>
</ocx-search-header>`,
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
export const AdvancedSearchHeader = {
  render: advancedSearchHeader,
  args: {
    header: 'Advanced Search',
    manualBreadcrumbs: true,
  },
}