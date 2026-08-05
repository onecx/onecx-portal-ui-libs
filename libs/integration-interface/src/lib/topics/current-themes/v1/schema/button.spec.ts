import { expectTokens, expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
    button,
    buttonDisplayVariant,
    buttonLinkVariant,
    buttonSize,
    buttonSizes,
} from './button'

describe('button schema', () => {
    it('parses an empty object', () => {
        const result = button.safeParse({})

        expect(result.success).toBe(true)
    })

    describe('button tokens', () => {
        it('should apply root defaults', () => {
            const result = button.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data as any
            expectExactUndefinedTokens(value, button.shape, ['sizes', 'icon'])
            expectTokens(value, {
                transition: {
                    duration: '{{primitives.transition.duration}}',
                },
                fontSize: '{{primitives.font.size}}',
                disabledOpacity: '0.6',
                roundedBorderRadius: '{{primitives.radius.full}}',
                raisedShadow: '{{primitives.shadow.md}}',
                badgeSize: '{{primitives.space.lg}}',
                border: expect.any(Object),
                layout: expect.any(Object),
                focusRing: expect.any(Object),
                text: expect.any(Object),
                state: expect.any(Object),
            })
        })

        describe('root flattened defaults', () => {
            it('should apply defaults for border, layout, focusRing, text', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any
                expectTokens(value, {
                    border: {
                        width: '{{primitives.border.width.sm}}',
                        radius: '{{primitives.radius.md}}',
                    },
                    layout: {
                        gap: '{{primitives.space.xs}}',
                        paddingX: '{{primitives.space.md}}',
                        paddingY: '{{primitives.space.sm}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    focusRing: {
                        width: '{{primitives.focusRing.width.sm}}',
                        style: '{{primitives.focusRing.style}}',
                        color: '{{primitives.variant.primary.defaultState.defaultSeverity.focusRing.color}}',
                        offset: '{{primitives.focusRing.offset.sm}}',
                        shadow: '{{primitives.variant.primary.defaultState.defaultSeverity.focusRing.shadow}}',
                    },
                    text: {
                        fontWeight: '{{primitives.font.weight}}',
                    },
                })
            })
        })

        describe('variants', () => {
            it('should apply defaults for textVariant', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any
                expectExactUndefinedTokens(value?.textVariant, buttonDisplayVariant.shape, ['focusRing', 'icon', 'text'])
                expectExactTokens(value?.textVariant, {
                    border: {
                        width: '{{primitives.border.width.sm}}',
                        radius: '{{primitives.radius.md}}',
                    },
                    layout: {
                        gap: '{{primitives.space.xs}}',
                        paddingX: '{{primitives.space.md}}',
                        paddingY: '{{primitives.space.sm}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    defaultState: expect.any(Object),
                    state: expect.any(Object),
                })
            })

            it('should apply defaults for outlined', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any
                expectExactUndefinedTokens(value?.outlined, buttonDisplayVariant.shape, ['focusRing', 'icon', 'text'])
                expectExactTokens(value?.outlined, {
                    border: {
                        width: '{{primitives.border.width.sm}}',
                        radius: '{{primitives.radius.md}}',
                    },
                    layout: {
                        gap: '{{primitives.space.xs}}',
                        paddingX: '{{primitives.space.md}}',
                        paddingY: '{{primitives.space.sm}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    defaultState: expect.any(Object),
                    state: expect.any(Object),
                })
            })

            it('should apply defaults for rounded', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any
                expectExactUndefinedTokens(value?.rounded, buttonDisplayVariant.shape, ['focusRing', 'icon', 'text'])
                expectExactTokens(value?.rounded, {
                    border: {
                        width: '{{primitives.border.width.sm}}',
                        radius: '{{primitives.radius.full}}',
                    },
                    layout: {
                        gap: '{{primitives.space.xs}}',
                        paddingX: '{{primitives.space.md}}',
                        paddingY: '{{primitives.space.sm}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    defaultState: expect.any(Object),
                    state: expect.any(Object),
                })
            })

            it('should apply defaults for raised', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any
                expectExactUndefinedTokens(value?.raised, buttonDisplayVariant.shape, ['focusRing', 'icon', 'text'])
                expectExactTokens(value?.raised, {
                    border: {
                        width: '{{primitives.border.width.sm}}',
                        radius: '{{primitives.radius.md}}',
                    },
                    layout: {
                        gap: '{{primitives.space.xs}}',
                        paddingX: '{{primitives.space.md}}',
                        paddingY: '{{primitives.space.sm}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    defaultState: expect.any(Object),
                    state: expect.any(Object),
                })
            })

            it('should apply defaults for link', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any
                expectExactUndefinedTokens(value?.link, buttonLinkVariant.shape, [])
                expectExactTokens(value?.link, {
                    color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
                    hover: {
                        color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
                    },
                    active: {
                        color: '{{primitives.variant.primary.state.active.defaultSeverity.contrast}}',
                    },
                })
            })

            it('should include severity combinations on non-default states', () => {
                const result = button.safeParse({})

                expect(result.success).toBe(true)

                const value = result.data as any

                expectExactTokens(
                    value?.state?.hover?.severity?.success,
                    {
                        background: '{{primitives.variant.primary.state.hover.severity.success.bg}}',
                        color: '{{primitives.variant.primary.state.hover.severity.success.contrast}}',
                        border: {
                            color: '{{primitives.variant.primary.state.hover.severity.success.border.color}}',
                            style: '{{primitives.variant.primary.state.hover.severity.success.border.style}}',
                            width: '{{primitives.border.width.sm}}',
                        },
                    }
                )

                expectExactTokens(
                    value?.outlined?.state?.focus?.severity?.info,
                    {
                        background: '{{primitives.variant.tertiary.state.focus.severity.info.bg}}',
                        color: '{{primitives.variant.tertiary.state.focus.severity.info.contrast}}',
                        border: {
                            color: '{{primitives.variant.tertiary.state.focus.severity.info.border.color}}',
                            style: '{{primitives.variant.tertiary.state.focus.severity.info.border.style}}',
                            width: '{{primitives.border.width.sm}}',
                        },
                        focusRing: {
                            width: '{{primitives.focusRing.width.sm}}',
                            style: '{{primitives.focusRing.style}}',
                            color: '{{primitives.variant.tertiary.state.focus.severity.info.focusRing.color}}',
                            offset: '{{primitives.focusRing.offset.sm}}',
                            shadow: '{{primitives.variant.tertiary.state.focus.severity.info.focusRing.shadow}}',
                        },
                    }
                )
            })
        })

        describe('sizes', () => {
            it('should apply defaults', () => {
                const result = button.safeParse({ sizes: {} })

                expect(result.success).toBe(true)

                const value = result.data as any
                expectExactUndefinedTokens(value?.sizes, buttonSizes.shape, [])
                expectExactTokens(value?.sizes, {
                    md: {
                        fontSize: '{{primitives.font.size}}',
                        paddingX: '{{primitives.space.md}}',
                        paddingY: '{{primitives.space.sm}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    sm: {
                        fontSize: '{{primitives.font.size}}',
                        paddingX: '{{primitives.space.sm}}',
                        paddingY: '{{primitives.space.xs}}',
                        iconOnlyWidth: '{{primitives.space.lg}}',
                    },
                    lg: {
                        fontSize: '{{primitives.font.size}}',
                        paddingX: '{{primitives.space.lg}}',
                        paddingY: '{{primitives.space.md}}',
                        iconOnlyWidth: '{{primitives.space.xl}}',
                    },
                })

                expectExactUndefinedTokens(value?.sizes?.md, buttonSize.shape, [])
                expectExactUndefinedTokens(value?.sizes?.sm, buttonSize.shape, [])
                expectExactUndefinedTokens(value?.sizes?.lg, buttonSize.shape, [])
            })
        })
    })
})
