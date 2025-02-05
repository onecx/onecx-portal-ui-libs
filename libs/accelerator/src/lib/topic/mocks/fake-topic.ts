import { Subject, Observable, Observer, Subscription, UnaryFunction, BehaviorSubject, ReplaySubject } from 'rxjs'

export class FakeTopic<T> {
  private state: Subject<T>
  constructor(initialValue: T | undefined = undefined) {
    if (initialValue !== undefined) {
      this.state = new BehaviorSubject<T>(initialValue)
    } else {
      this.state = new ReplaySubject<T>(1)
    }
  }
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

  destroy(){}
}
