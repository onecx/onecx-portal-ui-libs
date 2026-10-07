import { Component, input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './content.component.html',
})
export class OcxContentComponent {
  /**
   * Optionally allows specifying a title for the content card
   */
  title = input<string>('')

  /**
   * Optionally allows specifying styles for the content card
   */
  styleClass = input<string | undefined>(undefined)
}
