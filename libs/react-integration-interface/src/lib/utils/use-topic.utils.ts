import { useEffect, useRef, useState } from 'react'

interface Destroyable {
  destroy(): void
}

/**
 * Lazily creates a topic instance only when no external value is provided.
 * Destroys internal instances on unmount.
 *
 * Uses `useState` (lazy init) + `setTimeout(0)` to survive React StrictMode double-mounting:
 * on cleanup, destruction is deferred to the next tick. If the component re-mounts
 * before the timeout fires (StrictMode), `isMountedRef` cancels the destruction.
 *
 * @param valueTopic - optional external topic instance.
 * @param TopicClass - topic class constructor.
 * @returns the resolved topic instance.
 */
export function useTopic<T extends Destroyable>(valueTopic: T | undefined, TopicClass: new () => T): T {
  const isExternal = valueTopic !== undefined
  const [topic] = useState(() => valueTopic ?? new TopicClass())
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (!isExternal) {
        setTimeout(() => {
          if (!isMountedRef.current) {
            topic.destroy()
          }
        }, 0)
      }
    }
  }, [isExternal, topic])

  return topic
}
