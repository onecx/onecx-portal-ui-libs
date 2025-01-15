import { Component, Input } from '@angular/core'

@Component({
  selector: 'ocx-standalone-shell-viewport',
  template: `
  <ocx-shell-portal-viewport *ngIf="displayOneCXShellLayout; else plainStandalone"></ocx-shell-portal-viewport>
  <ng-template #plainStandalone>
    <router-outlet></router-outlet>
  </ng-template>
  `,
  styleUrls: ['./standalone-shell-viewport.component.scss']
})
export class StandaloneShellViewportComponent {
    // TODO: Enable by default once we know how to move forward with standalone styling
    @Input() displayOneCXShellLayout = false
}
