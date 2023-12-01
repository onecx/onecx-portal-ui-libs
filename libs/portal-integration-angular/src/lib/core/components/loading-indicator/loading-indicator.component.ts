import { Component, Input } from '@angular/core'

@Component({
  selector: 'ocx-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})

export class LoadingIndicatorComponent {
  @Input() fullPageOverlay: Boolean;
  @Input() small: Boolean;
}
