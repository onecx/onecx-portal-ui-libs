import { OcxContentDirective } from '../../directives/ocx-content.directive';
import { OcxContentComponent } from './ocx-content.component';
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular'

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

const Template: StoryFn<OcxContentComponent> = (args: OcxContentComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,
  args: {},
}
