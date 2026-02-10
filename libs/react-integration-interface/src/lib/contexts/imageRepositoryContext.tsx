import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { ImageRepositoryService } from '@onecx/integration-interface'

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
  const imageRepositoryService = useMemo(
    () => value?.imageRepositoryService ?? new ImageRepositoryService(),
    [value?.imageRepositoryService]
  )
  const isInternalService = !value?.imageRepositoryService

  useEffect(() => {
    return () => {
      if (isInternalService) {
        imageRepositoryService.destroy()
      }
    }
  }, [imageRepositoryService, isInternalService])

  const contextValue = useMemo(
    (): ImageRepositoryContextValue => ({
      imageRepositoryService,
    }),
    [imageRepositoryService]
  )

  return <ImageRepositoryContext value={contextValue}>{children}</ImageRepositoryContext>
}

export { ImageRepositoryProvider, useImageRepositoryService, ImageRepositoryContext }
export type { ImageRepositoryContextValue, ImageRepositoryProviderProps }
