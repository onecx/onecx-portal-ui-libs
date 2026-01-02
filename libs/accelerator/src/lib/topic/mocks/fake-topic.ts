import { Subject, Observable, Observer, Subscription, BehaviorSubject, ReplaySubject, OperatorFunction } from 'rxjs'
import { Topic } from '../topic'
import { TopicDataMessage } from '../topic-data-message'


interface MockSubscribable<T> {
  subscribe(observer: Partial<Observer<T>>): Subscription;
}

export class FakeTopic<T> extends Topic<T> implements MockSubscribable<T> {
    /**
     * Returns the current value if the state is a BehaviorSubject, else throws an error.
     */
    getValue(): T {
      if (this.state instanceof BehaviorSubject) {
        return (this.state as BehaviorSubject<T>).getValue();
      }
      throw new Error('Only possible for FakeTopic with initial value');
    }
  private state: Subject<T>
  protected override isInit = false
  protected override data: BehaviorSubject<TopicDataMessage<T> | undefined>
  protected override readonly readBroadcastChannel: BroadcastChannel | undefined =
    typeof BroadcastChannel === 'undefined' ? undefined : new BroadcastChannel(`Topic-${this.name}|${this.version}`)
  
  constructor();
  constructor(initialValue: T);
  constructor(name: string, version: number);
  constructor(name: string, version: number, ...args: any[]);
  constructor(arg1?: string | T, arg2?: number, ...args: any[]) {
    let name = 'mock'
    let version = 0
    let initialValue: T | undefined = undefined

    if (typeof arg1 === 'string' && typeof arg2 === 'number') {
      name = arg1;
      version = arg2;
      if (args.length > 0) {
        initialValue = args[0];
      }
    } else if (typeof arg1 === 'string') {
      name = arg1;
    } else if (typeof arg2 === 'undefined' && arg1 !== undefined) {
      initialValue = arg1 as T;
    }
    super(name, version);
    if (initialValue !== undefined) {
      this.state = new BehaviorSubject<T>(initialValue);
      this.data = new BehaviorSubject<TopicDataMessage<T> | undefined>({ data: initialValue } as TopicDataMessage<T>);
      this.isInit = true;
    } else {
      this.state = new ReplaySubject<T>(1);
      this.data = new BehaviorSubject<TopicDataMessage<T> | undefined>(undefined);
    }
  }

  override get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }

  override asObservable(): Observable<T> {
    return this.state.asObservable()
  }

  public override publish(value: T): Promise<void> {
    try {
      this.state.next(value)
    } catch (e) {
      console.error('Error publishing to FakeTopic', e)
    }
    return Promise.resolve()
  }

  override subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription;
  override subscribe(
    next?: ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Subscription;
  override subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Subscription {
    return (this.asObservable() as any).subscribe(observerOrNext as any, error as any, complete as any);
  }

  override pipe(...operations: any[]): any {
    return (this.asObservable() as any).pipe(...operations)
  }

  /**
   * @deprecated source is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  override get source() {
    return (this.state as any).source
  }

  /**
   * @deprecated operator is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  override get operator() {
    return (this.state as any).operator
  }

  /**
   * @deprecated lift is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  override lift<R>(operator: OperatorFunction<T, R>): Observable<R> {
    return (this.state as any).lift(operator)
  }

  /**
   * @deprecated foreach is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  override forEach(next: (value: T) => void, thisArg?: any): Promise<void> {
    return (this.state as any).forEach(next, thisArg)
  }

  /**
   * @deprecated toPromise is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  override toPromise(): Promise<T | undefined> {
    return (this.state as any).toPromise()
  }

  override destroy(): void {
    this.state.complete()
  }  
}