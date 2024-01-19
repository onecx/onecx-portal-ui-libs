import { SyncableTopic } from '@onecx/accelerator'

export interface Config { [key: string]: string }

export class ConfigurationTopic extends SyncableTopic<Config> {
  constructor() {
    super('configuration', 1)
  }
}
