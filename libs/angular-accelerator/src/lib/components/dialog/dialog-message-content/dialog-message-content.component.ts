import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: `./dialog-message-content.component.html`,
  // Long unbroken words must wrap instead of forcing horizontal scrolling (WCAG 1.4.10)
  styles: ['.dialogMessageContent { overflow-wrap: anywhere; }'],
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
}
