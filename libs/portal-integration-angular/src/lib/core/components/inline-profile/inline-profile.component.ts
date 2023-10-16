import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { UserProfile } from '../../../model/user-profile.model'
import { ConfigurationService } from '../../../services/configuration.service'
import { PortalUIService } from '../../../services/portal-ui.service'
import { MenuService } from '../../../services/app.menu.service'
import { MenuItem } from 'primeng/api'

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
export class AppInlineProfileComponent implements OnInit {
  userProfile: UserProfile | undefined
  activeInlineMenuElement: string | undefined
  userMenuItems: MenuItem[] = []

  @Input() style: any

  @Input() styleClass = ''

  @Input()
  inlineMenuActive = false

  @Output()
  inlineMenuClick: EventEmitter<UIEvent> = new EventEmitter()

  displayName = ''

  baseUrl: string

  constructor(
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    private configService: ConfigurationService,
    private stateService: PortalUIService,
    private menuService: MenuService
  ) {
    this.baseUrl = this.configService.getBaseUrl()
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.userProfile = user
      this.displayName = this.determineDisplayName()
    })

    this.menuService.getMenuItems().subscribe((el) => this.createMenu(el))
  }

  private createMenu(menuItems: MenuItem[]) {
    const menu = menuItems?.filter((item) => item.id === 'USER_PROFILE_MENU').pop()
    this.userMenuItems = menu?.items ? menu.items : []
  }

  determineDisplayName() {
    if (this.userProfile) {
      const person = this.userProfile.person
      if (person.displayName) {
        return person.displayName
      } else if (person.firstName && person.lastName) {
        return person.firstName + ' ' + person.lastName
      } else {
        return this.userProfile.userId
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
