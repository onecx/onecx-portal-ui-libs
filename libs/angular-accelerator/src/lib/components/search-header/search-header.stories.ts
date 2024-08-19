import { DatePipe } from '@angular/common'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { action } from '@storybook/addon-actions'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { PrimeIcons } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { AngularAcceleratorModule } from './../../angular-accelerator.module'
import { SearchHeaderComponent } from './search-header.component'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { SearchConfigComponent } from '../search-config/search-config.component'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'

export default {
  title: 'SearchHeaderComponent',
  component: SearchHeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
      ],
    }),
    moduleMetadata({
      declarations: [SearchHeaderComponent, DynamicPipe, PageHeaderComponent, SearchConfigComponent],
      imports: [
        MenuModule,
        InputTextModule,
        BreadcrumbModule,
        ButtonModule,
        DropdownModule,
        ReactiveFormsModule,
        SkeletonModule,
        StorybookTranslateModule,
        StorybookBreadcrumbModule.init([
          { label: 'Level 1', routerLink: ['/something'] },
          { label: 'Level 2', url: '/' },
        ]),
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
          <div class="flex flex-wrap gap-4 row-gap-3 md:px-2">
            <span class="p-float-label">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [pTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </span>
            <span class="p-float-label">
                <input
                    id="name"
                    pInputText
                    type="text"
                    class="w-18rem"
                    [pTooltip]="'Name'"
                    tooltipPosition="top"
                    tooltipEvent="hover"
                />
                <label for="name" style="white-space: nowrap">
                    Name
                </label>
            </span>
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
        resetted: ($event: any) => console.log($event),
      },
  }