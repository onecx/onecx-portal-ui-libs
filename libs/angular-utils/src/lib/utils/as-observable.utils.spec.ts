import { BehaviorSubject } from 'rxjs'
import { asObservable } from './as-observable.utils'

describe('asObservable', () => {
  it('should return an Observable unchanged', () => {
    const observable = new BehaviorSubject('value').asObservable()

    expect(asObservable(observable)).toBe(observable)
  })

  it('should return the observable view exposed by a Topic-like source', () => {
    const observable = new BehaviorSubject('value').asObservable()
    const source = { asObservable: jest.fn(() => observable) }

    expect(asObservable(source)).toBe(observable)
    expect(source.asObservable).toHaveBeenCalledTimes(1)
  })
})