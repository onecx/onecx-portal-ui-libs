import { OcxContentContainerDirective } from '../../directives/ocx-content-container.directive'
import { OcxContentDirective } from '../../directives/ocx-content.directive'
import { OcxContentComponent } from '../ocx-content/ocx-content.component'
import { OcxContentContainerComponent } from './ocx-content-container.component'
import { moduleMetadata, Meta } from '@storybook/angular'

export default {
  title: 'OcxContentContainerComponent',
  component: OcxContentContainerComponent,
  argTypes: {
    layout: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
    breakpoint: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    }
  },
  decorators: [
    moduleMetadata({
      declarations: [OcxContentContainerDirective, OcxContentComponent, OcxContentDirective],
    }),
  ],
} as Meta<OcxContentContainerComponent>

export const Basic = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}">
            <p>Content 1 nested in ocx-content-container</p>
            <p>Content 2 nested in ocx-content-container</p>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const WithNestedOCXContent = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}">
            <ocx-content class="w-full sm:w-8">
              <p>Content inside of ocx-content without title</p>
            </ocx-content>
            <ocx-content title="My Title" class="w-full sm:w-4">
              <p>Content inside of ocx-content with title</p>
            </ocx-content>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const WithNestedOCXContentContainer = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}">
          <ocx-content-container>
            <p>Horizontal content in nested ocx-content-container 1</p>
            <p>Horizontal content in nested ocx-content-container 1</p>
          </ocx-content-container>
          <ocx-content-container layout="vertical">
            <p>Vertical content in nested ocx-content-container 1</p>
            <p>Vertical content in nested ocx-content-container 1</p>
          </ocx-content-container>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}

export const DirectiveOnly = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <div ocxContentContainer layout="${args.layout}" breakpoint="${args.breakpoint}">
            <p>Content 1 nested inside of a div with the ocxContentContainer directive applied to it.</p>
            <p>Content 2 nested inside of a div with the ocxContentContainer directive applied to it.</p>
        </div>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md'
  },
}
