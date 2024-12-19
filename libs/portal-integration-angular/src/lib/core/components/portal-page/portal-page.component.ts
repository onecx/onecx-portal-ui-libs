import { Component, Inject, Input, OnInit, Optional } from '@angular/core'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from '@onecx/angular-utils'
import { AppStateService } from '@onecx/angular-integration-interface'
import { UserService } from '@onecx/angular-integration-interface'

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

  constructor(
    private appState: AppStateService,
    private userService: UserService,
    @Inject(HAS_PERMISSION_CHECKER)
    @Optional()
    private hasPermissionChecker?: HasPermissionChecker,
  ) {}

  hasAccess() {
    if(this.hasPermissionChecker) {
      return this.permission ? this.hasPermissionChecker.hasPermission(this.permission) : true
    }
    return this.permission ? this.userService.hasPermission(this.permission) : true
  }

  ngOnInit(): void {
    if (!this.helpArticleId) {
      console.warn(
        `ocx-portal-page on url ${location.pathname} does not have 'helpArticleId' set. Set to some unique string in order to support help management feature.`
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
