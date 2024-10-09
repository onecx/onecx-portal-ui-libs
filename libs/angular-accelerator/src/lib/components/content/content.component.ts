import { Component, Input } from '@angular/core'

@Component({
  selector: 'ocx-content',
  templateUrl: './content.component.html',
})
export class OcxContentComponent {
  /**
   * Optionally allows specifying a title for the content card
   */
  @Input() title = ''

  /**
   * Optionally allows specifying styles for the content card
   */
  @Input() styleClass = ''
}
