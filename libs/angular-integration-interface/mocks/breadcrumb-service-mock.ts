

import { Injectable } from '@angular/core'
import { of } from 'rxjs'
import { BreadcrumbService } from '@onecx/angular-accelerator'
import { MenuItem } from 'primeng/api'

export function provideBreadcrumbServiceMock() {
  return [BreadcrumbServiceMock, { provide: BreadcrumbService, useExisting: BreadcrumbServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbServiceMock {
  itemsHandler = of<MenuItem[]>([
    {
      label: 'Test breadcrumb from itemsHandler',
      show: 'always',
      routerLink: '/test-breadcrumb',
      permission: 'TEST#TEST_BREADCRUMB_PERMISSION',
    },
  ])

  generatedItemsSource = of<MenuItem[]>([{
      label: 'Test breadcrumb from generated source',
      show: 'always',
      routerLink: '/test-breadcrumb',
      permission: 'TEST#TEST_BREADCRUMB_PERMISSION',
    }])

  generateBreadcrumbs() {
    return this.generatedItemsSource
  }
}