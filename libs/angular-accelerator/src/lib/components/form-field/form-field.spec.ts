import { ChangeDetectionStrategy, Component, Directive, ViewChild, inject } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, FormControl, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { HttpErrorResponse } from '@angular/common/http'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HarnessLoader } from '@angular/cdk/testing'
import type * as AxeCore from 'axe-core'
import { Observable, catchError, map, of, throwError } from 'rxjs'
import {
  OcxFormErrorSummaryHarness,
  OcxFormFieldErrorHarness,
  OcxFormFieldHarness,
  provideTranslateTestingService,
} from '../../../../testing'
import { DialogButtonClicked, DialogState } from '../../services/portal-dialog.service'
import { FormErrorSummaryComponent, FormErrorSummaryItem } from './form-error-summary.component'
import { FormFieldErrorComponent } from './form-field-error.component'
import { OcxFormFieldDirective } from './form-field.directive'
import { OcxFormDirective } from './form.directive'

/**
 * The pattern documented in dev-docs: a dialog content component with required fields. Client validation focuses
 * the first invalid field, a failed save (HTTP 400) is reported in the dialog and keeps the dialog open.
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    OcxFormDirective,
    OcxFormFieldDirective,
    FormFieldErrorComponent,
    FormErrorSummaryComponent,
  ],
  template: `
    <form [formGroup]="form" ocxForm (ngSubmit)="submitted = submitted + 1">
      <ocx-form-error-summary [errors]="errors"></ocx-form-error-summary>
      <label for="name">Name</label>
      <input id="name" formControlName="name" ocxFormField #name="ocxFormField" />
      <ocx-form-field-error [field]="name" [messages]="{ required: 'Name is required' }"></ocx-form-field-error>

      <label for="email">Email</label>
      <input id="email" type="email" formControlName="email" ocxFormField #email="ocxFormField" />
      <ocx-form-field-error [field]="email" [messages]="{ required: 'Email is required' }"></ocx-form-field-error>

      <label for="note">Note</label>
      <input id="note" formControlName="note" aria-describedby="note-hint" ocxFormField #note="ocxFormField" />
      <span id="note-hint">Optional</span>
      <button type="submit">Save</button>
    </form>
  `,
})
class TestFormComponent implements DialogButtonClicked {
  form = inject(FormBuilder).group({
    name: ['', Validators.required],
    email: ['', [Validators.required]],
    note: [''],
  })
  submitted = 0
  errors: FormErrorSummaryItem[] = []
  save: (value: unknown) => Observable<unknown> = () => of({})

  @ViewChild(OcxFormDirective) ocxForm!: OcxFormDirective
  @ViewChild(FormErrorSummaryComponent) summary!: FormErrorSummaryComponent

  ocxDialogButtonClicked(state: DialogState<unknown>): Observable<boolean> | boolean {
    if (state.button !== 'primary') return true
    this.errors = []
    if (!this.ocxForm.validate()) return false
    return this.save(this.form.value).pipe(
      map(() => true),
      catchError((e: HttpErrorResponse) => {
        this.errors = [{ message: e.status === 400 ? 'Saving failed: the server rejected the input' : 'Saving failed' }]
        setTimeout(() => this.summary.focus())
        return of(false)
      })
    )
  }
}

/** Template-driven form, a field without id and a field outside of any form */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ReactiveFormsModule, OcxFormDirective, OcxFormFieldDirective, FormFieldErrorComponent],
  template: `
    <form ocxForm>
      @if (showFirst) {
        <label for="first">First</label>
        <input id="first" name="first" ngModel required ocxFormField />
      }
      <input name="title" aria-label="Title" [(ngModel)]="title" required ocxFormField #titleField="ocxFormField" />
      <ocx-form-field-error [field]="titleField"></ocx-form-field-error>
      <button type="submit">Save</button>
    </form>
    <label for="standalone">Standalone</label>
    <input id="standalone" [formControl]="standalone" ocxFormField />
  `,
})
class TemplateDrivenFormComponent {
  title = ''
  showFirst = false
  standalone = new FormControl('')
  @ViewChild(OcxFormDirective) ocxForm!: OcxFormDirective
}

