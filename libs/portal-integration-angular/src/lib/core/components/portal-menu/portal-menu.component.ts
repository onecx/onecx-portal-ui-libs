import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Observable } from 'rxjs'
import { MenuService } from '../../../services/app.menu.service'
import { map } from 'rxjs/operators'

@Component({
  selector: 'ocx-portal-menu',
  templateUrl: './portal-menu.component.html',
  styleUrls: ['./portal-menu.component.css'],
})
export class PortalMenuComponent {
  menuItems$: Observable<MenuItem[]>
  constructor(private menuService: MenuService) {
    this.menuItems$ = this.menuService.getMenuItems().pipe(
      map((el) => {
        return el.find((item: MenuItem) => item.id === 'PORTAL_MAIN_MENU')?.items
      })
    ) as Observable<MenuItem[]>
  }
}
