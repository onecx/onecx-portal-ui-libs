import { Inject, ModuleWithProviders, NgModule } from '@angular/core'
import { BreadCrumbMenuItem } from './model/breadcrumb-menu-item.model'
import { BreadcrumbService } from './services/breadcrumb.service'
import { StorybookTranslateModule } from './storybook-translate.module'

@NgModule({
  imports: [StorybookTranslateModule],
})
export class StorybookBreadcrumbModule {
  constructor(breadcrumbService: BreadcrumbService, @Inject('BREADCRUMBS') breadcrumbs: BreadCrumbMenuItem[]) {
    breadcrumbService.setItems(breadcrumbs)
  }

  public static init(breadcrumbs: BreadCrumbMenuItem[]): ModuleWithProviders<StorybookBreadcrumbModule> {
    const module: ModuleWithProviders<StorybookBreadcrumbModule> = {
      ngModule: StorybookBreadcrumbModule,
      providers: [{ provide: 'BREADCRUMBS', useValue: breadcrumbs }],
    }
    return module
  }
}
