import { Topic } from '@onecx/accelerator'
import { CurrentThemes } from './current-themes.model'

export class CurrentThemesTopic extends Topic<CurrentThemes> {
  constructor() {
    super('currentThemes', 1)
  }
}
