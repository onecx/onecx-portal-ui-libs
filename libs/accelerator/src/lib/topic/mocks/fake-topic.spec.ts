/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { map } from 'rxjs'
import type { Observable } from 'rxjs'
import { FakeTopic } from './fake-topic'

describe('FakeTopic', () => {
  it('publishes and subscribes (ReplaySubject path when no initial value)', async () => {
    const t = new FakeTopic<number>()

    const nextValues: number[] = []
    const completeFn = jest.fn()

    t.subscribe((v) => nextValues.push(v), null, completeFn)

    await t.publish(1)
    await t.publish(2)

    expect(nextValues).toEqual([1, 2])

    t.destroy()
    expect(completeFn).toHaveBeenCalled()
  })

  it('uses BehaviorSubject when initial value is provided and supports getValue()', () => {
    const t = new FakeTopic<string>('init')

    expect(t.getValue()).toBe('init')

    t.publish('next')
    expect(t.getValue()).toBe('next')

    t.destroy()
  })

  it('throws from getValue() when no initial value was provided', () => {
    const t = new FakeTopic<number>()

    expect(() => t.getValue()).toThrow('Only possible for FakeTopic with initial value')

    t.destroy()
  })

  it('exposes rxjs-compat helpers: source, operator, lift, pipe, forEach, toPromise', async () => {
    const t = new FakeTopic<number>(1)

    // Access deprecated properties
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    t.source
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    t.operator

    const lifted = t.lift((v: number) => v)
    expect(lifted).toBeTruthy()

    const doubled: number[] = []
    const doubled$ = t.pipe(map((v: number) => v * 2)) as unknown as Observable<number>
    doubled$.subscribe((v) => doubled.push(v))

    t.publish(2)
    t.publish(3)

    const forEachPromise = t.forEach(() => {})
    const toPromisePromise = t.toPromise()

    t.destroy()

    await expect(forEachPromise).resolves.toBeUndefined()
    await expect(toPromisePromise).resolves.toBe(3)

    expect(doubled).toEqual([2, 4, 6])
  })

    it('creates a Topic-compatible instance via FakeTopic.create()', async () => {
      const topicLike = FakeTopic.create('init')
      const values: string[] = []

      topicLike.subscribe((v) => values.push(v))

      await topicLike.publish('next')

      expect(values).toEqual(['init', 'next'])
      topicLike.destroy()
    })

  it('exposes isInitialized that resolves immediately', async () => {
    const t = new FakeTopic<boolean>()
    await expect(t.isInitialized).resolves.toBeUndefined()
    t.destroy()
  })
})
