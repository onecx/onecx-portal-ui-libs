import { Component, importProvidersFrom } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { FormErrorSummaryComponent, FormErrorSummaryItem } from './form-error-summary.component'
import { FormFieldErrorComponent } from './form-field-error.component'
import { OcxFormFieldDirective } from './form-field.directive'
import { OcxFormDirective } from './form.directive'

@Component({
  selector: 'ocx-form-field-story',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    OcxFormDirective,
    OcxFormFieldDirective,
    FormFieldErrorComponent,
    FormErrorSummaryComponent,
  ],
  template: `
    <form [formGroup]="form" ocxForm (ngSubmit)="onSubmit()" style="display: grid; gap: 0.5rem; max-width: 24rem">
      <ocx-form-error-summary [errors]="errors"></ocx-form-error-summary>

      <label for="story-name">Name *</label>
      <input id="story-name" formControlName="name" ocxFormField #name="ocxFormField" />
      <ocx-form-field-error [field]="name" [messages]="{ required: 'Please enter a name.' }"></ocx-form-field-error>

      <label for="story-email">Email *</label>
      <input id="story-email" type="email" formControlName="email" ocxFormField #email="ocxFormField" />
      <ocx-form-field-error
        [field]="email"
        [messages]="{ required: 'Please enter an email address.' }"
      ></ocx-form-field-error>

      <button type="submit">Save</button>
    </form>
  `,
})
class FormFieldStoryComponent {
  form = new FormBuilder().group({
    name: ['', Validators.required],
    email: ['', Validators.required],
  })
  errors: FormErrorSummaryItem[] = []

  onSubmit() {
    // Replace with the real save. A failed save (e.g. HTTP 400) is reported inside the form, the input is kept.
    this.errors = [{ message: 'Saving failed: the server rejected the input.' }]
  }
}

export default {
  title: 'Accessibility/FormField',
  component: FormFieldStoryComponent,
  decorators: [
    applicationConfig({ providers: [importProvidersFrom(BrowserModule)] }),
    moduleMetadata({ imports: [StorybookTranslateModule] }),
  ],
} as Meta<FormFieldStoryComponent>

/**
 * Submit the empty form: each invalid field shows its error text (announced by screen readers), exposes
 * `aria-required`, `aria-invalid` and `aria-describedby`, and focus moves to the first invalid field.
 */
export const RequiredFields: StoryObj<FormFieldStoryComponent> = {}
