import { animate, style, transition, trigger } from '@angular/animations'
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { combineLatest, map, Observable } from 'rxjs'
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

  constructor() {}

  ngOnInit() {}

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }
}
