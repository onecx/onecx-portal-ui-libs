import { animate, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { AppStateService, ThemeService } from '@onecx/angular-integration-interface'
import { ImageLogoUrlUtils } from '@onecx/portal-integration-angular'
import { combineLatest, map, Observable } from 'rxjs'
import { SHELL_BFF_PREFIX } from '../../model/constants'

@Component({
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
  menuExpanded = false
  fallbackImg = false

  @Input()
  menuButtonTitle: string | undefined
  @Input()
  fullPortalLayout = true
  @Input()
  homeNavUrl = '/'
  @Input()
  homeNavTitle = 'Home'

  @Output()
  menuButtonClick: EventEmitter<any> = new EventEmitter()

  logoUrl$: Observable<string | undefined>

  constructor(private themeService: ThemeService, private appStateService: AppStateService) {
    this.logoUrl$ = combineLatest([
      this.themeService.currentTheme$.asObservable(),
      this.appStateService.currentWorkspace$.asObservable(),
    ]).pipe(
      map(([theme, portal]) => {
        return ImageLogoUrlUtils.createLogoUrl(SHELL_BFF_PREFIX, theme.logoUrl || portal.logoUrl)
      })
    )
  }

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }
}
