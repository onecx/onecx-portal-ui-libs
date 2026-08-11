import { button } from './button'

describe('button schema', () => {
  it('parses an empty object', () => {
    const result = button.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('button tokens', () => {
    it('should apply defaults', () => {
      const result = button.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expect(value).toBeDefined()
      expect(value?.secondary).toBeDefined()
      expect(value?.background).toBeDefined()
    })

    describe('primary button (at root level)', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data

        expect(value).toBeDefined()
        expect(value?.background).toEqual(
          '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.bg}}'
        )
        expect(value?.color).toEqual(
          '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.contrast}}'
        )
        expect(value?.border).toEqual({
          color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        })
        expect(value?.paddingX).toEqual('{{primitives.space.md}}')
        expect(value?.paddingY).toEqual('{{primitives.space.sm}}')
        expect(value?.focusRing).toEqual({
          color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        })
      })

      it('should have severities inline at the root state', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data

        expect(value?.info?.background).toEqual(
          '{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.bg}}'
        )
        expect(value?.info?.border?.color).toEqual(
          '{{primitives.defaultVariant.defaultVariant.defaultState.severity.info.border.color}}'
        )
        expect(value?.warning?.background).toEqual(
          '{{primitives.defaultVariant.defaultVariant.defaultState.severity.warning.bg}}'
        )
      })

      it('should have severities inline for hover state', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const hover = value?.hover

        expect(hover).toBeDefined()
        expect(hover?.info?.background).toEqual(
          '{{primitives.defaultVariant.defaultVariant.state.hover.severity.info.bg}}'
        )
        expect(hover?.warning?.background).toEqual(
          '{{primitives.defaultVariant.defaultVariant.state.hover.severity.warning.bg}}'
        )
      })

      it('should have rounded variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const rounded = value?.rounded

        expect(rounded).toBeDefined()
        expect(rounded?.background).toEqual(
          '{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.bg}}'
        )
        expect(rounded?.color).toEqual(
          '{{primitives.defaultVariant.variant.rounded.defaultState.defaultSeverity.contrast}}'
        )
        expect(rounded?.border).toEqual({
          color: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.full}}',
          shadow: '{{primitives.shadow.none}}',
        })
        expect(rounded?.hover?.border?.radius).toEqual('{{primitives.radius.full}}')
        expect(rounded?.info?.background).toEqual(
          '{{primitives.defaultVariant.variant.rounded.defaultState.severity.info.bg}}'
        )
        expect(rounded?.hover?.warning?.background).toEqual(
          '{{primitives.defaultVariant.variant.rounded.state.hover.severity.warning.bg}}'
        )
      })

      it('should have raised variant with Correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const raised = value?.raised

        expect(raised).toBeDefined()
        expect(raised?.background).toEqual(
          '{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.bg}}'
        )
        expect(raised?.color).toEqual(
          '{{primitives.defaultVariant.variant.raised.defaultState.defaultSeverity.contrast}}'
        )
        expect(raised?.border?.shadow).toEqual('{{primitives.shadow.md}}')
        expect(raised?.hover?.border?.shadow).toEqual('{{primitives.shadow.md}}')
        expect(raised?.hover?.danger?.background).toEqual(
          '{{primitives.defaultVariant.variant.raised.state.hover.severity.danger.bg}}'
        )
      })

      it('should have text variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const textValue = value?.text

        expect(textValue).toBeDefined()
        expect(textValue?.background).toEqual(
          '{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.bg}}'
        )
        expect(textValue?.color).toEqual(
          '{{primitives.defaultVariant.variant.text.defaultState.defaultSeverity.contrast}}'
        )
        expect(textValue?.hover?.warning?.background).toEqual(
          '{{primitives.defaultVariant.variant.text.state.hover.severity.warning.bg}}'
        )
      })

      it('should have textRaised variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const textRaisedValue = value?.textRaised

        expect(textRaisedValue).toBeDefined()
        expect(textRaisedValue?.background).toEqual(
          '{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.bg}}'
        )
        expect(textRaisedValue?.color).toEqual(
          '{{primitives.defaultVariant.variant.raisedText.defaultState.defaultSeverity.contrast}}'
        )
        expect(textRaisedValue?.hover?.danger?.background).toEqual(
          '{{primitives.defaultVariant.variant.raisedText.state.hover.severity.danger.bg}}'
        )
      })

      it('should have outlined variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const outlinedValue = value?.outlined

        expect(outlinedValue).toBeDefined()
        expect(outlinedValue?.background).toEqual(
          '{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.bg}}'
        )
        expect(outlinedValue?.color).toEqual(
          '{{primitives.defaultVariant.variant.outlined.defaultState.defaultSeverity.contrast}}'
        )
        expect(outlinedValue?.hover?.info?.background).toEqual(
          '{{primitives.defaultVariant.variant.outlined.state.hover.severity.info.bg}}'
        )
      })
    })

    describe('secondary button', () => {
      it('should apply defaults', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const secondary = value?.secondary

        expect(secondary).toBeDefined()
        expect(secondary?.background).toEqual(
          '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.bg}}'
        )
        expect(secondary?.color).toEqual(
          '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.contrast}}'
        )
        expect(secondary?.border).toEqual({
          color: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.variant.primary.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        })
        expect(secondary?.hover?.background).toEqual(
          '{{primitives.variant.primary.defaultVariant.state.hover.defaultSeverity.bg}}'
        )
        expect(secondary?.warning?.background).toEqual(
          '{{primitives.variant.primary.defaultVariant.defaultState.severity.warning.bg}}'
        )
        expect(secondary?.hover?.info?.background).toEqual(
          '{{primitives.variant.primary.defaultVariant.state.hover.severity.info.bg}}'
        )
      })

      it('should have rounded variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const rounded = value?.secondary?.rounded

        expect(rounded).toBeDefined()
        expect(rounded?.border?.radius).toEqual('{{primitives.radius.full}}')
        expect(rounded?.info?.background).toEqual(
          '{{primitives.variant.primary.variant.rounded.defaultState.severity.info.bg}}'
        )
        expect(rounded?.hover?.danger?.background).toEqual(
          '{{primitives.variant.primary.variant.rounded.state.hover.severity.danger.bg}}'
        )
      })

      it('should have raised variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const raised = value?.secondary?.raised

        expect(raised).toBeDefined()
        expect(raised?.border?.shadow).toEqual('{{primitives.shadow.md}}')
        expect(raised?.warning?.background).toEqual(
          '{{primitives.variant.primary.variant.raised.defaultState.severity.warning.bg}}'
        )
        expect(raised?.hover?.success?.background).toEqual(
          '{{primitives.variant.primary.variant.raised.state.hover.severity.success.bg}}'
        )
      })

      it('should have text variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const textValue = value?.secondary?.text

        expect(textValue).toBeDefined()
        expect(textValue?.warning?.background).toEqual(
          '{{primitives.variant.primary.variant.text.defaultState.severity.warning.bg}}'
        )
        expect(textValue?.hover?.success?.background).toEqual(
          '{{primitives.variant.primary.variant.text.state.hover.severity.success.bg}}'
        )
      })

      it('should have textRaised variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const textRaisedValue = value?.secondary?.textRaised

        expect(textRaisedValue).toBeDefined()
        expect(textRaisedValue?.warning?.background).toEqual(
          '{{primitives.variant.primary.variant.raisedText.defaultState.severity.warning.bg}}'
        )
        expect(textRaisedValue?.hover?.success?.background).toEqual(
          '{{primitives.variant.primary.variant.raisedText.state.hover.severity.success.bg}}'
        )
      })

      it('should have outlined variant with correct overrides', () => {
        const result = button.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        const outlinedValue = value?.secondary?.outlined

        expect(outlinedValue).toBeDefined()
        expect(outlinedValue?.warning?.background).toEqual(
          '{{primitives.variant.primary.variant.outlined.defaultState.severity.warning.bg}}'
        )
        expect(outlinedValue?.hover?.success?.background).toEqual(
          '{{primitives.variant.primary.variant.outlined.state.hover.severity.success.bg}}'
        )
      })
    })
  })
})
