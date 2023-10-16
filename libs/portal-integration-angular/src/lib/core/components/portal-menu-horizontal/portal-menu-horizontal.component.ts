import { AfterViewChecked, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core'
import { MenuService } from '../../../services/app.menu.service'
import { MenuItem } from 'primeng/api'
import { Menubar } from 'primeng/menubar'

@Component({
  selector: 'ocx-portal-menu-horizontal',
  templateUrl: './portal-menu-horizontal.component.html',
  styleUrls: ['./portal-menu-horizontal.component.scss'],
})
export class PortalMenuHorizontalComponent implements AfterViewChecked {
  @ViewChild('menubar') menubar?: Menubar
  menuItems: MenuItem[] = []

  private _mainMenuItems: MenuItem[] = []
  private _sizeCache: DOMRect[] | null = [] // perf: valid cache on init

  constructor(private menuService: MenuService, private elementRef: ElementRef, private renderer: Renderer2) {
    this.menuService.getMenuItems().subscribe((el) => this.onMenuItemsChange(el))
  }

  ngAfterViewChecked(): void {
    if (
      // only perform update, when
      !this._sizeCache && // menu items changed
      this.menubar?.model === this.menuItems // menubar (+ DOM) was updated with new items
    ) {
      this.updateVisibleMenuItems()
    }
  }

  onMenuItemsChange(menuItems: MenuItem[]) {
    this._mainMenuItems = menuItems.find(({ id }) => id === 'PORTAL_MAIN_MENU')?.items || []
    this.invalidateCache()
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleMenuItems()
  }

  invalidateCache() {
    this.menuItems = [
      ...this._mainMenuItems,
      // last item = 'More' item
      {
        label: 'More', // TODO add translation
        items: [], // render with angle-down button
      },
    ]
    // invalidate cache, force recalculation
    this._sizeCache = null
  }

  updateSizeCache() {
    const el = this.elementRef?.nativeElement as HTMLElement | undefined
    if (!el) return

    this._sizeCache = []
    const menuItemEls = el.querySelectorAll('.p-menubar .p-menubar-root-list > .p-menuitem')
    menuItemEls.forEach((el) => this._sizeCache?.push(el.getBoundingClientRect()))
  }

  /**
   * Priority+ navigation pattern:
   * * Fits menu items into parent container width
   * * Shows 'more' element for hidden items
   * * Limitations: does not respect margin between menu items
   *
   * Implementation details:
   *
   * The algorithm works in two phases.
   * 1. The menubar is rendered with all menu items + a placeholder 'more' item.
   *    The menubar can be overflowing now visually for a very brief moment.
   *    The rendered view is used to fill the size cache by checking the width of each element.
   * 2. The size cache is used to calculate the visible elements.
   *    The menubar items will be set according to the calculation.
   *
   * Everytime the menu items update, the algorithm starts in phase 1.
   * Everytime the viewport resizes, the algorithm can skip phase 1 and use the cache.
   */
  updateVisibleMenuItems() {
    if (!this._sizeCache) this.updateSizeCache()

    // cache stale/invalid
    if (this._sizeCache?.length !== this._mainMenuItems.length + 1) {
      this.invalidateCache()
      return
    }

    const parentEl = this.elementRef?.nativeElement?.parentElement as Element | undefined
    if (!parentEl) return

    // get container width without padding
    const parentStyle = getComputedStyle(parentEl)
    const parentWidth =
      parentEl.clientWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight)

    // calculate visible elements
    const getWidth = (i: number) => this._sizeCache?.[i].width || 100 // default
    const totalWidth = this._mainMenuItems.reduce((totalWidth, _, i) => getWidth(i) + totalWidth, 0)
    let menuItems: MenuItem[]
    if (totalWidth > parentWidth) {
      // overflow
      const moreItemWidth = getWidth(this._sizeCache.length - 1) // last item = 'More' item
      let spaceLeft = parentWidth - moreItemWidth // show "More" button
      let i = 0
      for (; i < this._sizeCache.length; ++i) {
        spaceLeft -= getWidth(i)
        if (spaceLeft < 0) break
      }
      menuItems = [
        ...this._mainMenuItems.slice(0, i),
        {
          label: 'More', // TODO add translation
          items: this._mainMenuItems.slice(i),
        },
      ]
    } else {
      // no overflow
      menuItems = this._mainMenuItems
    }

    // set menuitems outside of lifecycle
    setTimeout(() => (this.menuItems = menuItems), 0)
  }
}
