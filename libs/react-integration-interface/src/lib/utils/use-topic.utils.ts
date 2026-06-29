import { useEffect, useMemo } from 'react'

interface Destroyable {
  destroy(): void
}

/**
 * Lazily creates a topic instance only when no external value is provided.
 * Destroys internal instances on unmount.
 *
 * @param valueTopic - optional external topic instance.
 * @param TopicClass - topic class constructor.
 * @returns the resolved topic instance.
 */
export function useTopic<T extends Destroyable>(
  valueTopic: T | undefined,
  TopicClass: new () => T
): T {
  const isExternal = valueTopic !== undefined
  const topic = useMemo(() => valueTopic ?? new TopicClass(), [valueTopic])

  useEffect(() => {
    return () => {
      if (!isExternal) {
        topic.destroy()
      }
    }
  }, [topic, isExternal])

  return topic
}
