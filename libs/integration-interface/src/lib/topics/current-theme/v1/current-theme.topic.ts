import { Topic } from '@onecx/accelerator'
import { Theme } from './theme.model'

/**
 * @deprecated Use `CurrentThemesTopic` instead.
 */
export class CurrentThemeTopic extends Topic<Theme> {
  constructor() {
    super('currentTheme', 1)
  }
}
