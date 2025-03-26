import { Component, Input } from '@angular/core'
/**
 * @deprecated This component will be removed in favor of ocx-content and ocx-content-container in a future release.
 */
@Component({
  standalone: false,
  selector: 'ocx-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss'],
})
export class PageContentComponent {
  @Input() public styleClass: string | undefined
}
