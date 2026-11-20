import { EnvironmentInjector, createEnvironmentInjector, runInInjectionContext } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { injectInstanceIdSuffix } from './instance-id.utils'

describe('injectInstanceIdSuffix', () => {
  const create = (scope: string) => {
    const injector = createEnvironmentInjector([], TestBed.inject(EnvironmentInjector))
    const suffix = runInInjectionContext(injector, () => injectInstanceIdSuffix(scope))
    return { suffix, destroy: () => injector.destroy() }
  }

  it('should keep the legacy id for the first live instance and suffix further instances', () => {
    const first = create('scope-a')
    const second = create('scope-a')
    const third = create('scope-a')

    expect([first.suffix, second.suffix, third.suffix]).toEqual(['', '-1', '-2'])

    first.destroy()
    second.destroy()
    third.destroy()
  })

  it('should count instances per scope', () => {
    const a = create('scope-b')
    const b = create('scope-c')

    expect([a.suffix, b.suffix]).toEqual(['', ''])

    a.destroy()
    b.destroy()
  })

  it('should reuse the slot of a destroyed instance', () => {
    const first = create('scope-d')
    const second = create('scope-d')
    first.destroy()

    const third = create('scope-d')
    expect(third.suffix).toBe('')

    const fourth = create('scope-d')
    expect(fourth.suffix).toBe('-2')

    second.destroy()
    third.destroy()
    fourth.destroy()
  })
})
