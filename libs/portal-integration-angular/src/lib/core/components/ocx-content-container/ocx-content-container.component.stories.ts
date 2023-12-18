import { OcxContentContainerDirective } from '../../directives/ocx-content-container.directive';
import { OcxContentContainerComponent } from './ocx-content-container.component';
import { moduleMetadata, Meta } from '@storybook/angular'

export default {
  title: 'OcxContentContainerComponent',
  component: OcxContentContainerComponent,
  argTypes: {
    layout: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
},
  decorators: [
    moduleMetadata({
      declarations: [
        OcxContentContainerDirective,
      ],
    }),
  ],
} as Meta<OcxContentContainerComponent>

export const Primary = {
  render: (args: OcxContentContainerComponent) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-content-container layout="${args.layout}">
            <p>Content 1 nested in ocx-content-container</p>
            <p>Content 2 nested in ocx-content-container</p>
        </ocx-content-container>
    `,
  }),
  args: {
    layout: 'horizontal'
  },
}
