import { Component, Input } from '@angular/core'

@Component({
  standalone: false,
  templateUrl: `./dialog-message-content.component.html`,
  styleUrls: ['./dialog-message-content.component.scss'],
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
}
