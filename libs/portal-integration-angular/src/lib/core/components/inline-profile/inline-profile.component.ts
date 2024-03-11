import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { MenuService } from '../../../services/app.menu.service'
import { MenuItem } from 'primeng/api'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { UserService } from '@onecx/angular-integration-interface'
import { map, Observable } from 'rxjs'
import { UserProfile } from '../../../model/user-profile.model'

@Component({
  selector: 'ocx-inline-profile',
  templateUrl: 'inline-profile.component.html',
  styleUrls: ['./inline-profile.component.scss'],
  animations: [
    trigger('menu', [
      state(
        'hiddenAnimated',
        style({
          height: '0px',
          paddingBottom: '0px',
          overflow: 'hidden',
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*',
          overflow: 'visible',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          'z-index': 100,
        })
      ),
      state(
        'hidden',
        style({
          opacity: 0,
          'z-index': '*',
        })
      ),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('visible => hidden', animate('.1s linear')),
      transition('hidden => visible', [
        style({ transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)'),
      ]),
    ]),
  ],
})
@UntilDestroy()
export class AppInlineProfileComponent implements OnInit {
  userProfile$: Observable<UserProfile> | undefined
  activeInlineMenuElement: string | undefined
  userMenuItems: MenuItem[] = []

  @Input() style: any

  @Input() styleClass = ''

  @Input()
  inlineMenuActive = false

  @Output()
  inlineMenuClick: EventEmitter<UIEvent> = new EventEmitter()

  displayName$: Observable<string> | undefined

  constructor(
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    private menuService: MenuService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userProfile$ = this.userService.profile$.asObservable()
    this.displayName$ = this.userService.profile$.pipe(map((userProfile) => this.determineDisplayName(userProfile)))

    this.menuService
      .getMenuItems()
      .pipe(untilDestroyed(this))
      .subscribe((el) => this.createMenu(el))
  }

  private createMenu(menuItems: MenuItem[]) {
    const menu = menuItems?.filter((item) => item.id === 'USER_PROFILE_MENU').pop()
    this.userMenuItems = menu?.items ? menu.items : []
  }

  determineDisplayName(userProfile: UserProfile) {
    if (userProfile) {
      const person = userProfile.person
      if (person.displayName) {
        return person.displayName
      } else if (person.firstName && person.lastName) {
        return person.firstName + ' ' + person.lastName
      } else {
        return userProfile.userId
      }
    } else {
      return 'Guest'
    }
  }

  get tabIndex() {
    return !this.inlineMenuActive ? '-1' : null
  }

  onClick(event: UIEvent) {
    this.inlineMenuClick.emit(event)
    event.preventDefault()
    event.stopPropagation()
  }

  logout(event: Event) {
    event.preventDefault()
    this.authService.logout()
  }
}
