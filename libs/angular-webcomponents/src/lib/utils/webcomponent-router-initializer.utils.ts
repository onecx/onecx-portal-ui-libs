import { Router } from '@angular/router'
import { AppStateService } from '@onecx/portal-integration-angular'
import { firstValueFrom, map } from 'rxjs'

export function initializeRouter(router: Router, appStateService: AppStateService) {
  return () =>
    firstValueFrom(
      appStateService.currentMfe$.asObservable().pipe(
        map((mfeInfo) => {
          const routes = router.config
          routes.forEach((route) => {
            route.data = {
              ...route.data,
              mfeInfo: mfeInfo,
            }
          })
          router.resetConfig(routes)
        })
      )
    )
}
