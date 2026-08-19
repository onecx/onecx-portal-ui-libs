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
      { property: 'padding', from: 'usages.content.padding' },
      { property: 'margin-bottom', from: 'usages.content.margin' },
      { property: 'border-radius', from: 'usages.content.border.radius' },
      { property: 'box-shadow', from: 'usages.content.shadow' },
    ],
  },
]
