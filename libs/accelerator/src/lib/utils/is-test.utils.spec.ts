/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { isTest } from './is-test.utils'

describe('isTest', () => {
  const originalJasmine = Reflect.get(globalThis, 'jasmine')
  const proc = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process
  const originalWorkerId = proc?.env?.['JEST_WORKER_ID']

  afterEach(() => {
    Reflect.set(globalThis, 'jasmine', originalJasmine)

    if (!proc?.env) {
      return
    }

    if (originalWorkerId === undefined) {
      delete proc.env['JEST_WORKER_ID']
    } else {
      proc.env['JEST_WORKER_ID'] = originalWorkerId
    }
  })

  it('returns true when jasmine is present', () => {
    if (proc?.env) {
      delete proc.env['JEST_WORKER_ID']
    }
    Reflect.set(globalThis, 'jasmine', {})

    expect(isTest()).toBe(true)
  })

  it('returns true when JEST_WORKER_ID is set', () => {
    if (!proc?.env) {
      return
    }
    Reflect.set(globalThis, 'jasmine', undefined)
    proc.env['JEST_WORKER_ID'] = '1'

    expect(isTest()).toBe(true)
  })

  it('returns false when neither jasmine nor JEST_WORKER_ID is set', () => {
    if (proc?.env) {
      delete proc.env['JEST_WORKER_ID']
    }
    Reflect.set(globalThis, 'jasmine', undefined)

    expect(isTest()).toBe(false)
  })
})
