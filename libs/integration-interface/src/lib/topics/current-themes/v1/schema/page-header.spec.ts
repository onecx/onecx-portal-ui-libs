import { PageHeaderContentSchema } from './page-header/content'
import { PageHeaderSchema } from './page-header/index'
import { PageHeaderSettingsSchema } from './page-header/settings'
import { PageHeaderTitleBarSchema } from './page-header/title-bar'
import { expectExactUndefinedTokens, expectExactTokens, expectTokens } from './test-utils'

describe('page header schema - should validate following tokens', () => {
  it('empty tokens', () => {
    const result = PageHeaderSchema.schema.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('Settings', () => {
    it('default tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data

      expectExactUndefinedTokens(result?.settings, PageHeaderSettingsSchema.schema.shape, [])
      expectExactTokens(result?.settings, {
        mode: 'basic',
        showBreadcrumbs: true,
        manualBreadcrumbs: false,
        loading: false,
        enableGrid: false,
        disableDefaultActions: false,
        gridLayoutDesktopColumns: 12,
      })
    })
  })

  it('Base tokens', () => {
    const result = PageHeaderSchema.schema.safeParse({})

    expect(result.success).toBe(true)
    const value = result.data
    expectExactUndefinedTokens(value, PageHeaderSchema.schema.shape, [])
    expectExactTokens(value, {
      settings: expect.any(Object),
      breadcrumbWrapper: expect.any(Object),
      header: expect.any(Object),
      content: expect.any(Object),
      border: {
        width: '{{primitives.border.width.md}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
      },
      padding: '{{primitives.space.md}}',
      shadow: '{{primitives.shadow.md}}',
      background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
      margin: '{{primitives.space.md}}',
    })
  })
  describe('Breadcrumb Wrapper', () => {
    it('default tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data

      expectExactTokens(result?.breadcrumbWrapper, {
        padding: '{{primitives.space.md}}',
        margin: '{{primitives.space.md}}',
      })
    })
  })
  describe('Header/ title bar', () => {
    it('base tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data

      const value = result?.header
      expectExactUndefinedTokens(value, PageHeaderTitleBarSchema.schema.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
        },
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        title: expect.any(Object),
        subtitle: expect.any(Object),
        titleIcon: expect.any(Object),
        titleWrap: expect.any(Object),
        actionPanel: expect.any(Object),
      })
    })

    it('title tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.header?.title

      expectExactUndefinedTokens(value, PageHeaderTitleBarSchema.title.shape, [])
      expectExactTokens(value, {
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        padding: '{{primitives.space.md}}',
      })
    })

    it('subtitle tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.header?.subtitle

      expectExactUndefinedTokens(value, PageHeaderTitleBarSchema.subtitle.shape, [])
      expectExactTokens(value, {
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        padding: '{{primitives.space.md}}',
      })
    })

    it('titleIcon tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.header?.titleIcon

      expectExactUndefinedTokens(value, PageHeaderTitleBarSchema.titleIcon.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: {
          color: '{{primitives.variant.primary.defaultState.defaultSeverity.bg.color}}',
        },
        icon: {
          size: '{{primitives.icon.md}}',
          width: '1rem',
          height: '1rem',
        },
        image: {
          size: '{{primitives.icon.md}}',
          width: '1rem',
          height: '1rem',
        },
      })
    })

    it('title wrap', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.header?.titleWrap

      expectExactUndefinedTokens(value, PageHeaderTitleBarSchema.titleWrap.shape, [])
      expectExactTokens(value, {
        alignItems: 'flex-start',
      })
    })

    it('actionPanel tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.header?.actionPanel

      expectExactUndefinedTokens(value, PageHeaderTitleBarSchema.actionPanel.shape, [])
      expectExactTokens(value, {
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        alignment: {
          horizontal: 'center',
          vertical: 'middle',
        },
      })
    })
  })
  describe('Content', () => {
    it('base tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.content
      expectExactUndefinedTokens(value, PageHeaderContentSchema.schema.shape, [])
      expectExactTokens(value, {
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        borderTop: {
          width: '{{primitives.border.width.md}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        },
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}',
        },
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        value: expect.any(Object),
        label: expect.any(Object),
      })
    })

    it('object panel tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.content
      expectExactUndefinedTokens(value, PageHeaderContentSchema.objectPanel, [])
      expectTokens(value, {
        gap: '{{primitives.space.md}}',
        value: expect.any(Object),
        label: expect.any(Object),
      })
    })

    it('object panel label tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.content.label
      expectExactUndefinedTokens(value, PageHeaderContentSchema.detailLabel.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.md}}',
        gap: '{{primitives.space.md}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
      })
    })

    it('object panel value tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.content.value
      expectExactUndefinedTokens(value, PageHeaderContentSchema.detailValue.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.md}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        infoIcon: expect.any(Object),
        actionIcon: expect.any(Object),
      })
    })

    it('object panel value info-icon tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.content.value.infoIcon
      expectExactUndefinedTokens(value, PageHeaderContentSchema.detailInfoIcon.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        icon: {
          size: '{{primitives.icon.md}}',
          width: '1rem',
          height: '1rem',
        },
        padding: {
          right: '{{primitives.space.md}}',
        },
      })
    })

    it('object panel action-icon tokens', () => {
      const result = PageHeaderSchema.schema.safeParse({})?.data
      const value = result?.content.value.actionIcon
      expectExactUndefinedTokens(value, PageHeaderContentSchema.detailActionIcon.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        icon: {
          size: '{{primitives.icon.md}}',
          width: '1rem',
          height: '1rem',
        },
        padding: {
          left: '{{primitives.space.md}}',
        },
      })
    })
  })
})
