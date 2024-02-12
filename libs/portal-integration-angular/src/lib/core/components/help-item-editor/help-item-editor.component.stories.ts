import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { HelpItemEditorComponent } from './help-item-editor.component'
import { DialogModule } from 'primeng/dialog'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { TranslateModule } from '@ngx-translate/core'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppStateService } from '../../../services/app-state.service'

export default {
  title: 'HelpItemEditorComponent',
  component: HelpItemEditorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule),
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(TranslateModule.forRoot({})),
        AppStateService,
      ],
    }),
    moduleMetadata({
      imports: [FormsModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
      providers: [],
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