/** ocxForm without [formGroup] or ngForm */
@Component({
  standalone: true,
  imports: [OcxFormDirective],
  template: `<form ocxForm></form>`,
})
class FormWithoutFormGroupComponent {}

/** An NgControl that has no control (yet) */
@Directive({
  selector: '[ocxTestNullControl]',
  standalone: true,
  providers: [{ provide: NgControl, useValue: { control: null } }],
})
class NullControlDirective {}

@Component({
  standalone: true,
  imports: [NullControlDirective, OcxFormFieldDirective, FormFieldErrorComponent],
  template: `
    <label for="nc">No control</label>
    <input id="nc" ocxTestNullControl ocxFormField #nc="ocxFormField" />
    <ocx-form-field-error [field]="nc"></ocx-form-field-error>
  `,
})
class NullControlComponent {}

describe('form field accessibility pattern', () => {
  let axe: typeof AxeCore
  let fixture: ComponentFixture<TestFormComponent>
  let component: TestFormComponent
  let loader: HarnessLoader

  beforeAll(() => {
    // axe-core observes DOM mutations when it is loaded; the test DOM has no complete MutationObserver
    if (typeof MutationObserver === 'undefined' || typeof MutationObserver.prototype.observe !== 'function') {
      Object.defineProperty(globalThis, 'MutationObserver', {
        configurable: true,
        writable: true,
        value: class {
          observe() {
            /* no-op */
          }
          disconnect() {
            /* no-op */
          }
          takeRecords() {
            return []
          }
        },
      })
    }
    axe = require('axe-core')
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormComponent],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()
    fixture = TestBed.createComponent(TestFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    loader = TestbedHarnessEnvironment.loader(fixture)
  })

  const submit = async () => {
    fixture.nativeElement.querySelector('button').click()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }

  it('exposes aria-required but no error before interaction', async () => {
    const name = await loader.getHarness(OcxFormFieldHarness.with({ id: 'name' }))
    const note = await loader.getHarness(OcxFormFieldHarness.with({ id: 'note' }))
    expect(await name.isRequired()).toBe(true)
    expect(await name.isInvalid()).toBe(false)
    expect(await name.getErrorText()).toBeNull()
    expect(await note.isRequired()).toBe(false)
  })

  it('shows an error per invalid field, linked with aria-describedby, and focuses the first invalid field', async () => {
    await submit()

    const name = await loader.getHarness(OcxFormFieldHarness.with({ id: 'name' }))
    const email = await loader.getHarness(OcxFormFieldHarness.with({ id: 'email' }))
    expect(await name.isInvalid()).toBe(true)
    expect(await name.getErrorText()).toBe('Name is required')
    expect(await email.isInvalid()).toBe(true)
    expect(await email.getErrorText()).toBe('Email is required')
    expect(await name.isFocused()).toBe(true)
    expect(component.submitted).toBe(1)

    const errors = await loader.getAllHarnesses(OcxFormFieldErrorHarness)
    expect(errors.length).toBe(2)
    expect(await errors[0].isLiveRegion()).toBe(true)
  })

  it('keeps an existing aria-describedby', async () => {
    const note = await loader.getHarness(OcxFormFieldHarness.with({ id: 'note' }))
    expect(await note.getDescription()).toBe('Optional')
    component.form.controls.note.setValidators(Validators.required)
    component.form.controls.note.updateValueAndValidity()
    await submit()
    expect(await note.isInvalid()).toBe(true)
    expect(await (await note.host()).getAttribute('aria-describedby')).toBe('note-hint note-error')
  })

  it('removes the error state when the field becomes valid', async () => {
    await submit()
    const name = await loader.getHarness(OcxFormFieldHarness.with({ id: 'name' }))
    await name.setValue('Jane')
    fixture.detectChanges()
    expect(await name.isInvalid()).toBe(false)
    expect(await name.getErrorText()).toBeNull()
    expect(await (await name.host()).getAttribute('aria-describedby')).toBeNull()
  })

  it('focuses the first invalid field in document order', async () => {
    component.form.controls.name.setValue('Jane')
    await submit()
    const email = await loader.getHarness(OcxFormFieldHarness.with({ id: 'email' }))
    expect(await email.isFocused()).toBe(true)
  })

  it('validate() returns true and does not touch focus for a valid form', async () => {
    component.form.setValue({ name: 'a', email: 'b', note: '' })
    expect(component.ocxForm.validate()).toBe(true)
    expect(component.ocxForm.focusFirstInvalid()).toBe(false)
  })

  it('exposes aria-required for a native required attribute', async () => {
    const note = await loader.getHarness(OcxFormFieldHarness.with({ id: 'note' }))
    expect(await note.isRequired()).toBe(false)
    fixture.nativeElement.querySelector('#note').setAttribute('required', '')
    fixture.detectChanges()
    expect(await note.isRequired()).toBe(true)
  })

  it('validate() returns true for a disabled form', () => {
    component.form.disable()
    expect(component.ocxForm.validate()).toBe(true)
  })

  describe('error messages', () => {
    const nameError = () =>
      fixture.debugElement.queryAll(By.directive(FormFieldErrorComponent))[0]
        .componentInstance as FormFieldErrorComponent
    const showNameErrors = (errors: Record<string, unknown>) => {
      const name = component.form.controls.name
      name.markAsTouched()
      name.setErrors(errors)
      fixture.detectChanges()
    }

    it('falls back to the default translation with the error values as parameters', () => {
      const name = component.form.controls.name
      name.setValidators(Validators.minLength(3))
      name.setValue('ab')
      name.markAsTouched()
      fixture.detectChanges()
      expect(nameError().message()).toEqual({
        key: 'OCX_FORM_FIELD.ERROR.MINLENGTH',
        params: { requiredLength: 3, actualLength: 2 },
      })
    })

    it('shows a string error value, e.g. set by the server', async () => {
      showNameErrors({ server: 'Name already exists' })
      expect(nameError().message()).toEqual({ key: 'Name already exists', params: undefined })
      const name = await loader.getHarness(OcxFormFieldHarness.with({ id: 'name' }))
      expect(await name.getErrorText()).toBe('Name already exists')
    })

    it('falls back to a generic message for unknown errors', () => {
      showNameErrors({ custom: true })
      expect(nameError().message()).toEqual({ key: 'OCX_FORM_FIELD.ERROR.INVALID', params: undefined })
    })
  })

  describe('as dialog content', () => {
    const click = (button: DialogState<unknown>['button'] = 'primary') =>
      component.ocxDialogButtonClicked({ button } as DialogState<unknown>)

    it('does not close and does not save while required fields are empty', async () => {
      const save = jest.fn(() => of({}))
      component.save = save
      expect(click()).toBe(false)
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()
      expect(save).not.toHaveBeenCalled()
      const name = await loader.getHarness(OcxFormFieldHarness.with({ id: 'name' }))
      expect(await name.isFocused()).toBe(true)
      expect(await name.getErrorText()).toBe('Name is required')
    })

    it('closes after a successful save', (done) => {
      component.form.setValue({ name: 'a', email: 'b', note: '' })
      ;(click() as Observable<boolean>).subscribe((close) => {
        expect(close).toBe(true)
        done()
      })
    })

    it('keeps the dialog open and the input on a 400 and reports the failure inside the dialog', async () => {
      component.form.setValue({ name: 'Jane', email: 'jane@example.com', note: 'keep me' })
      component.save = () => throwError(() => new HttpErrorResponse({ status: 400 }))

      const close = await new Promise((resolve) => (click() as Observable<boolean>).subscribe(resolve))
      fixture.detectChanges()
      await new Promise((r) => setTimeout(r))
      fixture.detectChanges()

      expect(close).toBe(false)
      expect(component.form.value).toEqual({ name: 'Jane', email: 'jane@example.com', note: 'keep me' })
      const summary = await loader.getHarness(OcxFormErrorSummaryHarness)
      expect(await summary.isAlert()).toBe(true)
      expect(await summary.getErrors()).toEqual(['Saving failed: the server rejected the input'])
      expect(await summary.isFocused()).toBe(true)
    })
  })

  describe('error summary', () => {
    it('moves focus to the invalid field when a linked error is clicked', async () => {
      component.errors = [{ message: 'Name is required', fieldId: 'name' }]
      fixture.detectChanges()
      const summary = await loader.getHarness(OcxFormErrorSummaryHarness)
      await summary.clickError('Name is required')
      const name = await loader.getHarness(OcxFormFieldHarness.with({ id: 'name' }))
      expect(await name.isFocused()).toBe(true)
    })

    it('lists errors without fieldId as text and ignores links to missing fields', async () => {
      component.errors = [{ message: 'Saving failed' }, { message: 'Removed field', fieldId: 'missing' }]
      fixture.detectChanges()
      const summary = await loader.getHarness(OcxFormErrorSummaryHarness)
      expect(await summary.getErrors()).toEqual(['Saving failed', 'Removed field'])
      const items = fixture.nativeElement.querySelectorAll('ocx-form-error-summary li')
      expect(items[0].querySelector('a')).toBeNull()
      expect(items[1].querySelector('a').getAttribute('href')).toBe('#missing')

      const event = new MouseEvent('click', { cancelable: true })
      items[1].querySelector('a').dispatchEvent(event)
      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe('axe', () => {
    const run = async () => {
      const result = await axe.run(fixture.nativeElement, {
        runOnly: ['label', 'aria-required-attr', 'aria-valid-attr-value'],
      })
      return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(', ')}`)
    }

    it('has no label / aria-required-attr violations before submit', async () => {
      expect(await run()).toEqual([])
    })

    it('has no label / aria-required-attr violations when errors are shown', async () => {
      await submit()
      expect(await run()).toEqual([])
    })
  })
})

describe('form field directives in other setups', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateDrivenFormComponent, FormWithoutFormGroupComponent, NullControlComponent],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()
  })

  it('throws when ocxForm is not used on a form with [formGroup] or ngForm', () => {
    expect(() => TestBed.createComponent(FormWithoutFormGroupComponent)).toThrow(
      'ocxForm can only be used on a form with [formGroup] or ngForm'
    )
  })

  it('supports template-driven forms, generates a missing id and works outside of a form', async () => {
    const fixture = TestBed.createComponent(TemplateDrivenFormComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    const loader = TestbedHarnessEnvironment.loader(fixture)

    const title = await loader.getHarness(OcxFormFieldHarness.with({ selector: '[name="title"]' }))
    expect(await title.getId()).toMatch(/^ocx-form-field-\d+$/)
    expect(await title.isRequired()).toBe(true)

    fixture.nativeElement.querySelector('button').click()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    expect(await title.isInvalid()).toBe(true)
    expect(await title.getErrorText()).toBe('OCX_FORM_FIELD.ERROR.REQUIRED')
    expect(await title.isFocused()).toBe(true)

    const standalone = await loader.getHarness(OcxFormFieldHarness.with({ id: 'standalone' }))
    expect(await standalone.isRequired()).toBe(false)
    fixture.componentInstance.standalone.setValidators(Validators.required)
    fixture.componentInstance.standalone.updateValueAndValidity()
    fixture.detectChanges()
    expect(await standalone.isRequired()).toBe(true)
    expect(await standalone.isInvalid()).toBe(false)
    fixture.componentInstance.standalone.markAsTouched()
    fixture.detectChanges()
    expect(await standalone.isInvalid()).toBe(true)
  })

  it('focuses the first invalid field in document order also if it was added later', async () => {
    const fixture = TestBed.createComponent(TemplateDrivenFormComponent)
    fixture.detectChanges()
    fixture.componentInstance.showFirst = true
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    fixture.nativeElement.querySelector('button').click()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    expect(fixture.nativeElement.ownerDocument.activeElement.id).toBe('first')
  })

  it('exposes no state while the NgControl has no control', async () => {
    const fixture = TestBed.createComponent(NullControlComponent)
    fixture.detectChanges()
    const loader = TestbedHarnessEnvironment.loader(fixture)
    const field = await loader.getHarness(OcxFormFieldHarness.with({ id: 'nc' }))
    expect(await field.isRequired()).toBe(false)
    expect(await field.isInvalid()).toBe(false)
    expect(await field.getErrorText()).toBeNull()
    const directive = fixture.debugElement
      .query(By.directive(OcxFormFieldDirective))
      .injector.get(OcxFormFieldDirective)
    expect(directive.invalid).toBe(false)
    const error = await loader.getHarness(OcxFormFieldErrorHarness)
    expect(await error.hasError()).toBe(false)
  })
})
