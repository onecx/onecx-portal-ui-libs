import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { filter } from 'rxjs'
import { PortalUIService } from '../../../services/portal-ui.service'

@Component({
  selector: 'ocx-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
  animations: [
    trigger('children', [
      state(
        'void',
        style({
          height: '0px',
          padding: '0px',
        })
      ),
      state(
        'hiddenAnimated',
        style({
          height: '0px',
          padding: '0px',
        })
      ),
      state(
        'visibleAnimated',
        style({
          height: '*',
        })
      ),
      state(
        'visible',
        style({
          height: '*',
        })
      ),
      state(
        'hidden',
        style({
          height: '0px',
          padding: '0px',
        })
      ),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
})
export class SubMenuComponent implements OnInit {
  @Input() item!: MenuItem

  @Input() index!: number

  @Input() root = false

  @Input() parentKey: string | undefined

  active = false

  // menuSourceSubscription: Subscription

  // menuResetSubscription: Subscription

  // key!: string
  // isParent: boolean | undefined
  type: 'parent' | 'routerLink' | 'href' | 'command' | 'label' = 'label'

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    public uiConfig: PortalUIService,
    private sanitizer: DomSanitizer
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.uiConfig.isHorizontal || this.uiConfig.isSlim) {
        this.active = false
      } else {
        if (this.type === 'routerLink' || this.type === 'parent') {
          this.updateActiveStateFromRoute()
        } else {
          this.active = false
        }
      }
    })
  }

  ngOnInit() {
    // this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index)

    this.type = this.getItemType(this.item)
    if (!(this.uiConfig.isHorizontal || this.uiConfig.isSlim) && this.item.routerLink) {
      this.updateActiveStateFromRoute()
    }
  }

  sanitize(url?: string) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url)
    } else {
      return url
    }
  }

  updateActiveStateFromRoute() {
    this.active = this.isSelfOrChildActive(this.item)
  }

  getItemType(item: MenuItem): 'parent' | 'routerLink' | 'href' | 'command' | 'label' {
    if (item.items && item.items.length > 0) {
      return 'parent'
    } else if (item.routerLink) {
      return 'routerLink'
    } else if (item.command) {
      return 'command'
    } else if (item.url) {
      return 'href'
    } else {
      return 'label'
    }
  }

  isSelfOrChildActive(item: MenuItem) {
    // const matchMode = this.type === 'parent' ? 'subset' : 'exact'
    const matchMode = 'subset'

    if (this.getItemType(item) === 'parent' && item.items) {
      for (const child of item.items) {
        if (this.isSelfOrChildActive(child)) {
          return true
        }
      }
      return false
    } else {
      let url = item.routerLink || item.url
      if (!url) {
        console.warn(`Item without any url ${item.id} ${item.label}`)
        return false
      }
      url = url.startsWith('/') ? url.substring(1) : url
      url = url.endsWith('/') ? url.substring(0, url.length - 1) : url
      return this.router.isActive(url, {
        paths: matchMode,
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      })
    }
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault()
      return
    }

    // navigate with hover in horizontal mode
    if (this.root) {
      this.uiConfig.menuHoverActive = !this.uiConfig.menuHoverActive
    }

    // notify other items
    // this.menuService.onMenuStateChange(this.key)

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item })
    }

    // toggle active state
    if (this.type === 'parent') {
      this.active = !this.active
      event.preventDefault()
      event.stopPropagation()
    } else {
      // activate item
      this.active = true

      // reset horizontal and slim menu
      if (this.uiConfig.isHorizontal || this.uiConfig.isSlim) {
        // this.menuService.reset()
        this.uiConfig.menuHoverActive = false
      }

      if (!this.uiConfig.isStatic) {
        this.uiConfig.menuActive = false
      }

      this.uiConfig.mobileMenuActive = false
    }

    this.removeActiveInk(event)
  }

  onMouseEnter() {
    // activate item on hover
    if (this.root && (this.uiConfig.isHorizontal || this.uiConfig.isSlim) && this.uiConfig.isDesktop) {
      if (this.uiConfig.menuHoverActive) {
        // this.menuService.onMenuStateChange(this.key)
        this.active = true
      }
    }
  }

  removeActiveInk(event: Event) {
    const currentTarget = event.currentTarget as HTMLElement
    setTimeout(() => {
      if (currentTarget) {
        const activeInk = currentTarget.querySelector('.p-ink-active')
        if (activeInk) {
          if (activeInk.classList) {
            activeInk.classList.remove('p-ink-active')
          } else {
            activeInk.className = activeInk.className.replace(
              new RegExp('(^|\\b)' + 'p-ink-active'.split(' ').join('|') + '(\\b|$)', 'gi'),
              ' '
            )
          }
        }
      }
    }, 401)
  }

  // ngOnDestroy() {
  //   // if (this.menuSourceSubscription) {
  //   //   this.menuSourceSubscription.unsubscribe()
  //   // }

  //   // if (this.menuResetSubscription) {
  //   //   this.menuResetSubscription.unsubscribe()
  //   // }
  // }
}
