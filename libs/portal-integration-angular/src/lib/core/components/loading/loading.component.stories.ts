import { moduleMetadata, StoryFn, Meta } from '@storybook/angular'
import { LoadingComponent } from './loading.component'

export default {
  title: 'LoadingComponent',
  component: LoadingComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<LoadingComponent>

const Template: StoryFn<LoadingComponent> = (args: LoadingComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,
  args: {},
}
