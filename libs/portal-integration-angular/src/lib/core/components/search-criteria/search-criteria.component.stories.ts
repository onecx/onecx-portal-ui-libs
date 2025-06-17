import { APP_BASE_HREF } from '@angular/common'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { importProvidersFrom } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchModule } from 'primeng/inputswitch'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { PageHeaderComponent } from '@onecx/angular-accelerator'
import { ConfigurationService, APP_CONFIG } from '@onecx/angular-integration-interface'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { CriteriaTemplateComponent } from './criteria-template/criteria-template.component'
import { SearchCriteriaComponent } from './search-criteria.component'
import { StorybookThemeModule } from '../../storybook-theme.module'

export default {
  title: 'SearchCriteriaComponent',
  component: SearchCriteriaComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        provideHttpClient(withInterceptorsFromDi()),
        importProvidersFrom(StorybookThemeModule),
        provideHttpClientTesting(),
        ConfigurationService,
        { provide: APP_CONFIG, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }),
    moduleMetadata({
      declarations: [SearchCriteriaComponent, PageHeaderComponent, CriteriaTemplateComponent],
      imports: [
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        FormsModule,
        DropdownModule,
        ButtonModule,
        MenuModule,
        BreadcrumbModule,
        SkeletonModule,
        StorybookTranslateModule,
      ],
      providers: [],
    }),
  ],
} as Meta<SearchCriteriaComponent>

const Template: StoryFn<SearchCriteriaComponent> = (args) => ({
  props: args,
  template: `
  <ocx-search-criteria [disableAdvancedToggle]="disableAdvancedToggle" [showBreadcrumbs]="showBreadcrumbs" [header]="header" [subheader]="subheader" [actions]="actions"></ocx-search-criteria>
  `,
})

const TemplateWithProjection: StoryFn<SearchCriteriaComponent> = (args) => ({
  props: args,
  template: `
  <ocx-search-criteria [disableAdvancedToggle]="disableAdvancedToggle" [showBreadcrumbs]="showBreadcrumbs" [header]="header" [subheader]="subheader" [actions]="actions">
    <div simpleCriteria style="display:flex; flex-wrap:wrap;" class="demo-border">
      <div *ngFor="let i of [1,2,3]" style="padding: 0.5rem;">
        <span class="p-float-label">
          <input id="name" pInputText type="text" />
          <label for="name">Name</label>
        </span>
      </div>
    </div>
    <div advancedCriteria style="display: flex; flex-wrap: wrap" class="demo-border">
      <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]" style="padding: 0.5rem">
        <span class="p-float-label">
          <input id="name" pInputText type="text" />
          <label for="name">Name</label>
        </span>
      </div>
    </div>
  </ocx-search-criteria>`,
})

const TemplateWithProjectionAndExtraToolbar: StoryFn<SearchCriteriaComponent> = (args) => ({
  props: args,
  template: `
  <ocx-search-criteria [disableAdvancedToggle]="disableAdvancedToggle" [showBreadcrumbs]="showBreadcrumbs" [header]="header" [subheader]="subheader" [actions]="actions">
    <div toolbarItems class="flex gap-1">
      <button pButton icon="pi pi-cog" class="action-button"></button>
      <button
        pButton
        label="Create new"
        pTooltip="Create New Object"
        tooltipPosition="top"
        icon="pi pi-plus"
      ></button>
    </div>
    <div simpleCriteria style="display:flex; flex-wrap:wrap;" class="demo-border">
      <div *ngFor="let i of [1,2,3]" style="padding: 0.5rem;">
        <span class="p-float-label">
          <input id="name" pInputText type="text" />
          <label for="name">Name</label>
        </span>
      </div>
    </div>
    <div advancedCriteria style="display: flex; flex-wrap: wrap" class="demo-border">
      <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]" style="padding: 0.5rem">
        <span class="p-float-label">
          <input id="name" pInputText type="text" />
          <label for="name">Name</label>
        </span>
      </div>
    </div>
  </ocx-search-criteria>`,
})

export const Simple = {
  render: Template,

  args: {
    header: 'My search',
    subheader: 'Optional subheader',
    disableAdvancedToggle: true,
  },
}

export const WithAdvancedCriteria = {
  render: TemplateWithProjection,

  args: {
    header: 'My search',
    subheader: 'Switch to advanced criteria if you need more filters',
    disableAdvancedToggle: false,
  },
}

export const WithBreadcrumbs = {
  render: TemplateWithProjection,

  args: {
    header: 'My search',
    subheader: 'Optional subheader',
    showBreadcrumbs: true,
    disableAdvancedToggle: true,
  },
}

export const WithExtraToolbarItems = {
  render: TemplateWithProjectionAndExtraToolbar,

  args: {
    header: 'My search',
    subheader: 'Optional subheader',
    showBreadcrumbs: true,
    disableAdvancedToggle: true,
  },
}
