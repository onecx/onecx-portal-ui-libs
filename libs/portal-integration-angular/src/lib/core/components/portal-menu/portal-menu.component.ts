import { Component, inject } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Observable } from 'rxjs'
import { MenuService } from '../../../services/app.menu.service'
import { map } from 'rxjs/operators'

@Component({
  standalone: false,
  selector: 'ocx-portal-menu',
  templateUrl: './portal-menu.component.html',
  styleUrls: ['./portal-menu.component.css'],
})
export class PortalMenuComponent {
  private menuService = inject(MenuService);

  menuItems$: Observable<MenuItem[]>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {
    this.menuItems$ = this.menuService.getMenuItems().pipe(
      map((el) => {
        return el.find((item: MenuItem) => item.id === 'PORTAL_MAIN_MENU')?.items
      })
    ) as Observable<MenuItem[]>
  }
}
