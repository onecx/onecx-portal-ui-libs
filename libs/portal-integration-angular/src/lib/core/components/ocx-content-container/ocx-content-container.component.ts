import { Component, Input } from '@angular/core'

@Component({
  selector: 'ocx-content-container',
  templateUrl: './ocx-content-container.component.html',
})
export class OcxContentContainerComponent {
  /**
   * Allows specifying the layout direction of the container
   */
  @Input() layout: 'vertical' | 'horizontal' = 'horizontal';
}
