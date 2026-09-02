import type { CssRule } from '../../mapper.types'

export const contentCssRules: CssRule[] = [
  {
    selector: '.ocx-card',
    declarations: [
      { property: 'background', from: 'usages.content.background' },
      { property: 'color', from: 'usages.content.color' },
      { property: 'font-family', from: 'usages.content.font.family' },
      { property: 'font-size', from: 'usages.content.font.size' },
      { property: 'font-weight', from: 'usages.content.font.weight' },
      { property: 'font-style', from: 'usages.content.font.style' },
      { property: 'line-height', from: 'usages.content.font.lineHeight' },
      { property: 'letter-spacing', from: 'usages.content.font.letterSpacing' },
      { property: 'padding-left', from: 'usages.content.paddingX' },
      { property: 'padding-right', from: 'usages.content.paddingX' },
      { property: 'padding-top', from: 'usages.content.paddingY' },
      { property: 'padding-bottom', from: 'usages.content.paddingY' },
      { property: 'margin-left', from: 'usages.content.marginX' },
      { property: 'margin-right', from: 'usages.content.marginX' },
      { property: 'margin-top', from: 'usages.content.marginY' },
      { property: 'margin-bottom', from: 'usages.content.marginY' },
      { property: 'border-radius', from: 'usages.content.border.radius' },
      { property: 'box-shadow', from: 'usages.content.shadow' },
    ],
  },
  {
    selector: '#ocx_content_title_element',
    declarations: [
      { property: 'color', from: 'usages.content.title.color' },
      { property: 'font-family', from: 'usages.content.title.font.family' },
      { property: 'font-size', from: 'usages.content.title.font.size' },
      { property: 'font-weight', from: 'usages.content.title.font.weight' },
      { property: 'line-height', from: 'usages.content.title.font.lineHeight' },
      { property: 'letter-spacing', from: 'usages.content.title.font.letterSpacing' },
      { property: 'font-style', from: 'usages.content.title.font.style' },
    ],
  },
]
