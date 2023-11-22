import { Topic } from './topic'
import { TopicDataMessage } from './topic-data-message'

/**
 * This class allows sync access to the value of a topic.
 * If you use this as a super class you have to make sure that
 * in all cases when the value is accessed is initialized.
 * This means that you have to make sure that in all possibile
 * code paths reaching your sync access you made sure that it
 * is initialized (in standalone and shell mode).
 * Keep in mind that there can be multiple instances of the topic
 * so you cannot rely on the fact that the shell has already checked
 * that it is initialized.
 */
export class SyncableTopic<T> extends Topic<T> {
  constructor(name: string, version: number) {
    super(name, version)
  }

  /**
   * This function does not offer read after write consistency!
   * This means you cannot call it directly after publish, because the new value will not be there yet!
   * This function will return undefined unti the isInitialized promise is resolved.
   * @returns the current value of the topic in a synchronous way
   */
  getValue(): T | undefined {
    return this.isInit ? (<TopicDataMessage<T>>this.data.value).data : undefined
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }
}
