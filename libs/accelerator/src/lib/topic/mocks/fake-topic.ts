import { Subject, Observable, Observer, Subscription, UnaryFunction, BehaviorSubject, ReplaySubject } from 'rxjs'
import { Topic } from '../topic'

export class FakeTopic<T> {
  private state: Subject<T>
  constructor(initialValue: T | undefined = undefined) {
    if (initialValue !== undefined) {
      this.state = new BehaviorSubject<T>(initialValue)
    } else {
      this.state = new ReplaySubject<T>(1)
    }
  }
  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }
  
  subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription
  /** @deprecated is deprecated in rxjs. This is only here to be compatible with the interface. */
  subscribe(
    next?: ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Subscription
  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
    error?: (error: any) => void | null,
    complete?: () => void | null
  ): Subscription {
    return (<any>this.asObservable()).subscribe(observerOrNext, error, complete)
  }

  /**
   * @deprecated source is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get source() {
    return (this.asObservable() as any).source
  }

  /**
   * @deprecated operator is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get operator() {
    return (this.asObservable() as any).operator
  }

  /**
   * @deprecated lift is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  lift<R>(operator: UnaryFunction<T, R>): Observable<R> {
    return (this.asObservable() as any).lift(operator)
  }

  /**
   * @deprecated foreach is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  forEach(next: (value: T) => void, thisArg?: any): Promise<void> {
    return this.asObservable().forEach(next, thisArg)
  }

  /**
   * @deprecated toPromise is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  toPromise(): Promise<T | undefined> {
    return this.asObservable().toPromise()
  }

  // The following are already present: publish, destroy, getValue
  asObservable(): Observable<T> {
    return this.state.asObservable()
  }

  pipe<R = Observable<T>>(...operations: UnaryFunction<any, any>[]): R {
    return (this.asObservable() as any).pipe(...operations)
  }

  publish(value: T): Promise<void> {
    this.state.next(value)
    return Promise.resolve()
  }

  destroy(): void {
    this.state.complete()
  }

  getValue(): T {
    if (this.state instanceof BehaviorSubject) {
      return this.state.getValue()
    }
    throw new Error('Only possible for FakeTopic with initial value')
  }

  static create<T>(initialValue: T | undefined = undefined): Topic<T> {
    return new FakeTopic<T>(initialValue) as unknown as Topic<T>
  }
}
