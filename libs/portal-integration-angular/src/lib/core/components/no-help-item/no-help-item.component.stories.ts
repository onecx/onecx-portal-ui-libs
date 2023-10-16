import { moduleMetadata, StoryFn, Meta } from '@storybook/angular'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { NoHelpItemComponent } from './no-help-item.component'

export default {
  title: 'NoHelpItemComponent',
  component: NoHelpItemComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        DynamicDialogRef,
        { provide: DynamicDialogConfig, useValue: { data: { helpArticleId: 'TEST_PAGE' } } },
      ],
    }),
  ],
} as Meta<NoHelpItemComponent>

const Template: StoryFn<NoHelpItemComponent> = (args: NoHelpItemComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,
  args: {},
}
