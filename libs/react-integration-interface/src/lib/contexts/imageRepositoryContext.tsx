import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { ImageRepositoryService } from '@onecx/integration-interface'
import { useTopic } from '../utils/use-topic.utils'

interface ImageRepositoryContextValue {
  imageRepositoryService: ImageRepositoryService
}

interface ImageRepositoryProviderProps {
  children: ReactNode
  value?: Partial<ImageRepositoryContextValue>
}

const ImageRepositoryContext = createContext<ImageRepositoryContextValue | null>(null)

/**
 * Hook to access image repository service.
 * Must be used within ImageRepositoryProvider.
 *
 * @returns Image repository service context.
 * @throws Error when used outside ImageRepositoryProvider.
 */
const useImageRepositoryService = (): ImageRepositoryContextValue => {
  const context = useContext(ImageRepositoryContext)
  if (!context) {
    throw new Error('useImageRepositoryService must be used within an ImageRepositoryProvider')
  }
  return context
}

/**
 * Provides image repository service access.
 *
 * @param children - React subtree consuming image repository context.
 * @param value - Optional overrides for the image repository service instance.
 * @returns Provider wrapping the given children.
 */
const ImageRepositoryProvider: React.FC<ImageRepositoryProviderProps> = ({ children, value }) => {
  const imageRepositoryService = useTopic(value?.imageRepositoryService, ImageRepositoryService)

  const contextValue = useMemo(
    (): ImageRepositoryContextValue => ({
      imageRepositoryService,
    }),
    [imageRepositoryService]
  )

  return <ImageRepositoryContext.Provider value={contextValue}>{children}</ImageRepositoryContext.Provider>
}

export { ImageRepositoryProvider, useImageRepositoryService, ImageRepositoryContext }
export type { ImageRepositoryContextValue, ImageRepositoryProviderProps }
