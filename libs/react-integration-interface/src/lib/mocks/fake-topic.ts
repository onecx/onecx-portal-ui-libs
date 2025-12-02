import { Topic } from '@onecx/accelerator';
import {
  Subject,
  Observable,
  Observer,
  Subscription,
  UnaryFunction,
  ReplaySubject,
} from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export class FakeTopic<T> extends Topic<T> {
  private currentPath$ = new BehaviorSubject<string>(
    document.location.pathname
  );
  private state: Subject<T>;

  constructor(initialValue: T | undefined = undefined) {
    super('fakeTopic', 1);
    this.watchForPathChanges();

    if (initialValue !== undefined) {
      this.state = new BehaviorSubject<T>(initialValue);
    } else {
      this.state = new ReplaySubject<T>(1);
    }
  }
  asObservable(): Observable<T> {
    return this.state.asObservable();
  }

  getValue(): T | undefined {
    return this.isInit ? this.data.value?.data : undefined;
  }

  subscribe(
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void),
    error?: (error: unknown) => void,
    complete?: () => void
  ): Subscription {
    if (typeof observerOrNext === 'function') {
      return (this.asObservable() as Observable<T>).subscribe(
        observerOrNext,
        error,
        complete
      );
    } else if (observerOrNext && typeof observerOrNext === 'object') {
      return (this.asObservable() as Observable<T>).subscribe({
        next: observerOrNext.next?.bind(observerOrNext),
        error: observerOrNext.error?.bind(observerOrNext),
        complete: observerOrNext.complete?.bind(observerOrNext),
      });
    } else {
      return (this.asObservable() as Observable<T>).subscribe();
    }
  }

  pipe(
    ...operations: UnaryFunction<Observable<T>, Observable<T>>[]
  ): Observable<T> {
    return (this.asObservable() as any).pipe(...operations);
  }

  publish(value: T): Promise<void> {
    this.state.next(value);
    return Promise.resolve();
  }
  destroy() {
    this.state.complete();
  }
  next(value: T) {
    this.state.next(value);
  }

  private watchForPathChanges() {
    const body = document.querySelector('body');
    if (body === null) {
      console.error('could not listen to location changes');
      throw new Error('could not listen to location changes');
    }
    const observer = new MutationObserver(() => {
      this.currentPath$.next(document.location.pathname);
    });
    observer.observe(body, { childList: true, subtree: true });
  }
}
