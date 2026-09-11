import { Observable } from 'rxjs'

/**
 * Returns the observable view exposed by an RxJS Observable or OneCX Topic.
 *
 * @param source Source exposing an observable view.
 * @returns The source as an RxJS Observable.
 */
export function asObservable<T>(source: Observable<T> | { asObservable(): Observable<T> }): Observable<T> {
  return 'asObservable' in source ? source.asObservable() : source
}