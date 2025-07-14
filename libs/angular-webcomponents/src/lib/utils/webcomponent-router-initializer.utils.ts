import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { AppStateService } from '@onecx/angular-integration-interface'
import { GuardWrapper, wrapGuards } from '@onecx/angular-utils'
import { firstValueFrom, map } from 'rxjs'

export function initializeRouter(router: Router, appStateService: AppStateService, guardWrapper: GuardWrapper) {
  return () =>
    firstValueFrom(
      appStateService.currentMfe$.asObservable().pipe(
        map((mfeInfo) => {
          const routes = router.config
          routes.forEach((route) => {
            ;((route.data = {
              ...route.data,
              mfeInfo: mfeInfo,
            }),
              (route.redirectTo =
                route.redirectTo && typeof route.redirectTo === 'string'
                  ? Location.joinWithSlash(mfeInfo.baseHref, route.redirectTo)
                  : route.redirectTo))
            wrapGuards(route, guardWrapper)
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
