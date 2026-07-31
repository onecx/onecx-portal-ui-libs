import { tabs } from './tabs'
import {
  expectExactTokens,
  expectExactUndefinedTokens,
  expectTokens,
} from './test-utils'

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
            expectExactTokens(value, {
                background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
                gap: '{{primitives.space.md}}',
                focusRing: {
                    radius: '{{primitives.focusRing.radius}}',
                    offset: '{{primitives.focusRing.offset}}',
                    width: '{{primitives.focusRing.width}}',
                    shadow: '{{primitives.focusRing.shadow}}',
                },
                shadow: '{{primitives.shadow.none}}',
                settings: expect.any(Object),
                tablist: expect.any(Object),
                tabpanel: expect.any(Object),
                navButtons: expect.any(Object),
                tab: expect.any(Object),
                viewport: expect.any(Object),
            })
        })
    })

    describe('tabs nav buttons', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.navButtons, {
                nextIcon: '{{primitives.icon.arrowRight}}',
                prevIcon: '{{primitives.icon.arrowLeft}}',
            })
        })
    })

    describe('tabs viewport', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.viewport, {
                overscrollBehavior: 'contain auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                webkitScrollbarDisplay: 'none',
            })
        })
    })

    describe('tabs active bar', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tab?.activeBar, {
                background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
                size: '{{primitives.border.width.sm}}',
                bottom: '{{primitives.space.none}}',
                transition: {
                    duration: '{{primitives.transition.duration}}',
                },
                shadow: '{{primitives.shadow.none}}',
            })
        })
    })

    describe('tabs list', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tablist, {
                background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
                gap: '{{primitives.space.md}}',
                paddingX: '{{primitives.space.md}}',
                paddingY: '{{primitives.space.md}}',
                border: {
                    width: '{{primitives.border.width.none}}',
                    radius: '{{primitives.border.radius.none}}',
                    offset: '{{primitives.border.offset.none}}',
                    style: '{{primitives.border.style}}',
                    color: '{{primitives.border.color}}',
                },
                content: expect.any(Object),
            })
        })
    })

    describe('tabs list content', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tablist?.content, {
                background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
                gap: '{{primitives.space.md}}',
                border: {
                    width: '{{primitives.border.width.none}}',
                    radius: '{{primitives.border.radius.sm}}',
                    offset: '{{primitives.border.offset.none}}',
                    style: '{{primitives.border.style.solid}}',
                    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border}}',
                },
            })
        })
    })

    describe('tabs tab', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tab, {
                background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
                paddingX: '{{primitives.space.md}}',
                paddingY: '{{primitives.space.md}}',
                alignItems: '{{primitives.layout.alignItems}}',
                gap: '{{primitives.space.md}}',
                icon: expect.any(Object),
                activeBar: expect.any(Object),
                tooltip: expect.any(Object),
                border: {
                    width: '{{primitives.border.width.none}}',
                    radius: '{{primitives.border.radius.none}}',
                    offset: '{{primitives.border.offset.none}}',
                    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
                    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
                },
                hover: expect.any(Object),
                focus: expect.any(Object),
                active: expect.any(Object),
                disabled: expect.any(Object),
            })
        })

        it('should apply defaults for hover state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tab?.hover, {
                background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
                cursor: '{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}',
                border: {
                    width: '{{primitives.border.width.none}}',
                    radius: '{{primitives.border.radius.none}}',
                    offset: '{{primitives.border.offset.none}}',
                    style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
                    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
                },
                font: {
                    weight: '{{primitives.defaultVariant.state.hover.defaultSeverity.font.weight}}',
                },
            })
        })

        it('should apply defaults for active state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tab?.active, {
                background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
                border: {
                    width: '{{primitives.border.width.none}}',
                    radius: '{{primitives.border.radius.none}}',
                    offset: '{{primitives.border.offset.none}}',
                    style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
                    color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
                },
                font: {
                    weight: '{{primitives.defaultVariant.state.active.defaultSeverity.font.weight}}',
                },
            })
        })

        it('should apply defaults for focus state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tab?.focus, {
                background: '{{primitives.defaultVariant.focusedState.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.focusedState.defaultSeverity.contrast}}',
                border: {
                    width: '{{primitives.border.width.none}}',
                    radius: '{{primitives.border.radius.none}}',
                    offset: '{{primitives.border.offset.none}}',
                    style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
                    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
                },
                font: {
                    weight: '{{primitives.defaultVariant.state.focus.defaultSeverity.font.weight}}',
                },
            })
        })

        it('should apply defaults for disabled state', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)
            
            const value = result.data
            expectExactTokens(value?.tab?.disabled, {
                background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
                cursor: '{{primitives.defaultVariant.state.disabled.defaultSeverity.cursor}}',
            })
        })
    })

    describe('tabs panel', () => {
        it('should apply defaults', () => {
            const result = tabs.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.tabpanel, {
                background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
                paddingX: '{{primitives.space.md}}',
                paddingY: '{{primitives.space.md}}',
                alignItems: '{{primitives.layout.alignItems}}',
                justifyContent: '{{primitives.layout.justifyContent}}',
                font: {
                    size: '{{primitives.font.size.md}}',
                    weight: '{{primitives.font.weight.normal}}',
                    lineHeight: '{{primitives.font.lineHeight.md}}',
                },
            })
        })
    })
})
