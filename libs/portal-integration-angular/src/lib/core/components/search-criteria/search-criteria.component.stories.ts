import { InputSwitchModule } from 'primeng/inputswitch'
import { ButtonModule } from 'primeng/button'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { SearchCriteriaComponent } from './search-criteria.component'
import { CriteriaTemplateComponent } from './criteria-template/criteria-template.component'
import { FormsModule } from '@angular/forms'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { TranslateModule } from '@ngx-translate/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { APP_CONFIG } from '../../../api/injection-tokens'
import { APP_BASE_HREF } from '@angular/common'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { DropdownModule } from 'primeng/dropdown'
import { ConfigurationService } from '../../../services/configuration.service'
import { HttpClientModule } from '@angular/common/http'
import { importProvidersFrom } from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'

export default {
  title: 'SearchCriteriaComponent',
  component: SearchCriteriaComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
        importProvidersFrom(MockAuthModule),
        importProvidersFrom(HttpClientModule),
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
      ],
      providers: [],
    }),
  ],
} as Meta<SearchCriteriaComponent>

const Template: StoryFn<SearchCriteriaComponent> = (args: SearchCriteriaComponent) => ({
  props: args,
  template: `
  <ocx-search-criteria [disableAdvancedToggle]="disableAdvancedToggle" [showBreadcrumbs]="showBreadcrumbs" [header]="header" [subheader]="subheader" [actions]="actions"></ocx-search-criteria>
  `,
})

const TemplateWithProjection: StoryFn<SearchCriteriaComponent> = (args: SearchCriteriaComponent) => ({
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

const TemplateWithProjectionAndExtraToolbar: StoryFn<SearchCriteriaComponent> = (args: SearchCriteriaComponent) => ({
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

export const Basic = {
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
