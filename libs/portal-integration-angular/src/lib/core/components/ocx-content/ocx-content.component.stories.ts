import { OcxContentDirective } from '../../directives/ocx-content.directive';
import { OcxContentComponent } from './ocx-content.component';
import { moduleMetadata, Meta } from '@storybook/angular'

export default {
  title: 'OcxContentComponent',
  component: OcxContentComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        OcxContentDirective,
      ]
    }),
  ],
} as Meta<OcxContentComponent>

export const WithTitle = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content title="${args.title}">
            <p>Content inside of ocx-content with title</p>
        </ocx-content>
    `,
  }),
  args: {
    title: 'My Title'
  },
}

export const WithoutTitle = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content>
            <p>Content inside of ocx-content without title</p>
        </ocx-content>
    `,
  }),
}

export const DirectiveOnly = {
  render: (args: OcxContentComponent) => ({
    props: {
      ...args,
    },
    template: `
        <div ocxContent="${args.title}">
            <p>Content inside of a div with the ocxContent directive applied to it.</p>
        </div>
    `,
  }),
  args: {
    title: 'My Title'
  },
}
