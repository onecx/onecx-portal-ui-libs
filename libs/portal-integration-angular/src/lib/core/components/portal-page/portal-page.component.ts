import { Component, Injector, Input, OnInit } from '@angular/core'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { AppStateService } from '../../../services/app-state.service'

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

  authService: IAuthService

  constructor(private injectorObj: Injector, private appState: AppStateService) {
    this.authService = this.injectorObj.get(AUTH_SERVICE)
  }

  hasAccess() {
    return this.permission ? this.authService.hasPermission(this.permission) : true
  }

  ngOnInit(): void {
    if (!this.helpArticleId) {
      console.warn(
        `ocx-portal-page on url ${location.pathname} does not have 'heplArticleId' set. Set to some unique string in order to support help management feature.`
      )
    }
    this.appState.currentPage$.next({
      helpArticleId: this.helpArticleId,
      permission: this.permission,
      pageName: this.pageName,
      applicationId: this.applicationId,
    })
  }
}
