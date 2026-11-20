import { ChangeDetectorRef, DestroyRef, Directive, ElementRef, OnDestroy, AfterViewInit, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AbstractControl, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms'
import { OcxFormDirective } from './form.directive'

let nextFieldId = 0
/** Control with an empty value, used to probe whether the validators of a control include `required` */
const EMPTY_CONTROL = new FormControl(null)

/**
 * Exposes the validation state of an Angular form control programmatically on the input element:
 *
 * - `aria-required="true"` when the control has a required validator (or the `required` attribute)
 * - `aria-invalid="true"` once the control is invalid and was touched (or the form was submitted)
 * - `aria-describedby` points to the error element of the matching `<ocx-form-field-error>` while an error is shown
 *   (an `aria-describedby` already set on the element is preserved)
 *
 * The visible `<label for>` association stays the responsibility of the template: every field needs a label.
 *
 * @example
 * ```html
 * <label for="name">Name</label>
 * <input id="name" formControlName="name" ocxFormField #name="ocxFormField" />
 * <ocx-form-field-error [field]="name" [messages]="{ required: 'MY.NAME_REQUIRED' }"></ocx-form-field-error>
 * ```
 */
@Directive({
  selector: '[ocxFormField]',
  exportAs: 'ocxFormField',
  host: {
    '[attr.aria-required]': 'required ? "true" : null',
    '[attr.aria-invalid]': 'showError ? "true" : null',
    '[attr.aria-describedby]': 'describedBy',
  },
})
export class OcxFormFieldDirective implements AfterViewInit, OnDestroy {
  private readonly ngControl = inject(NgControl, { self: true })
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly destroyRef = inject(DestroyRef)
  private readonly parentForm = inject(OcxFormDirective, { optional: true })
  private readonly submittable = inject(FormGroupDirective, { optional: true }) ?? inject(NgForm, { optional: true })
  private readonly staticDescribedBy = this.host.nativeElement.getAttribute('aria-describedby')

  /** Id of the input element, generated if the element has none. */
  readonly fieldId: string
  /** Id of the element holding the error text, to be rendered by `<ocx-form-field-error>`. */
  readonly errorId: string

  constructor() {
    if (!this.host.nativeElement.id) {
      this.host.nativeElement.id = `ocx-form-field-${nextFieldId++}`
    }
    this.fieldId = this.host.nativeElement.id
    this.errorId = `${this.fieldId}-error`
    this.parentForm?.registerField(this)
  }

  ngAfterViewInit(): void {
    // The control is only available after the NgControl has been set up; react to touched/status changes
    this.ngControl.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cdr.markForCheck())
    this.submittable?.ngSubmit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cdr.markForCheck())
  }

  ngOnDestroy(): void {
    this.parentForm?.unregisterField(this)
  }

  get element(): HTMLElement {
    return this.host.nativeElement
  }

  get control(): AbstractControl | null {
    return this.ngControl.control
  }

  get required(): boolean {
    if (this.host.nativeElement.hasAttribute('required')) {
      return true
    }
    // Probe the validators with an empty value: works for Validators.required as well as the `required` directive
    return !!this.ngControl.control?.validator?.(EMPTY_CONTROL)?.['required']
  }

  /** The control is invalid. Independent of whether the error is already shown. */
  get invalid(): boolean {
    return !!this.control?.invalid
  }

  /** The error is shown once the control was touched or the form was submitted. */
  get showError(): boolean {
    const control = this.control
    return !!control && control.invalid && (control.touched || !!this.submittable?.submitted)
  }

  get describedBy(): string | null {
    const ids = [this.staticDescribedBy, this.showError ? this.errorId : null].filter(Boolean)
    return ids.length ? ids.join(' ') : null
  }
}
