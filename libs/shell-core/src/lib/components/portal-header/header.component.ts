import { animate, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { Observable } from 'rxjs'

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
export class HeaderComponent implements OnInit {
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

  logoUrl$!: Observable<string | null>

  // constructor(   private themeService: ThemeService,
  //   private appStateService: AppStateService) {
  //   this.logoUrl$ = combineLatest([
  //     this.themeService.currentTheme$.asObservable(),
  //     this.appStateService.currentPortal$.asObservable(),
  //   ]).pipe(
  //     map(([theme, portal]) => {
  //       return ImageLogoUrlUtils.createLogoUrl(theme.logoUrl || portal.logoUrl)
  //     })
  //   )
  // }

  ngOnInit() {}

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }
}
