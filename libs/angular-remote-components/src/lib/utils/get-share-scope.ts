import { inject } from '@angular/core'
import { Manifest } from '../model/manifest'
import { createLogger } from './logger.utils'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

export async function getShareScope(manifestUrl: string): Promise<string> {
  const http = inject(HttpClient)
  const logger = createLogger('getShareScope')
  let manifest: Manifest

  try {
    manifest = await firstValueFrom(http.get<Manifest>(manifestUrl))
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
}
