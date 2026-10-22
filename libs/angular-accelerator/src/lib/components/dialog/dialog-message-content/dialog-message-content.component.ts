import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { TranslationKey } from '../../../model/translation.model'

let nextMessageId = 0

/**
 * Maps icon classes to the translation key of the severity they convey, so that the severity is also available as text.
 * Icons that are not listed here have no default text (pass `iconLabel` to provide one).
 */
const ICON_SEVERITY_KEYS: { pattern: RegExp; key: string }[] = [
  { pattern: /pi-(check|check-circle)(\s|$)/, key: 'OCX_BUTTON_DIALOG.SEVERITY.SUCCESS' },
  { pattern: /pi-(info|info-circle)(\s|$)/, key: 'OCX_BUTTON_DIALOG.SEVERITY.INFO' },
  { pattern: /pi-(exclamation-triangle)(\s|$)/, key: 'OCX_BUTTON_DIALOG.SEVERITY.WARNING' },
  { pattern: /pi-(exclamation-circle|times-circle|ban)(\s|$)/, key: 'OCX_BUTTON_DIALOG.SEVERITY.ERROR' },
  { pattern: /pi-(question|question-circle)(\s|$)/, key: 'OCX_BUTTON_DIALOG.SEVERITY.QUESTION' },
]

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: `./dialog-message-content.component.html`,
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
  /** Translation key (with optional parameters) of a text describing the icon, e.g. its severity. Defaults to a text derived from known icons. */
  @Input() iconLabel: TranslationKey | undefined

  /** Unique per instance so that stacked dialogs do not share an id and `aria-describedby` resolves to the right message. */
  readonly messageId = `ocx-dialog-message-${nextMessageId++}`

  get iconLabelKey(): string | undefined {
    if (this.iconLabel) {
      return typeof this.iconLabel === 'string' ? this.iconLabel : this.iconLabel.key
    }
    return ICON_SEVERITY_KEYS.find((entry) => entry.pattern.test(this.icon))?.key
  }

  get iconLabelParameters(): object {
    return typeof this.iconLabel === 'object' ? (this.iconLabel.parameters ?? {}) : {}
  }
}
