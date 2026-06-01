import { composeProviders } from './composeProviders'

describe('composeProviders', () => {
  it('should return the component unchanged when no providers are given', () => {
    const TestComponent = (props: { value: string }) => props.value
    const composed = (composeProviders as any)()(TestComponent)
    expect(composed).toBe(TestComponent)
  })

  it('should apply a single provider', () => {
    const TestComponent = (props: { value: string }) => props.value
    const provider = (Comp: any) => (props: any) => Comp({ value: 'injected' })
    const composed = (composeProviders as any)(provider)(TestComponent)
    expect(composed({})).toBe('injected')
  })

  it('should compose multiple providers from right to left', () => {
    const calls: string[] = []
    const TestComponent = (props: { value: string }) => {
      calls.push('component')
      return props.value
    }
    const providerA = (Comp: any) => (props: any) => {
      calls.push('A')
      return Comp({ value: 'fromA' })
    }
    const providerB = (Comp: any) => (props: any) => {
      calls.push('B')
      return Comp({ value: 'fromB' })
    }
    const composed = (composeProviders as any)(providerA, providerB)(TestComponent)
    const result = composed({})
    expect(result).toBe('fromB')
    expect(calls).toEqual(['A', 'B', 'component'])
  })
})
