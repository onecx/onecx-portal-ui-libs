import { normalizeKeys } from './normalize-preset-keys.utils'

describe('normalizeKeys', () => {
  it('should handle keys with multiple camelCase segments and leave the value as it is', () => {
    const input = { veryDeepCamelCaseKey: '{general.textSecondaryColor}' }
    const expected = {
      very: {
        deep: {
          camel: {
            case: {
              key: '{general.textSecondaryColor}',
            },
          },
        },
      },
    }
    expect(normalizeKeys(input)).toEqual(expected)
  })

  it('should preserve the colorScheme key as-is because it is excluded', () => {
    const input = {
      colorScheme: {
        primaryColor: '#123456',
        secondaryColor: '#654321',
      },
    }

    const expected = {
      colorScheme: {
        primary: { color: '#123456' },
        secondary: { color: '#654321' },
      },
    }

    expect(normalizeKeys(input)).toEqual(expected)
  })
})
