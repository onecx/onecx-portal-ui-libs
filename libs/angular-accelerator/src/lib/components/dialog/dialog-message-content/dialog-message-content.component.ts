import { Component, Input } from '@angular/core'

@Component({
  standalone: false,
  templateUrl: `./dialog-message-content.component.html`,
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
}
