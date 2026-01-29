import { assertInInjectionContext, OutputEmitterRef, Signal, signal } from '@angular/core'

class ListenerArray {
  private _listeners: Array<(...args: any[]) => void> = []
  observed = signal<boolean>(false)

  indexOf(listener: (...args: any[]) => void): number {
    return this._listeners.indexOf(listener)
  }

  splice(start: number, deleteCount: number): void {
    this._listeners.splice(start, deleteCount)
    this.observed.set(this._listeners.length > 0)
  }

  push(listener: (...args: any[]) => void): number {
    const pushResult = this._listeners.push(listener)
    this.observed.set(this._listeners.length > 0)
    return pushResult
  }

  [Symbol.iterator]() {
    return this._listeners[Symbol.iterator]()
  }
}

export class ObservableOutputEmitterRef<T> extends OutputEmitterRef<T> {
  observed: Signal<boolean>

  constructor() {
    super()
    ;(this as any).listeners = new ListenerArray()
    this.observed = (this as any).listeners.observed
  }
}

export function observableOutput<T>(): ObservableOutputEmitterRef<T> {
  ngDevMode && assertInInjectionContext(observableOutput)
  return new ObservableOutputEmitterRef<T>()
}
