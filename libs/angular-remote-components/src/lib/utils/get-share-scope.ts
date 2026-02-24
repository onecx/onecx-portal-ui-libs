import { createLogger } from './logger.utils'
// TODO: Type manifest properly and ensure that default is used when no version can be determined or when version is below 21
export function getShareScope(manifest: any): string {
  const logger = createLogger('getShareScope')
  const angularCore = manifest.shared.find((s: any) => s.name === '@angular/core')
  if (!angularCore) {
    logger.warn('Could not determine Angular version from manifest. Using default share scope.')
    return 'default'
  }

  const version = angularCore.version.split('.')[0]
  if (!version || version === '18' || version === '19') {
    logger.warn('Using default share scope for Angular version:', version)
    return 'default'
  }

  return `angular_${version}`
}
