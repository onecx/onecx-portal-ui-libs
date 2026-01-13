import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { AppStateService } from '@onecx/angular-integration-interface'
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
            };
            route.redirectTo =
              route.redirectTo && typeof route.redirectTo === 'string'
                ? Location.joinWithSlash(mfeInfo.baseHref, route.redirectTo)
                : route.redirectTo
          })
          routes.push({
            path: '**',
            children: [],
          })
          router.resetConfig(routes)
        })
      )
    )
}
