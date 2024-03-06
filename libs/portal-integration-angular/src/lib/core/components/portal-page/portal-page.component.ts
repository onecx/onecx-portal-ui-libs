import { Component, Input, OnInit } from '@angular/core'
import { AppStateService } from '@onecx/angular-accelerator'
import { UserService } from '@onecx/angular-accelerator'

@Component({
  selector: 'ocx-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
})
export class PortalPageComponent implements OnInit {
  @Input() permission = ''
  @Input() helpArticleId = ''
  @Input() pageName = ''
  @Input() applicationId = ''

  collapsed = false

  constructor(private appState: AppStateService, private userService: UserService) {}

  hasAccess() {
    return this.permission ? this.userService.hasPermission(this.permission) : true
  }

  ngOnInit(): void {
    if (!this.helpArticleId) {
      console.warn(
        `ocx-portal-page on url ${location.pathname} does not have 'heplArticleId' set. Set to some unique string in order to support help management feature.`
      )
    }
    this.appState.currentPage$.publish({
      path: document.location.pathname,
      helpArticleId: this.helpArticleId,
      permission: this.permission,
      pageName: this.pageName,
      applicationId: this.applicationId,
    })
  }
}
