import { Component, Input, OnInit, inject } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { Observable, of } from 'rxjs'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { PermissionService } from '../../services/permission.service'
import { createLogger } from '../../utils/logger.utils'

@Component({
  selector: 'ocx-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class PortalPageComponent implements OnInit {
  private readonly logger = createLogger('PortalPageComponent')
  private appState = inject(AppStateService)
  private permissionService = inject(PermissionService)
  private trueObservable = of(true)

  @Input() permission = ''
  @Input() helpArticleId = ''
  @Input() pageName = ''
  @Input() applicationId = ''

  hasAccess(): Observable<boolean> {
    return this.permission ? this.permissionService.hasPermission(this.permission) : this.trueObservable
  }

  ngOnInit(): void {
    if (!this.helpArticleId) {
      this.logger.warn(
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
