import { filter, map } from 'rxjs/operators'
import { BehaviorSubject, Observable, Observer, OperatorFunction, Subscribable, Subscription, UnaryFunction } from 'rxjs'
import { TopicDataMessage } from './topic-data-message'
import { TopicMessage } from './topic-message'
import { TopicMessageType } from './topic-message-type'

export class Topic<T> implements Subscribable<T>{
  public isInitialized: Promise<void>
  private data = new BehaviorSubject<TopicDataMessage<T> | undefined>(undefined)

  private isInit = false
  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private eventListener = (m: MessageEvent<TopicMessage>) => this.onMessage(m)

  constructor(private name: string, private version: number) {
    this.isInitialized = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    });
    window.addEventListener('message', this.eventListener)
    const message = new TopicMessage(TopicMessageType.TopicGet, this.name, this.version);
    window.postMessage(message, '*')
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

  /**
   * This function does not offer read after write consistency!
   * This means you cannot call it directly after publish, because the new value will not be there yet!
   * This function will return undefined unti the isInitialized promise is resolved.
   * @returns the current value of the topic in a synchronous way
   */
  getValue(): T | undefined {
    return this.isInit ? (<TopicDataMessage<T>>this.data.value).data : undefined
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

  publish(value: T) {
    const message = new TopicDataMessage<T>(TopicMessageType.TopicNext, this.name, this.version, value);
    window.postMessage(message, '*')
  }

  destroy() {
    window.removeEventListener('message', this.eventListener, true)
  }

  private onMessage(m: MessageEvent<TopicMessage>): any {
    switch (m.data.type) {
      case TopicMessageType.TopicNext:
        if (
          m.data.name === this.name &&
          m.data.version === this.version &&
          (!this.data.value || (this.isInit && (<TopicMessage>m.data).timestamp > this.data.value.timestamp))
        ) {
          this.isInit = true
          this.data.next(<TopicDataMessage<T>>m.data)
          this.resolveInitPromise()
        }
        break
      case TopicMessageType.TopicGet:
        if (m.data.name === this.name && m.data.version === this.version && this.isInit && this.data.value) {
          window.postMessage(this.data.value, '*')
          m.stopImmediatePropagation()
          m.stopPropagation()
        }
        break
    }
  }
}
