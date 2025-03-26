import { animate, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { Observable, combineLatest, filter, map, mergeMap, of } from 'rxjs'

import { AppStateService, ThemeService } from '@onecx/angular-integration-interface'
import {
  WORKSPACE_CONFIG_BFF_SERVICE_PROVIDER,
  WorkspaceConfigBffService,
} from '../../shell-interface/workspace-config-bff-service-provider'

@Component({
  standalone: false,
  selector: 'ocx-shell-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('topbarActionPanelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
      ]),
      transition(':leave', [animate('.1s linear', style({ opacity: 0 }))]),
    ]),
  ],
})
@UntilDestroy()
export class HeaderComponent {
  @Input() menuButtonTitle: string | undefined
  @Input() fullPortalLayout = true
  @Input() homeNavUrl = '/'
  @Input() homeNavTitle = 'Home'
  @Input() isStaticalMenu = false
  @Input() isHorizontalMenu = false
  @Output() menuButtonClick: EventEmitter<any> = new EventEmitter()

  private themeService = inject(ThemeService)
  private appStateService = inject(AppStateService)
  workspaceConfigBffService = inject<WorkspaceConfigBffService | undefined>(WORKSPACE_CONFIG_BFF_SERVICE_PROVIDER, {
    optional: true,
  })

  menuExpanded = false
  fallbackImg = false
  logoUrl$: Observable<string | undefined>

  constructor() {
    this.logoUrl$ = combineLatest([
      this.themeService.currentTheme$.asObservable(),
      this.appStateService.currentWorkspace$.asObservable(),
    ]).pipe(
      mergeMap(([theme, portal]) => {
        if (!theme.logoUrl && !portal.logoUrl) {
          return (this.workspaceConfigBffService?.getThemeLogoByName(theme.name ?? '') ?? of()).pipe(
            filter((blob) => !!blob),
            map((blob) => URL.createObjectURL(blob))
          )
        }
        return of(theme.logoUrl || portal.logoUrl)
      })
    )
  }

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }

  onLoad(logoUrl: string) {
    if (logoUrl.startsWith('blob: ')) {
      URL.revokeObjectURL(logoUrl)
    }
  }
}
