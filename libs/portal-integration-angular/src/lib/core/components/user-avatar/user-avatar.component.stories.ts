import { moduleMetadata, StoryFn, Meta } from '@storybook/angular'
import { UserAvatarComponent } from './user-avatar.component'

export default {
  title: 'UserAvatarComponent',
  component: UserAvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<UserAvatarComponent>

const Template: StoryFn<UserAvatarComponent> = (args: UserAvatarComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,
  args: {},
}
