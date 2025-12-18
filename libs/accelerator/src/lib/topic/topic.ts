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
import { increaseInstanceCount, isStatsEnabled } from '../utils/logs.utils'

export class Topic<T> extends TopicPublisher<T> implements Subscribable<T> {
  protected isInitializedPromise: Promise<void>
  protected data = new BehaviorSubject<TopicDataMessage<T> | undefined>(undefined)

  protected isInit = false
  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private eventListener = (m: MessageEvent<TopicMessage>) => this.onMessage(m)

  constructor(name: string, version: number, sendGetMessage = true) {
    super(name, version)

    if (isStatsEnabled()) {
      increaseInstanceCount(this.name)
    }

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

  private onMessage(m: MessageEvent<TopicMessage>): any {
    if (
      window['@onecx/accelerator']?.topic?.debug?.includes(this.name) &&
      m.data?.name === this.name &&
      m.data?.version === this.version
    ) {
      console.log('Topic', this.name, ':', this.version, 'received message', m.data)
    }
    switch (m.data.type) {
      case TopicMessageType.TopicNext: {
        if (m.data.name !== this.name || m.data.version !== this.version) {
          break
        }

        if (
          !this.data.value ||
          (this.isInit &&
            (<TopicMessage>m.data).id !== undefined &&
            this.data.value.id !== undefined &&
            (<TopicMessage>m.data).id > this.data.value.id) ||
          (this.isInit && (<TopicMessage>m.data).timestamp > this.data.value.timestamp)
        ) {
          this.isInit = true
          this.data.next(<TopicDataMessage<T>>m.data)
          this.resolveInitPromise()
        } else if (
          this.data.value &&
          this.isInit &&
          (<TopicMessage>m.data).timestamp === this.data.value.timestamp &&
          (((<TopicMessage>m.data).id && !this.data.value.id) || (!(<TopicMessage>m.data).id && this.data.value.id))
        ) {
          console.warn(
            'Message was dropped because of equal timestamps, because there was an old style message in the system. Please upgrade all libraries to the latest version.'
          )
        }
        break
      }
      case TopicMessageType.TopicGet: {
        if (m.data.name === this.name && m.data.version === this.version && this.isInit && this.data.value) {
          window.postMessage(this.data.value, '*')
          m.stopImmediatePropagation()
          m.stopPropagation()
        }
        break
      }
      case TopicMessageType.TopicResolve: {
        const publishPromiseResolver = this.publishPromiseResolver[(<TopicResolveMessage>m.data).resolveId]
        if (publishPromiseResolver) {
          publishPromiseResolver()
          delete this.publishPromiseResolver[(<TopicResolveMessage>m.data).resolveId]
        }
        break
      }
    }
  }
}
