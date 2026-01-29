import { TestBed } from '@angular/core/testing'
import { observableOutput, ObservableOutputEmitterRef } from './observable-output.utils'

describe('ObservableOutputEmitterRef', () => {
  const emitOnOutput = <T>(out: ObservableOutputEmitterRef<T>, value: T) => {
    out.emit(value)
  }

  it('output not subscribed and emit called', () => {
    const out = TestBed.runInInjectionContext(() => observableOutput<number>())

    expect(() => emitOnOutput(out, 1)).not.toThrow()
    // no listeners -> observed should remain false
    expect(out.observed()).toBe(false)
  })

  it('output not subscribed and observed used', () => {
    const out = TestBed.runInInjectionContext(() => observableOutput<string>())

    expect(out.observed()).toBe(false)

    // using observed should not mutate state
    expect(out.observed()).toBe(false)

    // also ensure emit doesn't flip it
    emitOnOutput(out, 'x')
    expect(out.observed()).toBe(false)
  })

  it('output subscribed and emit called', () => {
    const out = TestBed.runInInjectionContext(() => observableOutput<number>())

    const received: number[] = []
    const sub = out.subscribe((v) => received.push(v))

    expect(out.observed()).toBe(true)

    emitOnOutput(out, 123)
    emitOnOutput(out, 456)

    expect(received).toEqual([123, 456])

    sub.unsubscribe()
    expect(out.observed()).toBe(false)
  })

  it('output subscribed and observed used', () => {
    const out = TestBed.runInInjectionContext(() => observableOutput<void>())

    expect(out.observed()).toBe(false)

    const sub = out.subscribe(() => {
      /* noop */
    })

    expect(out.observed()).toBe(true)

    sub.unsubscribe()
    expect(out.observed()).toBe(false)
  })
})
