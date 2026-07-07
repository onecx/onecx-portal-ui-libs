import { asBoolean, asEnum, asNumber, defineUsageSettingsMapper, mapValues } from './helpers'

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