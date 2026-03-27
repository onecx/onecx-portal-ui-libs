import { ensureProperty } from './utils/ensure-property.utils'

const gatherPromises = ensureProperty(globalThis as object, ['@onecx/accelerator', 'gatherer', 'promises'], {} as Record<number, Array<Promise<any>>>)
const gatherDebug = ensureProperty(gatherPromises, ['@onecx/accelerator', 'gatherer', 'debug'], [] as string[])
const topicUseBroadcastChannel = ensureProperty(gatherDebug, ['@onecx/accelerator', 'topic', 'useBroadcastChannel'], 'V2' as 'V2' | boolean)
const topicDebug = ensureProperty(topicUseBroadcastChannel, ['@onecx/accelerator', 'topic', 'debug'], [] as string[])
const topicInitDate = ensureProperty(topicDebug, ['@onecx/accelerator', 'topic', 'initDate'], Date.now())
const topicTabId = ensureProperty(topicInitDate, ['@onecx/accelerator', 'topic', 'tabId'], Math.ceil(globalThis.performance?.now?.() ?? 0))

export { topicTabId as acceleratorState }
