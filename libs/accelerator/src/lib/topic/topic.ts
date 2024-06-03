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

export class Topic<T> extends TopicPublisher<T> implements Subscribable<T> {
  protected isInitializedPromise: Promise<void>
  protected data = new BehaviorSubject<TopicDataMessage<T> | undefined>(undefined)

  protected isInit = false
  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private eventListener = (m: MessageEvent<TopicMessage>) => this.onMessage(this.data.value, m)

  constructor(name: string, version: number, sendGetMessage = true) {
    super(name, version)

    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    })
    window.addEventListener('message', this.eventListener)

    if (sendGetMessage) {
      const message = new TopicMessage(TopicMessageType.TopicGet, this.name, this.version)
      window.postMessage(message, '*')
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

  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
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

  destroy() {
    window.removeEventListener('message', this.eventListener, true)
  }

  public onMessage(currentMessage: TopicDataMessage<T> | undefined, incomingMessage: MessageEvent<TopicMessage>): any {
    switch (incomingMessage.data.type) {
      case TopicMessageType.TopicNext:
        if (incomingMessage.data.name !== this.name || incomingMessage.data.version !== this.version) {
          break
        }

        if (
          !currentMessage ||
          (this.isInit &&
            (<TopicMessage>incomingMessage.data).id !== undefined &&
            currentMessage.id !== undefined &&
            (<TopicMessage>incomingMessage.data).id > currentMessage.id) ||
          (this.isInit && (<TopicMessage>incomingMessage.data).timestamp > currentMessage.timestamp)
        ) {
          this.isInit = true
          this.data.next(<TopicDataMessage<T>>incomingMessage.data)
          this.resolveInitPromise()
          const publishPromiseResolver = this.publishPromiseResolver[incomingMessage.data.timestamp]
          if (publishPromiseResolver) {
            publishPromiseResolver()
            delete this.publishPromiseResolver[incomingMessage.data.timestamp]
          }
        } else if (
          currentMessage &&
          this.isInit &&
          (<TopicMessage>incomingMessage.data).timestamp === currentMessage.timestamp &&
          ((<TopicMessage>incomingMessage.data).id || currentMessage.id)
        ) {
          console.warn(
            'Message was swallowed because of equal timestamps. Please upgrate to the latest version to ensure messages are correctly timed'
          )
        }
        break
      case TopicMessageType.TopicGet:
        if (
          incomingMessage.data.name === this.name &&
          incomingMessage.data.version === this.version &&
          this.isInit &&
          currentMessage
        ) {
          window.postMessage(currentMessage, '*')
          incomingMessage.stopImmediatePropagation()
          incomingMessage.stopPropagation()
        }
        break
    }
  }
}
