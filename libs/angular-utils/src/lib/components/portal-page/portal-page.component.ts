import { Component, Input, OnInit, computed, inject, input } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { Observable, of, switchMap, tap } from 'rxjs'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { PermissionService } from '../../services/permission.service'
import { toObservable } from '@angular/core/rxjs-interop'

@Component({
  selector: 'ocx-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class PortalPageComponent implements OnInit {
  private appState = inject(AppStateService)
  private permissionService = inject(PermissionService)
  private trueObservable = of(true)

  permission = input<string>('')
  helpArticleId = input<string>('')
  pageName = input<string>('')
  applicationId = input<string>('')

  hasAccess$ = toObservable(this.permission).pipe(
    tap((permission) => console.debug('Checking access for permission:', permission)),
    switchMap((permission) => (permission ? this.permissionService.hasPermission(permission) : this.trueObservable)),
    tap((hasAccess) => console.debug('Access result:', hasAccess))
  )

  ngOnInit(): void {
    if (!this.helpArticleId()) {
      console.warn(
        `ocx-portal-page on url ${location.pathname} does not have 'helpArticleId' set. Set to some unique string in order to support help management feature.`
      )
    }

    this.appState.currentPage$.publish({
      path: document.location.pathname,
      helpArticleId: this.helpArticleId(),
      permission: this.permission(),
      pageName: this.pageName(),
      applicationId: this.applicationId(),
    })
  }
}
