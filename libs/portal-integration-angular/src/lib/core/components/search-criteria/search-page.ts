import { isObservable, Observable } from 'rxjs'

import { forwardRef } from '@angular/core'

export function provideParent(component: any, parentType?: any) {
  return {
    provide: parentType || PortalSearchPage,
    useExisting: forwardRef(() => component),
  }
}

export abstract class PortalSearchPage<T> {
  searchInProgress = false
  public results: T[] = []

  abstract search(mode: 'simple' | 'advanced'): T[] | Observable<T[]>
  abstract reset(mode: 'simple' | 'advanced'): void

  onSearch(mode: 'simple' | 'advanced') {
    this.searchInProgress = true
    const resultIntermediate = this.search(mode)
    if (isObservable(resultIntermediate)) {
      const obs$ = resultIntermediate.subscribe((data) => {
        this.results = data
        this.searchInProgress = false
        obs$.unsubscribe()
      })
    } else {
      this.results = resultIntermediate
      this.searchInProgress = false
    }
  }

  onReset(mode: 'simple' | 'advanced') {
    this.results = []
    this.reset(mode)
  }
}
