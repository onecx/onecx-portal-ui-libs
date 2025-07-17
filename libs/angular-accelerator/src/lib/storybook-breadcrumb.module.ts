import { ModuleWithProviders, NgModule, inject } from '@angular/core'
import { BreadCrumbMenuItem } from './model/breadcrumb-menu-item.model'
import { BreadcrumbService } from './services/breadcrumb.service'
import { StorybookTranslateModule } from './storybook-translate.module'

@NgModule({
  imports: [StorybookTranslateModule],
})
export class StorybookBreadcrumbModule {
  constructor() {
    const breadcrumbService = inject(BreadcrumbService)
    const breadcrumbs = inject<BreadCrumbMenuItem[]>('BREADCRUMBS' as any)

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
