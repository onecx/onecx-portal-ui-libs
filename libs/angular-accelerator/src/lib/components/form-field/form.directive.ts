import { Directive, inject, Injector, afterNextRender } from '@angular/core'
import { FormGroupDirective, NgForm } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import type { OcxFormFieldDirective } from './form-field.directive'

/**
 * Form-level behaviour for accessible validation. Put it on a `<form>` that uses `[formGroup]` or `ngForm`.
 *
 * - On submit of an invalid form, all controls are marked as touched (so each invalid
 *   {@link OcxFormFieldDirective} shows its error) and focus moves to the first invalid field.
 * - {@link validate} offers the same behaviour for forms that are not submitted by a submit button,
 *   e.g. forms inside a dialog whose buttons are rendered by the dialog footer.
 *
 * @example
 * ```html
 * <form [formGroup]="form" ocxForm (ngSubmit)="save()">
 *   <label for="name">Name</label>
 *   <input id="name" formControlName="name" ocxFormField #name="ocxFormField" />
 *   <ocx-form-field-error [field]="name" [messages]="{ required: 'MY.NAME_REQUIRED' }"></ocx-form-field-error>
 * </form>
 * ```
 */
@Directive({
  selector: 'form[ocxForm]',
  exportAs: 'ocxForm',
})
export class OcxFormDirective {
  private readonly injector = inject(Injector)
  private readonly form =
    inject(FormGroupDirective, { optional: true, self: true }) ?? inject(NgForm, { optional: true, self: true })

  private readonly fields = new Set<OcxFormFieldDirective>()

  constructor() {
    if (!this.form) {
      throw new Error('ocxForm can only be used on a form with [formGroup] or ngForm')
    }
    this.form.ngSubmit.pipe(takeUntilDestroyed()).subscribe(() => {
      this.validate()
    })
  }

  /** @internal Called by {@link OcxFormFieldDirective} */
  registerField(field: OcxFormFieldDirective): void {
    this.fields.add(field)
  }

  /** @internal Called by {@link OcxFormFieldDirective} */
  unregisterField(field: OcxFormFieldDirective): void {
    this.fields.delete(field)
  }

  /**
   * Marks every control as touched so that all errors become visible and moves focus to the first invalid field.
   * @returns true if the form is valid
   */
  validate(): boolean {
    const control = this.form?.control
    if (!control || control.valid || control.disabled) {
      return true
    }
    control.markAllAsTouched()
    // Focus after the next render, so aria-invalid / aria-describedby are already present when the field is announced
    afterNextRender(() => this.focusFirstInvalid(), { injector: this.injector })
    return false
  }

  /** Focuses the first (in document order) field that is invalid. */
  focusFirstInvalid(): boolean {
    const invalid = [...this.fields]
      .filter((f) => f.invalid)
      .sort((a, b) => (a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    if (invalid.length === 0) {
      return false
    }
    invalid[0].element.focus()
    return true
  }
}
