import { badge, badgeDot } from './badge'
import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'

const BASE_STRUCTURAL = {
  font: {
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.full}}',
  },
  padding: '{{primitives.space.sm}}',
  minWidth: '1.5rem',
  height: '1.5rem',
}

const colorVariantDefaults: Record<string, { variant: string; severity?: string }> = {
  primary: { variant: 'primary' },
  secondary: { variant: 'secondary' },
  success: { variant: 'primary', severity: 'success' },
  info: { variant: 'primary', severity: 'info' },
  warning: { variant: 'primary', severity: 'warning' },
  danger: { variant: 'primary', severity: 'danger' },
  contrast: { variant: 'primary', severity: 'contrast' },
}

const severityRef = (variant: string, severity?: string) =>
  `{{primitives.variant.${variant}.defaultState.${severity ? `severity.${severity}` : 'defaultSeverity'}.`

describe('badge schema', () => {
  it('parses an empty object', () => {
    const result = badge.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('badge tokens', () => {
    it('should apply defaults', () => {
      const result = badge.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, badge.shape, ['settings'])
      expectExactTokens(value, {
        ...BASE_STRUCTURAL,
        dot: expect.any(Object),
        sm: expect.any(Object),
        lg: expect.any(Object),
        xl: expect.any(Object),
        primary: expect.any(Object),
        secondary: expect.any(Object),
        success: expect.any(Object),
        info: expect.any(Object),
        warning: expect.any(Object),
        danger: expect.any(Object),
        contrast: expect.any(Object),
      })
    })

    describe('settings', () => {
      it('should apply defaults when provided', () => {
        const result = badge.safeParse({ settings: {} })

        expect(result.success).toBe(true)

        expectExactTokens(result.data?.settings, {})
      })
    })

    describe('dot', () => {
      it('should apply defaults', () => {
        const result = badge.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.dot, badgeDot.shape, [])
        expectExactTokens(value?.dot, {
          size: '0.5rem',
        })
      })
    })

    describe('size variants', () => {
      it.each([
        ['sm', { fontSize: '{{primitives.font.size}}', minWidth: '1.25rem', height: '1.25rem' }],
        ['lg', { fontSize: '{{primitives.font.size}}', minWidth: '1.75rem', height: '1.75rem' }],
        ['xl', { fontSize: '{{primitives.font.size}}', minWidth: '2rem', height: '2rem' }],
      ])('should apply %s defaults', (size, expected) => {
        const result = badge.safeParse({})

        expect(result.success).toBe(true)

        expectExactTokens((result.data as any)?.[size], expected)
      })
    })

    describe('color variants', () => {
      it.each(Object.keys(colorVariantDefaults))('should apply %s defaults', (variant) => {
        const result = badge.safeParse({})

        expect(result.success).toBe(true)

        const { variant: v, severity } = colorVariantDefaults[variant]
        expectExactTokens((result.data as any)?.[variant], {
          background: `${severityRef(v, severity)}bg}}`,
          color: `${severityRef(v, severity)}contrast}}`,
        })
      })
    })
  })
})
