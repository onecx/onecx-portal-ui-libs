/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { SharedLibraryConfig } from '@nx/module-federation'
import { getOneCXSharedRecommendations } from './get-onecx-shared-recommendations'

describe('getOneCXSharedRecommendations', () => {
  it('returns false for non-OneCX shared libraries and does not mutate config', () => {
    const shared: SharedLibraryConfig = {
      singleton: true,
      strictVersion: true,
      eager: true,
    } as unknown as SharedLibraryConfig

    const result = getOneCXSharedRecommendations('some-random-lib', shared)

    expect(result).toBe(false)
    expect(shared).toEqual({ singleton: true, strictVersion: true, eager: true })
  })

  it.each(['@angular/core', '@onecx/whatever', 'rxjs', 'primeng/api', '@ngx-translate/core', '@ngrx/store'])(
    'forces recommendations for %s',
    (libraryName) => {
      const shared: SharedLibraryConfig = {
        singleton: true,
        strictVersion: true,
        eager: true,
      } as unknown as SharedLibraryConfig

      const result = getOneCXSharedRecommendations(libraryName, shared)

      expect(result).toBe(shared)
      expect(shared.singleton).toBe(false)
      expect(shared.strictVersion).toBe(false)
      expect(shared.eager).toBe(false)
    }
  )
})
