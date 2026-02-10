import type { i18n } from 'i18next'

/**
 * Builds a translation base path from an import.meta.url value.
 */
export const getTranslationPathFromMeta = (metaUrl: string | undefined, path = 'assets/i18n/') => {
  if (!metaUrl || metaUrl.startsWith('file://')) {
    throw new Error(
      'Cannot construct translation path from local file path. Ensure import.meta.url is available in the bundler.'
    )
  }

  const urlWithoutFileName = metaUrl.replace(/\/[^/]*$/, '')
  const normalizedPath = path.endsWith('/') ? path : `${path}/`

  return `${urlWithoutFileName}/${normalizedPath}`
}

/**
 * Registers portal page translation loadPath on an i18next instance.
 */
export const registerPortalPageTranslations = (
  instance: i18n,
  metaUrl: string | undefined,
  path = 'onecx-react-integration-functionalities/assets/i18n/'
) => {
  if (!metaUrl || metaUrl.startsWith('file://')) {
    return
  }
  const translationPath = getTranslationPathFromMeta(metaUrl, path)
  const loadPath = `${translationPath}{{lng}}.json`

  const backendOptions = instance.options.backend ? { ...instance.options.backend, loadPath } : { loadPath }
  instance.options.backend = backendOptions

  const backendConnector = instance.services.backendConnector
  if (backendConnector?.backend) {
    backendConnector.backend.options = backendOptions
  }
}
