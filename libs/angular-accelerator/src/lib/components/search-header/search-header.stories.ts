import { importProvidersFrom } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { MenuModule } from 'primeng/menu'
import { SkeletonModule } from 'primeng/skeleton'
import { DynamicPipe } from '../../pipes/dynamic.pipe'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { PageHeaderComponent } from '../page-header/page-header.component'
import { SearchConfigComponent } from '../search-config/search-config.component'
import { StorybookBreadcrumbModule } from './../../storybook-breadcrumb.module'
import { SearchHeaderComponent } from './search-header.component'

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
          <div class="flex flex-wrap gap-3">
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
      },
  }