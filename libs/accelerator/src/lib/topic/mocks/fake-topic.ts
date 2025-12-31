import { Subject, Observable, Observer, Subscription, BehaviorSubject, ReplaySubject, OperatorFunction } from 'rxjs'
import { TopicMessage } from '../topic-message'

class MockTopicPublisher<T> {
  public name: string
  public version: number
  protected publishPromiseResolver: Record<number, () => void> = {}
  protected publishBroadcastChannel: BroadcastChannel | undefined
  constructor(name: string, version: number) {
    this.name = name
    this.version = version
  }
  public publish(_value: T): Promise<void> {
    return Promise.resolve()
  }
  protected createBroadcastChannel(): void {
    // No-op for mock
  }
  protected sendMessage(_message: any): void {
    // No-op for mock
  }
}

interface MockSubscribable<T> {
  subscribe(observer: Partial<Observer<T>>): Subscription;
}

export class FakeTopic<T> extends MockTopicPublisher<T> implements MockSubscribable<T> {
  private state: Subject<T>
  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private readonly windowEventListener = (m: MessageEvent<TopicMessage>) => this.onWindowMessage(m)

  protected isInit = false
  protected data: BehaviorSubject<T | undefined>
  protected isInitializedPromise: Promise<void>
  protected readonly readBroadcastChannel: BroadcastChannel | undefined = new BroadcastChannel(`Topic-${this.name}|${this.version}`)
  
  constructor()
  constructor(name: string, version: number)
  constructor(name: string, version: number, ...args: any[])
  constructor(name?: string, version?: number, ...args: any[]) {
    const initialValue: T | undefined = args.length > 0 ? args[0] : undefined;
    super(name ?? 'mock', version ?? 0);
    if (initialValue !== undefined) {
      this.state = new BehaviorSubject<T>(initialValue);
      this.data = new BehaviorSubject<T | undefined>(initialValue);
      this.isInit = true;
    } else {
      this.state = new ReplaySubject<T>(1);
      this.data = new BehaviorSubject<T | undefined>(undefined);
    }
    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve;
    });
  }

  private onBroadcastChannelMessage(_m: MessageEvent<TopicMessage>): any {
    // No-op for mock
  }

  protected disableBroadcastChannel(): void {
    // No-op for mock
  }

  protected isLogEnabled(): boolean {
    return false;
  }

  protected handleTopicResolveMessage(_m: any): void {
    // No-op for mock
  }

  protected handleTopicGetMessage(_m: any): void {
    // No-op for mock
  }

  protected handleTopicNextMessage(_m: any): void {
    // No-op for mock
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
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

  pipe(...operations: any[]): any {
    return (this.asObservable() as any).pipe(...operations)
  }

  /**
   * @deprecated source is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get source() {
    return (this.state as any).source
  }

  /**
   * @deprecated operator is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get operator() {
    return (this.state as any).operator
  }

  /**
   * @deprecated lift is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  lift<R>(operator: OperatorFunction<T, R>): Observable<R> {
    return (this.state as any).lift(operator)
  }

  /**
   * @deprecated foreach is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  forEach(next: (value: T) => void, thisArg?: any): Promise<void> {
    return (this.state as any).forEach(next, thisArg)
  }

  /**
   * @deprecated toPromise is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  toPromise(): Promise<T | undefined> {
    return (this.state as any).toPromise()
  }

  onWindowMessage(_messageEvent: MessageEvent<TopicMessage>): void {
    // No-op for mock
  }

  destroy(): void {
    this.state.complete()
  }  
}