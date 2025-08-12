import { Component, EventEmitter, Input, Output } from '@angular/core'
import { animate, style, transition, trigger } from '@angular/animations'
import { UntilDestroy } from '@ngneat/until-destroy'

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
  @Input() menuButtonTitle: string | undefined
  @Input() fullPortalLayout = true
  @Input() homeNavUrl = '/'
  @Input() homeNavTitle = 'Home'
  @Input() isHorizontalMenu = false
  @Input() isStaticalMenu = false
  @Output() menuButtonClick: EventEmitter<any> = new EventEmitter()

  public logoLoadingEmitter = new EventEmitter<boolean>()
  public themeLogoLoadingFailed = false

  constructor() {
    this.logoLoadingEmitter.subscribe((data: boolean) => {
      this.themeLogoLoadingFailed = data
    })
  }

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }
}
