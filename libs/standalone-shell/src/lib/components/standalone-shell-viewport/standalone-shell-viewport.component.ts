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
    @Input() displayOneCXShellLayout = true
}
