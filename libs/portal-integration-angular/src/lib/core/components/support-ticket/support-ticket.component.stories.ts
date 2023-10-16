import { InputTextareaModule } from 'primeng/inputtextarea'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { SupportTicketComponent } from './support-ticket.component'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { InputTextModule } from 'primeng/inputtext'

export default {
  title: 'SupportTicketComponent',
  component: SupportTicketComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, InputTextareaModule],
    }),
  ],
} as Meta<SupportTicketComponent>

const Template: StoryFn<SupportTicketComponent> = (args: SupportTicketComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    displayDialog: true,
  },
}
