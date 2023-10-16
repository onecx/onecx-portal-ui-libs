import { MessageService } from 'primeng/api'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { HelpItemEditorComponent } from './help-item-editor.component'
import { DialogModule } from 'primeng/dialog'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'

export default {
  title: 'HelpItemEditorComponent',
  component: HelpItemEditorComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
      providers: [MessageService],
    }),
  ],
} as Meta<HelpItemEditorComponent>

const Template: StoryFn<HelpItemEditorComponent> = (args: HelpItemEditorComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    displayDialog: true,
  },
}
