import { Component, Input } from '@angular/core'

@Component({
  templateUrl: `./dialog-host.component.html`,
})
export class DialogHostComponent {
  @Input() message = 'message'
  @Input() icon = ''
}
