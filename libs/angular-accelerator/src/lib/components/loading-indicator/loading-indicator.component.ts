import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {}
