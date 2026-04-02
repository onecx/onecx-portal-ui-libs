/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { getLocation } from './path.utils'

describe('getLocation', () => {
  afterEach(() => {
    globalThis.document.head.querySelectorAll('base').forEach((b) => b.remove())
    globalThis.history.pushState({}, '', '/')
  })

  it('derives deploymentPath and applicationPath without a <base> tag', () => {
    globalThis.document.head.querySelectorAll('base').forEach((b) => b.remove())
    globalThis.history.pushState({}, '', '/app/workspace')

    const loc = getLocation()
    expect(loc.deploymentPath).toBe('/')
    expect(loc.applicationPath).toBe('/app/workspace')
  })

  it('derives deploymentPath and applicationPath from <base href>', () => {
    const base = globalThis.document.createElement('base')
    base.href = `${globalThis.location.origin}/deploy/`
    globalThis.document.head.appendChild(base)
    globalThis.history.pushState({}, '', '/deploy/workspace/app')

    const loc = getLocation()
    expect(loc.deploymentPath).toBe('/deploy/')
    expect(loc.applicationPath).toBe('/workspace/app')
  })
})
