import { Component, Input } from '@angular/core'

@Component({
  selector: 'ocx-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContentComponent {
  @Input() public styleClass: string | undefined
}
