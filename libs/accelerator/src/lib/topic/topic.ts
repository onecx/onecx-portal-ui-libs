import { filter, map } from 'rxjs/operators'
import {
  BehaviorSubject,
  Observable,
  Observer,
  OperatorFunction,
  Subscribable,
  Subscription,
  UnaryFunction,
} from 'rxjs'
import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'
import { TopicPublisher } from './topic-publisher'
import { TopicResolveMessage } from './topic-resolve-message'
import '../declarations'

export class Topic<T> extends TopicPublisher<T> implements Subscribable<T> {
  protected isInitializedPromise: Promise<void>
  protected data = new BehaviorSubject<TopicDataMessage<T> | undefined>(undefined)

  protected isInit = false
  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private readonly windowEventListener = (m: MessageEvent<TopicMessage>) => this.onWindowMessage(m)


  constructor(name: string, version: number, sendGetMessage = true) {
    super(name, version)
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate ??= Date.now()

    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    })
    window.addEventListener('message', this.windowEventListener)
    this.broadcastChannel?.addEventListener('message', (m) =>this.onBroadcastChannelMessage(m))

    if (sendGetMessage) {
      if (Date.now() - window['@onecx/accelerator'].topic.initDate < 2000) {
        // Delay the get message a bit to give other topics time to initialize
        setTimeout(() => {
          if (!this.isInit) {
            const message = new TopicMessage(TopicMessageType.TopicGet, this.name, this.version)
            this.sendMessage(message)
          }
        }, 100);
      }
      else {
        const message = new TopicMessage(TopicMessageType.TopicGet, this.name, this.version)
        this.sendMessage(message)
      }
    }
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }

  asObservable(): Observable<T> {
    return this.data.asObservable().pipe(
      filter(() => this.isInit),
      map((d) => (<TopicDataMessage<T>>d).data)
    )
  }

  subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription;
  /** @deprecated is deprecated in rxjs. This is only here to be compatible with the interface. */
  subscribe(next?: ((value: T) => void) | null, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription;
  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null,
    error?: (error: any) => void | null,
    complete?: () => void | null
  ): Subscription {
    return (<any>this.asObservable()).subscribe(observerOrNext, error, complete)
  }

  pipe(): Observable<T>
  pipe<A>(op1: UnaryFunction<Observable<T>, A>): A
  pipe<A, B>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>): B
  pipe<A, B, C>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>): C
  pipe<A, B, C, D>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>
  ): D
  pipe<A, B, C, D, E>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>
  ): E
  pipe<A, B, C, D, E, F>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>
  ): F
  pipe<A, B, C, D, E, F, G>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>
  ): G
  pipe<A, B, C, D, E, F, G, H>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>
  ): H
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>
  ): I
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
    ...operations: OperatorFunction<any, any>[]
  ): Observable<unknown>
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
    ...operations: UnaryFunction<any, any>[]
  ): unknown

  pipe(...operations: UnaryFunction<any, any>[]): unknown {
    return (<any>this.asObservable()).pipe(...operations)
  }

  /**
   * @deprecated source is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get source() {
    return this.asObservable().source
  }

  /**
   * @deprecated operator is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  get operator() {
    return this.asObservable().operator
  }

  /**
   * @deprecated lift is deprecated in rxjs. This is only here to be compatible with the interface.
   */
  lift<R>(operator: OperatorFunction<T, R>): Observable<R> {
    return this.asObservable().lift(operator)
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


  destroy() {
    window.removeEventListener('message', this.windowEventListener, true)
    this.broadcastChannel?.close()
  }

  private onWindowMessage(m: MessageEvent<TopicMessage>): any {
    if (
      this.isLogEnabled() &&
      m.data?.name === this.name &&
      m.data?.version === this.version
    ) {
      console.log('Topic', this.name, ':', this.version, 'received message via window', m.data)
    }
    switch (m.data.type) {
      case TopicMessageType.TopicNext: {
        this.disableBroadcastChannel();
        if (m.data.name === this.name && m.data.version === this.version) {
          this.handleTopicNextMessage(m)
        }
        break
      }
      case TopicMessageType.TopicGet: {
        this.disableBroadcastChannel();
        if (m.data.name === this.name && m.data.version === this.version && this.isInit && this.data.value) {
          this.handleTopicGetMessage(m)
        }
        break
      }
      case TopicMessageType.TopicResolve: {
        this.disableBroadcastChannel();
        this.handleTopicResolveMessage(m)
        break
      }
    }
  }

  private onBroadcastChannelMessage(m: MessageEvent<TopicMessage>): any {
    if (
      this.isLogEnabled()
    ) {
      console.log('Topic', this.name, ':', this.version, 'received message', m.data)
    }
    switch (m.data.type) {
      case TopicMessageType.TopicNext: {
        this.handleTopicNextMessage(m)
        break
      }
      case TopicMessageType.TopicGet: {
        if (this.isInit && this.data.value) {
          this.handleTopicGetMessage(m)
        }
        break
      }
      case TopicMessageType.TopicResolve: {
        this.handleTopicResolveMessage(m)
        break
      }
    }
  }

  private disableBroadcastChannel() {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    if (window['@onecx/accelerator'].topic.useBroadcastChannel === true) {
      console.log('Disabling BroadcastChannel for topic');
    }
    window['@onecx/accelerator'].topic.useBroadcastChannel = false;
  }

  private isLogEnabled() {
    return window['@onecx/accelerator']?.topic?.debug?.includes(this.name)
  }

  private handleTopicResolveMessage(m: MessageEvent<TopicMessage>) {
    const publishPromiseResolver = this.publishPromiseResolver[(<TopicResolveMessage>m.data).resolveId]
    if (publishPromiseResolver) {
      try{
        publishPromiseResolver()
        m.stopImmediatePropagation()
        m.stopPropagation()
        delete this.publishPromiseResolver[(<TopicResolveMessage>m.data).resolveId]
      } catch (error) {
        console.error('Error handling TopicResolveMessage:', error);
      }
    }
  }

  private handleTopicGetMessage(m: MessageEvent<TopicMessage>) {
    if(this.data.value){
      this.sendMessage(this.data.value)
      m.stopImmediatePropagation()
      m.stopPropagation()
    }
  }

  private handleTopicNextMessage(m: MessageEvent<TopicMessage>) {
    if (!this.data.value ||
      (this.isInit &&
        (m.data).id !== undefined &&
        this.data.value.id !== undefined &&
        (m.data).id > this.data.value.id) ||
      (this.isInit && (m.data).timestamp > this.data.value.timestamp)) {
      this.isInit = true
      this.data.next(<TopicDataMessage<T>>m.data)
      this.resolveInitPromise()
    } else if (this.data.value &&
      this.isInit &&
      (m.data).timestamp === this.data.value.timestamp &&
      (((m.data).id && !this.data.value.id) || (!(m.data).id && this.data.value.id))) {
      console.warn(
        'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
      )
    }
  }
}
