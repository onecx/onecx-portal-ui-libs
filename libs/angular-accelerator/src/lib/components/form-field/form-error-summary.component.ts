import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'

export interface FormErrorSummaryItem {
  /** Translation key or text of the error */
  message: string
  /** Id of the invalid field. If set, the entry links to the field and moves focus to it. */
  fieldId?: string
}

/**
 * Alert region that reports failures of a whole form, e.g. a failed save (HTTP 400) inside a dialog
 * or the list of invalid fields. The region is always rendered with `role="alert"`, so content that is
 * added later is announced by screen readers. Call {@link focus} to additionally move the focus to it.
 *
 * @example
 * ```html
 * <ocx-form-error-summary [errors]="errors"></ocx-form-error-summary>
 * ```
 */
@Component({
  selector: 'ocx-form-error-summary',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div #region class="ocx-form-error-summary" role="alert" tabindex="-1">
    @if (errors().length > 0) {
      <p class="ocx-form-error-summary-title">{{ heading() | translate }}</p>
      <ul>
        @for (error of errors(); track $index) {
          <li>
            @if (error.fieldId) {
              <a [attr.href]="'#' + error.fieldId" (click)="focusField($event, error.fieldId)">{{
                error.message | translate
              }}</a>
            } @else {
              {{ error.message | translate }}
            }
          </li>
        }
      </ul>
    }
  </div>`,
  styles: [
    `
      .ocx-form-error-summary {
        color: var(--p-onecx-error-color, var(--text-color));
      }
      .ocx-form-error-summary:focus-visible {
        /* Theme focus ring; never remove the focus indicator */
        outline: var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid)
          var(--p-focus-ring-color, var(--primary-color, currentColor));
        outline-offset: var(--p-focus-ring-offset, 2px);
      }
    `,
  ],
})
export class FormErrorSummaryComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly region = viewChild.required<ElementRef<HTMLElement>>('region')

  /** The errors to report. An empty list renders an empty alert region. */
  errors = input<FormErrorSummaryItem[]>([])
  /** Translation key of the heading shown above the errors */
  heading = input<string>('OCX_FORM_FIELD.SUMMARY.TITLE')

  /** Moves focus to the alert region, e.g. after a failed save. */
  focus(): void {
    this.region().nativeElement.focus()
  }

  focusField(event: Event, fieldId: string): void {
    const field = this.host.nativeElement.ownerDocument.getElementById(fieldId)
    if (field) {
      event.preventDefault()
      field.focus()
    }
  }
}
