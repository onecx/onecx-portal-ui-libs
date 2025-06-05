import { Component, Input, OnInit } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { PermissionService } from '../../services/permission.service'
import { of } from 'rxjs'

@Component({
  selector: 'ocx-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class PortalPageComponent implements OnInit {
  @Input() permission = ''
  @Input() helpArticleId = ''
  @Input() pageName = ''
  @Input() applicationId = ''
  private defaultPermissionObs = of(true)
  constructor(
    private appState: AppStateService,
    private permissionService: PermissionService
  ) {}

  hasAccess() {
    return this.permission ? this.permissionService.hasPermission(this.permission) : this.defaultPermissionObs
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
