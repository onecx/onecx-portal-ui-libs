import { Injectable } from '@angular/core'
import { PageInfo, Portal } from '@onecx/integration-interface'
import { BehaviorSubject, Observable, Observer, Subscription, UnaryFunction } from 'rxjs'

class FakeTopic<T> {
  private state = new BehaviorSubject<T>(this.initialValue)
  constructor(private initialValue: T) {}
  asObservable(): Observable<T> {
    return this.state.asObservable()
  }

  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return (<any>this.asObservable()).subscribe(observerOrNext, error, complete)
  }

  pipe(...operations: UnaryFunction<any, any>[]): unknown {
    return (<any>this.asObservable()).pipe(...operations)
  }

  publish(value: T): Promise<void> {
    this.state.next(value)
    return Promise.resolve()
  }
}

@Injectable()
export class AppStateServiceMock {
  globalError$ = new FakeTopic('')
  globalLoading$ = new FakeTopic(false)
  currentMfe$ = new FakeTopic({ mountPath: '/', remoteBaseUrl: '.', baseHref: '/', shellName: 'test' })
  currentPage$ = new FakeTopic<PageInfo | undefined>(undefined)
  currentPortal$ = new FakeTopic<Portal>({ baseUrl: '/', microfrontendRegistrations: [], portalName: 'Test portal' })
  isAuthenticated$ = new FakeTopic<void>(undefined)
}
