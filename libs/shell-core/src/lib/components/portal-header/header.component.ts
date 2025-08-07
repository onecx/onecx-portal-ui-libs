import { animate, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { UntilDestroy } from '@ngneat/until-destroy'
import { Observable } from 'rxjs'

import { SlotService } from '@onecx/angular-remote-components'
import { Theme, ThemeService } from '@onecx/angular-integration-interface'

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
  private slotService = inject(SlotService)

  menuExpanded = false
  // slot configuration: get theme logo
  public slotName = 'onecx-theme-data'
  public isComponentDefined$: Observable<boolean> // check a component was assigned
  public currentTheme$: Observable<Theme>
  public logoLoadingEmitter = new EventEmitter<boolean>()
  public themeLogoLoadingFailed = false

  constructor() {
    this.isComponentDefined$ = this.slotService.isSomeComponentDefinedForSlot(this.slotName)
    this.currentTheme$ = this.themeService.currentTheme$.asObservable()
    this.logoLoadingEmitter.subscribe((data: boolean) => {
      this.themeLogoLoadingFailed = data
    })
  }

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }
}
