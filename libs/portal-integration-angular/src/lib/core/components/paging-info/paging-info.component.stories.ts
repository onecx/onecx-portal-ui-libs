import { moduleMetadata, StoryFn, Meta } from '@storybook/angular'
import { PagingInfoComponent } from './paging-info.component'

export default {
  title: 'PagingInfoComponent',
  component: PagingInfoComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PagingInfoComponent>

const Template: StoryFn<PagingInfoComponent> = (args: PagingInfoComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    resultsCount: 0,
  },
}
