import { ensureProperty } from './utils/ensure-property.utils'

const topicUseBroadcastChannel = ensureProperty(globalThis as object, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], 'V2' as 'V2' | boolean)
const topicInitDate = ensureProperty(topicUseBroadcastChannel, ['@onecx/accelerator', 'topic', 'initDate'], Date.now())
const topicTabId = ensureProperty(topicInitDate, ['@onecx/accelerator', 'topic', 'tabId'], Math.ceil(globalThis.performance?.now?.() ?? 0))

export { topicTabId as acceleratorState }
