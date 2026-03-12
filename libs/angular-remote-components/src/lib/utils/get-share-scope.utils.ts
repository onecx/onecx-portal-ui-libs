import { inject } from '@angular/core'
import { Manifest } from '../model/manifest'
import { createLogger } from './logger.utils'
import { firstValueFrom } from 'rxjs'
import { ManifestCacheService } from '../services/manifest-cache.service'

export async function getShareScope(manifestUrl: string): Promise<string> {
  const manifestCacheService = inject(ManifestCacheService)
  const logger = createLogger('getShareScope')
  let manifest: Manifest | object

  try {
    manifest = await firstValueFrom(manifestCacheService.getManifest(manifestUrl))
  } catch (error) {
    logger.warn(
      'Failed to load manifest from URL:',
      manifestUrl,
      'Falling back to default share scope.',
      'Error:',
      error
    )
    return 'default'
  }

  if ('shared' in manifest) {
    const angularCore = manifest.shared.find((s: any) => s.name === '@angular/core')

    if (!angularCore) {
      logger.warn('Could not determine Angular version from manifest. Using default share scope.')
      return 'default'
    }

    const version = parseInt(angularCore.version.split('.')[0], 10)

    if (isNaN(version) || version < 21) {
      logger.warn('Using default share scope for Angular version:', version)
      return 'default'
    }

    return `angular_${version}`
  } else {
    logger.warn('Manifest does not contain shared dependencies:', manifest, 'Using default share scope.')
    return 'default'
  }
}
