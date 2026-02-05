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
 * Hook to access image repository service
 * Must be used within ImageRepositoryProvider
 */
const useImageRepositoryService = (): ImageRepositoryContextValue => {
  const context = useContext(ImageRepositoryContext)
  if (!context) {
    throw new Error('useImageRepositoryService must be used within an ImageRepositoryProvider')
  }
  return context
}

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

  return <ImageRepositoryContext.Provider value={contextValue}>{children}</ImageRepositoryContext.Provider>
}

export { ImageRepositoryProvider, useImageRepositoryService, ImageRepositoryContext }
export type { ImageRepositoryContextValue, ImageRepositoryProviderProps }
