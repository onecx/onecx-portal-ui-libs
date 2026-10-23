import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { OcxFormFieldDirective } from './form-field.directive'

/** Validation errors that have a default translation in `OCX_FORM_FIELD.ERROR` */
const DEFAULT_ERROR_KEYS: Record<string, string> = {
  required: 'OCX_FORM_FIELD.ERROR.REQUIRED',
  email: 'OCX_FORM_FIELD.ERROR.EMAIL',
  minlength: 'OCX_FORM_FIELD.ERROR.MINLENGTH',
  maxlength: 'OCX_FORM_FIELD.ERROR.MAXLENGTH',
  min: 'OCX_FORM_FIELD.ERROR.MIN',
  max: 'OCX_FORM_FIELD.ERROR.MAX',
  pattern: 'OCX_FORM_FIELD.ERROR.PATTERN',
}
const FALLBACK_ERROR_KEY = 'OCX_FORM_FIELD.ERROR.INVALID'

/**
 * Shows the error text of a field next to it. The element is a polite live region that is always present,
 * so that the text is announced by screen readers when the error appears, and it carries the id that
 * {@link OcxFormFieldDirective} references with `aria-describedby`.
 *
 * `messages` maps validation error keys (e.g. `required`) to translation keys or texts. Errors without
 * an entry fall back to a default translation (`OCX_FORM_FIELD.ERROR.*`). Error values (e.g. `requiredLength`)
 * are passed as translation parameters.
 */
@Component({
  selector: 'ocx-form-field-error',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div class="ocx-form-field-error" [id]="field().errorId" aria-live="polite" aria-atomic="true">
    @if (message(); as m) {
      <span>{{ m.key | translate: m.params }}</span>
    }
  </div>`,
  styles: [
    `
      .ocx-form-field-error {
        color: var(--ocx-form-error-color, #b3261e);
      }
    `,
  ],
})
export class FormFieldErrorComponent {
  /** The field this error text belongs to, e.g. `#name="ocxFormField"` */
  field = input.required<OcxFormFieldDirective>()
  /** Maps validation error keys to translation keys or texts */
  messages = input<Record<string, string>>({})

  message(): { key: string; params: unknown } | null {
    const field = this.field()
    const errors = field.control?.errors
    if (!field.showError || !errors) {
      return null
    }
    const keys = Object.keys(errors)
    const configured = keys.find((k) => this.messages()[k])
    if (configured) {
      return { key: this.messages()[configured], params: errors[configured] }
    }
    const defaulted = keys.find((k) => DEFAULT_ERROR_KEYS[k])
    if (defaulted) {
      return { key: DEFAULT_ERROR_KEYS[defaulted], params: errors[defaulted] }
    }
    // e.g. error set by the server: { server: 'Name already exists' }
    const text = keys.map((k) => errors[k]).find((v) => typeof v === 'string')
    return { key: text ?? FALLBACK_ERROR_KEY, params: undefined }
  }
}
