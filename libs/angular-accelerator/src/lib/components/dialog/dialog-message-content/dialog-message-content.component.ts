import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: `./dialog-message-content.component.html`,
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
}
