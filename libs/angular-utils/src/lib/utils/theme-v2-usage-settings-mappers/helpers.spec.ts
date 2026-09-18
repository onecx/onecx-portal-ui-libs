import { BehaviorSubject } from 'rxjs'

import { asBoolean, asEnum, asNumber, asObservable, defineUsageSettingsMapper, mapValues } from './helpers'

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

describe('theme-usage-mappers helpers', () => {
  it('should map booleans and enums declaratively', () => {
    const mapSettings = defineUsageSettingsMapper({
      enabled: {
        from: 'enabledFlag',
        transform: asBoolean,
      },
      direction: {
        from: 'position',
        transform: mapValues({
          start: 'left',
          end: 'right',
        } as const),
      },
      variant: {
        from: 'variant',
        transform: asEnum(['solid', 'outline'] as const),
      },
      delay: {
        from: 'delay',
        transform: asNumber,
      },
    })

    expect(
      mapSettings({
        enabledFlag: true,
        position: 'start',
        variant: 'outline',
        delay: 300,
      })
    ).toEqual({
      enabled: true,
      direction: 'left',
      variant: 'outline',
      delay: 300,
    })
  })

  it('should drop values that the transforms cannot apply', () => {
    const mapSettings = defineUsageSettingsMapper({
      enabled: {
        from: 'enabledFlag',
        transform: asBoolean,
      },
      delay: {
        from: 'delay',
        transform: asNumber,
      },
    })

    expect(
      mapSettings({
        enabledFlag: '{{primitives.boolean}}',
        delay: '{{primitives.delay}}',
      } as never)
    ).toEqual({})
  })

  it('should expose target keys for runtime tracking', () => {
    const mapSettings = defineUsageSettingsMapper({
      enabled: {
        from: 'enabledFlag',
        transform: asBoolean,
      },
      delay: {
        from: 'delay',
        transform: asNumber,
      },
    })

    expect(mapSettings.targetKeys).toEqual(['enabled', 'delay'])
  })
})