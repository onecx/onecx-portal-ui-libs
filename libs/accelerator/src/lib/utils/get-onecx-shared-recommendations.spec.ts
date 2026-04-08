import type { SharedLibraryConfig as NxSharedLibraryConfig } from '@nx/module-federation'

describe('getOneCXSharedRecommendations', () => {
  it('accepts Nx SharedLibraryConfig objects and normalizes fields', async () => {
    const { getOneCXSharedRecommendations } = await import('./get-onecx-shared-recommendations')

    const sharedConfig: NxSharedLibraryConfig = {
      singleton: true,
      strictVersion: true,
      eager: true,
    } as unknown as NxSharedLibraryConfig

    const result = getOneCXSharedRecommendations('@angular/core', sharedConfig as unknown as any)

    expect(result).toBe(sharedConfig)
    expect(sharedConfig.singleton).toBe(false)
    expect(sharedConfig.strictVersion).toBe(false)
    expect(sharedConfig.eager).toBe(false)
  })

  it('returns false for non-matching libraries', async () => {
    const { getOneCXSharedRecommendations } = await import('./get-onecx-shared-recommendations')
    expect(getOneCXSharedRecommendations('not-shared-lib', {})).toBe(false)
  })
})
