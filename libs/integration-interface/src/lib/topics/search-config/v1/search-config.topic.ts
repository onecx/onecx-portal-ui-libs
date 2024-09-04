import { SyncableTopic, Topic } from '@onecx/accelerator'
import { SearchConfigMessage } from './search-config.model'
import { InjectionToken } from '@angular/core'

export const SEARCH_CONFIG_STORE_TOPIC = new InjectionToken<string>('searchConfigStoreTopic')

export class SearchConfigTopic extends Topic<SearchConfigMessage> {
  constructor() {
    super('searchConfig', 1)
  }
}
