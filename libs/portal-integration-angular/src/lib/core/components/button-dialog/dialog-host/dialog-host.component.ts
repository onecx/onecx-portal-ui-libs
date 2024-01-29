import { Component, Input } from '@angular/core'

@Component({
  templateUrl: `./dialog-host.component.html`,
})
export class DialogMessageContentComponent {
  @Input() message = 'message'
  @Input() messageParameters: object = {}
  @Input() icon = ''
}
