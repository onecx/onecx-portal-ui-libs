import { filter, MonoTypeOperatorFunction } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Type } from '@angular/core'
import { RouterNavigatedAction } from '@ngrx/router-store'

export function filterForNavigatedTo<A extends RouterNavigatedAction>(
  router: Router,
  component: Type<any>
): MonoTypeOperatorFunction<A> {
  return (source) => {
    return source.pipe(
      filter(() => {
        return checkForComponent(component, router.routerState.root)
      })
    )
  }
}

function checkForComponent(component: any, route: ActivatedRoute): boolean {
  if (route.component === component) {
    return true
  }
  for (const c of route.children) {
    const r = checkForComponent(component, c)
    if (r) {
      return true
    }
  }
  return false
}
