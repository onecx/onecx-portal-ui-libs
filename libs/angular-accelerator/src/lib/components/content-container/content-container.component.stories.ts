import { OcxContentContainerDirective } from '../../directives/content-container.directive'
import { OcxContentDirective } from '../../directives/content.directive'
import { OcxContentComponent } from '../content/content.component'
import { OcxContentContainerComponent } from './content-container.component'
import { moduleMetadata, Meta } from '@storybook/angular'

export default {
  title: 'Components/ContentContainerComponent',
  component: OcxContentContainerComponent,
  argTypes: {
    layout: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
    breakpoint: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
    styleClass: {
      control: { type: 'text' },
    },
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
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}" styleClass="${args.styleClass}">
            <p>Content 1 nested in ocx-content-container</p>
            <p>Content 2 nested in ocx-content-container</p>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md',
    styleClass: '',
  },
}

export const WithNestedOCXContent = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}" styleClass="${args.styleClass}">
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
    breakpoint: 'md',
    styleClass: ''
  },
}

export const WithNestedOCXContentContainer = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}" styleClass="${args.styleClass}">
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
    breakpoint: 'md',
    styleClass: ''
  },
}

export const DirectiveOnly = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <div ocxContentContainer layout="${args.layout}" breakpoint="${args.breakpoint}" styleClass="${args.styleClass}">
            <p>Content 1 nested inside of a div with the ocxContentContainer directive applied to it.</p>
            <p>Content 2 nested inside of a div with the ocxContentContainer directive applied to it.</p>
        </div>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md',
    styleClass: ''
  },
}

export const WithCustomStyleClasses = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}" breakpoint="${args.breakpoint}" styleClass="${args.styleClass}">
            <p>Content 1 inside of ocx-content-container with styleClass</p>
            <p>Content 2 inside of ocx-content-container with styleClass</p>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal',
    breakpoint: 'md',
    styleClass: 'text-blue-800',
  },
}