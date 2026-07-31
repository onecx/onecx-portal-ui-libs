import { tabs } from './tabs'

describe('tabs schema', () => {
    it('parses an empty object', () => {
    const result = tabs.safeParse({})

    expect(result.success).toBe(true)
    })

    describe('tabs tokens', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
            expect(value?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
            expect(value?.gap).toBe('{{primitives.space.md}}')
            expect(value?.focusRing).toStrictEqual({
                radius: '{{primitives.focusRing.radius}}',
                offset: '{{primitives.focusRing.offset}}',
                width: '{{primitives.focusRing.width}}',
                shadow: '{{primitives.focusRing.shadow}}',
            })
            expect(value?.shadow).toBe('{{primitives.shadow.none}}')
            expect(value?.settings).toBeDefined()
            expect(value?.tablist).toBeDefined()
            expect(value?.tabpanel).toBeDefined()
            expect(value?.navButtons).toBeDefined()
            expect(value?.tab).toBeDefined()
            expect(value?.viewport).toBeDefined()
        })
    })

    describe('tabs nav buttons', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.navButtons).toBeDefined()
            expect(value?.navButtons?.nextIcon).toBeDefined()
            expect(value?.navButtons?.prevIcon).toBeDefined()
        })
    })

    describe('tabs viewport', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.viewport).toBeDefined()
            expect(value?.viewport?.overscrollBehavior).toBe('contain auto')
            expect(value?.viewport?.scrollBehavior).toBe('smooth')
            expect(value?.viewport?.scrollbarWidth).toBe('none')
            expect(value?.viewport?.webkitScrollbarDisplay).toBe('none')
        })
    })

    describe('tabs active bar', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tab?.activeBar).toBeDefined()
            expect(value?.tab?.activeBar?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
            expect(value?.tab?.activeBar?.size).toBe('{{primitives.border.width.sm}}')
            expect(value?.tab?.activeBar?.bottom).toBe('{{primitives.space.none}}')
            expect(value?.tab?.activeBar?.transition).toBeDefined()
            expect(value?.tab?.activeBar?.transition?.duration).toBe('{{primitives.transition.duration}}')
            expect(value?.tab?.activeBar?.shadow).toBe('{{primitives.shadow.none}}')
        })
    })

    describe('tabs list', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tablist).toBeDefined()
            expect(value?.tablist?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
            expect(value?.tablist?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
            expect(value?.tablist?.gap).toBe('{{primitives.space.md}}')
            expect(value?.tablist?.paddingX).toBe('{{primitives.space.md}}')
            expect(value?.tablist?.paddingY).toBe('{{primitives.space.md}}')
            expect(value?.tablist?.border).toBeDefined()
            expect(value?.tablist?.border?.width).toBe('{{primitives.border.width.none}}')
            expect(value?.tablist?.border?.radius).toBe('{{primitives.border.radius.none}}')
            expect(value?.tablist?.border?.offset).toBe('{{primitives.border.offset.none}}')
            expect(value?.tablist?.border?.style).toBe('{{primitives.border.style}}')
            expect(value?.tablist?.border?.color).toBe('{{primitives.border.color}}')
        })
    })

    describe('tabs list content', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tablist?.content).toBeDefined()
            expect(value?.tablist?.content?.gap).toBe('{{primitives.space.md}}')
            expect(value?.tablist?.content?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
            expect(value?.tablist?.content?.border).toBeDefined()
            expect(value?.tablist?.content?.border?.width).toBe('{{primitives.border.width.none}}')
            expect(value?.tablist?.content?.border?.radius).toBe('{{primitives.border.radius.sm}}')
            expect(value?.tablist?.content?.border?.offset).toBe('{{primitives.border.offset.none}}')
            expect(value?.tablist?.content?.border?.style).toBe('{{primitives.border.style.solid}}')
            expect(value?.tablist?.content?.border?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.border}}')
        })
    })

    describe('tabs tab', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tab).toBeDefined()
            expect(value?.tab?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
            expect(value?.tab?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
            expect(value?.tab?.paddingX).toBe('{{primitives.space.md}}')
            expect(value?.tab?.paddingY).toBe('{{primitives.space.md}}')
            expect(value?.tab?.alignItems).toBe('{{primitives.layout.alignItems}}')
            expect(value?.tab?.gap).toBe('{{primitives.space.md}}')
            expect(value?.tab?.icon).toBeDefined()
            expect(value?.tab?.activeBar).toBeDefined()
            expect(value?.tab?.tooltip).toBeDefined()
            expect(value?.tab?.border).toBeDefined()
            expect(value?.tab?.border?.width).toBe('{{primitives.border.width.none}}')
            expect(value?.tab?.border?.radius).toBe('{{primitives.border.radius.none}}')
            expect(value?.tab?.border?.offset).toBe('{{primitives.border.offset.none}}')
            expect(value?.tab?.border?.style).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}')
            expect(value?.tab?.border?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}')
        })

        it('should apply defaults for hover state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tab?.hover).toBeDefined()
            expect(value?.tab?.hover?.background).toBe('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}')
            expect(value?.tab?.hover?.color).toBe('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}')
            expect(value?.tab?.hover?.cursor).toBe('{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}')
            expect(value?.tab?.hover?.border).toBeDefined()
            expect(value?.tab?.hover?.border?.width).toBe('{{primitives.border.width.none}}')
            expect(value?.tab?.hover?.border?.radius).toBe('{{primitives.border.radius.none}}')
            expect(value?.tab?.hover?.border?.offset).toBe('{{primitives.border.offset.none}}')
            expect(value?.tab?.hover?.border?.style).toBe('{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}')
            expect(value?.tab?.hover?.border?.color).toBe('{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}')
            expect(value?.tab?.hover?.font).toBeDefined()
            expect(value?.tab?.hover?.font?.weight).toBe('{{primitives.defaultVariant.state.hover.defaultSeverity.font.weight}}')
        })

        it('should apply defaults for focus state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tab?.focus).toBeDefined()
            expect(value?.tab?.focus?.background).toBe('{{primitives.defaultVariant.focusedState.defaultSeverity.bg}}')
            expect(value?.tab?.focus?.color).toBe('{{primitives.defaultVariant.focusedState.defaultSeverity.contrast}}')
            expect(value?.tab?.focus?.border).toBeDefined()
            expect(value?.tab?.focus?.border?.width).toBe('{{primitives.border.width.none}}')
            expect(value?.tab?.focus?.border?.radius).toBe('{{primitives.border.radius.none}}')
            expect(value?.tab?.focus?.border?.offset).toBe('{{primitives.border.offset.none}}')
            expect(value?.tab?.focus?.border?.style).toBe('{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}')
            expect(value?.tab?.focus?.border?.color).toBe('{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}')
            expect(value?.tab?.focus?.font).toBeDefined()
            expect(value?.tab?.focus?.font?.weight).toBe('{{primitives.defaultVariant.state.focus.defaultSeverity.font.weight}}')
        })

        it('should apply defaults for disabled state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)
            
            const value = result.data
            expect(value?.tab?.disabled).toBeDefined()
            expect(value?.tab?.disabled?.background).toBe('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}')
            expect(value?.tab?.disabled?.color).toBe('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}')
            expect(value?.tab?.disabled?.cursor).toBe('{{primitives.defaultVariant.state.disabled.defaultSeverity.cursor}}')
        })
    })


    describe('tabs panel', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expect(value?.tabpanel).toBeDefined()
            expect(value?.tabpanel?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
            expect(value?.tabpanel?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
            expect(value?.tabpanel?.paddingX).toBe('{{primitives.space.md}}')
            expect(value?.tabpanel?.paddingY).toBe('{{primitives.space.md}}')
            expect(value?.tabpanel?.alignItems).toBe('{{primitives.layout.alignItems}}')
            expect(value?.tabpanel?.justifyContent).toBe('{{primitives.layout.justifyContent}}')
            expect(value?.tabpanel?.font).toBeDefined()
            expect(value?.tabpanel?.font?.size).toBe('{{primitives.font.size.md}}')
            expect(value?.tabpanel?.font?.weight).toBe('{{primitives.font.weight.normal}}')
            expect(value?.tabpanel?.font?.lineHeight).toBe('{{primitives.font.lineHeight.md}}')
        }) 
    })
})
