import type { CssRule } from '../../mapper.types'
import { diagramCssRules } from './diagram.rules'

export const groupByCountDiagramCssRules: CssRule[] = diagramCssRules.map((rule) => ({
  selector: `ocx-group-by-count-diagram ${rule.selector}`,
  declarations: rule.declarations.map((declaration) => ({
    ...declaration,
    from: declaration.from?.replace('usages.diagram.', 'usages.groupByCountDiagram.'),
  })),
}))