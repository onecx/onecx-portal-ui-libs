import { Provider } from '@angular/core'
import { TRANSLATION_PATH } from '../injection-tokens/translation-path'
import { Location } from '@angular/common'
import { isTest } from '@onecx/accelerator'

/**
 * Returns a provider for TRANSLATION_PATH based on import.meta.url and a given path.
 * Removes the file name from import.meta.url and appends the path (default 'assets/i18n/').
 * Please make sure the webpack configuration for importMeta contains: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta.
 */
export function provideTranslationPathFromMeta(url: string | undefined, path = 'assets/i18n/'): Provider {
  if (isTest() && (!url || url.startsWith('file://'))) {
    return constructTranslationPathInTestEnv(path)
  }
  return constructTranslationPath(url, path)
}

function constructTranslationPathInTestEnv(path: string): Provider {
  return {
    provide: TRANSLATION_PATH,
    useValue: path,
    multi: true,
  }
}

function constructTranslationPath(url: string | undefined, path: string): Provider {
  if (!url || url.startsWith('file://')) {
    throw new Error(
      'Cannot construct translation path from local file path. Please check whether the webpack configuration for importMeta is correct: https://webpack.js.org/configuration/module/#moduleparserjavascriptimportmeta'
    )
  }
  const urlWithoutFileName = url.replace(/\/[^/]*$/, '')
  const translationPath = Location.joinWithSlash(urlWithoutFileName, path) + (path.endsWith('/') ? '' : '/')
  return {
    provide: TRANSLATION_PATH,
    useValue: translationPath,
    multi: true,
  }
}
