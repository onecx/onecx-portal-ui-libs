import { Topic } from '@onecx/accelerator'
import { MfeInfo } from './mfe-info.model'

export class CurrentMfeTopic extends Topic<MfeInfo> {
  constructor() {
    super('currentMfe', 1)
  }
}
