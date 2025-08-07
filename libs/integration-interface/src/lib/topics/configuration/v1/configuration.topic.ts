import { Topic } from '@onecx/accelerator'

export interface Config {
  [key: string]: string
}

export class ConfigurationTopic extends Topic<Config> {
  constructor() {
    super('configuration', 1)
  }
}
