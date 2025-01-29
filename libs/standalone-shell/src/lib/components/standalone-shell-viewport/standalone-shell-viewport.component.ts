import { Component, Input } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-standalone-shell-viewport',
  template: `
    @if (displayOneCXShellLayout) {
      <ocx-shell-portal-viewport></ocx-shell-portal-viewport>
    } @else {
      <router-outlet></router-outlet>
    }
    `,
  styleUrls: ['./standalone-shell-viewport.component.scss'],
})
export class StandaloneShellViewportComponent {
  // TODO: Enable by default once we know how to move forward with standalone styling
  @Input() displayOneCXShellLayout = false
}
