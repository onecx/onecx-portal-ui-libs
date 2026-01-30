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

  it('normalizes flat camelCase keys', () => {
    const input = { hoverColor: '#fff' }
    const output = normalizeKeys(input)
    expect(output).toEqual({ hover: { color: '#fff' } })
  })

  it('normalizes nested camelCase keys', () => {
    const input = {
      hoverColor: {
        backgroundColor: '#eee',
      },
    }
    const output = normalizeKeys(input)
    expect(output).toEqual({
      hover: {
        color: {
          background: { color: '#eee' },
        },
      },
    })
  })

  it('handles mixed keys correctly', () => {
    const input = {
      hoverColor: '#fff',
      primitive: {
        baseColor: '#000',
      },
    }
    const output = normalizeKeys(input)
    expect(output).toEqual({
      hover: { color: '#fff' },
      primitive: { base: { color: '#000' } },
    })
  })
})
