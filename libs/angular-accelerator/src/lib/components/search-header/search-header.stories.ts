import { importProvidersFrom, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { Meta, StoryFn, applicationConfig, argsToTemplate, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { PageHeaderComponent, Action } from '../page-header/page-header.component'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { SearchHeaderComponent } from './search-header.component'
import { provideHttpClient } from '@angular/common/http'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { TooltipModule } from 'primeng/tooltip'
import { FloatLabelModule } from 'primeng/floatlabel'
import { action } from 'storybook/actions'
import { TagModule } from 'primeng/tag'
import { provideConfigurationServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AdvancedDirective } from '../../directives/advanced.directive'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'

export default {
  title: 'Components/SearchHeaderComponent',
  component: SearchHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        provideConfigurationServiceMock(),
        provideUserServiceMock(),
        provideHttpClient(),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [SearchHeaderComponent, DynamicPipe, PageHeaderComponent, AdvancedDirective],
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
        TagModule,
        OcxTooltipDirective,
      ],
    }),
  ],
} as Meta<SearchHeaderComponent>

const defaultComponentArgs = {
  header: 'My title',
}

const defaultActionsArgs = {
  resetted: {
    observed: () => true,
    emit: action('resetted'),
  },
  searched: action('searched'),
  componentStateChanged: action('componentStateChanged'),
}

export const Basic = {
  render: (args: any) => ({
    props: {
      ...args,
      ...defaultActionsArgs,
    },
    template: `
      <ocx-search-header ${argsToTemplate(args)} (resetted)="resetted($event)" (searched)="searched($event)" (componentStateChanged)="componentStateChanged($event)">
      </ocx-search-header>
    `,
  }),
  args: {
    ...defaultComponentArgs,
  },
}

export const WithCustomTemplates = {
  render: (args: any) => ({
    props: {
      ...args,
      ...defaultActionsArgs,
    },
    template: `
      <ocx-search-header ${argsToTemplate(args)} (resetted)="resetted($event)" (searched)="searched($event)" (componentStateChanged)="componentStateChanged($event)">
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
  }),
  args: {
    ...defaultComponentArgs,
  },
}

export const WithViewMode = {
  render: (args: any) => ({
    props: {
      ...args,
      ...defaultActionsArgs,
    },
    template: `
      <ocx-search-header ${argsToTemplate(args)} (resetted)="resetted($event)" (searched)="searched($event)" (componentStateChanged)="componentStateChanged($event)">
       <form>
          <div class="flex flex-wrap gap-3">
            <p-floatlabel variant="on">
                <input
                    id="basic"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [ocxTooltip]="'basic'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="basic" style="white-space: nowrap">
                    basic
                </label>
            </p-floatlabel>
            <p-floatlabel variant="on" *ocxAdvanced>
                <input
                    id="advanced"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [ocxTooltip]="'advanced'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="advanced" style="white-space: nowrap">
                    advanced
                </label>
            </p-floatlabel>
          </div>
        </form>
      </ocx-search-header>
    `,
  }),
  args: {
    ...defaultComponentArgs,
    viewMode: 'basic',
  },
}

const SearchNoResultsTemplate: StoryFn<any> = (args) => {
  const loadingSignal = signal(false)
  const searchResultsCountSignal = signal<number | null>(24)

  const applyLoadedWithResults = () => {
    loadingSignal.set(false)
    searchResultsCountSignal.set(24)
    action('state changed: loaded with results')()
  }

  const applyLoadedNoResults = () => {
    loadingSignal.set(false)
    searchResultsCountSignal.set(0)
    action('state changed: loaded with no results')()
  }

  const applyLoading = () => {
    loadingSignal.set(true)
    searchResultsCountSignal.set(null)
    action('state changed: loading')()
  }

  const stateActions: Action[] = [
    {
      id: 'show-loading',
      label: 'Set Loading',
      show: 'always',
      actionCallback: applyLoading,
    },
    {
      id: 'show-results',
      label: 'Set Results Found',
      show: 'always',
      actionCallback: applyLoadedWithResults,
    },
    {
      id: 'show-no-results',
      label: 'Set No Results',
      show: 'always',
      actionCallback: applyLoadedNoResults,
    },
  ]

  const onSearched = () => {
    applyLoading()
    setTimeout(() => {
      applyLoadedWithResults()
      setTimeout(() => {
        applyLoadedNoResults()
      }, 2000)
    }, 2000)
  }

  return {
    props: {
      ...args,
      loading: loadingSignal,
      searchResultsCount: searchResultsCountSignal,
      actions: stateActions,
      applyLoadedWithResults,
      applyLoadedNoResults,
      applyLoading,
      onSearched,
    },
    template: `
      <div class="p-4 surface-ground min-h-screen">
        <ocx-search-header 
          [header]="header"
          [loading]="loading()"
          [searchResultsCount]="searchResultsCount()"
          [searchButtonDisabled]="loading()"
          [actions]="actions"
          (resetted)="resetted"
          (searched)="onSearched()"
        >
          <form>
            <div class="flex flex-wrap gap-3 p-3">
              <p-floatlabel variant="on">
                <input
                  id="searchInput"
                  pInputText
                  type="text"
                  class="w-18rem"
                  placeholder="Enter search term"
                />
                <label for="searchInput">Search Term</label>
              </p-floatlabel>
            </div>
          </form>
        </ocx-search-header>
        <div class="mb-4 p-4 surface-card border-round shadow-1">
          <div class="mb-3 flex gap-2">
            <p-button label="Loading" (onClick)="applyLoading()"></p-button>
            <p-button label="Results Found" (onClick)="applyLoadedWithResults()"></p-button>
            <p-button label="No Results" (onClick)="applyLoadedNoResults()"></p-button>
          </div>
          <div class="mb-3">
            <strong>State:</strong>
            <p-tag [value]="loading() ? 'Loading' : (searchResultsCount() && searchResultsCount() > 0 ? 'Results Found' : 'No Results')" [severity]="loading() ? 'warning' : (searchResultsCount() && searchResultsCount() > 0 ? 'success' : 'danger')" class="ml-2"></p-tag>
            <span class="ml-3">Count: {{ searchResultsCount() ?? '-' }}</span>
          </div>
          <p class="text-sm text-600">Use buttons to switch among Loading, Results Found, and No Results states.</p>
        </div>
      </div>
    `,
  }
}

export const WithSearchNoResults = {
  render: SearchNoResultsTemplate,
  argTypes: {
    searched: { action: 'searched' },
    resetted: { action: 'resetted' },
    componentStateChanged: { action: 'componentStateChanged' },
  },
  args: {
    header: 'Product Search',
  },
}
